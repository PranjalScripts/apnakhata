const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const userRoutes =require("./routes/userRoutes/userRoutes")
const connectDb = require("./config/connectDb");
const bookRoutes = require("./routes/bookRoute/bookRoutes");
const clientUserRoutes = require("./routes/clientUserRoutes/clientUserRoutes");
const collabtransactionRoutes = require("./routes/transactionRoutes/collabtransaction");
const selftransactionRoutes = require("./routes/transactionRoutes/selfrecord");
const path = require("path");

// Serve static files from the "uploads" folder

  // config dot env file
dotenv.config();
 
//databse call
connectDb();
 
//rest object
const app = express();

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
//api for authentications
app.use("/api/v1/auth", userRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//api for books
app.use("/api/v2/transactionBooks", bookRoutes);
//api for clients 
app.use("/api/v3/client", clientUserRoutes);

//api for self transactions
app.use("/api/v4/transaction", selftransactionRoutes);


 //api for collab transactions
 app.use("/api/collab-transactions", collabtransactionRoutes);
 
app.get("/", (req, res) => { res.send("<h1> Welcome to the Expense Management API</h1>") });

//port
const PORT = 5100 || process.env.PORT;

//listen server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgYellow);
});
 