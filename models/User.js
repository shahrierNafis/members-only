const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  membershipStatus: {
    type: String,
    enum: ["member", "admin", "nonMember"],
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
