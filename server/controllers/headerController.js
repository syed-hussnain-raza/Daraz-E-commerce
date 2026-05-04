// Header controller
const data = require("../data/header.json");

// Get header data
const getHeader = (req, res) => {
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

// Export controller
module.exports = { getHeader };
