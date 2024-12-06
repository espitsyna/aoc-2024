const fs = require('node:fs');

const map = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));

const N = 0;
const W = 1;
const E = 2;
const S = 3;

const forward = (i, j, direction) => {
    switch (direction) {
        case N: return [i-1, j];
        case W: return [i, j-1];
        case E: return [i, j+1];
        case S: return [i+1, j];
    }
};

const turn = direction => {
    switch (direction) {
        case N:
            return E;
        case W:
            return N;
        case E:
            return S;
        case S:
            return W;
    }
};


const step = (i, j, direction, map) => {
    while (true) {
        const [stepI, stepJ] = forward(i, j, direction);
        if ((map[stepI] || [])[stepJ] !== '#') {
            return [stepI, stepJ, direction];
        }
        direction = turn(direction);
    }
};

const register = (i, j, direction, visited) => {
    if (!visited[i]) {
        visited[i] = {};
    }
    if (!visited[i][j]) {
        visited[i][j] = new Set();
    }
    visited[i][j].add(direction);
};

const run = map => {
    const visited = {};
    let direction = N;

    let i = map.findIndex(line => line.includes('^'));
    let j = map[i].findIndex(s => s === '^');

    while (true) {
        const [stepI, stepJ, newDirection] = step(i, j, direction, map);
        if ((map[stepI] || [])[stepJ] === undefined) {
            return false;
        }

        if (((visited[i] || [])[j])?.has(newDirection)) {
            return true;
        }
        register(i, j, newDirection, visited);

        i = stepI;
        j = stepJ;
        direction = newDirection;
    }
}

const loops = map.reduce((acc, line, i) => {
    const countInLine = line.reduce((acc, s, j) => {
        if (s !== '.') {
            return acc;
        }
        const tmp = [...map.map(line => ([...line]))];
        tmp[i][j] = '#'
        return acc + 1 * run(tmp);
    }, 0);
    return acc + countInLine;
}, 0);

console.log(loops);
