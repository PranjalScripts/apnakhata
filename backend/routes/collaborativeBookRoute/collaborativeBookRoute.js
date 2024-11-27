const express = require("express");
const router = express.Router();
const { getTransactions, addTransaction } = require("../../controllers/collaborativeBookController/collaborativeBookController"); // Import the controller
const authenticateUser = require("../../middleware/authMiddleware"); // Middleware to authenticate

// Route to fetch transactions
router.get("/transactions", authenticateUser, getTransactions);
router.post("/add-transaction", authenticateUser, addTransaction);

module.exports = router;
