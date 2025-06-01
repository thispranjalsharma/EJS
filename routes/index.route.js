import express from "express";
import {
  indexPage,
  aboutPage,
  signUpPage,
  signInPage,
} from "../controller/index.controller.js";
import { auth } from "../middleware/auth.js";
const router = express.Router();

router.get("/", auth, indexPage);

router.get("/about", aboutPage);

router.get("/sign-up", signUpPage);

router.get("/sign-in", signInPage);

export default router;
