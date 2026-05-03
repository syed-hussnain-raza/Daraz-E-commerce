const data = require("../data/main.json");
const getMain = (req, res) => res.json(data);
module.exports = { getMain };
