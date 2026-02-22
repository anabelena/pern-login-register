import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create Express APP
const app = express();

// Middlewares
app.use(express.json()); //converts json request into an JS Object
app.use(cookieParser()); //reads and parses cookies from request

// Routes
app.get("/", (req, res) => {
  res.send("!hi");
});

// server https 
app.listen(3000, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});
