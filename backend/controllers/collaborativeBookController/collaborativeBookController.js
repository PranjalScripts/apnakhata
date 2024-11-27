const Transaction = require("../../models/transactionModel/transactionModel");
const ClientUser = require("../../models/clientUserModel/clientUserModel");

const getTransactions = async (req, res) => {
  try {
    const loggedInUserEmail = req.user.email; // Email from authenticated user

    // Find the ClientUser that matches the logged-in user's email
    const clientUser = await ClientUser.findOne({ email: loggedInUserEmail });

    if (!clientUser) {
      return res
        .status(404)
        .json({ message: "No client record found for this email." });
    }

    // Fetch transactions for the matched client user
    const transactions = await Transaction.find({
      clientUserId: clientUser._id,
    })
      .populate("bookId", "bookname") // Populate book details
      .populate("userId", "name email") // Populate the user who registered the transaction
      .exec();

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found." });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching transactions." });
  }
};


/**
 * Add a transaction between a user and a client
 */
const addTransaction = async (req, res) => {
  try {
    const {
      transactionId,
      transactionType,
      amount,
      description,
      transactionDate,
    } = req.body;
    const loggedInUserId = req.user.id; // Authenticated user ID

    // Validate input
    if (!transactionId || !transactionType || !amount) {
      return res
        .status(400)
        .json({ message: "Transaction ID, type, and amount are required." });
    }

    if (
      !["you will give", "you will get"].includes(transactionType.toLowerCase())
    ) {
      return res.status(400).json({ message: "Invalid transaction type." });
    }

    // Find the transaction record
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction record not found." });
    }

    // Calculate the new outstanding balance
    const lastBalance = transaction.outstandingBalance || 0;
    const newBalance =
      transactionType.toLowerCase() === "you will give"
        ? lastBalance - amount
        : lastBalance + amount;

    // Create a new transaction history entry
    const newTransactionHistory = {
      transactionType,
      amount,
      description: description || "",
      transactionDate: transactionDate || new Date(),
      outstandingBalance: newBalance,
    };

    // Update the transaction record
    transaction.transactionHistory.push(newTransactionHistory);
    transaction.outstandingBalance = newBalance;
    transaction.updatedAt = new Date();

    await transaction.save();

    res.status(201).json({
      message: "Transaction added successfully.",
      updatedTransaction: transaction,
    });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the transaction." });
  }
};

module.exports = {
  getTransactions,
  addTransaction,
};
