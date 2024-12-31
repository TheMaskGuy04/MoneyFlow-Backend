const express = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  handleLogout,
  checkAuth,
  handleUserDetailsUpdate,
} = require("../controllers/user");

const router = express.Router();

router.post("/", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/logout", handleLogout);
router.post("/update", handleUserDetailsUpdate);
router.get("/checkAuth", checkAuth);

module.exports = router;
