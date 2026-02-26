const multer = require("multer");
const path = require("path");

// Configure storage location and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Save files inside uploads folder
    cb(null, "uploads/"); // make sure uploads folder exists
  },
  filename: (req, file, cb) => {
    // Create unique filename using timestamp
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

// Filter files to allow only PNG and JPG images
const fileFilter = (req, file, cb) => {
  // Log file details for debugging
  console.log("Received file:", file.originalname);
  console.log("MIME type:", file.mimetype);

  // Accept only image/png and image/jpeg
  if (["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG/JPG allowed"), false);
  }
};

// Create multer instance with size limit 1MB
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 // 1 MB max file size
  }
});

// Export upload middleware
module.exports = upload;