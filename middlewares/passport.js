const { access } = require('fs');
const passport = require('passport');
const AuthOStrategy = require('passport-auth0');
const JwtStrategy = require('passport-jwt').Strategy;



// redirects user to Auth0 sign in page
// then Auth0 redirects user back to callback url, where profile of user will show
const authOStrategy = new AuthOStrategy(
    {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL,
    },
    (accessToken, refreshToken, extraParams, profile, done) => {
        return done(null, profile);
    }

);

// verifies a jwt token using a given secret to decode the jwt's signature 
// and return the payload that was encoded into the token
const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: (req) => req.session.jwt,
        secretOrKey: process.env.JWT_SECRET_KEY,
    },
    (payload, done) => {

        return done(null, payload);
    }


);

passport.use(authOStrategy);
passport.use(jwtStrategy);

module.exports = passport;