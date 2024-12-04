const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));

const count = data.reduce((acc, line, i) => {
    const countInLine = line.reduce((acc, letter, j) => {
        if (letter !== 'A') {
            return acc;
        }
        const nw = (data[i-1] || [])[j-1];
        const ne = (data[i-1] || [])[j+1];
        const sw = (data[i+1] || [])[j-1];
        const se = (data[i+1] || [])[j+1];

        const pattern = [nw, ne, sw, se].every(letter => ['M', 'S'].includes(letter)) && nw !== se && ne !== sw;
        return acc + pattern;
    }, 0);
    return acc + countInLine;
}, 0);
console.log(count);
