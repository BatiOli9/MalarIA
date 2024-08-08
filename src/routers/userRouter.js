import express from "express";
const router = express.Router();

import userController from "../controllers/userController.js";

// Rutas Registrar
router.get("/register", userController.register);
router.post("/register", userController.registerPost);

export default router;