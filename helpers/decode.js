const jwt = require("jsonwebtoken");

exports.decode = (req) => {
  let tmp = req.header("Authorization");
  const token = tmp ? tmp.slice(7, tmp.length) : "";
  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  return decoded;
};
