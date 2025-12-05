import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  // Minimal: returns a fake URL and key — replace with S3 presign later
  const file = req.file;
  if (!file) return res.status(400).json({ error: "No file" });
  const key = `mock/${Date.now()}_${file.originalname}`;
  const url = `http://localhost:4000/mock-files/${encodeURIComponent(file.originalname)}`;
  res.json({ key, url });
});

export default router;
