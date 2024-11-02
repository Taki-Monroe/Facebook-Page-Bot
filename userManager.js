// userManager.js
const fs = require('fs');

function getUser(id) {
    const users = JSON.parse(fs.readFileSync('users.json'));
    return users[id];
}

function setUser(id, data) {
    const users = JSON.parse(fs.readFileSync('users.json'));
    users[id] = data;
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
}

module.exports = { getUser, setUser };
