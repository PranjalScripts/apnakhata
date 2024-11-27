const Transaction = require("../../models/transactionModel/transactionModel");

exports.createCollabTransaction = async (req, res) => {
  try {
    const { bookId, clientUserId, transactionType, amount, description } =
      req.body;
    const userId = req.user.id;

    // Check if a transaction already exists for the same user, client, and book
    let transaction = await Transaction.findOne({
      userId,
      clientUserId,
      bookId,
    });

    if (transaction) {
      console.log(
        `Transaction found for userId: ${userId}, clientUserId: ${clientUserId}, bookId: ${bookId}`
      );

      // Calculate the new outstanding balance based on the transaction type
      let newOutstandingBalance = transaction.outstandingBalance;

      if (transactionType === "you will get") {
        newOutstandingBalance += amount;
      } else if (transactionType === "you will give") {
        newOutstandingBalance -= amount;
      }

      // Add a new transaction history entry
      transaction.transactionHistory.push({
        transactionType,
        amount,
        description,
        transactionDate: new Date(),
        outstandingBalance: newOutstandingBalance,
      });

      // Update the transaction's outstanding balance and finalAmount
      transaction.outstandingBalance = newOutstandingBalance;
      transaction.finalAmount = newOutstandingBalance;

      // Save the updated transaction
      await transaction.save();

      return res.status(200).json({
        success: true,
        message: "Transaction updated successfully!",
        data: transaction,
      });
    }

    // Log to confirm no existing transaction is found for this book
    console.log(`No existing transaction found for bookId: ${bookId}`);

    // If no existing transaction, create a new one
    const newTransaction = new Transaction({
      bookId,
      userId,
      clientUserId,
      transactionType,
      amount,
      description,
      outstandingBalance: transactionType === "you will get" ? amount : -amount,
      finalAmount: transactionType === "you will get" ? amount : -amount,
      transactionHistory: [
        {
          transactionType,
          amount,
          description,
          transactionDate: new Date(),
          outstandingBalance:
            transactionType === "you will get" ? amount : -amount,
        },
      ],
    });

    // Save the new transaction
    await newTransaction.save();

    return res.status(201).json({
      success: true,
      message: "Transaction created successfully!",
      data: newTransaction,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a transaction by ID
exports.getCollabTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the transaction.",
      error: error.message,
    });
  }
};

// Get all transactions for a specific user
exports.getCollabTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId });

    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for this user",
      });
    }

    res.status(200).json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching transactions.",
      error: error.message,
    });
  }
};

// Update an existing transaction (for example, adjusting the amount or description)
exports.CollabupdateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionType, amount, description } = req.body;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Update transaction history and outstanding balance
    let newOutstandingBalance = transaction.outstandingBalance;

    if (transactionType === "you will get") {
      newOutstandingBalance += amount;
    } else if (transactionType === "you will give") {
      newOutstandingBalance -= amount;
    }

    transaction.transactionHistory.push({
      transactionType,
      amount,
      description,
      transactionDate: new Date(),
      outstandingBalance: newOutstandingBalance,
    });

    transaction.outstandingBalance = newOutstandingBalance;
    transaction.finalAmount = newOutstandingBalance;

    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully!",
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the transaction.",
      error: error.message,
    });
  }
};

// Delete a transaction
exports.deleteCollabTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the transaction.",
      error: error.message,
    });
  }
};
