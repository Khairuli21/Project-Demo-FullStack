import passport from "passport";
import { PrismaClient } from "@prisma/client";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";

// 🔹 Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({ where: { email: profile.emails?.[0].value } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails?.[0].value,
              password: "", // kosong karena pakai OAuth
            },
          });
        }

        const token = jwt.sign(
          { id: user.id, name: user.name, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        done(null, { token, user });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// 🔹 Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value || `${profile.id}@facebook.com`;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email,
              password: "",
            },
          });
        }

        const token = jwt.sign(
          { id: user.id, name: user.name, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        done(null, { token, user });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default passport;
