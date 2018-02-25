const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const verificationController = require('./controllers/verification');
const messageWebhookController = require('./controllers/messageWebhook');
//const imageSearchController = require('./controllers/imageSearch');

app.use(express.static(path.resolve(__dirname, 'client')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(8080, () => console.log('Webhook server is listening at port 5000'));
console.log('v0.3');

app.get('/', verificationController);
app.post('/', messageWebhookController);
//app.post('/image-search', imageSearchController);
