import express from "express";
const router = express.Router();
import { verifyToken, verifyAdmin } from "../middlewares/auth.js";

import patientsController from "../controllers/patientsController.js";

// Crear paciente
router.post("/registerPatient", verifyToken, patientsController.registerPatient);

// Devolver todos los pacientes
router.get("/allPacients", patientsController.allPacients);

// Devolver paciente especifico
router.get("/pacient/:id", patientsController.pacient);

// Editar Paciente Existente
router.put("/editPacient/:id", patientsController.editPacient);

// Eliminar Paciente Existente
router.delete("/deletePacient/:id", patientsController.deletePacient);

// Ver todos los pacientes de un usuario
router.get("/pacientsByUser/:id", patientsController.pacientsByUser);

export default router;