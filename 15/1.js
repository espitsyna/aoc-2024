const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n\r\n');

const map = data[0].split('\r\n').map(line => line.split(''));
const instructions = data[1].replaceAll('\r\n', '').split('');

let i = map.findIndex(line => line.includes('@'));
let j = map[i].findIndex(s => s === '@');

const getLine = instruction => {
    switch (instruction) {
        case '^':
            return map.slice(0, i).map(line => line[j]).reverse();
        case 'v':
            return map.slice(i+1).map(line => line[j]);
        case '>':
            return map[i].slice(j+1);
        case '<':
            return map[i].slice(0, j).reverse();
    }
};

const move = (instruction, empty) => {
    map[i][j] = '.';
    switch (instruction) {
        case '^':
            if (map[i-1][j] === 'O') {
                map[i - empty - 1][j] = 'O';
            }
            map[i-1][j] = '@';
            i--;
            break;
        case 'v':
            if (map[i+1][j] === 'O') {
                map[i + empty + 1][j] = 'O';
            }
            map[i+1][j] = '@';
            i++;
            break;
        case '>':
            if (map[i][j+1] === 'O') {
                map[i][j + empty + 1] = 'O';
            }
            map[i][j+1] = '@';
            j++;
            break;
        case '<':
            if (map[i][j-1] === 'O') {
                map[i][j - empty - 1] = 'O';
            }
            map[i][j-1] = '@';
            j--;
            break;
    }
};

const run = instruction => {
    const line = getLine(instruction);
    const wall = line.findIndex(s => s === '#');
    const empty = line.findIndex(s => s === '.');
    if (empty === -1 || empty > wall) {
        return;
    }
    move(instruction, empty);
};

const print = map => console.log(map.map(line => line.join('')).join('\r\n'), '\r\n');

instructions.forEach(instruction => {
    run(instruction);
});

print(map);

const gps = map.reduce((acc, line, i) => acc + line.reduce((acc, s, j) => acc + (s === 'O' ? 100 * i + j : 0), 0), 0);
console.log(gps);
