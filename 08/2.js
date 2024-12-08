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

            let a = i1;
            let b = j1;
            while (true) {
                if ((map[a] || [])[b] === undefined) {
                    break;
                }
                antidotes.add(`${a},${b}`);
                a-= diffI;
                b-= diffJ;
            }

            a = i2;
            b = j2;
            while (true) {
                if ((map[a] || [])[b] === undefined) {
                    break;
                }
                antidotes.add(`${a},${b}`);
                a+= diffI;
                b+= diffJ;
            }
        });
    });
});

console.log(antidotes.size);
