const fs = require('node:fs');

let stones = fs.readFileSync('data.txt', 'utf8').split(' ').filter(Boolean).map(n => +n);

const blink = stones => {
    const res = [];
    stones.forEach(stone => {
        if (stone === 0) {
            res.push(1);
        } else if (`${stone}`.length % 2 === 0) {
            const line = `${stone}`;
            const a = line.substring(0, line.length/2);
            const b = line.substring(line.length/2);
            res.push(+a);
            res.push(+b);
        } else {
            res.push(stone * 2024);
        }
    });
    return res;
};


let n = 0;
while (n < 25) {
    stones = blink(stones);
    n++;
}

console.log(stones.length);
