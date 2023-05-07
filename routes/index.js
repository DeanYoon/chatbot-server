const express = require("express");
const app = express(); // create an instance of the express app
const router = express.Router();
const cors = require("cors");
const User = require("./models/User");
const Comment = require("./models/Comment");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const MONGODB_URL = process.env.MONGODB_URL;

router.use(
  cors({
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  })
);

router.post("/users/:username", async (req, res) => {
  const username = req.params.username;
  const newData = req.body;

  try {
    const user = await User.findOneAndUpdate({ username }, newData, {
      upsert: true,
      new: true, // returns the updated document
    });

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

router.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const user = await User.findById({ username });
    console.log(user);
    res.send(user);
  } catch (err) {
    res.status(500).send("No user found");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (user) {
      if (password && user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        isMatch
          ? res.status(200).send(user)
          : res.status(500).send("Wrong Password");
      }
    } else {
      res.status(500).send("User not exists");
    }

    // if (!user) {
    //   return res.status(401).send("Wrong Password");
    // }
    // const token = jwt.sign({ userId: user.id }, REACT_APP_JWT_SECRET, {
    //   expiresIn: "7d",
    // });
    // res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});
router.post("/signup", async (req, res) => {
  const { username } = req.body;
  const newData = req.body;

  try {
    const user = await User.exists({ username });
    if (user) {
      res.status(500).send("User Exists");
    } else if (!user) {
      const user = await User.findOneAndUpdate({ username }, newData, {
        upsert: true,
        new: true, // returns the updated document
      });
      res.status(200).send(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

//게시물
router.post("/comment/add", async (req, res) => {
  const comment = req.body;

  try {
    await Comment.create(comment);
    res.send(comment);
  } catch (error) {
    console.error(error);
    res.status(500).send("fail");
  }
});

router.get("/comments", async (req, res) => {
  try {
    const allComments = await Comment.find();
    res.send(allComments);
  } catch (error) {
    res.status(500).send("fail");
  }
});

//edit profile information
router.post("/profile/edit", async (req, res) => {
  const { prevUsername } = req.body;
  const { edittedUserData } = req.body;

  if (prevUsername !== edittedUserData.username) {
    const alreadyExists = await User.exists({
      username: edittedUserData.username,
    });
    if (alreadyExists) {
      return res.status(400).send("User Already Exists");
    }
  }

  try {
    await User.findOneAndUpdate({ username: prevUsername }, edittedUserData, {
      upsert: true,
      new: true, // returns the updated document
    });
    res.send("updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

// Start the server

mongoose.connect(MONGODB_URL);
const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB✅");
const handleError = (error) => console.log("DB Error", error);

db.on("error", handleError);
db.once("open", handleOpen);

module.exports = router;
