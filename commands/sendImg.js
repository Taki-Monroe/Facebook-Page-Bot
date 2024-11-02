// commands/sendImage.js
module.exports = {
  name: 'sendimage',
  description: 'Send an image',
  execute(senderId, args, client) {
    if (!args[0]) {
      console.log('You need to specify an image URL.');
      return;
    }
    const message = {
      attachment: {
        type: 'image',
        payload: {
          url: args[0],
        },
      },
    };
    client.sendAttachment(senderId, message)
      .then(() => console.log(`Sent image to recipientId: ${senderId}`))
      .catch(err => console.log('Error sending image:', err));
  },
};
