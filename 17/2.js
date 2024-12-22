const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n\r\n');

const instructions = data[1].match(/[0-9]+/g).map(i => +i);

const exec = input => {
    let pointer = 0;
    let A = input;
    let [_, B, C] = data[0].split('\r\n').map(value => +value.match(/[0-9]+/g));

    const out = [];

    const parseComboOperand = operand => {
        switch (operand) {
            case 0:
            case 1:
            case 2:
            case 3:
                return operand;
            case 4:
                return A;
            case 5:
                return B;
            case 6:
                return C;
        }
    };

    const run = (opcode, operand) => {
        switch (opcode) {
            case 0:
                A = Math.floor(A / Math.pow(2, parseComboOperand(operand)));
                break;
            case 1:
                B = B ^ operand;
                break;
            case 2:
                B = ((parseComboOperand(operand) % 8) + 8) % 8;
                break;
            case 3:
                if (A !== 0) {
                    pointer = operand;
                }
                break;
            case 4:
                B = B ^ C;
                break;
            case 5:
                out.push(((parseComboOperand(operand) % 8) + 8) % 8);
                break;
            case 6:
                B = Math.floor(A / Math.pow(2, parseComboOperand(operand)));
                break;
            case 7:
                C = Math.floor(A / Math.pow(2, parseComboOperand(operand)));
                break;

        }
    };

    while (instructions[pointer] !== undefined) {
        const opcode = instructions[pointer++];
        const operand = instructions[pointer++]
        run(opcode, operand);
    }

    return out;
}
const base = '0'.repeat(instructions.length).split('');

const candidates = []

let options = [[base, 0]];
while (options.length) {
    const [option, ...rest] = options;
    options = rest;
    const [base, i] = option;

    if (i === base.length) {
        break;
    }

    for (let n = 0; n <= 7; n++) {
        const input = [...base];
        input[i] = n;
        const out = exec(parseInt(input.join(''), 8));

        if (out.toString() === instructions.toString()) {
            candidates.push(parseInt(input.join(''), 8));
            break;
        }

        if (out.slice(-i-1).toString() === instructions.slice(-i-1).toString()) {
            options = [[input, i+1], ...options];
        }
    }
}

console.log(Math.min(...candidates));
