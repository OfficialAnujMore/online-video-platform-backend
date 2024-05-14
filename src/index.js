import dotnev from "dotenv";
import connectDB from "./db/index.js";

dotnev.config({ path: "./env" });

connectDB();
