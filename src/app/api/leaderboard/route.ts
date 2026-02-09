import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/scoring';

export const dynamic = 'force-dynamic'; // Ensure we don't cache stale data on the serverless function

export async function GET() {
    const leaderboard = await getLeaderboard();
    return NextResponse.json(leaderboard);
}
