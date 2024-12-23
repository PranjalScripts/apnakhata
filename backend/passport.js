const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('./models/userModel/userModel');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Debug log to check if env vars are loaded
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('CALLBACK_URL:', process.env.CALLBACK_URL);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
            passReqToCallback: true,
        },
        async function (request, accessToken, refreshToken, profile, done) {
            try {
                // Find or create user
                let user = await User.findOne({ googleId: profile.id });
                
                if (!user) {
                    // Check if email already exists
                    const existingUser = await User.findOne({ email: profile.email });
                    if (existingUser) {
                        // Update existing user with Google ID
                        existingUser.googleId = profile.id;
                        existingUser.name = profile.displayName;
                        existingUser.profilePicture = profile.picture;
                        await existingUser.save();
                        return done(null, existingUser);
                    }

                    // Create new user
                    user = await User.create({
                        googleId: profile.id,
                        email: profile.email,
                        name: profile.displayName,
                        profilePicture: profile.picture,
                        hasCompletedProfile: false
                    });
                }

                return done(null, user);
            } catch (error) {
                console.error('Error in Google Strategy:', error);
                return done(error, null);
            }
        }
    )
);

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

module.exports = passport;