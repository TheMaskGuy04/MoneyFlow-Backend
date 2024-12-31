const { getUser } = require("../services/auth");

async function restrictToLoggedinUserOnly(req, res, next) {
  const tokenId = req.cookies?.tokenId;

  if (!tokenId) {
    return res.json({ success: false, error: "Not LoggedIn", StatusCode: 401 });
  } //
  else {
    const user = getUser(tokenId);

    if (!user) {
      return res.json({
        success: false,
        error: "Not LoggedIn",
        StatusCode: 401,
      });
    } //
    else {
      req.user = user;
      next();
    }
  }
}

module.exports = { restrictToLoggedinUserOnly };
