const express = require("express");
const router = express.Router();
const { getFooter } = require("../controllers/footerController");

router.get("/", getFooter);
module.exports = router;
