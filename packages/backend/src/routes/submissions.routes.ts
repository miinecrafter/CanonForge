import { Router } from "express";
import { body } from "express-validator";
import { requireAuth } from "../middleware/auth";
import * as submissionsController from "../controllers/submissions.controller";

const router = Router();

router.post("/projects/:slug/submissions", requireAuth, body("title").isLength({ min: 1 }), submissionsController.createSubmission);
router.patch("/submissions/:id", requireAuth, submissionsController.updateSubmission);
router.post("/submissions/:id/submit", requireAuth, submissionsController.submitSubmission);
router.get("/projects/:slug/submissions", requireAuth, submissionsController.listProjectSubmissions);
router.get("/submissions/:id", requireAuth, submissionsController.getSubmission);

export default router;
