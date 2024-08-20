const express = require("express");
const User = require("../models/User");
const passport = require("passport");
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post("/create-user", async (req, res) => {
  try {
    const { username, password, email, role, organization } = req.body;
    if (!username || !password || !email || !role || !organization) {
        return res.status(403).json({ message: 'Missing required fields' });
    }
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new Usaer({
      username,
      password: hashedPassword,
      email,
      role,
      organization
    });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide a username and password' });
    }

    try {
        const user = await User.findOne({ username }).populate('organization');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { id: user._id, username: user.username, role: user.role };
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, organization: user.organization } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get(
  "/get-all-users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "don't have access" });

    try {
      const users = await User.find().populate("organization");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  "/get-user-details/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (req.user._id !== req.params.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "don't have access" });
    }

    try {
      const user = await User.findById(req.params.id).populate("organization");
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;

