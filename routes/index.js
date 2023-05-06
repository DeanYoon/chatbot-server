const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "HEAD", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  })
);

router.get("/", function (req, res, next) {
  res.send({ message: "Welcome to the API server" });
});

module.exports = router;
