const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransactions,
  confirmTransaction,
  getTransactionstoclient,
  getTransactionById,
} = require("../../controllers/collaborativeBookController/collaborativeBookController"); // Adjust path if necessary

const authenticate =require("../../middleware/authMiddleware")
// Route to create a new transaction
router.post("/create-transactions",authenticate,createTransaction);

// Route to fetch transactions for a user or client
router.get("/transactions",authenticate, getTransactions);
router.get("/client-transactions", authenticate, getTransactionstoclient);
router.get("/single-transaction/:id", authenticate, getTransactionById);
// Route to confirm a pending transaction
router.patch("/transactions/:id/confirm", confirmTransaction);
router.patch(
  "/transactions/:transactionId/entries/:entryId/confirm",
  confirmTransaction
);

module.exports = router;
