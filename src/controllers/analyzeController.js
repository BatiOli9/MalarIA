import fs from "fs";
import path from "path";
import { client } from "../dbconfig.js";
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');
const extensionesPermitidas = ['pdf', 'png', 'jpeg', 'jpg'];

const controller = {
    todosAnalisis: async (req, res) => {
        const query = "SELECT * FROM public.analisis";
        try {
            const result = await client.query(query);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir analisis:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al requerir analisis", err: err.message });
        }
    },
    analisisPorPaciente: async (req, res) => {
        const id = req.params.id;
        const query = "SELECT * FROM public.analisis WHERE id_paciente = $1";
        try {
            const result = await client.query(query, [id]);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir analisis:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al requerir analisis", err: err.message });
        }
    },
    analisisPorId: async (req, res) => {
        const id = req.params.id;
        const query = "SELECT * FROM public.analisis WHERE id = $1";
        try {
            const result = await client.query(query, [id]);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir analisis:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al requerir analisis", err: err.message });
        }
    }
}

export default controller;