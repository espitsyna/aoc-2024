const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');

const remove = (array, index) => [...array.slice(0, index), ...array.slice(index + 1)];

const check = (a, b, increasing) => {
    if (b === undefined) {
        return true;
    }
    if (increasing) {
        return b > a && b < a + 4;
    }
    return a > b && a < b + 4;
};

const isSafe = (levels, canTolerate = false) => {
    const increasing = levels[0] < levels[1];
    const error = levels.findIndex((level, i) => !check(level, levels[i+1], increasing));
    if (error === -1) {
        return true;
    }

    if (!canTolerate) {
        return false;
    }

    return isSafe(remove(levels, error)) || isSafe(remove(levels, error + 1)) || (error === 1 && isSafe(remove(levels, 0)));
};

const safe = data.split('\n').filter(Boolean).reduce((acc, report) => {
    const levels = report.split(' ').map(level => +level);
    return acc + 1 * isSafe(levels, true);
}, 0);
console.log(safe);
