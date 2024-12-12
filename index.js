const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const app = express()
const env = require("dotenv")
const port = 4000

app.use(express.json());

const db = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/AYAF");
    console.log("connection Established");
  } catch (error) {
    console.log("error connecting to the database");
  }
};

db();

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.send("Hi, welcome");
});

app.post("/signup", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    //checks if all requred fields are present
    if (!userName ||!email ||!password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    //check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    // //check if password meets requirements
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists please login" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName: userName,
      email: email,
      password: hashPassword,
    });
    //save the new user to the database
    await newUser.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "internal server error, User could not be created" });
  }
});

app.post('/login', async(req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email:email});
    if (!user) {
      return res.status(400).json({msg:'invalis email credentials'})
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
      return res.status(400).json({msg:'Invalid password credentials'})
    }
    const dataInfo = {
      email: user.email,
      password: user.password
    }
    return res.status(200).json({msg:'Login successful', dataInfo})
  } catch (error) {
    console.log(error);
    return res.status(500).json({msg:'Internal Server Error'})
  }
})

app.listen(port, () => {
  console.log("Listening on localhost:4000");
});
