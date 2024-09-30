import fs from "fs";
import path from "path";
import { client } from "../dbconfig.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../upload.js';
import cors from "cors"

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

const controller = {
    createPost: async (req, res) => {
        const title = req.body.title;
        const text = req.body.text;
        const file = req.file.path;
        const id_user = req.userId;

        if (!title || !text) {
            return res.status(500).send("Es necesario titulo y text para crear una publicacion");
        }

        if (!file) {
            const queryWithoutFile = 'INSERT INTO public.posts (title, text, id_user) VALUES ($1, $2, $3)';

            try {
                const uploadWithoutFile = await client.query(queryWithoutFile, [title, text, id_user]);
                return res.status(200).send("Publicacion creada correctamente", uploadWithoutFile);
            } catch (err) {
                return res.status(400).send("Error al crear publicacion")
            }
        }

        else {
            const resultCloudinary = await cloudinary.uploader.upload(file, {
                folder: "publicaciones",
            });

            const fileUrl = resultCloudinary.secure_url;

            const queryWithFile = 'INSERT INTO public.posts (title, text, file, id_user) VALUES ($1, $2, $3, $4)';

            try {
                const uploadWithFile = await client.query(queryWithFile, [title, text, fileUrl, id_user]);
                return res.status(200).send("Publicacion creada correctamente", uploadWithFile);
            } catch (err) {
                return res.status(400).send("Error al crear publicacion")
            }
        }
    }
}

export default controller;