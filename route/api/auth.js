const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Data Ache");
});
router.get("/signup", (req, res) => {
  res.send({
    name: "Twahidul",
    email: "twahid746@gmail.com",
    password :"12254e564"
  });
});

module.exports = router;
