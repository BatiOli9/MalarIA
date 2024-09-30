import express from "express";
const router = express.Router();
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

import patientsController from "../controllers/patientsController.js";

// Crear paciente
router.post("/registerPatient", verifyToken, patientsController.registerPatient);

// Devolver todos los pacientes
router.get("/allPacients", verifyToken, verifyAdmin, patientsController.allPacients);

// Devolver paciente especifico
router.get("/pacient/:id", verifyToken, patientsController.pacient);

// Editar Paciente Existente
router.put("/editPacient/:id", verifyToken, patientsController.editPacient);

// Eliminar Paciente Existente
router.delete("/deletePacient/:id", verifyToken, patientsController.deletePacient);

// Ver todos los pacientes de un usuario
router.get("/pacientsByUser/:id", verifyToken, patientsController.pacientsByUser);

export default router;