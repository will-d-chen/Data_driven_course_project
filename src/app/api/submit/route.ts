import { NextRequest, NextResponse } from 'next/server';
import { calculateScores, saveEntry } from '@/lib/scoring';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const teamName = formData.get('teamName') as string;

        if (!file || !teamName) {
            return NextResponse.json({ error: 'File and Team Name are required' }, { status: 400 });
        }

        const text = await file.text();
        const rows = text.trim().split('\n');

        const predictions: number[] = [];

        for (const row of rows) {
            const cleanRow = row.replace(/['"\r]/g, '').trim();
            if (!cleanRow) continue;

            const cols = cleanRow.split(',');
            const valStr = cols[cols.length - 1];
            const val = parseFloat(valStr);

            if (!isNaN(val)) {
                predictions.push(val);
            }
        }

        if (predictions.length === 0) {
            return NextResponse.json({ error: 'Could not parse predictions from file.' }, { status: 400 });
        }

        // Determine scores
        const scores = calculateScores(predictions);

        const entry = {
            teamName,
            ...scores,
            timestamp: Date.now()
        };

        // Save (awaiting the async operation)
        await saveEntry(entry);

        return NextResponse.json(scores);

    } catch (error: any) {
        console.error("Submission error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
