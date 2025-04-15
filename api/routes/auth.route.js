import express from "express";
import { login, logout, requestEmailVerification,
    verifyEmailAndRegister } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/request-verification", requestEmailVerification);
router.get("/verify-email", verifyEmailAndRegister);
//router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
