const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const port = 4000;

app.use(express.json())

const db = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/AYAF")
    console.log("connection Established");
  } catch (error) {
    console.log("error connecting to the database");
  }
}

db();

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }
})

const User = mongoose.model("user", userSchema)

app.get('/', (req,res) => {
  res.send('Hi, welcome');
});

app.post('/signup', async(req,res)=>{
  try {
    const {userName,email,password} = req.body;
    const existingUser = await User.findOne({email: email})
    if (existingUser) {
      return res.status(400).json({message: "User already exists please login"});
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = ({
      userName: userName,
      email: email,
      password: hashPassword
    })
  } catch (error) {
    
  }
})

app.listen(port, () => {
  console.log('Listening on localhost:4000');
})
