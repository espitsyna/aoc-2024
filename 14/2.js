const fs = require('node:fs');

const sizeX = 101;
const sizeY = 103;

let robots = fs.readFileSync('data.txt', 'utf8')
    .split('\r\n')
    .filter(Boolean)
    .map(robot => {
        const [x, y, a, b] = robot.match(/-?[0-9]+/g);
        return { x: +x, y: +y, a: +a, b: +b };
    });

const writeToFile = (robots, iteration) => {
    let content = '';
    let candidate = false;
    let i = 0;
    while (i < sizeY) {
        let j = 0;
        let line = '';
        while (j < sizeX) {
            if (robots.some(({ x, y }) => x === j && y === i)) {
                line += '*';
            } else {
                line += ' ';
            }
            j++;
        }
        if (line.includes('*'.repeat(30))) {
            candidate = true;
        }
        content += `${line}\r\n`;
        i++;
    }

    if (candidate) {
        fs.writeFileSync(`${iteration}.txt`, content);
    }
};

let i = 0;
while (i < sizeX * sizeY) {
    robots = robots.map(({ x, y, a, b }) => ({
        x: (sizeX + x + a) % sizeX,
        y: (sizeY + y + b) % sizeY,
        a,
        b,
    }));
    i++;

    writeToFile(robots, i);
}


