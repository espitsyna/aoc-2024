const fs = require('node:fs');

const machines = fs.readFileSync('data.txt', 'utf8')
    .split('\r\n\r\n')
    .filter(Boolean)
    .map(machine => {
        const [buttonA, buttonB, prize] = machine.split('\r\n');
        const [AX, AY] = buttonA.match(/[0-9]+/g);
        const [BX, BY] = buttonB.match(/[0-9]+/g);
        const [X, Y] = prize.match(/[0-9]+/g);

        return { AX: +AX, AY: +AY, BX: +BX, BY: +BY, X: +X, Y: +Y };
    });

const tokens = machines.reduce((acc, machine) => {
    const { AX, AY, BX, BY, X, Y } = machine;
    const b = (AX * Y - AY * X) / (AX * BY - AY * BX);
    if (!Number.isInteger(b)) {
        return acc;
    }
    const a = (X - BX * b) / AX;
    if (!Number.isInteger(a)) {
        return acc;
    }
    return acc + a * 3 + b;
}, 0);
console.log(tokens);
