import express from "express";
import cors from "cors";

// import semua routes
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import articleRoutes from "./routes/article";

const app = express();

// izinkan request dari frontend (http://localhost:3000)
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/articles", articleRoutes); // <<< ini penting

// backend listen di 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
