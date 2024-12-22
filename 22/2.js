const fs = require('node:fs');

const secrets = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(n => +n);

const modulo = num => ((num % 16777216) + 16777216) % 16777216;
const getPrice = secret => +`${secret}`.at(-1);

const next = secret => {
    const s1 = modulo((secret * 64) ^ secret);
    const s2 = modulo(Math.floor(s1 / 32) ^ s1);
    return modulo((s2 * 2048) ^ s2);
};


const changes = [];
const prices = [];

secrets.forEach(secret => {
    const p = [];
    const c = [];
    const initialPrice = getPrice(secret);

    let s = secret;
    for (let i = 0; i < 2000; i++) {
        s = next(s);
        const price = getPrice(s);
        c.push(price - (p.at(-1) ?? initialPrice));
        p.push(price);

    }
    changes.push(c);
    prices.push(p);
});

const sequences = {};
changes.forEach((change, i) => {
    for (let j = 0; j < change.length - 3; j++) {
        const sequence = change.slice(j, j+4).toString();
        if (!sequences[sequence]) {
            sequences[sequence] = {};
        }
        if (!sequences[sequence][i]) {
            sequences[sequence][i] = prices[i][j+3];
        }
    }
});


let max = 0;
let maxSequence = null;

Object.entries(sequences).forEach(([sequence, prices]) => {
    const sum = Object.values(prices).reduce((acc, price) => acc + price, 0);
    if (sum > max) {
        max = sum;
        maxSequence = sequence;
    }
});

console.log(max, maxSequence);
