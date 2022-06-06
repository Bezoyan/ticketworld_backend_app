import express, { Request, Response } from "express";
import { User } from "../models/user";
import { body } from "express-validator";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.post(
    "/users/signup",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("Password must be between 4 and 20 characters"),
    ], authController.SignUp
)
router.post(
    "/users/signin",
    [
        body("email").isEmail().withMessage("Email must be valid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("You must supply a password"),
    ], authController.SignIn
)
router.post("/users/signout", authController.SignOut)

export { router as authRouters };