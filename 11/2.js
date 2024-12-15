const fs = require('node:fs');

let stones = fs.readFileSync('data.txt', 'utf8').split(' ').filter(Boolean).reduce((acc, stone) => ({
    ...acc,
    [+stone]: (acc[+stone] ?? 0) + 1,
}), {});

const compute = stone => {
    if (+stone === 0) {
        return [1];
    }
    if (stone.length % 2 === 0) {
        const line = stone;
        const a = line.substring(0, line.length/2);
        const b = line.substring(line.length/2);
        return [+a, +b];

    }
    return [+stone * 2024];
};

const blink = stones => {
    const res = {};
    Object.entries(stones).forEach(([stone, count]) => {
        compute(stone).forEach(s => res[s] = (res[s] ?? 0) + count);
    });
    return res;
};

let n = 0;
while (n < 75) {
    stones = blink(stones);
    n++;
}
console.log(Object.values(stones).reduce((acc, stones) => acc + stones, 0));
