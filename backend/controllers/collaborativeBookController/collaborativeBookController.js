const Transaction = require("../../models/transactionModel/transactionModel");
const Client = require("../../models/clientUserModel/clientUserModel");
const User = require("../../models/userModel/userModel");
// Fetch transactions for a user or client
 const getTransactions = async (req, res) => {
  try {
    // Assuming the client/user is logged in and their ID is available via the session or token
    const loggedInUserId = req.user.id; // Get from req.user if authenticated via JWT or session

    const transactions = await Transaction.find({
      
         userId: loggedInUserId   
       
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
         clientUserId: client._id  // Match transaction where the client is involved
      
    })
      .populate("userId clientUserId bookId") // Populate related user, client, and book details
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



// const createTransaction = async (req, res) => {
//   try {
//     const {
//       bookId,
//       clientUserId,
//       transactionType,
//       amount,
//       description,
//       initiatedBy,
//     } = req.body;
// const userId = req.user.id; // Get the user ID from the authenticated user
//     // Validate input
//     if (
//       !bookId ||
//       !userId ||
//       !clientUserId ||
//       !transactionType ||
//       !amount ||
//       !description
//     ) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Check if a transaction already exists for the same client, book, and user
//     let existingTransaction = await Transaction.findOne({
//       bookId,
//       userId,
//       clientUserId,
//     });

//     if (existingTransaction) {
//       // If the transaction exists, we update the transaction history
//       const lastHistory =
//         existingTransaction.transactionHistory[
//           existingTransaction.transactionHistory.length - 1
//         ];

//   {
//         // Add new history entry
//         existingTransaction.transactionHistory.push({
//           transactionType,
//           amount,
//           description,
//           transactionDate: new Date(),
//           outstandingBalance: existingTransaction.outstandingBalance, // Use current outstanding balance
//           confirmationStatus: "pending", // Default status for new transactions
//         });
//       }

//       // Calculate the outstanding balance only if there are no pending transactions
//       const hasPendingTransaction = existingTransaction.transactionHistory.some(
//         (entry) => entry.confirmationStatus === "pending"
//       );

//       if (!hasPendingTransaction) {
//         // Update outstanding balance after confirming all entries
//         let newOutstandingBalance = 0;

//         // Calculate the outstanding balance based on transaction history
//         existingTransaction.transactionHistory.forEach((entry) => {
//           if (entry.transactionType === "you will get") {
//             newOutstandingBalance += entry.amount;
//           } else if (entry.transactionType === "you will give") {
//             newOutstandingBalance -= entry.amount;
//           }
//         });

//         // Set the new outstanding balance
//         existingTransaction.outstandingBalance = newOutstandingBalance;
//       }

//       // Save the updated transaction
//       await existingTransaction.save();

//       return res.status(200).json({
//         message: "Transaction updated successfully.",
//         transaction: existingTransaction,
//       });
//     } else {
//       // Create a new transaction if no existing transaction is found
//       const newTransaction = new Transaction({
//         bookId,
//         userId,
//         clientUserId,
//         transactionType,
//         initiatedBy,
//         amount, // Include the amount field
//         description, // Description
//         transactionHistory: [
//           {
//             transactionType,
//             amount, // Store the amount in transactionHistory
//             description,
//             transactionDate: new Date(),
//             outstandingBalance: 0, // Initially, set the outstanding balance to 0
//             confirmationStatus: "pending", // Default confirmation status
//           },
//         ],
//         outstandingBalance: 0, // Initialize the outstanding balance to 0
//       });

//       // Save the new transaction
//       const savedTransaction = await newTransaction.save();

//       return res.status(201).json({
//         message: "Transaction created successfully.",
//         transaction: savedTransaction,
//       });
//     }
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     res.status(500).json({ error: error.message });
//   }
// };

const createTransaction = async (req, res) => {
  try {
    const {
      bookId,
     
      clientUserId,
      transactionType,
      amount,
      description,
      
     } = req.body;
    const userId = req.user.id; // Get the user ID from the authenticated user 
    const initiatedBy = req.user.name; // Get the user name from the authenticated user
    // Validate input
    if (
      !bookId ||
      !userId ||
      !clientUserId ||
      !transactionType ||
      !amount ||
       !initiatedBy ||
      !description
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

    if (existingTransaction) {
      // Update transaction history
      existingTransaction.transactionHistory.push({
        transactionType,
        amount,
        description,
        initiatedBy,
        transactionDate: new Date(),
        outstandingBalance: existingTransaction.outstandingBalance, // Keep outstanding balance unchanged until confirmation
        confirmationStatus: "pending",
      });

      // Save the updated transaction
      await existingTransaction.save();

      return res.status(200).json({
        message: "Transaction updated successfully.",
        transaction: existingTransaction,
      });
    } else {
      // Create a new transaction
      const newTransaction = new Transaction({
        bookId,
        userId,
        clientUserId,
        transactionType,
        initiatedBy,
        transactionHistory: [
          {
            transactionType,
            amount,
            description,
            initiatedBy: req.user.name,
            transactionDate: new Date(),
            outstandingBalance: 0, // Initially 0 until confirmation
            confirmationStatus: "pending",
          },
        ],
        outstandingBalance: 0, // Initialize to 0 until confirmation
      });

      // Save the new transaction
      const savedTransaction = await newTransaction.save();

      return res.status(201).json({
        message: "Transaction created successfully.",
        transaction: savedTransaction,
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};

const confirmTransaction = async (req, res) => {
  try {
    const { transactionId, entryId } = req.params;
    console.log(req.params) ;
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
      return res
        .status(400)
        .json({
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

    res.status(200)
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


module.exports = {
  getTransactions,
  createTransaction,
  confirmTransaction,
  getTransactionstoclient,
  getTransactionById,
};