import { Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../middleware/auth";

// GET all videos
export const getVideos = async (req: AuthRequest, res: Response) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { created_at: "desc" },
      include: { user: true },
    });
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE video
export const createVideo = async (req: AuthRequest, res: Response) => {
  const { title, url, description } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: "Title and URL are required" });
  }

  try {
    const userId = req.user!.userId;

    const video = await prisma.video.create({
      data: {
        title,
        url,
        description,
        userId,
      },
    });

    res.status(201).json(video);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
