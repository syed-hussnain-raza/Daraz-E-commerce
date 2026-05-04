// import  express from "express";
const express = require("express");

// Create a router instance
const router = express.Router();

// Import the controller function for handling the footer route
const { getFooter } = require("../controllers/footerController");

// Route constants
const ROUTES = {
  ROOT: "/",
};

// Define the route for getting the footer information
router.get(ROUTES.ROOT, getFooter);

// Export the router to be used in the main application
module.exports = router;
