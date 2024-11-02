// commands/openai.js
const { Configuration, OpenAIApi } = require('openai');

// Set your OpenAI key and organization ID here
const openaiKey = 'YOUR_OPENAI_KEY';
const organization = 'YOUR_ORGANIZATION_ID';

const configuration = new Configuration({
  apiKey: openaiKey,
  organization: organization,
});

const openai = new OpenAIApi(configuration);

module.exports = {
  name: 'openai',
  description: 'Interact with AI',
  async execute(senderId, args, client) {
    const ask = args.join(" ");
    if (!ask) {
      console.log('Missing input.');
      return;
    }

    try {
      const persona = "You are ChatGPT, a friendly and knowledgeable AI.";
      const fullPrompt = `${persona}\nUser: ${ask}\nAI:`;

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: fullPrompt,
        temperature: 0.9,
        n: 1,
        stream: false,
        max_tokens: 4000,
      });

      const reply = response.data.choices[0].text.trim();

      const message = {
        text: reply,
      };

      client.sendText(senderId, message)
          .then(() => console.log(`Sent AI response to recipientId: ${senderId}`))
          .catch(err => console.log('Error sending AI response:', err));
    } catch (error) {
      console.error(error);
      client.sendTextMessage(senderId, "Sorry, there was an error processing your request!")
          .catch(err => console.log('Error sending error message:', err));
    }
  },
};
