const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("../config/db");
const ticketRoutes = require("../routes/ticketRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Support Desk API is running" });
});

app.use("/api/tickets", ticketRoutes);

// Connect to DB on first invocation (cached for warm invocations)
let dbConnected = false;

const handler = async (req, res) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  return app(req, res);
};

module.exports = handler;
