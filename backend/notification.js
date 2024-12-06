//import notificationapi from "notificationapi-node-server-sdk";
const notificationapi = require("notificationapi-node-server-sdk").default;
require("dotenv").config(); // Load environment variables from .env file

notificationapi.init(
  process.env.clientId, // clientId
  process.env.clientSecret // clientSecret
);

notificationapi.send({
  notificationId: "apnakhata_63_07",
  user: {
    id: "pranjalt363@gmail.com",
    email: "pranjal4tiwari@gmail.com",
    number: "+916307103854", // Replace with your phone number
  },
  mergeTags: {
    item: "Krabby Patty Burger",
    address: "124 Conch Street",
    orderId: "1234567890",
  },
});
