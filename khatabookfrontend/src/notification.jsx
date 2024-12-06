import NotificationAPI from "notificationapi-js-client-sdk";
import "notificationapi-js-client-sdk/dist/styles.css";
const notificationapi = new NotificationAPI({
  clientId: "pranjalt363@gmail.com",
  userId: "pranjal4tiwari@gmail.com",
});
notificationapi.askForWebPushPermission();