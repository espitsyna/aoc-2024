const fs = require('node:fs');

const map = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));

const N = 0;
const W = 1;
const E = 2;
const S = 3;

const visited = {};
let direction = N;

let i = map.findIndex(line => line.includes('^'));
let j = map[i].findIndex(s => s === '^');

const forward = () => {
    switch (direction) {
        case N: return [i-1, j];
        case W: return [i, j-1];
        case E: return [i, j+1];
        case S: return [i+1, j];
    }
};

const turn = () => {
    switch (direction) {
        case N:
            direction = E;
            break;
        case W:
            direction = N;
            break;
        case E:
            direction = S;
            break;
        case S:
            direction = W;
            break;
    }
};


const step = () => {
    const [forwardI, forwardJ] = forward();
    if ((map[forwardI] || [])[forwardJ] === '#') {
        turn();
        return forward();
    }
    return [forwardI, forwardJ];
};

const isOut = (i, j) => i === -1 || i === map.length || j === -1 || j === map[0].length;

while (true) {
    if (!visited[i]) {
        visited[i] = new Set();
    }
    visited[i].add(j);
    const [stepI, stepJ] = step();
    if (isOut(stepI, stepJ)) {
        break;
    }
    i = stepI;
    j = stepJ;
}

const count = Object.values(visited).reduce((acc, s) => acc + s.size, 0);

console.log(count);
