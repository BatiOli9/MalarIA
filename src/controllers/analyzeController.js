import fs from "fs";
import path from "path";
import { client } from "../dbconfig.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../upload.js';
/* import authMiddleware from '../middlewares/auth.js'; */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

const controller = {
    todosAnalisis: async (req, res) => {
        const query = "SELECT * FROM public.analisis";
        try {
            const result = await client.query(query);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir analisis:', err);
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
            console.error('Error al requerir analisis:', err);
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
            console.error('Error al requerir analisis:', err);
            res.status(500).json({ message: "Error al requerir analisis", err: err.message });
        }
    },
    uploadAnalyze: async (req, res) => {
        res.render('upload');
    },
    uploadAnalyzePost: async (req, res) => {
        const imageFile = req.file.path;
        const nombre = req.body.nombre;
        const fecha = Date.now();
        const id_paciente = 3;
        const resultados = 1;
        const id_usuario = req.userId;

        console.log(id_usuario);

        const extension = imageFile.split('.').pop();
        const extensionesPermitidas = ['pdf', 'png', 'jpeg', 'jpg'];

        if (!extensionesPermitidas.includes(extension)) {
            console.error('Extensión de archivo no permitida');
            return res.status(400).send('Error: Extensión de archivo no permitida. Extensiones admitidas: PDF, PNG, JPEG, y JPG');
        }

        // Subir la imagen a Cloudinary
        try {
            const result = await cloudinary.uploader.upload(imageFile, {
                folder: 'analisis',
            });

            const imageUrl = result.secure_url; // Obtener el link de la imagen subida

            // Insertar el análisis en la base de datos, incluyendo el URL de la imagen
            const query = 'INSERT INTO public.analisis (imagen, nombre, fecha, id_paciente, resultados) VALUES ($1, $2, $3, $4, $5)';
            await client.query(query, [imageUrl, nombre, fecha, id_paciente, resultados]);

            const query2 = 'SELECT id FROM public.analisis WHERE imagen = $1';
            const result2 = await client.query(query2, [imageUrl]);

            const id_requerido = result2.rows[0].id;

            const query3 = 'INSERT INTO public.manipulacion (id_analisis, id_usuarios) VALUES ($1, $2)';
            await client.query(query3, [id_requerido, id_usuario]);

            fs.unlinkSync(imageFile); // Eliminar el archivo local

            res.json({ message: "Análisis subido correctamente", imageUrl });
        } catch (error) {
            console.error('Error al subir análisis:', error);
            res.status(500).json({ message: "Error al subir análisis", error: error.message });
        }
    },
    deleteAnalyze: async (req, res) => {
        const id = req.params.id;

        const query = 'DELETE FROM public.analisis WHERE id = $1';
        try {
            await client.query(query, [id]);
            res.json({ message: "Análisis eliminado correctamente" });
        } catch (error) {
            console.error('Error al eliminar análisis:', error);
            res.status(500).json({ message: "Error al eliminar análisis", error: error.message });
        }
    },
    editAnalyze: async (req, res) => {
        const id = req.params.id;
        const nombre = req.body.nombre;

        const query = 'UPDATE public.analisis SET nombre = $1 WHERE id = $2';
        try {
            await client.query(query, [nombre, id]);
            res.json({ message: "Análisis actualizado correctamente" });
        } catch (error) {
            console.error('Error al actualizar análisis:', error);
            res.status(500).json({ message: "Error al actualizar análisis", error: error.message });
        }
    },
    addCollaborators: async (req, res) => {
        const id = req.params.id;
        const email = req.body.email;

        const query1 = 'SELECT id FROM public.users WHERE email = $1';
        const query2 = 'INSERT INTO public.manipulacion (id_analisis, id_usuarios) VALUES ($1, $2)';
        try {
            const result = await client.query(query1, [email]);
            const email_result = result.rows[0].id;

            await client.query(query2, [id, email_result]);
            res.json({ message: "Colaborador agregado correctamente" });
        } catch (error) {
            console.error('Error al agregar colaborador:', error);
            res.status(500).json({ message: "Error al agregar colaborador", error: error.message });
        }
    }
}

export default controller;