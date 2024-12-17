const fs = require('node:fs');

const map = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));

const E = 0;
const S = 1;
const W = 2;
const N = 3;

const startI = map.findIndex(line => line.includes('S'));
const startJ = map[startI].findIndex(s => s === 'S');
const endI = map.findIndex(line => line.includes('E'));
const endJ = map[endI].findIndex(s => s === 'E');
const direction = E;

map[startI][startJ] = 0;
map[endI][endJ] = '.';

const getOptions = (i, j, direction) => {
    switch (direction) {
        case N:
            return [[i-1, j], [i, j+1], [i, j-1]];
        case S:
            return [[i+1, j], [i, j-1], [i, j+1]];
        case E:
            return [[i, j+1], [i+1, j], [i-1, j]];
        case W:
            return [[i, j-1], [i-1, j], [i+1, j]];
    }
};

const shouldGo = (i, j, weight) => {
    return map[i][j] !== '#' && (map[i][j] === '.' || map[i][j] >= weight);
}

const finish = {};
const step = ([i, j, weight, direction, path]) => {
    if (i === endI && j === endJ) {
        if (!finish[weight]) {
            finish[weight] = [];
        }
        finish[weight].push(path);
        return [];
    }

    const snapshots = [];
    const [[forwardI, forwardJ], turnA, turnB] = getOptions(i, j, direction);
    if (shouldGo(forwardI, forwardJ, weight + 1)) {
        map[forwardI][forwardJ] = weight + 1;
        snapshots.push([forwardI, forwardJ, map[forwardI][forwardJ], direction, [...path, `${forwardI},${forwardJ}`]]);
    }
    [turnA, turnB].forEach(([a, b], index) => {
        map[i][j] = weight + 1000;
        if (shouldGo(a, b, weight + 1001)) {
            map[a][b] = weight + 1001;
            snapshots.push([a, b, map[a][b], (direction + (index ? -1 : 1) + 4) % 4, [...path, `${a},${b}`]]);
        }
    });
    return snapshots;
};

let snapshots = [[startI, startJ, 0, direction, [`${startI},${startJ}`]]];
while (snapshots.length) {
    const [snapshot, ...others] = snapshots;
    snapshots = [...step(snapshot), ...others];
}

const minWeight = Math.min(...Object.keys(finish).map(weight => +weight));
const count = (new Set([...finish[minWeight].flat()])).size;
console.log(count);
