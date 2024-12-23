// userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      sparse: true, // This allows multiple null values
      validate: {
        validator: function(v) {
          // Return true if value is null/undefined or if it's a valid phone number
          return v === null || v === undefined || /^\+[1-9]\d{1,14}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    password: {
      type: String,
      required: function() {
        // Only required if not using Google auth
        return !this.googleId;
      }
    },
    profilePicture: { 
      type: String 
    },
    // Google Auth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    countryCode: {
      type: String,
      default: null
    },
    hasCompletedProfile: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Create a compound index for phone and countryCode
userSchema.index({ phone: 1, countryCode: 1 }, { 
  unique: true, 
  sparse: true,
  partialFilterExpression: { phone: { $type: "string" } }  // Only index non-null phone numbers
});

// Remove any existing indexes on just the phone field
userSchema.collection.dropIndex("phone_1", function(err, result) {
  if (err) {
    console.log("Error in dropping index:", err);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
