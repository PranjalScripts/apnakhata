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
      unique: true,
      sparse: true, // This allows multiple null values
      default: null
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

// Add index for phone with sparse option
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
