const emailValidation = require("../helpers/emailValidation");
const userSchema = require("../model/userSchema");
const bcrypt = require("bcrypt");
const loginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.json({
      message: "Error: Email Required",
    });
  }
  if (!password) {
    return res.json({
      message: "Error: Password Required",
    });
  }
  if (!emailValidation(email)) {
    return res.json({
      message: "Error: Invalid Email Format",
    });
  }
  const duplicateUser = await userSchema.findOne({ email });
  if (!duplicateUser) {
    return res.json({
      message: "Error: User Not Found",
    });
  }

  try {
    const matchPassword = await bcrypt.compare(
      password,
      duplicateUser.password,
    );
    if (!matchPassword) {
      return res.json({
        message: "Error: Incorrect Password",
      });
    }
    return res.json({
      message: "Success: Logged in",
      user: duplicateUser,
    });
  } catch (err) {
    return res.json({
      message: "Error: Internal Server Error",
    });
  }
};
module.exports = loginController;
