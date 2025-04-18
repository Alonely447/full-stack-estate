import express from "express";
import { login, logout, requestEmailVerification,
    verifyEmailAndRegister,forgotPassword,resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/request-verification", requestEmailVerification);
router.get("/verify-email", verifyEmailAndRegister);
//router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
