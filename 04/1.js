const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));

const word = ['X', 'M', 'A', 'S'];
const N = 0;
const S = 1;
const W = 2;
const E = 3;
const NW = 4;
const NE = 5;
const SW = 6;
const SE = 7;

const checkLetter = (letter, i, j) => (data[i] || [])[j] === letter ? [i, j] : false;

const nextStep = (direction, letter, i, j) => {
    switch (direction) {
        case N:
            return checkLetter(letter, i-1, j);
        case S:
            return checkLetter(letter, i+1, j);
        case W:
            return checkLetter(letter, i, j-1);
        case E:
            return checkLetter(letter, i, j+1);
        case NW:
            return checkLetter(letter, i-1, j-1);
        case NE:
            return checkLetter(letter, i-1, j+1);
        case SW:
            return checkLetter(letter, i+1, j-1);
        case SE:
            return checkLetter(letter, i+1, j+1);
    }
};

const count = data.reduce((acc, line, i) => {
    const countInLine = line.reduce((acc, letter, j) => {
        if (letter !== word[0]) {
            return acc;
        }
        const words = [N, S, W, E, NW, NE, SW, SE].filter(direction => {
            let currentI = i;
            let currentJ = j;

            return word.slice(1).every(letter => {
                const move = nextStep(direction, letter, currentI, currentJ);
                if (!move) {
                    return false;
                }
                [currentI, currentJ] = move;
                return true;
            });
        });
        return acc + words.length;
    }, 0);
    return acc + countInLine;
}, 0);
console.log(count);
