const express = require("express");
const router = express.Router();
const config = require("config");
const request = require("request");
const auth = require("../../middleware/auth");
const profiles = require("../../models/profile");
const users = require("../../models/user");
const axios = require("axios");
const posts = require("../../models/post");
const { check, validationResult } = require("express-validator");

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await profiles
      .findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"]);
    if (!profile) {
      return res
        .status(400)
        .send({ error: "There is no profile for this user." });
    }
    res.send(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Server Error" });
  }
});

// multiple middleware in array
router.post(
  "/",
  [
    auth,
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ check: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const fields = {};
    fields.user = req.user.id;
    if (status) fields.status = status;
    if (company) fields.company = company;
    if (website) fields.website = website;
    if (location) fields.location = location;
    if (bio) fields.bio = bio;
    if (status) fields.status = status;
    if (githubusername) fields.githubusername = githubusername;

    if (skills) {
      fields.skills = skills.split(",").map((skill) => skill.trim());
    }

    fields.social = {};
    if (youtube) fields.social.youtube = youtube;
    if (twitter) fields.social.twitter = twitter;
    if (facebook) fields.social.facebook = facebook;
    if (linkedin) fields.social.linkedin = linkedin;
    if (instagram) fields.social.instagram = instagram;
    //console.log(fields);

    try {
      let profile = await profiles.findOne({ user: req.user.id });
      //console.log(fields);
      if (profile) {
        profile = await profiles.findOneAndUpdate(
          { user: req.user.id }, //find by user
          { $set: fields },
          { new: true }
        );
        return res.json(profile);
      }
      console.log(fields);
      profile = new profiles(fields);
      await profile.save();
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/", async (req, res) => {
  try {
    const profile = await profiles.find().populate("user", ["name", "avatar"]);
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server Error" });
  }
});

//get profile by user id
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await profiles
      .findOne({ user: req.params.user_id })
      .populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).send({ error: "there is no profile." });
    }

    res.send(profile);
  } catch (error) {
    console.error(error.message);

    if (error.kind == "ObjectId") {
      return res.status(400).send({ error: "There is no profile" });
    }
    return res.status(400).send({ error: "There is no profile" });
  }
});

module.exports = router;

//delete profile
router.delete("/", auth, async (req, res) => {
  try {
    await posts.deleteMany({ user: req.user.id });

    await profiles.findOneAndRemove({ user: req.user.id });

    await users.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: "Server Error" });
  }
});

//add profile experience
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From data is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ check: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await profiles.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ error: "Server Error" });
    }
  }
);

//delete experience
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await profiles.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send({ error: "Server Error" });
  }
});

//add profile education
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field Of Study is required").not().isEmpty(),
      check("from", "From Date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ check: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await profiles.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ error: "Server Error" });
    }
  }
);

//delete education
router.delete("/education/:exp_id", auth, async (req, res) => {
  try {
    const profile = await profiles.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.error(err.message);
    res.status(500).send({ error: "Server Error" });
  }
});

//get github repos of username
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: encodeURI(
        `https://api.github.com/users/${
          req.params.username
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
          "githubClientId"
        )}&client_secret=${config.get("githubSecret")}`
      ),
      method: "GET",
      headers: { "user-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ error: "No Github profile found" });
      }

      res.send(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ error: "Server Error" });
  }
});
