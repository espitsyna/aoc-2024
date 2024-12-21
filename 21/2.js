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

const d = Object.keys([...new Array(25)]).map(() => [0, 2]);

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
    const level = 0;
    const startPosition = d[level];
    const endPosition = directionalMap[direction];
    d[level] = endPosition;

    const memoValue = getMemo(level, startPosition, endPosition);
    if (memoValue) {
        return memoValue;
    }

    const paths = getPaths(startPosition, endPosition, moveDirection);

    const value = goDeeper(paths, level+1);
    memo(level, startPosition, endPosition, value);
    return value;
};

const memo = (level, s, e, value) => {
    const start = Object.keys(directionalMap).find(key => directionalMap[key].toString() === s.toString());
    const end = Object.keys(directionalMap).find(key => directionalMap[key].toString() === e.toString());
    if (!dictionary[level]) {
        dictionary[level] = {};
    }
    dictionary[level][`${start},${end}`] = value;
};

const getMemo = (level, s, e) => {
    const start = Object.keys(directionalMap).find(key => directionalMap[key].toString() === s.toString());
    const end = Object.keys(directionalMap).find(key => directionalMap[key].toString() === e.toString());

    return (dictionary[level] || [])[`${start},${end}`];
};

const goDeeper = (paths, level) => {
    if (!d[level]) {
        return Math.min(...paths.map(path => path.length));
    }

    const options = paths.map(path =>
        path.reduce((acc, s) => {
            const startPosition = d[level];
            const endPosition = directionalMap[s];
            d[level] = endPosition;

            const memoValue = getMemo(level, startPosition, endPosition);
            if (memoValue) {
                return acc + memoValue;
            }

            const paths = getPaths(startPosition, endPosition, moveDirection);
            const value = goDeeper(paths, level+1);
            memo(level, startPosition, endPosition, value)
            return acc + value;
        }, 0)
    );

    return Math.min(...options);
};

const pressCode = code => code.split('').reduce((acc, letter) => acc + pressNumber(letter), 0);

const complexity = codes.reduce((acc, code) => acc + pressCode(code) * Number.parseInt(code), 0);
console.log(complexity);
