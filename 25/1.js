const fs = require('node:fs');
const data = fs.readFileSync('data.txt', 'utf8').split('\n\n');

const locks = [];
const keys = [];

data.forEach(input => {
	const rows = input.split('\n');
	const isLock = rows[0].includes('#');
	const schema = [];
	for (let i = 0; i < rows[0].length; i++) {
		const row = rows.map(row => row[i]);
		const index = row.findIndex(s => s === (isLock ? '.' : '#'));
		schema.push(isLock ? index - 1 : rows[0].length - index + 1);
	} 
	if (isLock) {
		locks.push(schema);
	} else {
		keys.push(schema);
	}
});

const count = locks.reduce((acc, lock) => acc + keys.reduce((acc, key) => {
	const fits = key.every((k, i) => k + lock[i] <= key.length);
	return acc + fits * 1;
}, 0), 0);

console.log(count);