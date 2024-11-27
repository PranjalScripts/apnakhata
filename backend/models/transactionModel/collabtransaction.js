const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  ledgerBook: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LedgerBook",
    required: true,
  }, // Reference to the ledger book
  amount: { type: Number, required: true },
  transactionType: {
    type: String,
    enum: ["YOU GAVE", "YOU GOT"],
    required: true,
  },
  status: {
    type: String,
    enum: ["CONFIRMED", "UNCONFIRMED"],
    default: "UNCONFIRMED",
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the user who added the transaction
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClientUser",
    required: true,
  }, // Reference to the client
  addedAt: { type: Date, default: Date.now },
  confirmationStatus: { type: Boolean, default: null }, // True = Confirmed, False = Rejected
});

const Transaction = mongoose.model("CollabTransaction", transactionSchema);

module.exports = Transaction;
