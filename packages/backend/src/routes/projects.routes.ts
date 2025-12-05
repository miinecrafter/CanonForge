import { Router } from "express";
import { body } from "express-validator";
import { requireAuth, requireRole } from "../middleware/auth";
import * as projectsController from "../controllers/projects.controller";

const router = Router();

router.post("/", requireAuth, body("title").isLength({ min: 3 }), projectsController.createProject);
router.get("/", projectsController.listProjects);
router.get("/:slug", projectsController.getProjectBySlug);

export default router;
