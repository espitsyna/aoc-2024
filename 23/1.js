const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean);

const connections = {};
data.forEach(connection => {
    const [a, b] = connection.split('-');
    connections[a] = [...(connections[a] || []), b];
    connections[b] = [...(connections[b] || []), a];
});

const groups = new Set();
Object.entries(connections).forEach(([key, values]) => {
    values.forEach(value => {
        connections[value].filter(v => values.includes(v)).map(third => {
            if (key.startsWith('t') || value.startsWith('t') || third.startsWith('t')) {
                const group = [key, value, third].sort().toString();
                groups.add(group);
            }
        });
    });
});

console.log(groups.size);
