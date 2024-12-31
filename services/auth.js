const jwt = require("jsonwebtoken");

function setUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, process.env.JWT_SECRET);
}

function getUser(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { setUser, getUser };
