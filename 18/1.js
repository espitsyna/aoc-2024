const fs = require('node:fs');

const size = 71;
const failed = 1024;

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n').slice(0, failed);
const map = Object.keys([...new Array(size)]).map(() => new Array(size).fill(Number.MAX_SAFE_INTEGER));
data.forEach(byte => {
    const [j, i] = byte.split(',').map(n => +n);
    map[i][j] = '#';
});

const move = ([i, j]) => {
    if (i === size-1 && j === size-1) {
        return [];
    }
    return [[i-1, j], [i+1, j], [i, j-1], [i, j+1]].filter(([a, b]) => {
        const value = (map[a] || [])[b];
        if (Number.isInteger(value) && value > map[i][j] + 1) {
            map[a][b] = map[i][j] + 1;
            return true;
        }
        return false;
    });
}


map[0][0] = 0;
let coordinates = [[0, 0]];
while (coordinates.length) {
    const [coordinate, ...other] = coordinates;
    const steps = move(coordinate);
    coordinates = [...other, ...steps];
}

console.log(map[size-1][size-1]);
