const mongoose = require("mongoose");

const ledgerBookSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "User A's Ledger"
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
  createdAt: { type: Date, default: Date.now },
});


ledgerBookSchema.index({ name: 1 ,user:1}, { unique: true });
const LedgerBook = mongoose.model("LedgerBook", ledgerBookSchema);

module.exports = LedgerBook;
