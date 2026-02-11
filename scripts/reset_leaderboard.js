require('dotenv').config({ path: '.env.local' });
const { list, del } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

async function reset() {
    // 1. Reset Blob (Production/Preview/Dev with Env Vars)
    try {
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const { blobs } = await list({ prefix: 'leaderboard.json', limit: 1 });
            if (blobs.length > 0) {
                await del(blobs[0].url);
                console.log('✅ Vercel Blob leaderboard cleared.');
            } else {
                console.log('ℹ️ No leaderboard blob found.');
            }
        } else {
            console.log('ℹ️ BLOB_READ_WRITE_TOKEN not found. Skipping Blob reset.');
        }
    } catch (error) {
        console.error('❌ Failed to reset Blob leaderboard:', error);
    }

    // 2. Reset Local File (Legacy/Local Dev fallback)
    const leaderboardPath = path.join(__dirname, '../src/lib/data/leaderboard.json');
    if (fs.existsSync(leaderboardPath)) {
        try {
            fs.unlinkSync(leaderboardPath);
            console.log('✅ Local leaderboard file deleted.');
        } catch (error) {
            console.error('❌ Failed to delete local leaderboard file:', error);
        }
    } else {
        console.log('ℹ️ Local leaderboard file not found.');
    }
}

reset();
