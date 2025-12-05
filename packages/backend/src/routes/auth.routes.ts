import { Router } from "express";
import { body } from "express-validator";
import * as authController from "../controllers/auth.controller";

const router = Router();

router.post("/register",
  body("username").isLength({ min: 3 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  authController.register
);

router.post("/login",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  authController.login
);

router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", authController.me);

export default router;
