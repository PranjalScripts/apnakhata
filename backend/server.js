const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const userRoutes =require("./routes/userRoutes/userRoutes")
const connectDb = require("./config/connectDb");
 const transactionsRouter = require("./routes/collaborativeBookRoute/collaborativeBookRoute"); // Import the transactions router
const transactionRoutes = require("./routes/transactionRoutes/transactionRoutes");
const bookRoutes = require("./routes/bookRoute/bookRoutes");
const clientUserRoutes = require("./routes/clientUserRoutes/clientUserRoutes");
 
//const transactionBookRoutes =require("./routes/transactionbook/transactionBookRoutes")
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
 
//api for books
app.use("/api/v2/transactionBooks", bookRoutes);
//api for clients 
app.use("/api/v3/client", clientUserRoutes);
//api for transaction books
app.use("/api/v4/transaction", transactionRoutes);
//api for collaborative books
 app.use("/api", transactionsRouter); // Prefix the router with `/api`

 
app.get("/", (req, res) => { res.send("<h1> Welcome to the Expense Management API</h1>") });

//routes  
//merchant routes

//port
const PORT = 5100 || process.env.PORT;



//listen server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.bgYellow);
});
 