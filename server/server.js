// Server entry point
const app = require("./app");

// Load environment variables from .env file
require("dotenv").config();

// Port configuration
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
