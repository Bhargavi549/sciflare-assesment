const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" }
});

module.exports = mongoose.model("User", userSchema);
