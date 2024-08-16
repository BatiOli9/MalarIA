import express from "express";
const router = express.Router();

import patientsController from "../controllers/patientsController.js";

router.post("/registerPatient", patientsController.registerPatient);

export default router;