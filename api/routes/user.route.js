import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  savePost,
  profilePosts,
  getNotificationNumber,
  verifyUserByAdmin,
  refuseUserByAdmin
} from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);
// router.get("/search/:id", verifyToken, getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", verifyToken, savePost);
router.get("/profilePosts", verifyToken, profilePosts);
router.get("/notification", verifyToken, getNotificationNumber);

router.delete("/refuse/:id", verifyToken, verifyAdmin, refuseUserByAdmin);

// New route for admin to verify user
router.put("/verify/:id", verifyToken, verifyAdmin, verifyUserByAdmin);

export default router;
