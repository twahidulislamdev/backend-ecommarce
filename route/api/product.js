const express = require("express");
const router = express.Router();

router.get("/product", (req, res) => {
  res.send({
    title: "iphone",
    price: 150000,
    color: "White",
  });
});

module.exports = router;
