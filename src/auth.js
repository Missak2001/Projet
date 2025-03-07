const jsonServerAuth = require("json-server-auth");

module.exports = (req, res, next) => {
  jsonServerAuth(req, res, next);
};
