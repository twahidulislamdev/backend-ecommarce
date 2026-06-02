require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const app = express();
require("dotenv").config();
const dbConnection = require("./database/dbConnection");
const routes = require("./routes");
const session = require("express-session");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5000",
  "https://prime-store-public.vercel.app",
  "https://buygoodashboard.vercel.app",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// Middleware for parsing JSON and URL-encoded data
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use This for session management Start
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  }),
);
// Use this for session management End

// Database Connection
dbConnection();

// Routing
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
