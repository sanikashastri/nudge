const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');

const config = require('./config/database');

mongoose.connect(config.database);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to ' + config.database);
});

db.on('error', (err) => {
    console.log('Database error ' + err);
});

const app = express();

const port = 3000;

const users = require('./routes/users');
const groups = require('./routes/groups');
const facts = require('./routes/facts');

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use(express.static(__dirname + '/public'));

app.use('/users', users);
app.use('/groups', groups);
app.use('/facts', facts);

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')));

app.listen(port, () => {
    console.log('Server started on port ' + port);
});