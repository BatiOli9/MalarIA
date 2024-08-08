import express from "express";
const router = express.Router();

import userController from "../controllers/userController.js";

router.post("/register", userController.register);

export default router;