// import express from "express";
const express = require("express");

// Create a router instance
const router = express.Router();

// Import the controller function for handling the main route
const { getMain } = require("../controllers/mainController");

const ROUTES = {
  ROOT: "/",
};

// Define the route for getting the main information
router.get(ROUTES.ROOT, getMain);

// Export the router to be used in the main application
module.exports = router;
