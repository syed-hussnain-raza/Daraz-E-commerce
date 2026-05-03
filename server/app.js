const express = require("express");
const cors = require("cors");

const headerRoutes = require("./routes/headerRoutes");
const footerRoutes = require("./routes/footerRoutes");
const mainRoutes = require("./routes/mainRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/header", headerRoutes);
app.use("/api/footer", footerRoutes);
app.use("/api/main", mainRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
