import multer from 'multer';
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";
import analyzeController from "../controllers/analyzeController.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.memoryStorage();

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

// Devolver analisis por usuario
router.get("/analisisPorUsuario/:id", analyzeController.analisisPorUsuario);

// Devolver analisis por paciente
router.get("/analisisPorPaciente/:id", analyzeController.analisisPorPaciente);

// Devolver analisis por id
router.get("/analisisPorId/:id", analyzeController.analisisPorId);

// Subir análisis
router.post("/uploadAnalyzePost", verifyToken, upload.single('file'), analyzeController.uploadAnalyzePost);

// Eliminar análisis
router.delete("/deleteAnalyze/:id", analyzeController.deleteAnalyze);

// Editar análisis
router.put("/editAnalyze/:id", analyzeController.editAnalyze);

// Agregar colaboradores
router.post("/addCollaborators/:id", analyzeController.addCollaborators);

// Promedio de resultados
router.get("/promedioResultados", analyzeController.promedioResultados);

// Buscar análisis por nombre
router.get("/analisisPorNombre", analyzeController.analisisPorNombre);

export default router;