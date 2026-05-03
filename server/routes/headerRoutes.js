const express = require("express");
const router = express.Router();
const { getHeader } = require("../controllers/headerController");

router.get("/", getHeader);
module.exports = router;
