import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

const SECRET = "sometext";

const register = async (req, res) => {
  try {
    // const { name, email, password, role } = req.body;
    const { firstname, lastname, email, password } = req.body;
    const hashedpwd = await bcrypt.hash(password, 10);
    const user = {
      firstname,
      lastname,
      email,
      password: hashedpwd,
      // role,
    };
    const result = await userModel.create(user);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong!" });
  }
};

const userUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const result = await userModel.findByIdAndUpdate(id, body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(200).json("Something went wrong!");
  }
};

const userDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userModel.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

// const showUsers = async (req, res) => {
//   try {
//     const result = await userModel.find();
//     res.status(200).json(result);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({ message: "Something went wrong!" });
//   }
// };

const showUsers = async (req, res) => {
  try {
    const { page = 1, limit = 3, search = "" } = req.query;
    const skip = (page - 1) * limit;
    const count = await userModel.countDocuments({ firstname: { $regex: search, $options: "i" } });
    const total = Math.ceil(count / limit);
    const users = await userModel
      .find({ firstname: { $regex: search, $options: "i" } })
      .skip(skip)
      .limit(limit)
      .sort({updatedAt:-1})
    res.status(200).json({ users, total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (isMatch) {
        const userObj = {
          id:existingUser._id,
          firstname: existingUser.firstname,
          // lastname: existingUser.lastname,
          email: existingUser.email,
          role: existingUser.role,
        };
        const token = jwt.sign(userObj, SECRET, { expiresIn: "1h" });
        res.status(200).json({ ...userObj, token });
      } else {
        res.status(400).json({ message: "Invalid password!" });
      }
    } else {
      res.status(400).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong!" });
  }
};

const showProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const userObj = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        };
        res.status(200).json({ userObj });
      } else {
        res.status(400).json({ message: "Invalid password!" });
      }
    } else {
      res.status(400).json({ message: "User not found!" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong!" });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userModel.findOne({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const addUser = async (req, res) => {
  try {
    const body = req.body;
    const hashedpwd = await bcrypt.hash(body.password, 10);
    body.password = hashedpwd;
    const result = await userModel.create(body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstname, lastname, email, password } = req.body;
    const hashedpwd = await bcrypt.hash(password, 10);
    const userObj = {
      firstname,
      lastname,
      email,
      password: hashedpwd,
    };
    const result = await userModel.findByIdAndUpdate(id, userObj);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const profile = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userModel.findOne({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

export { register, login, showUsers, userUpdate, userDelete, showProfile, updateProfile, getUser, addUser, profile };