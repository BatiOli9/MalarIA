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
        const fecha_nacimiento = req.body.nacimiento;

        let query = 'INSERT INTO public.pacientes (nombre, apellido, descripcion, id_pais, id_user, email, phone, fecha_nacimiento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

        try {
            await client.query(query, [nombre, apellido, descripcion, id_pais, id_user, email, phone, fecha_nacimiento]);
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
        const id = req.params.id;
        let query = "SELECT * FROM public.pacientes WHERE id = $1";

        try {
            const result = await client.query(query, [id]);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir paciente:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al requerir paciente", err: err.message });
        }
    },
    editPacient: async (req, res) => {
        const id = req.params.id;

        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const descripcion = req.body.descripcion;
        const id_pais = req.body.pais;
        const email = req.body.email;
        const phone = req.body.phone;
        const fecha_nacimiento = req.body.nacimiento;

        console.log(
            nombre,
            apellido,
            descripcion,
            id_pais,
            email,
            phone
        );

        let query = 'UPDATE public.pacientes SET nombre = $1, apellido = $2, descripcion = $3, id_pais = $4, email = $5, phone = $6, fecha_nacimiento = $7 WHERE id = $8';

        try {
            await client.query(query, [nombre, apellido, descripcion, id_pais, email, phone, fecha_nacimiento, id]);
            res.send("Paciente editado correctamente");
        } catch (err) {
            console.error('Error al editar paciente:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al editar paciente", err: err.message });
        }
    },
    deletePacient: async (req, res) => {
        const id = req.params.id;

        const query = 'DELETE FROM public.pacientes WHERE id = $1';

        try {
            await client.query(query, [id]);
            res.send("Paciente Eliminado Correctamente");
        } catch (err) {
            console.error('Error al eliminar paciente:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al eliminar paciente", err: err.message });
        }
    },
    pacientsByUser: async (req, res) => {
        const id = req.params.id;

        const query = 'SELECT * FROM public.pacientes WHERE id_user = $1';

        try {
            const result = await client.query(query, [id]);
            if (result.rows.length > 0) {
                res.json(result.rows);
            } else {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
        } catch (err) {
            console.error('Error al requerir usuario:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al requerir usuario", err: err.message });
        }
    } 
}

export default controller;