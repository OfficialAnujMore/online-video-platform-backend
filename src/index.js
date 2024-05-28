import dotnev from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotnev.config({ path: "./.env" });

const portNumber = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(portNumber, () => {
      console.log(`Server is runnig on PORT ${portNumber}`);
    });
    
  })
  .catch((err) => {
    console.log("MongoDB connection FAILED !! ", err);
  });
