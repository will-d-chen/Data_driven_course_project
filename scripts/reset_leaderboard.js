const fs = require('fs');
const path = require('path');

const leaderboardPath = path.join(__dirname, '../src/lib/data/leaderboard.json');

if (fs.existsSync(leaderboardPath)) {
    fs.unlinkSync(leaderboardPath);
    console.log('Leaderboard has been reset (file deleted).');
} else {
    console.log('Leaderboard is already empty (file does not exist).');
}
