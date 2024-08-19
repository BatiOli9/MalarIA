import fs from "fs";
import path from "path";
import { client } from "../dbconfig.js";

const controller = {
    registerPatient: async (req, res) => {
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const descripcion = req.body.descripcion;
        const id_pais = req.body.pais;
        const id_user = 5;
        const email = req.body.email;
        const phone = req.body.phone;

        let query = 'INSERT INTO public.pacientes (nombre, apellido, descripcion, id_pais, id_user, email, phone) VALUES ($1, $2, $3, $4, $5, $6, $7)';

        try {
            await client.query(query, [nombre, apellido, descripcion, id_pais, id_user, email, phone]);
            res.json({ message: "Paciente registrado correctamente" });
        } catch (error) {
            console.error('Error al registrar paciente:', error); // Imprime el error en la consola
            res.status(500).json({ message: "Error al registrar paciente", error: error.message });
        }
    },
    allPacients: async (req, res) => {
        let query = 'SELECT * FROM public.pacientes';

        try {
            const result = await client.query(query);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir pacientes:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al requerir pacientes", err: err.message });
        }
    },
    pacient: async (req, res) => {
        const id = req.parms.id;
        let query = "SELECT * FROM public.pacientes WHERE id = $1";

        try {
            const result = await client.query(query, [id]);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir paciente:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al requerir paciente", err: err.message });
        }
    }
}

export default controller;