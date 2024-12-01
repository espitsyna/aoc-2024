const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const left = [];
const right = {};
data.split('\n').filter(Boolean).forEach(line => {
    const [a, b] = line.split('   ');
    left.push(+a);
    right[+b] = (right[+b] ?? 0) + 1;
});

const similarity = left.reduce((acc, num) => acc + num * (right[num] ?? 0), 0);
console.log(similarity);
