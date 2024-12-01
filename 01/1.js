const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const left = [];
const right = [];
data.split('\n').filter(Boolean).forEach(line => {
    const [a, b] = line.split('   ');
    left.push(+a);
    right.push(+b);
});

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

const distance = left.reduce((acc, num, i) => acc + Math.abs(num - right[i]), 0);
console.log(distance);
