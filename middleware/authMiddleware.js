const authMiddleware = (req, res, next) => {
  if (req.session && req.session.isAuth) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};
module.exports = authMiddleware;