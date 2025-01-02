const fs = require('node:fs');
const data = fs.readFileSync('data.txt', 'utf8').split('\n\n');

const input = {};
data[0].split('\n').forEach(line => {
	const [name, value] = line.split(': ');
	input[name] = +value;
});

let gates = [];
data[1].split('\n').forEach(line => {
	const [instruction, name] = line.split(' -> ');
	const [input1, operation, input2] = instruction.split(' ');
	gates.push({ name, input: [input1, input2], operation });
});

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

while (gates.length) {
	const processed = gates.filter(({ name, input: [input1, input2], operation }) => {
		if (input[input1] !== undefined && input[input2] !== undefined) {
			input[name] = calculate(operation, input[input1], input[input2]);
			return true;
		}
		return false;
	}).map(({ name }) => name);
	gates = gates.filter(({ name }) => !processed.includes(name));
}

const values = Object.keys(input).filter(name => name.startsWith('z')).sort((a, b) => {
	const n1 = +a.slice(1);
	const n2 = +b.slice(1);
	return n2-n1;
}).map(name => input[name]);

const value = parseInt(values.join(''), 2);
console.log(value);