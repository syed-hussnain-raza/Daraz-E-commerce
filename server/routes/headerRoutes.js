// import  express from "express";
const express = require("express");

// Create a router instance
const router = express.Router();

// Import the controller function for handling the header route
const { getHeader } = require("../controllers/headerController");

// Route constants
const ROUTES = {
  ROOT: "/",
};

// Define the route for getting the header information
router.get(ROUTES.ROOT, getHeader);

// Export the router to be used in the main application
module.exports = router;
