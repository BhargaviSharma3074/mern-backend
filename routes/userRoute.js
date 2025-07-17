import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  register,
  login,
  showUsers,
  userUpdate,
  userDelete,
  showProfile,
  updateProfile,
  getUser,
  addUser,
  profile
} from "../controllers/userController.js";

const Router = express.Router();

// user routes
Router.post("/register", register);
Router.post("/login", login);
// Router.post("/profile", showProfile)
Router.get("/:id/profile", profile);
Router.patch("/:id/profile", updateProfile);

// admin routes

// Router.get("/users", authenticate, authorize("admin"), showUsers);
Router.get("/", authenticate, authorize("admin"), showUsers);
Router.post("/", authenticate, authorize("admin"), addUser);
Router.get("/:id", authenticate, authorize("admin"), getUser);
Router.patch("/:id", authenticate, authorize("admin"), userUpdate);
Router.delete("/:id", authenticate, authorize("admin"), userDelete);


export default Router;