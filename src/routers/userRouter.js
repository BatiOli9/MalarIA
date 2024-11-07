import express from "express";
import multer from "multer";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const router = express.Router();
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";

import userController from "../controllers/userController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, "../uploads/analyze");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PNG, JPEG, and JPG files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
});

// Registrar Usuario Admin
router.post("/registerAdmin", verifyAdmin, verifyToken, userController.registerAdminPost);

// Registrar Usuario
router.post("/register", userController.registerPost);

// Upload Photo Profile
router.post("/photoProfile/:id", userController.photoProfile);

// Devolver todos los usuarios
router.get("/allUsers", verifyAdmin, verifyToken, userController.allUsers);

// Devolver usuario por id
router.get("/user/:id", userController.userById);

// Editar un usuario existente
router.put("/editUser/:id", verifyToken, userController.editUser);

// Eliminar un usuario especifico
router.delete("/deleteUser/:id", verifyToken, userController.deleteUser);

// Login
router.post("/login", userController.login);

// Editar Email
router.post("/editEmail/:id", verifyToken, userController.editEmail);

// Editar Nombre
router.post("/editNombre/:id", verifyToken, userController.editNombre);

// Editar Apellido
router.post("/editApellido/:id", verifyToken, userController.editApellido);

// Editar Username
router.post("/editUsername/:id", verifyToken, userController.editUsername);

// Recuperar Contraseña (enviar correo)
router.post("/sendPasswordResetEmail", userController.sendPasswordResetEmail);

// Recuperar Contraseña (cambiar)
router.post("/resetPassword", userController.resetPassword);

export default router;