import fs from 'fs';
import path from 'path';
import os from 'os';

// Determine storage path
// In production (Vercel), we must use /tmp for write access.
// In development, we use the local project folder so the user can see the file.
const isProduction = process.env.NODE_ENV === 'production';
const DATA_DIR = isProduction ? os.tmpdir() : path.join(process.cwd(), 'src/lib/data');

const GROUND_TRUTH_PATH = path.join(process.cwd(), 'src/lib/data/ground_truth.csv'); // Always read from source
const LEADERBOARD_FILE = 'leaderboard.json';
const LEADERBOARD_PATH = path.join(DATA_DIR, LEADERBOARD_FILE);

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
        const allTemperatures: number[] = [];

        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            // Temperature is index 4
            const temp = parseFloat(cols[4]);
            if (!isNaN(temp)) {
                allTemperatures.push(temp);
            }
        }

        // Return last 1440 points (60 days * 24 hours)
        const sliceSize = 60 * 24;
        return allTemperatures.slice(-sliceSize);
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

    if (limit < 240) {
        throw new Error("Submission too short. Require at least 10 days (240 hours) of predictions.");
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
    if (!fs.existsSync(LEADERBOARD_PATH)) {
        return [];
    }
    try {
        const data = fs.readFileSync(LEADERBOARD_PATH, 'utf8');
        const entries: LeaderboardEntry[] = JSON.parse(data);
        return entries.sort((a, b) => a.rmse_60 - b.rmse_60);
    } catch (e) {
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

    fs.writeFileSync(LEADERBOARD_PATH, JSON.stringify(newEntries, null, 2));
}

export async function resetLeaderboard() {
    if (fs.existsSync(LEADERBOARD_PATH)) {
        fs.unlinkSync(LEADERBOARD_PATH);
    }
}
