const fs = require('node:fs');

const map = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));
const antennas = {};

map.forEach((line, i) => line.forEach((s, j) => {
    if (s !== '.') {
        antennas[s] = [...(antennas[s] || []), [i, j]];
    }
}));

const antidotes = new Set();
Object.values(antennas).forEach(locations => {
    locations.forEach(([i1, j1], i) => {
        locations.forEach(([i2, j2], j) => {
            if (i === j) {
                return;
            }
            const diffI = i2 - i1;
            const diffJ = j2 - j1;
            [[i1 - diffI, j1 - diffJ], [i2 + diffI, j2 + diffJ]].forEach(([a, b]) => {
                if ((map[a] || [])[b] !== undefined) {
                    antidotes.add(`${a},${b}`);
                }
            });
        });
    });
});

console.log(antidotes.size);
