const express = require('express');
const bodyParser = require('body-parser');
const handler = require('./handler');

const app = express();
app.use(bodyParser.json());

app.get('/webhook', handler.verifyWebhook);
app.post('/webhook', handler.handleWebhookEvent);

app.listen(3000, () => console.log('Server is running on port 3000'));
