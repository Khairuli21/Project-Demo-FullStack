import { Router } from "express";
import { getVideos, createVideo } from "../controllers/videoController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET → ambil semua video
router.get("/", authMiddleware, getVideos);

// POST → buat video baru
router.post("/", authMiddleware, createVideo);

export default router;
