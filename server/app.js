// Main application file

// Import dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Environment variables
const API_PREFIX = process.env.API_PREFIX;

// Centralized route imports
const routes = {
  header: require("./routes/headerRoutes"),
  footer: require("./routes/footerRoutes"),
  main: require("./routes/mainRoutes"),
  products: require("./routes/productRoutes"),
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Register routes dynamically (scalable approach)
Object.entries(routes).forEach(([path, router]) => {
  app.use(`${API_PREFIX}/${path}`, router);
});

// End-Point Not Found (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API not found",
  });
});

// Start the server
module.exports = app;
