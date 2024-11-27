const express = require("express");
const router = express.Router();
const transactionController = require("../../controllers/transactionController/transactionController");
const authenticate = require("../../middleware/authMiddleware");

// Route to create a new transaction
router.post(
  "/create-transaction",
  authenticate,
  transactionController.createTransaction
);

// Route to get a single transaction by ID
router.get(
  "/get-transaction/:id",
  authenticate,
  transactionController.getTransactionById
);

// Route to get all transactions for a specific user
router.get(
  "/get-transactions/:userId",
  authenticate,
  transactionController.getTransactions
);

// Route to update an existing transaction
router.put(
  "/update-transaction/:id",
  authenticate,
  transactionController.updateTransaction
);

// Route to delete a transaction by ID
router.delete(
  "/delete-transaction/:id",
  authenticate,
  transactionController.deleteTransaction
);

module.exports = router;
