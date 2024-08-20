const express = require("express");
const Organization = require("../models/Organization");
const passport = require("passport");
const authorize = require("../config/auth");
const router = express.Router();

router.post("/create-organization", async (req, res) => {
  try {
    const newOrg = new Organization(req.body);
    const organization = await newOrg.save();
    res.status(201).json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/update-organization/:id", async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/delete-organization/:id", async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.json({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/get-organizations", async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
