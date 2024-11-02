// commands/meme.js
const axios = require('axios');
const userManager = require('../userManager');
const messenger = require('../messenger');

module.exports = {
    name: 'meme',
    description: 'Fetch and send a meme',
    async execute(senderId, args, client) {
        try {
            const response = await axios.get('https://meme-api.herokuapp.com/gimme');
            const meme = response.data;
            
            const user = userManager.getUser(senderId);
            if (!user) {
                const userProfile = await messenger.getUserProfile(senderId);
                userManager.setUser(senderId, userProfile);
            }

            const message = {
                attachment: {
                    type: 'image',
                    payload: {
                        url: meme.url,
                    },
                },
            };

            client.sendAttachment(senderId, message)
                .then(() => console.log(`Sent meme to recipientId: ${senderId}`))
                .catch(err => console.log('Error sending meme:', err));

        } catch (error) {
            console.error(`Error fetching meme: ${error}`);
            client.sendTextMessage(senderId, "Sorry, I couldn't fetch a meme right now!")
                .catch(err => console.log('Error sending error message:', err));
        }
    },
};
