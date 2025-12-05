import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import * as reviewsController from "../controllers/reviews.controller";
import { body } from "express-validator";

const router = Router();

router.post("/submissions/:id/reviews", requireAuth, requireRole(["WRITER","ADMIN"]), body("decision").isString(), reviewsController.createReview);

export default router;
