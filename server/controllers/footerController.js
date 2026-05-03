const data = require("../data/footer.json");
const getFooter = (req, res) => res.json(data);
module.exports = { getFooter };
