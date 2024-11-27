const express = require("express");
const router = express.Router();
const ledgerBookController = require("../../controllers/bookController/ledgerBookController");

// Create a new ledger book
router.post("/", ledgerBookController.createLedgerBook);

// Get all ledger books for a user
router.get("/:userId", ledgerBookController.getLedgerBooks);

// Get a single ledger book by ID
router.get("/:ledgerBookId", ledgerBookController.getLedgerBookById);

module.exports = router;
