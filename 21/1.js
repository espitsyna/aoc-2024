const fs = require('node:fs');

const codes = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean);

const numericMap = {
    '7': [0, 0],
    '8': [0, 1],
    '9': [0, 2],
    '4': [1, 0],
    '5': [1, 1],
    '6': [1, 2],
    '1': [2, 0],
    '2': [2, 1],
    '3': [2, 2],
    '0': [3, 1],
    'A': [3, 2],
};

const directionalMap = {
    '^': [0, 1],
    'A': [0, 2],
    '<': [1, 0],
    'v': [1, 1],
    '>': [1, 2],
};

let n = [3, 2];

const d = [
    [0, 2],
    [0, 2],
];

const dictionary = {};

const move = ([si, sj], [ei, ej], path = '') => {
    const options = [];
    if (si < ei) {
        options.push([`${path}v`, [si+1, sj]]);
    }
    if (si > ei) {
        options.push([`${path}^`, [si-1, sj]]);
    }
    if (sj < ej) {
        options.push([`${path}>`, [si, sj+1]]);
    }
    if (sj > ej) {
        options.push([`${path}<`, [si, sj-1]]);
    }

    return options;
};

const iterate = (paths, end, move) => {
    return paths.map(([path, current]) => {
        const options = move(current, end, path);
        if (options.length === 0) {
            return path;
        } else {
            return iterate(options, end, move).flat();
        }
    });
};

const moveNumeric = (start, end, path = '') => {
    return move(start, end, path)
        .filter(([_, [a, b]]) => [0, 1, 2, 3].includes(a) && [0, 1, 2].includes(b) && !(a === 3 && b === 0));
};

const moveDirection = (start, end, path = '') => {
    return move(start, end, path)
        .filter(([_, [a, b]]) => [0, 1].includes(a) && [0, 1, 2].includes(b) && !(a === 0 && b === 0));
};

const getPaths = (start, end, callback) => {
   const paths = iterate(callback(start, end), end, callback).flat();
   return paths.length ? paths.map(path => [...path.split(''), 'A']) : [['A']];
};

const pressNumber = letter => {
    const endPosition = numericMap[letter];
    const paths = getPaths(n, endPosition, moveNumeric);
    const options = paths.map(path => path.reduce((acc, s) => acc + pressDirection(s), 0));
    n = endPosition;
    return Math.min(...options);
};

const pressDirection = (direction) => {
    const startPosition = d[0];
    const endPosition = directionalMap[direction];

    if (!dictionary[`${startPosition}${endPosition}`]) {
        const paths = getPaths(startPosition, endPosition, moveDirection);
        const options = paths.map(path => {
            let options = [];
            path.forEach(s => {
                const paths = getPaths(d[1], directionalMap[s], moveDirection);
                if (options.length) {
                    options = options.map(option => paths.map(path => option + path.length)).flat();
                } else {
                    options = paths.map(path => path.length);
                }
                d[1] = directionalMap[s];
            })
            return Math.min(...options);
        });
        dictionary[`${startPosition}${endPosition}`] = Math.min(...options);
    }

    d[0] = endPosition;
    return dictionary[`${startPosition}${endPosition}`];
};

const pressCode = code => code.split('').reduce((acc, letter) => acc + pressNumber(letter), 0);

const complexity = codes.reduce((acc, code) => acc + pressCode(code) * Number.parseInt(code), 0);

console.log(complexity);

