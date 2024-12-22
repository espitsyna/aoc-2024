const fs = require('node:fs');

const secrets = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(n => +n);

const modulo = num => ((num % 16777216) + 16777216) % 16777216;

const next = secret => {
    const s1 = modulo((secret * 64) ^ secret);
    const s2 = modulo(Math.floor(s1 / 32) ^ s1);
    return modulo((s2 * 2048) ^ s2);
};

const sum = secrets.reduce((acc, secret) => {
    let s = secret;
    for (let i = 0; i < 2000; i++) {
        s = next(s);
    }
    return acc + s;
}, 0);

console.log(sum);
