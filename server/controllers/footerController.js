// Controller for footer-related endpoints

// In a real application, this would likely interact with a database or another data source.
const data = require("../data/footer.json");

// Import the response handler utility for consistent API responses
const { handleResponse } = require("../utils/responseHandler");

// GET /footer?id=123
const getFooter = (req, res) => {
  // Extract 'id' from query parameters and validate it as a string
  const { id } = req.query;
  return handleResponse(res, data, {
    rules: { id: { value: id, type: "string" } },
  });
};

// export the controller functions to be used in route definitions
module.exports = { getFooter };
