const LedgerBook = require("../../models/bookModel/ledgerbook");
const Transaction = require("../../models/transactionModel/collabtransaction");
const User = require("../../models/userModel/userModel");
const Client = require("../../models/clientUserModel/clientUserModel");

// Create a new ledger book
exports.createLedgerBook = async (req, res) => {
  try {
    const { name} = req.body;
    const userId = req.user.id; 
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const ledgerBook = new LedgerBook({
      name,
      user: userId,
    });

    await ledgerBook.save();

    return res.status(201).json(ledgerBook);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error creating ledger book" });
  }
};

// Get all ledger books for a user
exports.getLedgerBooks = async (req, res) => {
  try {
    const ledgerBooks = await LedgerBook.find({ user: req.params.userId });
    return res.status(200).json(ledgerBooks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching ledger books" });
  }
};

// Get a single ledger book by its ID
exports.getLedgerBookById = async (req, res) => {
  try {
    const ledgerBook = await LedgerBook.findById(req.params.ledgerBookId);
    if (!ledgerBook) {
      return res.status(404).json({ message: "Ledger book not found" });
    }
    return res.status(200).json(ledgerBook);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error fetching ledger book" });
  }
};
