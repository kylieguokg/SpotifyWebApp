const express = require('express'); // Express web server framework
const session = require('cookie-session');
const helmet = require('helmet'); // sets HTTP headers to defend against common web app security vulnerabilities e.g. xss attacks
const hpp = require('hpp'); // protects against HTTP Parameter Pollution attacks
const csurf = require('csurf'); // protects against cross-site request forgery
const dotenv = require('dotenv');
const path = require('path');

// Import config
dotenv.config({path: path.resolve(__dirname, '.env')});

const passport = require('./middlewares/passport');

// Create Express App
const app = express();

// Set Security configs
app.use(helmet());
app.use(hpp());

// Set cookie settings
app.use(
    session({
        name: 'session', // name of cookie
        secret: process.env.COOKIE_SECRET, // used to sign and verify cookie values
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // cookie expires in 24 hours
    })

);

app.use(csurf());

const authRoutes = require('./routes/auth');

app.use('/auth', authRoutes);


app.use(passport.initialize());

// // Listen on port 8888
app.listen(8888, () => 
{
    console.log("I'm listening!");
});