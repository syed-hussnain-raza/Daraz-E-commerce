const data = require("../data/products.json");

const getProducts = (req, res) => res.json(data.products);

const getProductById = (req, res) => {
  const product = data.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};

module.exports = { getProducts, getProductById };
