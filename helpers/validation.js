const User = require("../models/User");

exports.validateEmail = (email) => {
  return String(email)
    .toLocaleLowerCase()
    .match(/^([a-z\d.-]+)@([a-z\-]{2,12})(\.[a-z\-]{2,12})?$/);
};

exports.validateLenght = (text, min, max) => {
  if (text.lenght > max || text.lenght < min) {
    return false;
  }
  return true;
};

exports.validateUsername = async (username) => {
  let a = false;
  do {
    let check = await User.findOne({ username });
    if (check) {
      username += (+new Date() * Math.random()).toString().substring(0, 1);
      a = true;
    } else {
      a = false;
    }
  } while (a);
  return username;
};
