import express from "express";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import { errorHandler } from "./middleware/error";
import authRoutes from "./routes/auth.routes";
import projectsRoutes from "./routes/projects.routes";
import submissionsRoutes from "./routes/submissions.routes";
import reviewsRoutes from "./routes/reviews.routes";
import canonRoutes from "./routes/canon.routes";

const app = express();
app.use(json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api", submissionsRoutes); // submission endpoints
app.use("/api", reviewsRoutes);
app.use("/api", canonRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

// error handler
app.use(errorHandler);

export default app;
