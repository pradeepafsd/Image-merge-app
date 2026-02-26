const mongoose = require("mongoose");

// Define schema for template collection
const templateSchema = new mongoose.Schema({
  templateFile: String, // stores uploaded template file path or name
  templateUploadedBy: String, // stores uploader name
  timeStamp: { type: Date, default: Date.now } // auto save upload time
});

// Export Template model
module.exports = mongoose.model("Template", templateSchema);