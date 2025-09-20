import { Router } from "express";
import passport from "../auth/passport";

const router = Router();

// GOOGLE
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res) => {
    const { token, user } = req.user;
    res.redirect(`http://localhost:3001/login-success?token=${token}&name=${user.name}`);
  }
);

// FACEBOOK
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req: any, res) => {
    const { token, user } = req.user;
    res.redirect(`http://localhost:3001/login-success?token=${token}&name=${user.name}`);
  }
);

export default router;
