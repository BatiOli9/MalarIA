import express from "express";
const router = express.Router();

import patientsController from "../controllers/patientsController.js";

// Crear paciente
router.post("/registerPatient", patientsController.registerPatient);

// Devolver todos los pacientes
router.get("/allPacients", patientsController.allPacients);

// Devolver paciente especifico
router.get("/pacient/:id", patientsController.pacient);

// Editar Paciente Existente
router.put("/editPacient/:id", patientsController.editPacient);

export default router;