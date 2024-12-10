const fs = require('node:fs');

const map = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split('').map(n => +n));

const up = hill => {
    const [i, j] = hill.split(',').map(n => +n);
    const level = map[i][j];
    return [[i-1, j], [i+1, j], [i, j-1], [i, j+1]].filter(([a, b]) => (map[a] || [])[b] === level + 1);
};

const go = hills => {
    const upHills = {};
    Object.keys(hills).forEach(hill => up(hill).forEach(([i, j]) => {
        upHills[`${i},${j}`] = (upHills[`${i},${j}`] || 0) + hills[hill];
    }));
    return upHills;
};

const countScore = (i, j) => {
    if (map[i][j] !== 0) {
        return 0;
    }

    let hills = {[`${i},${j}`]: 1};
    let level = 0;
    while (level < 9) {
        if (hills.size === 0) {
            return 0;
        }
        hills = go(hills);
        level++;
    }
    return Object.values(hills).reduce((acc, count) => acc + count, 0);
};

const score = map.reduce((acc, line, i) => {
    return acc + line.reduce((acc, n, j) => acc + countScore(i, j), 0);
}, 0);

console.log(score);
