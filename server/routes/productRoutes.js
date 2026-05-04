// import express from "express";
const express = require("express");

// Create a router instance
const router = express.Router();

// Import the controller functions for handling product routes
const {
  getProducts,
  getProductById,
} = require("../controllers/productController");

// Route constants
const ROUTES = {
  ROOT: "/",
  BY_ID: "/:id",
};

// Define the route for getting all products
router.get(ROUTES.ROOT, getProducts);

// Define the route for getting a product by ID
router.get(ROUTES.BY_ID, getProductById);

// Export the router to be used in the main application
module.exports = router;
