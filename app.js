const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const config = require('./config.js');
const session = require('express-session');
const rethinkSession = require('session-rethinkdb')(session);
const passport = require('passport');
const server = require('http').createServer(app);
const Auth = require('./lib/auth');
const routes = require('./routes');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const r = require('./lib/thinky').r;
const store = new rethinkSession(r);

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false,
    store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {

    // console.log(req.user);

    if (req.user) {
        res.locals.signedInUser = {};
        res.locals.signedInUser.username = req.user.username;
        res.locals.signedInUser.name = req.user.name;
        res.locals.signedInUser.mail = req.user.mail;
        // res.locals.signedInUser.isAdmin = util.isAdmin(req.user.username);
        if (req.user.iconURL) {
            res.locals.signedInUser.iconURL = req.user.iconURL;
        }
        return next(null, req, res);
    } else {
        next();
    }
});

// util.setupPassport();

Auth.setupPassport();


app.use('/', routes);


module.exports = server;