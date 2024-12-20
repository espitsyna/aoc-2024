const fs = require('node:fs');

const map = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));
const benefit = 100;
const shortcut = 20;

const pathMap = Object.keys([...new Array(map.length)]).map(() => new Array(map[0].length).fill(null));

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
            pathMap[a][b] = [i, j];
            return true;
        }
        return false;
    });
}


map[startI][startJ] = 0
map[endI][endJ] = '.';

const run = () => {
    let coordinates = [[startI, startJ]];
    while (coordinates.length) {
        const [coordinate, ...other] = coordinates;
        const steps = move(coordinate, map);
        coordinates = [...other, ...steps];
    }
    return map[endI][endJ];
}

run();

const path = [[endI, endJ]];
while (true) {
    const [a, b] = path.at(-1);
    const prev = pathMap[a][b];
    if (prev === null) {
        break;
    }
    path.push(prev);
}

let count = 0
for (let i = 0; i < path.length; i++) {
    for (let j = i+benefit; j < path.length; j++) {
        const [x1, y1] = path[i];
        const [x2, y2] = path[j];

        const distance = j-i;
        const manhattanDistance = Math.abs(x1-x2) + Math.abs(y1-y2);
        if (manhattanDistance <= shortcut && distance - manhattanDistance >= benefit) {
            count++;
        }
    }
}

console.log(count);
