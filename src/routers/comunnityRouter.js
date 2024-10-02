import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { verifyAdmin, verifyToken } from "../middlewares/auth.js";

import communityController from "../controllers/comunnityController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, "../uploads/community");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, PNG, JPEG, and JPG files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
})

// Crear publicacion
router.post("/createPost", upload.single("file"), verifyToken, communityController.createPost);

// Devolver todas las publicaciones
router.get("/allPosts", verifyToken, communityController.allPosts);

// Devolver publicacion por id
router.get("/post/:id", verifyToken, communityController.postById);

// Editar una publicacion existente
router.put("/editPost/:id", verifyToken, communityController.editPost);

// Eliminar una publicacion especifica
router.delete("/deletePost/:id", verifyToken, communityController.deletePost);

// Crear comentario
router.post("/createComment", verifyToken, upload.single("file"), communityController.createComment);

// Devolver comentarios por id de publicacion
router.get("/comments/:id", verifyToken, communityController.commentsByPost);

// Editar un comentario existente
router.put("/editComment/:id", verifyToken, communityController.editComment);

// Eliminar un comentario especifico
router.delete("/deleteComment/:id", verifyToken, communityController.deleteComment);

export default router;

