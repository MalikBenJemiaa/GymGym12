const d = require("./date_conf");
exports.test_date = (a) => {
  if (d.formatDate(new Date()) > a) {
    return true;
  } else {
    return False;
  }
};
