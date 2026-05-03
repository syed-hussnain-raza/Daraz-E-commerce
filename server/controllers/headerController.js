const data = require("../data/header.json");
const getHeader = (req, res) => res.json(data);
module.exports = { getHeader };
