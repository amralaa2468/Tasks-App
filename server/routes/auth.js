import express from "express";
import { check } from "express-validator";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

const registerValidation = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Email is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty(),
  check("email", "Invalid email").isEmail(),
  check("name", "Name must be at least 2 characters").isLength({
    min: 2,
  }),
  check("name", "Name at max is 50 characters").isLength({
    max: 50,
  }),
  check("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
];

const loginValidation = [
  check("email", "Email is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty(),
  check("email", "Invalid email").isEmail(),
  check("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
];

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

export default router;
