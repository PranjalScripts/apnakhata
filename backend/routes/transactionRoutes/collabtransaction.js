const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  confirmTransaction,
} = require("../../controllers/collaborativeBookController/collaborativeBookController"); // Adjust path if necessary

// Route to create a new transaction
router.post("/transactions", createTransaction);

// Route to fetch transactions for a user or client
router.get("/transactions", getTransactions);

// Route to confirm a pending transaction
router.patch("/transactions/:id/confirm", confirmTransaction);

module.exports = router;
