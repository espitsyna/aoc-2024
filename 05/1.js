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

const middle = updates.split('\r\n').filter(Boolean).filter(update => {
    const numbers = update.split(',');
    return numbers.every((number, i) => {
        if (!map[number]) {
            return true;
        }
        if (map[number].before.length && numbers.slice(i+1).some(after => map[number].before.includes(after))) {
            return false;
        }
        if (map[number].after.length && numbers.slice(0, Math.max(i-1, 0)).some(before => map[number].after.includes(before))) {
            return false;
        }
        return true;
    });
}).map(update => {
    const numbers = update.split(',');
    return +numbers[Math.floor(numbers.length/2)];
}).reduce((acc, middle) => acc + middle, 0);

console.log(middle);
