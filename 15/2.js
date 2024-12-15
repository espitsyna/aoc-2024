const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n\r\n');

const map = data[0].split('\r\n').map(line => line.split('').reduce((acc, s) => {
    switch (s) {
        case '#': return [...acc, '#', '#'];
        case 'O': return [...acc, '[', ']'];
        case '.': return [...acc, '.', '.'];
        case '@': return [...acc, '@', '.'];
    }
}, []));

const instructions = data[1].replaceAll('\r\n', '').split('');

let i = map.findIndex(line => line.includes('@'));
let j = map[i].findIndex(s => s === '@');

const getBorders = (level, startPrev, endPrev = startPrev) => {
    let start = map[level][startPrev] === ']' ? startPrev - 1 : startPrev;
    let end = map[level][endPrev] === '[' ? endPrev + 1 : endPrev;
    while (map[level][start] === '.') {
        start++;
    }
    while (map[level][end] === '.') {
        end--;
    }

    return [start, end];
};

const getEmpty = instruction => {
    switch (instruction) {
        case '>':
            const lineForward = map[i].slice(j+1);
            const wallForward = lineForward.findIndex(s => s === '#');
            const emptyForward = lineForward.findIndex(s => s === '.');
            if (emptyForward !== -1 && emptyForward < wallForward) {
                return j + emptyForward + 1;
            }
            return null;
        case '<':
            const lineBackward = map[i].slice(0, j).reverse();
            const wallBackward = lineBackward.findIndex(s => s === '#');
            const emptyBackward = lineBackward.findIndex(s => s === '.');
            if (emptyBackward !== -1 && emptyBackward < wallBackward) {
                return j - emptyBackward -1;
            }
            return null;
        case '^':
            let levelBackward = i-1;
            let [startBackward, endBackward] = getBorders(levelBackward, j);
            while (true) {
                const line = map[levelBackward].slice(startBackward, endBackward + 1);
                if (line.every(s => s === '.')) {
                    return levelBackward;
                }
                if (line.some(s => s === '#')) {
                    return null;
                }
                levelBackward--;
                [startBackward, endBackward] = getBorders(levelBackward, startBackward, endBackward);
            }
        case 'v':
            let levelForward = i+1;
            let [startForward, endForward] = getBorders(levelForward, j);
            while (true) {
                const line = map[levelForward].slice(startForward, endForward + 1);
                if (line.every(s => s === '.')) {
                    return levelForward;
                }
                if (line.some(s => s === '#')) {
                    return null;
                }
                levelForward++;
                [startForward, endForward] = getBorders(levelForward, startForward, endForward);
            }
    }
};

const move = (instruction, empty) => {
    map[i][j] = '.';
    switch (instruction) {
        case '>':
            if (map[i][j+1] !== '.') {
                let position = empty;
                while (position > j){
                    map[i][position] = map[i][position-1];
                    position--;
                }
            }
            map[i][j+1] = '@';
            j++;
            break;
        case '<':
            if (map[i][j-1] !== '.') {
                let position = empty;
                while (position < j){
                    map[i][position] = map[i][position+1];
                    position++;
                }
            }
            map[i][j-1] = '@';
            j--;
            break;
        case '^':
            if (map[i-1][j] !== '.') {
                let level = i;
                const borders = {
                    [level]: [
                        map[level][j] === ']' ? j-1 : j,
                        map[level][j] === '[' ? j+1 : j,
                    ]
                };
                while (level-1 > empty) {
                    const [start, end] = borders[level];
                    level--;
                    borders[level] = getBorders(level, start, end);
                }

                let position = empty;
                while (position < i - 1) {
                    const [start, end] = borders[position + 1];
                    for (let j = start; j <= end; j++) {
                        map[position][j] = map[position+1][j];
                        map[position+1][j] = '.';
                    }
                    position++;
                }
            }
            map[i-1][j] = '@';
            i--;
            break;
        case 'v':
            if (map[i+1][j] !== '.') {
                let level = i;
                const borders = {
                    [level]: [
                        map[level][j] === ']' ? j-1 : j,
                        map[level][j] === '[' ? j+1 : j,
                    ]
                };
                while (level+1 < empty) {
                    const [start, end] = borders[level];
                    level++;
                    borders[level] = getBorders(level, start, end);
                }

                let position = empty;
                while (position > i + 1) {
                    const [start, end] = borders[position - 1];
                    for (let j = start; j <= end; j++) {
                        map[position][j] = map[position-1][j];
                        map[position-1][j] = '.';
                    }
                    position--;
                }
            }
            map[i+1][j] = '@';
            i++;
            break;
    }
};

const run = instruction => {
    const empty = getEmpty(instruction);
    if (empty === null) {
        return;
    }
    move(instruction, empty);
};

const print = map => console.log(map.map(line => line.join('')).join('\r\n'), '\r\n');


instructions.forEach(instruction => {
    run(instruction);
});

print(map);

const gps = map.reduce((acc, line, i) => acc + line.reduce((acc, s, j) => acc + (s === '[' ? 100 * i + j : 0), 0), 0);
console.log(gps);
