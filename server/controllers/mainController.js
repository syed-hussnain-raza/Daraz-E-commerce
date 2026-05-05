// Main controller to handle the main route logic
const data = require("../data/main.json");

// Import the response handler utility for consistent API responses
const { handleResponse } = require("../utils/responseHandler");

// GET /main?id=123
const getMain = (req, res) => {
  // Extract 'id' from query parameters and validate it as a string
  const { id } = req.query;
  return handleResponse(res, data, {
    rules: { id: { value: id, type: "string" } },
  });
};

// export the controller functions to be used in route definitions
module.exports = { getMain };
