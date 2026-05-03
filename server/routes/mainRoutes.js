const express = require("express");
const router = express.Router();
const { getMain } = require("../controllers/mainController");

router.get("/", getMain);
module.exports = router;
