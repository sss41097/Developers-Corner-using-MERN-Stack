const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/user");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    //test
    // res.status(200).send({ success: "This is 200 code msg" });
    //res.status(500).send({ up: "This is 400 code msg" });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ check: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //see if user exist
      //get users gravatar
      //encrypt password
      //return jsonwebtoken

      let user = await User.findOne({ email });
      if (user) {
        res.status(400).send({ error: "User already exists" });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 36000000,
        },
        (err, token) => {
          if (err) throw err;
          res.send({ token: token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send({ error: "Server error" });
    }
  }
);

module.exports = router;
