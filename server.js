require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const app = express();
const path = require("path");
const BodyParser = require("body-parser");
const Users = require("./model/usersDB.js"); // Import the User model from database
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Connect to MongoDB
const mongoose = require("mongoose");
const ConnectDB = require("./config/connectdb.js"); // Import database connection function
ConnectDB(); // Connect to the database

app.use(BodyParser.json()); // Parse incoming JSON requests

// Serve static files from "public" directory
app.use("/", express.static(path.join(__dirname, "public")));

// Route: Get all users
app.get("/allpost", async (req, res) => {
  try {
    const allusers = await Users.find(); // Fetch all users from the database
    if (!allusers) return res.status(401).json({ msge: "Users not found" }); // Check if users exist
    res.status(200).json(allusers); // Send user data as JSON response
  } catch (error) {
    console.log(error, " error while fetching ");
    return res.send(error.msge); // Handle any errors
  }
});

// Route: Register new user
app.post("/api/register", async (req, res) => {
  const { username, password, roles } = req.body; // Get user details from request body
  if (!username)
    return res.status(401).json({ msge: "username/password mismatch" });

  const HashedPW = await Bcrypt.hash(password, 10); // Hash the password

  try {
    // Save user data to the database
    const result = await Users.create({
      username: username,
      password: HashedPW,
      roles: roles,
    });
    const redirectedURL = "/login.html"; // URL to redirect to after registration
    return res
      .status(200)
      .json({ msge: "Register Success", redirectedURL: redirectedURL });
  } catch (error) {
    console.log("error while creating");
    return res.status(400).json({ msge: "something went wrong" }); // Handle errors
  }
});

// Route: Update password
app.post("/update-password", async (req, res) => {
  const { token, newpassword } = req.body; // Get token and new password from request body
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT token to authenticate user
    const userID = user.id;
    const founduser = await Users.findById(userID); // Find the user by ID

    if (!founduser) return res.status(404).json({ msge: "User not found" });

    const HashedPW = await Bcrypt.hash(newpassword, 10); // Hash the new password
    founduser.password = HashedPW; // Update user's password
    await founduser.save(); // Save changes to database
    res.status(200).json({ msge: "PASSWORD UPDATED SUCCESS" });
  } catch (error) {
    console.log(error, " password not updated");
    return res.status(404).json({ msge: error + "invalid token" }); // Handle errors
  }
});

// Route: Login user
app.post("/login", async (req, res) => {
  const { username, password } = req.body; // Get username and password from request body
  try {
    const founduser = await Users.findOne({ username }); // Find the user by username

    if (!founduser) return res.status(401).json({ msge: "user not found" });

    const matchedPw = await Bcrypt.compare(password, founduser.password); // Compare the passwords
    const findrole = founduser.roles;

    let redirectedURL;
    let name;

    if (matchedPw) {
      // Generate JWT token if password matches
      const token = jwt.sign(
        {
          id: founduser._id,
          username: founduser.username,
        },
        JWT_SECRET
      );

      // Check user role and set redirected URL accordingly
      if (findrole && findrole === "USER") {
        redirectedURL = `/userpage.html?name=${founduser.username}&role=${findrole}`;
        name = username;
      } else {
        name = username;
        redirectedURL = `/AdminPage.html?name=${founduser.username}&role=${findrole}`;
      }

      // Send response with login success message, URL, username, and token
      return res.status(200).json({
        msge: "LOGIN SUCCESS",
        redirectedURL: redirectedURL,
        name: name,
        data: token,
      });
    } else {
      return res.status(401).json({ msge: "incorrect Password" });
    }
  } catch (error) {
    console.log("error while creating");
    return res.status(400).json({ msge: "Something went wrong" }); // Handle errors
  }
});

// Set the server to listen on specified port
const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`Server running on ${PORT}`));
