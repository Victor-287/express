const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const app = express();
const port = 4000;

app.use(express.json())

const db = async () => {
  try {
    await mongoose.connect("mongodb+srv://Cluster92581:c9q0O8qHCeXvRhwW@drakehazer.8cc9x.mongodb.net/")
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
    if (existingUser) {
      
    }
  } catch (error) {
    
  }
})

app.listen(port, () => {
  console.log('Listening on localhost:4000');
})
