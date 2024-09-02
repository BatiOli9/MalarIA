import express from "express";
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
const router = express.Router();

import analyzeController from "../controllers/analyzeController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, "../uploads");

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, res, cb) {
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
});

// Devolver todos los analisis
router.get("/todosAnalisis", analyzeController.todosAnalisis);
// Devolver analisis por paciente
router.get("/analisisPorPaciente/:id", analyzeController.analisisPorPaciente);
// Devolver analisis por ID
router.get("/analisisPorId", analyzeController.analisisPorId);
// Subir Analisis (vista)
router.get("/uploadAnalyze", analyzeController.uploadAnalyze);
// Subir Analisis proceso
router.post("/uploadAnalyzePost", upload.single('file'), analyzeController.uploadAnalyze);

export default router;