const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 5600;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load User Model
require('./models/User');
require('./models/Activity');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const activities = require('./routes/activities');

// Load Keys
const keys = require('./config/keys');

// Handlebars Helpers
const {
    truncate,
    stripTags
} = require('./helpers/hbs');

// Map Global Promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global Vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/activities', activities);

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});