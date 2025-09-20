import { Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../middleware/auth";

// GET all articles
export const getArticles = async (req: AuthRequest, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { created_at: "desc" },
      include: { user: true }, // termasuk info user
    });
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE article
export const createArticle = async (req: AuthRequest, res: Response) => {
  const { title, content, thumbnail } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const userId = req.user!.userId;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        thumbnail,
        userId,
      },
    });

    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
