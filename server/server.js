const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Support Desk API is running" });
});

app.use("/api/tickets", ticketRoutes);

const startServer = async () => {
  await connectDB();
};

startServer();

module.exports = app;
