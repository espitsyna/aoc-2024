const fs = require('node:fs');


const data = fs.readFileSync('data.txt', 'utf8').split('\r\n\r\n');
const patterns = data[0].split(', ');
const towels = data[1].split('\r\n').filter(Boolean);

const isAllowed = towel => {
    if (towel.length === 0) {
        return true;
    }
    const options = patterns.filter(pattern => towel.startsWith(pattern));
    return options.some(option => isAllowed(towel.slice(option.length)));
};

const allowed = towels.filter(isAllowed).length;
console.log(allowed);
