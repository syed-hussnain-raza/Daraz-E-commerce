// Controller for header-related endpoints
const data = require("../data/header.json");

// Import the response handler utility for consistent API responses
const { handleResponse } = require("../utils/responseHandler");

// GET /header?id=123
const getHeader = (req, res) => {
  // Extract 'id' from query parameters and validate it as a string
  const { id } = req.query;
  return handleResponse(res, data, {
    rules: { id: { value: id, type: "string" } },
  });
};

// export the controller functions to be used in route definitions
module.exports = { getHeader };
