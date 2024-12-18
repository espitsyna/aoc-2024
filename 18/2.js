const fs = require('node:fs');

const size = 71;
let failed = 1024;

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n');

const move = ([i, j], map) => {
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

const isReachable = failed => {
    const map = Object.keys([...new Array(size)]).map(() => new Array(size).fill(Number.MAX_SAFE_INTEGER));
    data.slice(0, failed).forEach(byte => {
        const [j, i] = byte.split(',').map(n => +n);
        map[i][j] = '#';
    });

    map[0][0] = 0;
    let coordinates = [[0, 0]];
    while (coordinates.length) {
        const [coordinate, ...other] = coordinates;
        const steps = move(coordinate, map);
        coordinates = [...other, ...steps];
    }

    return map[size-1][size-1] !== Number.MAX_SAFE_INTEGER;
};

while (true) {
    if (!isReachable(failed)) {
        break;
    }
    failed++;
}

console.log(data[failed-1]);
