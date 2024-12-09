const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').trimEnd().split('').filter(Boolean).map(n => +n);
const blocks = [];
let ID = 0;

data.forEach((s, i) => {
    const isFile = i % 2 === 0;
    Object.keys([...new Array(s)]).forEach(() => blocks.push(isFile ? ID : '.'));
    ID = isFile ? ID + 1 : ID;
});

while (true) {
    const space = blocks.findIndex(s => s === '.');
    const file = blocks.findLastIndex(s => s !== '.');
    if (space > file) {
        break;
    }
    blocks[space] = blocks[file];
    blocks[file] = '.';
}

const checksum = blocks.reduce((acc, s, i) => s === '.' ? acc : acc + s * i, 0);
console.log(checksum);
