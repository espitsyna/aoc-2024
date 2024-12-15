const fs = require('node:fs');

const map = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean).map(line => line.split(''));

const visited = Object.keys([...new Array(map.length)]).map(() => new Array(map[0].length).fill(false));

const countSides = sides => Object.values(sides).reduce((acc, side) => {
    const sorted = [...side].sort((a, b) => a-b);
    return acc + sorted.filter((el, i) => sorted[i+1] && sorted[i+1] !== el + 1).length + 1;
}, 0);

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

    const sidesVertical = {};
    const sidesHorizontal = {};
    region.forEach(([a, b]) => {
        if ((map[a+1] || [])[b] !== map[i][j]) {
            sidesHorizontal[`${a}${a+1}`] = [...(sidesHorizontal[`${a}${a+1}`]|| []), b];
        }
        if ((map[a-1] || [])[b] !== map[i][j]) {
            sidesHorizontal[`${a}${a-1}`] = [...(sidesHorizontal[`${a}${a-1}`]|| []), b];
        }
        if (map[a][b+1] !== map[i][j]) {
            sidesVertical[`${b}${b+1}`] = [...(sidesVertical[`${b}${b+1}`]|| []), a];
        }
        if (map[a][b-1] !== map[i][j]) {
            sidesVertical[`${b}${b-1}`] = [...(sidesVertical[`${b}${b-1}`]|| []), a];
        }
    });

    return region.length * (countSides(sidesVertical) + countSides(sidesHorizontal));
};

const count = map.reduce((acc, line, i) => acc + line.reduce((acc, plant, j) => {
    const region = countRegion(i, j);
    return acc + region;
}, 0), 0);
console.log(count);
