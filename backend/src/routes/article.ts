import { Router } from "express";
import { getArticles, createArticle } from "../controllers/articleController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, getArticles);
router.post("/", authMiddleware, createArticle);

export default router;
