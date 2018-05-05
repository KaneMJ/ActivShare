const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 5600;

// Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');

// Load Keys
const keys = require('./config/keys');

// Map Global Promises
mongoose.Promise = global.Promise;

// mongoose Connect
mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
app.get('/', (req, res) => {
    res.send('Hello');
});

// Use Routes
app.use('/auth', auth);

// Passport iddleware
app.use(passport.initialize());
app.use(passport.session());

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});