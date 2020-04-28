const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/user");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send({ user });
  } catch (err) {
    //
    console.error(err.message);
    res.status(500).send("User not found");
  }
});

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],

  async (req, res) => {
    // res.status(400).send({ error: "EEEEEEEEEEEE" });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ check: errors.array() });
    }

    const { email, password } = req.body;
    try {
      //see if user exist
      //get users gravatar
      //encrypt password
      //return jsonwebtoken

      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).send({ error: "Invalid credentials" });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ error: "Server error" });
    }
  }
);

module.exports = router;
