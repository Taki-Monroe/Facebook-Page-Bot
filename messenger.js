// messenger.js
const fetch = require('node-fetch');
const config = require('./config');

async function getUserProfile(id) {
    const url = `https://graph.facebook.com/${id}?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=${config.pageAccessToken}`;
    const response = await fetch(url);
    return response.json();
}

module.exports = { getUserProfile };
