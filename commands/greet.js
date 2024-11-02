// commands/greet.js
module.exports = {
  name: 'greet',
  description: 'Send a greeting',
  execute(senderId, args, client) {
    let message = {
      text: 'Hello! How can I assist you today?',
    };
    client.sendTextMessage(senderId, message)
      .then(() => console.log(`Sent greeting to recipientId: ${senderId}`))
      .catch(err => console.log('Error sending greeting:', err));
  },
};
