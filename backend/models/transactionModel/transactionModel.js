const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TransactionBook",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientUser",
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["you will get", "you will give"],
      required: true,
    },
    file: {
      type: String,
    },
    transactionHistory: [
      {
        transactionType: {
          type: String,
          enum: ["you will get", "you will give"],
          required: true,
        },
        amount: {
          type: Number,
        },
        description: {
          type: String,
        },
        transactionDate: {
          type: Date,
          default: Date.now,
        },
        outstandingBalance: {
          type: Number,
          default: 0,
        },
        confirmationStatus: {
          type: String,
          enum: ["pending", "confirmed"],
          default: "pending", // Default status when a transaction is created
        },
      },
    ],
    outstandingBalance: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Pre-save hook to update the transaction history and calculate the outstanding balance
transactionSchema.pre("save", async function (next) {
  const transaction = this;

  // Calculate finalAmount
  if (transaction.transactionType === "you will get") {
    transaction.finalAmount = transaction.amount;
  } else if (transaction.transactionType === "you will give") {
    transaction.finalAmount = -transaction.amount;
  }

  // Handle outstanding balance calculation only if the transaction is confirmed
  let newOutstandingBalance = transaction.outstandingBalance;

  // Check for the most recent transaction in the history
  const lastHistory =
    transaction.transactionHistory[transaction.transactionHistory.length - 1];

  if (lastHistory && lastHistory.confirmationStatus === "confirmed") {
    // If confirmed, update the outstanding balance
    if (transaction.transactionType === "you will get") {
      newOutstandingBalance += transaction.amount;
    } else if (transaction.transactionType === "you will give") {
      newOutstandingBalance -= transaction.amount;
    }
  }

  // Ensure no duplicate transactions in the history
  if (
    !lastHistory ||
    lastHistory.transactionType !== transaction.transactionType ||
    lastHistory.amount !== transaction.amount
  ) {
    transaction.transactionHistory.push({
      transactionType: transaction.transactionType,
      amount: transaction.amount,
      description: transaction.description,
      transactionDate: transaction.transactionDate,
      outstandingBalance: newOutstandingBalance,
      confirmationStatus: "pending", // Default status
    });
  }

  // Update the outstanding balance for the transaction document
  transaction.outstandingBalance = newOutstandingBalance;

  next();
});

// Transaction model
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
