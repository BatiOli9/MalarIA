import express from "express";
const router = express.Router();

import userController from "../controllers/userController.js";

// Registrar Usuario
router.post("/register", userController.registerPost);

// Devolver todos los usuarios
router.get("/allUsers", userController.allUsers);

// Devolver usuario por id
router.get("/user/:id", userController.userById);

// Editar un usuario existente
router.put("/editUser/:id", userController.editUser);

export default router;