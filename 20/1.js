const fs = require('node:fs');

const map = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));
const benefit = 100;

const startI = map.findIndex(line => line.includes('S'));
const startJ = map[startI].findIndex(s => s === 'S');
const endI = map.findIndex(line => line.includes('E'));
const endJ = map[endI].findIndex(s => s === 'E');

const move = ([i, j], map) => {
    if (i === endI && j === endJ) {
        return [];
    }
    return [[i-1, j], [i+1, j], [i, j-1], [i, j+1]].filter(([a, b]) => {
        const value = (map[a] || [])[b];
        if (value === '.' || (Number.isInteger(value) && value > map[i][j] + 1)) {
            map[a][b] = map[i][j] + 1;
            return true;
        }
        return false;
    });
}


map[startI][startJ] = 0
map[endI][endJ] = '.';

const copyMap = () => [...map.map(line => [...line])];

const run = map => {
    let coordinates = [[startI, startJ]];
    while (coordinates.length) {
        const [coordinate, ...other] = coordinates;
        const steps = move(coordinate, map);
        coordinates = [...other, ...steps];
    }
    return map[endI][endJ];
}

const goal = run(copyMap()) - benefit;

let count = 0;
for (let i = 1; i < map.length - 1; i++) {
    for (let j = 1; j < map[0].length - 1; j++) {
        if (map[i][j] !== '#') {
            continue;
        }

        const copy = copyMap();
        copy[i][j] = '.';
        if (run(copy) <= goal) {
            count++;
        }
    }
}

console.log(count);
