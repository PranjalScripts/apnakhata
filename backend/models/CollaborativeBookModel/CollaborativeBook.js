const mongoose = require("mongoose");

const collabtransactionSchema = new mongoose.Schema(
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

    // Keep the transaction history, no limit (MongoDB will allow indefinite growth)
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

  // Handle outstanding balance calculation
  let newOutstandingBalance = transaction.outstandingBalance;

  // If transaction type is "you will get", increase the outstanding balance
  if (transaction.transactionType === "you will get") {
    newOutstandingBalance += transaction.amount;
  }
  // If transaction type is "you will give", decrease the outstanding balance
  else if (transaction.transactionType === "you will give") {
    newOutstandingBalance -= transaction.amount;
  }

  // Ensure the transaction history has no duplicates: add the current transaction to history
  const lastHistory =
    transaction.transactionHistory[transaction.transactionHistory.length - 1];
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
    });
  }

  // Update the outstanding balance for the transaction document
  transaction.outstandingBalance = newOutstandingBalance;

  next();
});

// Transaction model
const CollabTransaction = mongoose.model("Transaction", collabtransactionSchema);

module.exports = CollabTransaction;
