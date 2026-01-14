const express = require("express");
const dbConnection = require("./database/dbConnection");
const app = express();
const port = 3000;
require("dotenv").config();
const route = require("./route");


app.get("/", (req, res) => {
  res.send("Hello World!");
});
dbConnection();
app.use("/user", route)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
