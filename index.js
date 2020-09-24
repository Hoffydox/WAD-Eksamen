const express = require('express');
const cors = require('cors');
const login = require('./routes/login');
const users = require('./routes/users');
const projects = require('./routes/projects');
const transactions = require('./routes/transactions');
const setJSON = require('./middleware/setResponseHeaderToJSON');

const app = express();
const myPort = 8171;
// const myPort = 8536;

app.use(cors());
app.use(setJSON);
app.use(express.json()); // --> req.body
//

app.use('/api/login', login);
app.use('/api/users', users);
app.use('/api/projects', projects);
app.use('/api/transactions', transactions);

app.listen(myPort, () => console.log(`Listening on port ${myPort}...(WAD eksamen)`));