const router = require("express").Router();
const User = require("../models/User");
const upload = require("../middleware/upload");

router.post("/", upload.single("userPhoto"), async (req, res) => {
  const user = await User.create({
    userName: req.body.userName,
    userPhoto: req.file.path,
    destination: req.body.destination
  });
  res.json(user);
});

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;