import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import {verifyTokenOptional} from "../middleware/verifyTokenOptional.js";
import { addPost, deletePost, getPost, getPosts, updatePost, verifyPost } from "../controllers/post.controller.js";
import { checkSuspension } from "../middleware/checkSuspension.js";


const router = express.Router();

router.get("/", verifyTokenOptional, getPosts);
router.get("/:id", getPost);
router.post("/", verifyToken, checkSuspension, addPost);
router.put("/:id", verifyToken, updatePost);
router.put("/:id/verify", verifyToken, verifyPost);
router.delete("/:id", verifyToken, deletePost);

export default router;
