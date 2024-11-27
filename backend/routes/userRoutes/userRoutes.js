const express = require("express");
const {
  signup,
  login,
  updateProfile,
 
  getUserProfile,
 
 
} = require("../../controllers/userController/userAuthController");

const router = express.Router();
const authenticate = require("../../middleware/authMiddleware")
// Route for user signup
router.post("/signup", signup);

// Route for user login
router.post("/login", login);

// Route for updating user profile (protected)
router.put("/update-profile/:userId", authenticate, updateProfile);

 
// Route for getting user profile (protected)
router.get("/get-profile",authenticate, getUserProfile);

 
module.exports = router;
