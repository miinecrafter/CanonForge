import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import * as canonController from "../controllers/canon.controller";

const router = Router();

router.post("/submissions/:id/canonize", requireAuth, requireRole(["WRITER","ADMIN"]), canonController.canonizeSubmission);

export default router;
