import express from "express";
import { getReports, getStats, rejectReport, processReport, createReport } from "../controllers/report.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createReport);
router.get("/", verifyToken, verifyAdmin, getReports);
router.get("/stats", verifyToken, verifyAdmin, getStats);
router.patch("/:reportId/reject", verifyToken, verifyAdmin, rejectReport);
router.patch("/:reportId/process", verifyToken, verifyAdmin, processReport);

export default router;
