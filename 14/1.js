const fs = require('node:fs');

const sizeX = 101;
const sizeY = 103;

const middleX = (sizeX - 1) / 2;
const middleY = (sizeY - 1) / 2;

let Q1 = 0;
let Q2 = 0;
let Q3 = 0;
let Q4 = 0;

const robots = fs.readFileSync('data.txt', 'utf8')
    .split('\r\n')
    .filter(Boolean)
    .map(robot => {
        const [x, y, a, b] = robot.match(/-?[0-9]+/g);
        return { x: +x, y: +y, a: +a, b: +b };
    });

robots.forEach(({ x, y, a, b }) => {
    let i = 0;
    while (i < 100) {
        x = (sizeX + x + a) % sizeX;
        y = (sizeY + y + b) % sizeY;
        i++;
    }

    if (x < middleX && y < middleY) {
        Q1++
    } else if (x < middleX && y > middleY) {
        Q2++;
    } else if (x > middleX && y < middleY) {
        Q3++;
    } else if (x > middleX && y > middleY) {
        Q4++;
    }
});

console.log(Q1 * Q2 * Q3 * Q4);
