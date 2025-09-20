import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// middleware cek token
function authMiddleware(req: any, res: Response, next: Function) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(
    token,
    process.env.JWT_SECRET || "defaultsecret", // ✅ konsisten dengan auth.ts
    (err: any, decoded: any) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      req.user = decoded; // { id, name, email }
      next();
    }
  );
}

router.get("/", authMiddleware, (req: any, res: Response) => {
  res.json({
    user: req.user, // ✅ frontend bisa akses user.name
    articles: [
      { title: "Next.js 15 Released!" },
      { title: "Prisma Best Practices" },
    ],
    videos: [
      { title: "Learn Next.js in 10 mins", url: "https://youtu.be/xyz" },
      { title: "Express.js Crash Course", url: "https://youtu.be/abc" },
    ],
  });
});

export default router;
