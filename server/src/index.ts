import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import jobRoutes from "./routes/jobs";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/job-tracker";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(express.json());

// Allow the React dashboard's origin plus any Chrome extension origin
// (extensions call from "chrome-extension://<id>", which varies per install).
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // curl/postman/no-origin requests
      if (origin === CLIENT_ORIGIN || origin.startsWith("chrome-extension://")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

app.use(errorHandler);

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`[server] Listening on http://localhost:${PORT}`);
  });
});
