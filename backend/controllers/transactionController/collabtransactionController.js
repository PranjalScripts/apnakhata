const Transaction = require("../../models/transactionModel/collabtransaction");
const LedgerBook = require("../../models/bookModel/ledgerbook");
const User = require("../../models/userModel/userModel");
const Client = require("../../models/clientUserModel/clientUserModel");

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { ledgerBookId, amount, transactionType, clientId } =   req.body;
    const userId = req.user.id; 

    const ledgerBook = await LedgerBook.findById(ledgerBookId);
    if (!ledgerBook) {
      return res.status(404).json({ message: "Ledger book not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const transaction = new Transaction({
      ledgerBook: ledgerBookId,
      amount,
      transactionType,
      addedBy: userId,
      client: clientId,
    });

    await transaction.save();

    // Update balances
    if (transaction.transactionType === "YOU GAVE") {
      user.balance -= amount;
      client.balance += amount;
    } else {
      user.balance += amount;
      client.balance -= amount;
    }

    await user.save();
    await client.save();

    return res.status(201).json(transaction);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating transaction" });
  }
};

// Get all transactions for a specific ledger book
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      ledgerBook: req.params.ledgerBookId,
    }).populate("client");
    return res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching transactions" });
  }
};

// Get a specific transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(
      req.params.transactionId
    ).populate("client");
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return res.status(200).json(transaction);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching transaction" });
  }
};

// Update the confirmation status of a transaction
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { confirmationStatus } = req.body;

    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update the status based on confirmation/rejection
    transaction.confirmationStatus = confirmationStatus;
    transaction.status = confirmationStatus ? "CONFIRMED" : "UNCONFIRMED";

    // If confirmed, update the balances
    if (confirmationStatus) {
      if (transaction.transactionType === "YOU GAVE") {
        transaction.client.balance += transaction.amount;
        transaction.addedBy.balance -= transaction.amount;
      } else {
        transaction.client.balance -= transaction.amount;
        transaction.addedBy.balance += transaction.amount;
      }
    }

    await transaction.save();
    await transaction.client.save();
    await transaction.addedBy.save();

    return res.status(200).json(transaction);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error updating transaction status" });
  }
};
