const fs = require('node:fs');


const data = fs.readFileSync('data.txt', 'utf8').split('\r\n\r\n');
const patterns = data[0].split(', ');
const towels = data[1].split('\r\n').filter(Boolean);

const dictionary = {};

const countWays = towel => {
    if (towel.length === 0) {
        return 1;
    }
    const options = patterns.filter(pattern => towel.startsWith(pattern));
    return options.reduce((acc, option) => {
        const towelEnd = towel.slice(option.length);
        if (!dictionary[towelEnd]) {
            dictionary[towelEnd] = countWays(towelEnd);
        }
        return acc + dictionary[towelEnd];
    }, 0);
};

const ways = towels.reduce((acc, towel, i) => acc + countWays(towel), 0);
console.log(ways);
