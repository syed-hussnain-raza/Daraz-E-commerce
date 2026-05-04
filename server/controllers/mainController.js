// Main controller
const data = require("../data/main.json");

// Get main data
const getMain = (req, res) => {
  const { id } = req.query;

  // BAD REQUEST (400)
  if (id && typeof id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Bad Request: invalid 'id' format",
    });
  }

  // SUCCESS (200)
  return res.status(200).json({
    success: true,
    data: data,
  });
};

// Export the controller functions
module.exports = { getMain };
