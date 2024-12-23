const fs = require('node:fs');

const data = fs.readFileSync('data.txt', 'utf8').split('\r\n').filter(Boolean);

const connections = {};
data.forEach(connection => {
    const [a, b] = connection.split('-');
    connections[a] = [...(connections[a] || [a]), b];
    connections[b] = [...(connections[b] || [b]), a];
});

const count = neighbours => {
    const stat = {};
    neighbours.forEach(computers => computers.forEach(computer => stat[computer] = (stat[computer] ?? 0) + 1));
    const grouped = {};
    Object.keys(stat).forEach(computer => grouped[stat[computer]] = [...(grouped[stat[computer]] || []), computer]);
    return grouped[neighbours.length].length + (grouped[neighbours.length - 1]?.length || 0);
};

const intersections = {};

Object.entries(connections).forEach(([key, neighbours]) => {
    const size = count(neighbours.map(computer => connections[computer]));
    intersections[size] = [...(intersections[size] || []), key];
});

const maxSize = Math.max(...Object.keys(intersections).map(n => +n));
console.log(intersections[maxSize].sort().join(','));
