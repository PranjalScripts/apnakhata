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
      required: function() {
        // Only required if not using Google auth
        return !this.googleId;
      },
      unique: true,
      sparse: true
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
    avatar: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
