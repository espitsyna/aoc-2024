const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8');

const test = (numbers, result) => {
    if (numbers.length === 1) {
        return numbers[0] === result;
    }

    const [first, second, ...rest] = numbers;
    if (first > result) {
        return false;
    }

    return test([first + second, ...rest], result) ||
        test([first * second, ...rest], result) ||
        test([+`${first}${second}`, ...rest], result);
};

const sum = data.split('\r\n').filter(Boolean).reduce((acc, equation) => {
    const [result, numbers] = equation.split(': ');
    const correct = test(numbers.split(' ').map(n => +n), +result);
    return acc + result * correct;
}, 0);


console.log(sum);

