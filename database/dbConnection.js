const mongoose = require("mongoose");
// const dbConnection = async () => {
//   mongoose
//     .connect(
//       `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@backendecommarce.a4vhkvw.mongodb.net/${process.env.DB_NAME}?appName=backendecommarce`,
//     )
//     .then(() => console.log("DB Connected!"));
// };

const dbConnection = async () => {
  mongoose
    .connect(`${process.env.DB_URL}`)
    .then(() => console.log("Database Connected!"));
};
module.exports = dbConnection;
