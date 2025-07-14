import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  register,
  login,
  showUsers,
  userUpdate,
  userDelete,
  showProfile,
} from "../controllers/userController.js";

const Router = express.Router();

// user routes
Router.post("/register", register);
Router.post("/login", login);
Router.post("/profile", showProfile)
// === get - profile
// === patch - update profile

// admin routes
Router.patch("/:id", authenticate, authorize("admin"), userUpdate);
Router.delete("/:id", authenticate, authorize("admin"), userDelete);
// Router.get("/users", authenticate, authorize("admin"), showUsers);
Router.get("/users", showUsers);
// === get - getUser
// === post - adduser


export default Router;