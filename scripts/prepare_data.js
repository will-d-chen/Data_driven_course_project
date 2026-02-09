const fs = require('fs');
const path = require('path');

const cities = ['Charlotte', 'Nashville', 'Atlanta'];

// We determine the cutoff based on Charlotte (the target)
const charlottePath = path.join(__dirname, '../src/lib/data/ground_truth.csv');
const charlotteData = fs.readFileSync(charlottePath, 'utf8');
const charlotteRows = charlotteData.trim().split('\n').slice(1);

let maxDay = 0;
charlotteRows.forEach(row => {
    const cols = row.split(',');
    const day = parseInt(cols[0]);
    if (!isNaN(day) && day > maxDay) {
        maxDay = day;
    }
});

const cutoffDay = maxDay - 60;
console.log(`Max day: ${maxDay}. Cutoff day: ${cutoffDay}`);

cities.forEach(city => {
    // For Charlotte, we might have it named 'ground_truth.csv' in lib/data, 
    // but for others we likely copied them as Name.csv.
    // Let's handle generic pathing.
    let srcPath;
    if (city === 'Charlotte') {
        srcPath = path.join(__dirname, '../src/lib/data/ground_truth.csv');
    } else {
        srcPath = path.join(__dirname, `../src/lib/data/${city}.csv`);
    }

    if (!fs.existsSync(srcPath)) {
        console.error(`Source file not found for ${city}: ${srcPath}`);
        return;
    }

    const data = fs.readFileSync(srcPath, 'utf8');
    const lines = data.trim().split('\n');
    const header = lines[0];
    const rows = lines.slice(1);

    const trainingRows = rows.filter(row => {
        const cols = row.split(',');
        const day = parseInt(cols[0]);
        return day <= cutoffDay;
    });

    const publicPath = path.join(__dirname, `../public/data/${city}.csv`);
    const output = [header, ...trainingRows].join('\n');
    fs.writeFileSync(publicPath, output);

    console.log(`[${city}] Wrote ${trainingRows.length} rows to ${publicPath}`);
});
