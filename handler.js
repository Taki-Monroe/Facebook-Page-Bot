const commandPrefix = '!';
const fs = require('fs');
const config = require('./config');
const messengerNode = require('messenger-node');
const { getUserProfile } = require("./messenger");
const { getUser, setUser } = require("./userManager");

const client = new messengerNode.Client({
    token: config.pageAccessToken,
    api_version: 'v11.0'
});

// Load commands
const commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

async function handleMessage(senderId, message) {
    // Check if user exists in users.json
    let user = getUser(senderId);

    if (!user) {
        // If not, fetch their profile from the Facebook Messenger API
        try {
            const profile = await getUserProfile(senderId);
            // Then add them to users.json
            setUser(senderId, {
                id: senderId,
                firstName: profile.first_name,
                lastName: profile.last_name,
                profilePic: profile.profile_pic,
                locale: profile.locale,
                timezone: profile.timezone,
                gender: profile.gender,
                messagesReceived: 0
            });
            user = getUser(senderId);
        } catch (err) {
            console.error(err);
            sendTextMessage(senderId, "There was an error trying to fetch your profile. Please try again.");
        }
    }

    // Update messagesReceived count
    user.messagesReceived++;
    setUser(user.id, user);

    if (message.text && message.text.startsWith(commandPrefix)) {
        // Remove the command prefix and split the message into command and arguments
        const args = message.text.slice(commandPrefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (!commands.has(command)) return;

        try {
            commands.get(command).execute(senderId, args, client);
        } catch (error) {
            console.error(error);
            sendTextMessage(senderId, "There was an error trying to execute that command!");
        }
    }
}

function sendTextMessage(recipientId, messageText) {
    let message = {
        text: messageText
    };

    client.sendText(recipientId, message)
        .then(() => console.log(`Sent message to recipientId: ${recipientId}`))
        .catch(err => console.log('Error sending message:', err));
}

exports.verifyWebhook = (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.verifyToken) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.sendStatus(403);
    }
};

exports.handleWebhookEvent = (req, res) => {
    let data = req.body;

    if (data.object === 'page') {
        data.entry.forEach(entry => {
            entry.messaging.forEach(event => {
                if (event.message) {
                    handleMessage(event.sender.id, event.message);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });
        res.sendStatus(200);
    }
};
