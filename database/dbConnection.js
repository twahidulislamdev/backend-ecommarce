const mongoose = require("mongoose");
// function dbConnection() {
//   mongoose
//     .connect(
//       `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@backendecommarce.a4vhkvw.mongodb.net/${process.env.DB_NAME}?appName=backendecommarce`
//     )
//     .then(() => console.log("DB Connected!"));
// }

function dbConnection() {
  mongoose
    .connect(`${process.env.DB_URL}`)
    .then(() => console.log("DB Connected!"));
}
module.exports = dbConnection;
