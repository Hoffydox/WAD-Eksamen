const express = require('express');
const cors = require('cors');
const login = require('./routes/login');
const users = require('./routes/users');
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

app.listen(myPort, () => console.log(`Listening on port ${myPort}...(WAD eksamen)`));