const fs = require('node:fs');
const data = fs.readFileSync('test', 'utf8').split('\n\n');

const input = {};
data[0].split('\n').forEach(line => {
	const [name, value] = line.split(': ');
	input[name] = +value;
});

//for (let i = 0; i < 45; i++) {
//	const num = `${i}`.padStart(2, '0');
//	input[`x${num}`] = 0;
//	input[`y${num}`] = 0;
//}
//input[`x06`] = 1;
//input[`y06`] = 1;


const getNumber = letter => Object.keys(input).filter(name => name.startsWith(letter)).sort((a, b) => {
	const n1 = +a.slice(1);
	const n2 = +b.slice(1);
	return n2-n1;
}).map(name => input[name]).join('');

const wires = {};
data[1].split('\n').forEach(line => {
	const [instruction, name] = line.split(' -> ');
	const [input1, operation, input2] = instruction.split(' ');
	wires[name] = { name, input: [input1, input2], operation };
});

const isFinal = name => name.startsWith('x') || name.startsWith('y');


const print = (name) => {
	const { input: [input1, input2], operation } = wires[name];
	let line = '(';
	if (isFinal(input1)) {
		line += input1;
	} else {
		line += print(input1);
	}
	switch (operation) {
		case 'AND':
			line += ' && ';
			break;
		case 'OR':
			line += ' || ';
			break;
		case 'XOR':
			line += ' ^ ';
			break;
	}
	if (isFinal(input2)) {
		line += input2;
	} else {
		line += print(input2);
	}
	line += ')';
	return line;
};

// for (let i = 0; i < 45; i++) {
// 	const out = `z${`${i}`.padStart(2, '0')}`;
//	console.log(out);
//	console.log(print(out));
// }


const calculate = (operation, input1, input2) => {
	switch (operation) {
		case 'AND':
			return input1 === 1 && input2 === 1 ? 1 : 0;
		case 'OR':
			return input1 === 1 || input2 === 1 ? 1 : 0;
		case 'XOR':
			return input1 !== input2 ? 1 : 0;
	}
};

const x = getNumber('x');
const y = getNumber('y');

const sum = (parseInt(x, 2) + parseInt(y, 2)).toString(2).padStart(46, '0');

let gates = Object.values(wires);

while (gates.length) {
	const processed = gates.filter(({ name, input: [input1, input2], operation }) => {
		if (input[input1] !== undefined && input[input2] !== undefined) {
			input[name] = calculate(operation, input[input1], input[input2]);
			if (name.startsWith('z')) {
				const num = +name.slice(1);
				const expected = +sum[sum.length - num - 1];
				const computed = input[name];
				console.log(expected === computed ? 'CORRECT' : 'ERROR', name, expected, computed, operation, input1, input[input1], input2, input[input2]);
			}
			return true;
		}
		return false;
	}).map(({ name }) => name);
	gates = gates.filter(({ name }) => !processed.includes(name));
}


const z = getNumber('z');
console.log(sum);
console.log(z);


const fixed = ['z05', 'tst', 'z11', 'sps', 'z23', 'frt', 'pmd', 'cgh'].sort().join(',')
console.log(fixed);
