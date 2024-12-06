const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');
const [rules, updates] = data.split('\r\n\r\n');

const map = {};
rules.split('\r\n').forEach(rule => {
    const [before, after] = rule.split('|');
    if (!map[before]) {
        map[before] = { before: [], after: [] };
    }
    if (!map[after]) {
        map[after] = { before: [], after: [] };
    }
    map[before].after.push(after);
    map[after].before.push(before);
});

const findNext = candidates => iterate(candidates[0], candidates);

const iterate = (number, candidates) => {
    const before = map[number].before.filter(before => candidates.includes(before));
    if (before.length === 0) {
        return number;
    }
    return iterate(before[0], candidates);
};

const middle = updates.split('\r\n').filter(Boolean).reduce((acc, update) => {
    const numbers = update.split(',');
    const expected = [];
    while (expected.length !== numbers.length) {
        const candidates = numbers.filter(n => !expected.includes(n));
        const next = findNext(candidates);
        expected.push(next);
    }

    const correct = expected.toString() === numbers.toString();
    return correct ? acc : acc + +expected[Math.floor(expected.length/2)];
}, 0);

console.log(middle);
