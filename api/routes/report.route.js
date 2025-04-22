import express from "express";
import { getReports } from "../controllers/report.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getReports);

export default router;