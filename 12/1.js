const fs = require('node:fs');

const map = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));

const visited = Object.keys([...new Array(map.length)]).map(() => new Array(map[0].length).fill(false));

const countRegion = (i, j) => {
    if (visited[i][j]) {
        return 0;
    }

    const region = [];
    let check = [[i, j]];
    while (check.length) {
        const [[a, b], ...other] = check;
        check = other;

        if (visited[a][b]) {
            continue;
        }
        visited[a][b] = true;
        region.push([a, b]);
        [[a+1, b], [a, b+1], [a-1, b], [a, b-1]].forEach(([c, d]) => {
            if ((map[c] || [])[d] === map[i][j]) {
                check.push([c, d]);
            }
        });
    }

    return region.length * region.reduce((acc, [a, b]) => acc +
        [[a+1, b], [a, b+1], [a-1, b], [a, b-1]].filter(([c, d]) => (map[c] || [])[d] !== map[i][j]).length, 0);
};

const count = map.reduce((acc, line, i) => acc + line.reduce((acc, plant, j) => {
    const region = countRegion(i, j);
    return acc + region;
}, 0), 0);
console.log(count);
