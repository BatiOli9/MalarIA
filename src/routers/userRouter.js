import express from "express";
const router = express.Router();
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";

import userController from "../controllers/userController.js";

// Registrar Usuario Admin
router.post("/registerAdmin", verifyAdmin, verifyToken, userController.registerAdminPost);

// Registrar Usuario
router.post("/register", userController.registerPost);

// Devolver todos los usuarios
router.get("/allUsers", verifyAdmin, verifyToken, userController.allUsers);

// Devolver usuario por id
router.get("/user/:id", verifyToken, userController.userById);

// Editar un usuario existente
router.put("/editUser/:id", verifyToken, userController.editUser);

// Eliminar un usuario especifico
router.delete("/deleteUser/:id", verifyToken, userController.deleteUser);

// Login
router.post("/login", userController.login);

export default router;