// Product controller
const data = require("../data/products.json");

// Get all products
const getProducts = (req, res) => {
  return res.status(200).json({
    success: true,
    data: data.products,
  });
};

// Get product by ID
const getProductById = (req, res) => {
  const { id } = req.params;

  // BAD REQUEST (400)
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Bad Request: product id is required",
    });
  }

  const product = data.products.find((p) => p.id === id);

  // NOT FOUND (404)
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // SUCCESS (200)
  return res.status(200).json({
    success: true,
    data: product,
  });
};

// Export controllers
module.exports = { getProducts, getProductById };
