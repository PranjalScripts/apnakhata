const Transaction = require("../../models/transactionModel/transactionModel");
const Client = require("../../models/clientUserModel/clientUserModel");
const User = require("../../models/userModel/userModel");
const notificationapi = require("notificationapi-node-server-sdk").default;
require("dotenv").config();

 notificationapi.init(process.env.clientId, process.env.clientSecret);

// Fetch transactions for a user or client
const getTransactions = async (req, res) => {
  try {
    // Assuming the client/user is logged in and their ID is available via the session or token
    const loggedInUserId = req.user.id; // Get from req.user if authenticated via JWT or session

    const transactions = await Transaction.find({
      userId: loggedInUserId,
    })
      .populate("userId clientUserId bookId") // Populate related user, client, and book details
      .lean({ virtuals: true }); // Include virtual fields like `visibleTransactionType`

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getTransactionstoclient = async (req, res) => {
  try {
    // Assuming the client/user is logged in and their ID is available via the session or token
    const loggedInUserId = req.user.id; // The logged-in user's ID (could be a client ID when logged in)

    // Step 1: Get the client by email
    const client = await Client.findOne({ email: req.user.email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Step 2: Find the user by email (User model) - to ensure that this client is treated as a user
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 3: Query the Transaction model to get transactions for this user/client
    const transactions = await Transaction.find({
      // Match transaction where the user is involved
      clientUserId: client._id, // Match transaction where the client is involved
    })
      .populate({
        path: "userId",
        select: "-password", // Exclude the password field
      })
      .populate("clientUserId bookId") // Populate related user, client, and book details
      .lean(); // Returns plain JavaScript objects (without Mongoose's internal properties)

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found." });
    }

    res.status(200).json({ transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
 
// Initialize notification API

const createTransaction = async (req, res) => {
  try {
    const { bookId, clientUserId, transactionType, amount, description } =
      req.body;

    const userId = req.user.id; // Get the user ID from the authenticated user
    const initiatedBy = req.user.name; // Get the user name from the authenticated user
    const initiaterId = req.user.id;

    // Validate input
    if (
      !bookId ||
      !userId ||
      !clientUserId ||
      !transactionType ||
      !amount ||
      !initiatedBy ||
      !initiaterId
      
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (typeof amount !== "number" || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number." });
    }

    if (!["you will get", "you will give"].includes(transactionType)) {
      return res
        .status(400)
        .json({ message: "Invalid transaction type provided." });
    }

    // Check if a transaction already exists for the same client, book, and user
    let existingTransaction = await Transaction.findOne({
      bookId,
      userId,
      clientUserId,
    });

    let transaction;
    if (existingTransaction) {
      // Update transaction history
      existingTransaction.transactionHistory.push({
        transactionType,
        amount,
        description,
        initiatedBy,
        initiaterId,
        transactionDate: new Date(),
        outstandingBalance: existingTransaction.outstandingBalance, // Keep outstanding balance unchanged until confirmation
        confirmationStatus: "pending",
      });

      // Save the updated transaction
      transaction = await existingTransaction.save();

      res.status(200).json({
        message: "Transaction updated successfully.",
        transaction,
      });
    } else {
      // Create a new transaction
      const newTransaction = new Transaction({
        bookId,
        userId,
        clientUserId,
        transactionType,
        initiatedBy,
        initiaterId,
        transactionHistory: [
          {
            transactionType,
            amount,
            description,
            initiatedBy: req.user.name,
            initiaterId: req.user.id,
            transactionDate: new Date(),
            outstandingBalance: 0, // Initially 0 until confirmation
            confirmationStatus: "pending",
          },
        ],
        outstandingBalance: 0, // Initialize to 0 until confirmation
      });

      // Save the new transaction
      transaction = await newTransaction.save();

      res.status(201).json({
        message: "Transaction created successfully.",
        transaction,
      });
    }

    // Fetch the client's email and phone number from the Client model
    const client = await Client.findById(clientUserId); // Assuming clientUserId is the client's unique ID

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    // Trigger notification
    const notificationData = {
      notificationId: "apnakhata_63_07",
      user: {
        id: clientUserId, // User ID or unique identifier
        email: client.email, // Provide the client's email from the client model
        number: client.mobile, // Provide the client's phone number from the client model
      },
      mergeTags: {
        transactionType,
        amount: amount.toFixed(2),
        description,
        initiatedBy,
        date: new Date().toLocaleDateString(),
      },
    };

    try {
      await notificationapi.send(notificationData);
      console.log("Notification sent successfully!");
    } catch (notifyError) {
      console.error("Error sending notification:", notifyError);
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};


const confirmTransaction = async (req, res) => {
  try {
    const { transactionId, entryId } = req.params;
    console.log(req.params);
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    // Find the specific entry in the transactionHistory by entryId
    const entryIndex = transaction.transactionHistory.findIndex(
      (entry) => entry._id.toString() === entryId
    );

    if (entryIndex === -1) {
      return res.status(404).json({ message: "Transaction entry not found." });
    }

    // Get the specific pending entry
    const pendingEntry = transaction.transactionHistory[entryIndex];

    // Check if the entry is pending
    if (pendingEntry.confirmationStatus !== "pending") {
      return res.status(400).json({
        message: "This transaction entry has already been confirmed.",
      });
    }

    // Mark this entry as confirmed
    pendingEntry.confirmationStatus = "confirmed";

    // Recalculate the outstanding balance based on all confirmed entries
    let newOutstandingBalance = 0;

    transaction.transactionHistory.forEach((entry) => {
      if (entry.confirmationStatus === "confirmed") {
        if (entry.transactionType === "you will get") {
          newOutstandingBalance += entry.amount;
        } else if (entry.transactionType === "you will give") {
          newOutstandingBalance -= entry.amount;
        }
      }
    });

    // Update the overall outstanding balance
    transaction.outstandingBalance = newOutstandingBalance;

    // Save the updated transaction
    await transaction.save();

    res
      .status(200)
      .json({ message: "Transaction entry confirmed.", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransactionById = async (req, res) => {
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

 

// Initialize notification API
 

const addExistingTransaction = async (req, res) => {
  try {
    const transactionId = req.params.transactionId;
    console.log("transaction id is here", transactionId);

    const {
      transactionType,
      amount,
      description,
      confirmationStatus = "pending", // Default to pending if not provided
    } = req.body;

    const userId = req.user.id; // Get the user ID from the authenticated user
    const initiatedBy = req.user.name; // Get the user name from the authenticated user
    const initiaterId = req.user.id; // Get the user ID from the authenticated user

    // Validate required fields
    if (!transactionId || !transactionType || !amount) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID, type, and amount are required",
      });
    }

    // Find the transaction document by ID
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const lastOutstandingBalance = transaction.outstandingBalance;

    // Prepare the new transaction entry
    const newTransaction = {
      transactionType,
      amount,
      description,
      confirmationStatus,
      initiatedBy,
      initiaterId,
      outstandingBalance: lastOutstandingBalance, // Set the current outstanding balance
      transactionDate: new Date(),
    };

    // Append the new transaction to the transaction history
    transaction.transactionHistory.push(newTransaction);

    // Update outstanding balance only if the transaction is confirmed
    if (confirmationStatus === "confirmed") {
      if (transactionType === "you will get") {
        transaction.outstandingBalance += amount;
      } else if (transactionType === "you will give") {
        transaction.outstandingBalance -= amount;
      }
    }

    // Save the updated transaction document
    const updatedTransaction = await transaction.save();
 

    // Send the updated transaction back in the response
    res.status(200).json({
      success: true,
      message: "Transaction added successfully",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error("Error adding transaction:", error);

    // Handle any unexpected errors
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the transaction",
      error: error.message,
    });
  }
};


module.exports = {
  getTransactions,
  createTransaction,
  confirmTransaction,
  getTransactionstoclient,
  getTransactionById,
  addExistingTransaction,
};
