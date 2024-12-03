const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const instructions = data.match(/mul\([0-9]{0,3},[0-9]{0,3}\)/g);
const sum = instructions.reduce((acc, i) => {
    const [a,b] = i.match(/[0-9]+/g);
    return acc + a * b;
}, 0);
console.log(sum);
