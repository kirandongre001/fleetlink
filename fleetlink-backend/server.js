// server.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const app = require("./src/app");

// Load env variables
dotenv.config();

// Connect Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

