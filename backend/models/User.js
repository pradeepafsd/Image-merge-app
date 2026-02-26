const mongoose = require("mongoose");

// Define schema for User collection
const userSchema = new mongoose.Schema({
  userName: String,
  userPhoto: String,
  destination: String
});

// Export the User model
module.exports = mongoose.model("User", userSchema);