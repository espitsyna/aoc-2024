const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').trimEnd().split('').filter(Boolean).map(n => +n);
const blocks = [];
const map = {};
let ID = 0;

data.forEach((s, i) => {
    const isFile = i % 2 === 0;
    if (isFile) {
        map[ID] = { length: s, start: blocks.length };
    }

    Object.keys([...new Array(s)]).forEach(() => blocks.push(isFile ? ID : '.'));
    ID = isFile ? ID + 1 : ID;
});

while (ID > 1) {
    const { length, start } = map[--ID];
    const index = blocks.slice(0, start).findIndex((_, i) => blocks.slice(i, i+length).every(s => s === '.'));
    if (index !== -1) {
        Object.keys([...new Array(length)]).forEach(i => {
            blocks[index + +i] = ID;
            blocks[start + +i] = '.';
        });
    }
}

const checksum = blocks.reduce((acc, s, i) => s === '.' ? acc : acc + s * i, 0);
console.log(checksum);
