import fs from "fs";
import path from "path";
import { client } from "../dbconfig.js";
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';
import { upload } from "../upload.js";

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
    },
    uploadAnalyze: async (req, res) => {
        res.render('upload');
    },
    uploadAnalyzePost: async (req, res) => {
        const imageFile = req.file.filename;
        const nombre = req.body.nombre;
        const fecha = Date.now();
        const id_paciente = 3;
        
        const extension = file_name.split('.').pop();
        
        const extensionesPermitidas = ['pdf', 'png', 'jpeg', 'jpg'];

        if (!extensionesPermitidas.includes(extension)) {
            console.error('Extensión de archivo no permitida');
            return res.status(400).send('Error: Extensión de archivo no permitida. Extensiones admitidas: DOC, DOCX, XLSX, PPT, PPTX y PDF');
        }

        console.log(
            'Nombre:', nombre,
            'Fecha:', fecha,
            'Id Paciente:', id_paciente,
            'Imagen:', image
        );
        
        const imageLocation = "../../uploads/" + imageFile;

        console.log(imageLocation);

        /* const query = 'INSERT INTO public.analisis (imagen, nombre, fecha, id_paciente) VALUES ($1, $2, $3, $4)';

        try {
            upload.uploader.upload()
            await client.query(query, [image, nombre, fecha, id_paciente]);
            res.json({ message: "Analisis subido correctamente" });
        } catch (error) {
            console.error('Error al subir analisis:', error); // Imprime el error en la consola
            res.status(500).json({ message: "Error al subir analisis", error: error.message });
        } */
    }
}

export default controller;