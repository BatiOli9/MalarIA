import fs from "fs";
import path from "path";
import { client } from "../dbconfig.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../upload.js';
/* import FormData from 'form-data';
import fetch from 'node-fetch'; */

const controller = {
    todosAnalisis: async (req, res) => {
        const query = "SELECT * FROM public.analisis";
        try {
            const result = await client.query(query);
            res.send(result);
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
    analisisPorUsuario: async (req, res) => {
        const id = req.params.id;
        const query = "SELECT * FROM public.analisis WHERE id_usuario = $1";
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
        console.log(req.body);
        const imageFile = req.file;
        const apellido = req.body.apellido;
        const nombre = req.body.nombre;
        const fecha = Date.now();
        const userId = req.user.userId;
    
        console.log(userId);
    
        const extension = imageFile.originalname.split('.').pop();
        const extensionesPermitidas = ['pdf', 'png', 'jpeg', 'jpg'];
    
        console.log('hola');
    
        if (!extensionesPermitidas.includes(extension)) {
            console.error('Extensión de archivo no permitida');
            return res.status(400).send('Error: Extensión de archivo no permitida. Extensiones admitidas: PDF, PNG, JPEG, y JPG');
        }
    
        // Subir la imagen a Cloudinary
        try {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder: 'analisis',
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
    
                stream.end(imageFile.buffer);
            });
    
            const imageUrl = result.secure_url; // Obtener el link de la imagen subida
            console.log('Imagen subida a Cloudinary:', imageUrl);
    
            // Insertar el análisis en la base de datos, incluyendo el URL de la imagen
            const query = 'INSERT INTO public.analisis (imagen, nombre, fecha, apellido, id_usuario) VALUES ($1, $2, $3, $4, $5)';
            await client.query(query, [imageUrl, nombre, fecha, apellido, userId]);
            console.log('Análisis insertado en la base de datos');
    
            const query2 = 'SELECT id FROM public.analisis WHERE imagen = $1';
            const result2 = await client.query(query2, [imageUrl]);
            console.log('ID del análisis obtenido:', result2.rows[0].id);
    
            const id_requerido = result2.rows[0].id;
    
            const query3 = 'INSERT INTO public.manipulacion (id_analisis, id_usuarios) VALUES ($1, $2)';
            await client.query(query3, [id_requerido, userId]);
            console.log('Manipulación insertada en la base de datos');
    
            try {
                const body = {
                    url: imageUrl
                }
    
                const response = await fetch("https://project-malaria.onrender.com/analyze_image", {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(body)
                });
                const data = await response.json();
                console.log('Respuesta de la IA:', data);
                const prediccion = data.prediction;
                if (prediccion === "Infectado") {
                    const resultado = true;
                    const query4 = 'UPDATE public.analisis SET resultados = $1 WHERE id = $2';
                    try {
                        await client.query(query4, [resultado, id_requerido]);
                        console.log('Resultado actualizado correctamente');
                    } catch (error) {
                        console.error('Error al actualizar resultado:', error);
                        return res.status(500).json({ message: "Error al actualizar resultado", error: error.message });
                    }
                }
                else if (prediccion === "Sano") {
                    const resultado = false;
                    const query4 = 'UPDATE public.analisis SET resultados = $1 WHERE id = $2';
                    try {
                        await client.query(query4, [resultado, id_requerido]);
                        console.log('Resultado actualizado correctamente');
                    } catch (error) {
                        console.error('Error al actualizar resultado:', error);
                        return res.status(500).json({ message: "Error al actualizar resultado", error: error.message });
                    }
                }
    
                if (response.ok) {
                    return res.json({ message: "Análisis subido correctamente", imageUrl });
                } else {
                    console.log(data);
                    console.error('Error al subir análisis:' + data.message);
                    return res.status(500).json("Error al subir análisis");
                }
            } catch (err) {
                console.error('Error en la comunicación con IA:', err);
                return res.status(500).json({
                    message: "Error en la comunicación con el servidor de IA",
                    error: err.message,
                });
            }
    
        } catch (error) {
            console.error('Error al subir análisis:', error);
            return res.status(500).json({ message: "Error al subir análisis", error: error.message });
        }
    },
    deleteAnalyze: async (req, res) => {
        const id = req.params.id;
    
        const deleteManipulacionQuery = 'DELETE FROM public.manipulacion WHERE id_analisis = $1';
        const deleteAnalisisQuery = 'DELETE FROM public.analisis WHERE id = $1';
    
        try {
            // Eliminar referencias en la tabla manipulacion
            await client.query(deleteManipulacionQuery, [id]);
    
            // Eliminar el análisis
            await client.query(deleteAnalisisQuery, [id]);
    
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
    },
    promedioResultados: async (req, res) => {
        const query = 'SELECT resultados FROM public.analisis'
        try {
            const result = await client.query(query);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir resultados:', err);
            res.status(500).json({ message: "Error al requerir resultados", err: err.message });
        }
    },
    analisisPorNombre: async (req, res) => {
        const { nombre, id_usuario } = req.query;
    
        const query = 'SELECT * FROM public.analisis WHERE nombre ILIKE $1 AND id_usuario = $2';
    
        try {
            const result = await client.query(query, [`%${nombre}%`, id_usuario]);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir analisis:', err);
            res.status(500).json({ message: "Error al requerir analisis", err: err.message });
        }
    }
}

export default controller;