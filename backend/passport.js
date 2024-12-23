const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('./models/userModel/userModel');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Debug log to check if env vars are loaded
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('CALLBACK_URL:', process.env.CALLBACK_URL);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !CALLBACK_URL) {
    console.error('Missing required Google OAuth credentials');
    console.error('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
    console.error('GOOGLE_CLIENT_SECRET:', GOOGLE_CLIENT_SECRET);
    console.error('CALLBACK_URL:', CALLBACK_URL);
    throw new Error('Missing required Google OAuth credentials');
}

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
            return done(null, user);
        }

        // If user doesn't exist, create a new user
        user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.email,
            avatar: profile.picture || profile.photos[0].value
        });

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;