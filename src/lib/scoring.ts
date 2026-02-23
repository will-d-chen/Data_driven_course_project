import fs from 'fs';
import path from 'path';

import { put, list, del } from '@vercel/blob';

const GROUND_TRUTH_PATH = path.join(process.cwd(), 'src/lib/data/ground_truth.csv'); // Always read from source

// Interface for leaderboard entry
export interface LeaderboardEntry {
    teamName: string;
    rmse_10: number;
    rmse_30: number;
    rmse_60: number;
    timestamp: number;
}

// Load ground truth data
function loadGroundTruth(): number[] {
    try {
        const fileContent = fs.readFileSync(GROUND_TRUTH_PATH, 'utf8');
        const lines = fileContent.trim().split('\n');

        const validTemperatures: number[] = [];
        let startFound = false;

        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            // Header: day,time,humidity,pressure,temperature,weather_description,wind_direction,wind_speed
            // Index 0: day
            // Index 4: temperature

            const day = parseInt(cols[0]);

            // The competition/forecast starts on Day 1828
            if (!isNaN(day) && day >= 1828) {
                startFound = true;
            }

            if (startFound) {
                const temp = parseFloat(cols[4]);
                if (!isNaN(temp)) {
                    validTemperatures.push(temp);
                }
            }
        }

        if (!startFound && lines.length > 1) {
            console.warn("Warning: Day 1828 not found in ground_truth.csv. Scoring may be incorrect.");
        }

        return validTemperatures;
    } catch (error) {
        console.error("Error loading ground truth:", error);
        return [];
    }
}

export function calculateScores(predictions: number[]) {
    const groundTruth = loadGroundTruth();

    if (groundTruth.length === 0) {
        throw new Error("Ground truth data not found.");
    }

    const limit = Math.min(predictions.length, groundTruth.length);

    if (predictions.length > groundTruth.length) {
        console.warn(`Warning: Prediction length (${predictions.length}) exceeds available ground truth (${groundTruth.length}). Scoring based on available ground truth only.`);
    }

    if (limit < 1439) {
        throw new Error("Submission too short. Require at least 60 days (1440 hours) of predictions.");
    }

    const calcRMSE = (n: number) => {
        let sumSq = 0;
        const count = Math.min(n, limit);
        for (let i = 0; i < count; i++) {
            const diff = predictions[i] - groundTruth[i];
            sumSq += diff * diff;
        }
        return Math.sqrt(sumSq / count);
    };

    return {
        rmse_10: calcRMSE(240),
        rmse_30: calcRMSE(720),
        rmse_60: calcRMSE(1440)
    };
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
        const { blobs } = await list({ prefix: 'leaderboard.json', limit: 1 });
        if (blobs.length > 0) {
            const response = await fetch(blobs[0].url);
            const entries: LeaderboardEntry[] = await response.json();
            return entries.sort((a, b) => a.rmse_60 - b.rmse_60);
        }
        return [];
    } catch (e) {
        console.error("Failed to fetch leaderboard from Blob:", e);
        return [];
    }
}

export async function saveEntry(entry: LeaderboardEntry) {
    const current = await getLeaderboard();
    // Replace previous entry for same team
    const otherEntries = current.filter(e => e.teamName !== entry.teamName);
    const newEntries = [...otherEntries, entry];

    // Sort
    newEntries.sort((a, b) => a.rmse_60 - b.rmse_60);

    await put('leaderboard.json', JSON.stringify(newEntries, null, 2), {
        access: 'public',
        addRandomSuffix: false, // Overwrite the existing file
        token: process.env.BLOB_READ_WRITE_TOKEN, // Required for server-side writes
        allowOverwrite: true // Explicitly allow overwriting
    });
}

export async function resetLeaderboard() {
    const { blobs } = await list({ prefix: 'leaderboard.json', limit: 1 });
    if (blobs.length > 0) {
        await del(blobs[0].url);
    }
}
