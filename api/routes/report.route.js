import express from "express";
import { getReports, getStats } from "../controllers/report.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, verifyAdmin, getReports);
router.get("/stats", verifyToken, verifyAdmin, getStats);

export default router;
