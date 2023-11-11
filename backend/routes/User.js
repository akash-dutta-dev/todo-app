const express = require("express")
const router = express.Router();
const {User} = require("../models");
const bcrypt = require("bcrypt");
const { createSampleTask } = require("../service/User");

// Post API to login/ signup users
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    // Handlr if email or password not provided, then it will be a invalid request.
    if (!email || !password){
      return res.status(400).json({message:"Need to provide email and password."})
    }

    // Check if the user already exists then sign in else, create a new user.
    const user = await User.findOne({ where: { email } });
    if (user) {
      // Check if password is correct, else return 401 (invalid authenticaiton).
      if (!bcrypt.compareSync(password, user.password)) {
          return res.status(401).json({ message: "Incorrect password" });
      }
      user.setDataValue('password', null);
      req.session.authenticated = true
      req.session.user =  user ;
      
      // Respond with 200 for a successful login in
      return res.status(200).json({ message: "User already exists. Logging In" , userDetails: user });
    }
  
    // Hashing the password before storing it
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Store the user data in databases
    const newUser = await User.create({ email: email, password: hashedPassword });
  
    // Set the user in session variable
    newUser.setDataValue('password', null);
    req.session.authenticated = true
    req.session.user = newUser;  
    
    // Create sample todos for new user
    createSampleTask(newUser.id)
    
    // Respond with 200 for a successful sign up 
    res.status(200).json({ message: "User registered successfully", userDetails: newUser });
  });
  

  // Get API to check if user is logged in or not
  router.get("/isLoggedIn", async (req, res) => {
    let user = req.session.user;
    if (user) {
      user.sessionId = req.sessionID;
      res.json({ loggedIn: true, userDetails: user });
    } else {
      res.json({ loggedIn: false });
    }
  });

  module.exports = router