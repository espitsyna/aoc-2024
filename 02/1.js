const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const safe = data.split('\n').filter(Boolean).reduce((acc, report) => {
    const levels = report.split(' ').map(level => +level);
    const increasing = levels[0] < levels[1];

    const check = (a, b) => {
        if (b === undefined) {
            return true;
        }
        if (increasing) {
            return b > a && b < a + 4;
        }
        return a > b && a < b + 4;
    };

    const isSafe = levels.every((level, i) => check(level, levels[i+1]));
    return acc + 1 * isSafe;
}, 0);
console.log(safe);
