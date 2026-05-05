// controllers/productController.js
const data = require("../data/products.json");

// Import the response handler utility for consistent API responses
const { handleResponse } = require("../utils/responseHandler");

// GET /products
const getProducts = (req, res) => {
  return handleResponse(res, data.products);
};

// GET /products/:id
const getProductById = (req, res) => {
  const { id } = req.params;
  const product = data.products.find((p) => p.id === id);

  // Use the response handler to manage required params and not found cases
  return handleResponse(res, product, {
    required: { id },
    notFoundMsg: "Product not found",
  });
};

// export the controller functions to be used in route definitions
module.exports = { getProducts, getProductById };
