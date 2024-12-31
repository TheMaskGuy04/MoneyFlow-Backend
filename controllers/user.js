const User = require("../models/user");
const bcrypt = require("bcrypt");
const { setUser, getUser } = require("../services/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const hash = await bcrypt.hash(password, parseInt(process.env.saltRounds));

    await User.create({ name, email, password: hash });

    // console.log("Registration attempt with:", { name, email, password });

    return res.json({ userCreated: true });
  } else {
    return res.json({
      userCreated: false,
      error: "User with Same email exists",
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      userAuthenticated: false,
      error: "Invalid Email",
    });
  } else {
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const token = setUser(user);
      res.cookie("tokenId", token);

      return res.json({
        userAuthenticated: true,
        user: { email: user.email, name: user.name },
      });
    } //
    else {
      return res.json({
        userAuthenticated: false,
        error: "Invalid Password",
      });
    }
  }
}

async function handleLogout(req, res) {
  const tokenId = req.cookies?.tokenId;

  if (tokenId) {
    res.clearCookie("tokenId");
    res.clearCookie("data");
  }

  res.json({ success: true });
}

async function handleUserDetailsUpdate(req, res) {
  const { name, email } = req.body;
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
      // console.log("Before:", user);
      try {
        const resp = await User.findOneAndUpdate(
          { _id: user._id },
          { $set: { email: email, name: name } },
          { new: true }
        );

        const token = setUser(resp);
        res.cookie("tokenId", token);
        // console.log("After:", resp);

        return res.json({
          success: true,
          user: { email: email, name: name },
        });
      } catch (error) {
        return res.json({
          success: false,
          error: error.message,
        });
      }
    }
  }
}

async function checkAuth(req, res) {
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
      return res.json({
        success: true,
        user: { email: user.email, name: user.name },
      });
    }
  }
}

module.exports = {
  handleUserLogin,
  handleUserSignup,
  checkAuth,
  handleLogout,
  handleUserDetailsUpdate,
};
