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
            res.json({ message: "Usuario registrado correctamente" });
        } catch (error) {
            console.error('Error al registrar usuario:', error); // Imprime el error en la consola
            res.status(500).json({ message: "Error al registrar usuario", error: error.message });
        }
    }
}

export default controller;