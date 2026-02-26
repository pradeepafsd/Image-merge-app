const router = require("express").Router();
const Template = require("../models/Template");
const upload = require("../middleware/upload");

// Route for uploading a template
router.post("/", (req, res) => {
  upload.single("templateFile")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "File not provided" });
    }

    try {
      const template = await Template.create({
        templateFile: req.file.path,
        templateUploadedBy: req.body.templateUploadedBy
      });

      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Database error" });
    }
  });
});

// Route to get all templates
router.get("/", async (req, res) => {
  try {
    const templates = await Template.find();
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

// Export the router
module.exports = router;