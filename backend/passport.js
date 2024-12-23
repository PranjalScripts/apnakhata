const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('./models/userModel/userModel');

// Debug logs for environment variables
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
                console.log('Profile from Google:', profile); // Debug log

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
                        console.log('Updated existing user:', existingUser); // Debug log
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
                    console.log('Created new user:', user); // Debug log
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
    console.log('Serializing user:', user.id); // Debug log
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        console.log('Deserialized user:', user); // Debug log
        done(null, user);
    } catch (error) {
        console.error('Error deserializing user:', error);
        done(error, null);
    }
});

module.exports = passport;