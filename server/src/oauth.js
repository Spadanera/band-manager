import { web } from './client_secret.json';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
    passport.use(new GoogleStrategy({
        clientID: web.client_id,
        clientSecret: web.client_secret,
        callbackURL: `${process.env.PROTOCOL || "http" }://${process.env.ORIGIN || "localhost" }/auth/google/callback`
    },
        (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            });
        }));
};