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
    },
    allPosts: async (req, res) => {
        const query = 'SELECT * FROM public.posts';
        try {
            const posts = await client.query(query);
            return res.status(200).send(posts);
        } catch (err) {
            return res.status(400).send("Error al cargar publicaciones");
        }
    },
    postById: async (req, res) => {
        const id = req.params.id;
        const query = 'SELECT * FROM public.posts WHERE id = $1';

        try {
            const post = await client.query(query, [id]);
            return res.status(200).send(post);
        } catch (err) {
            return res.status(400).send("Error al cargar publicacion");
        }
    },
    editPost: async (req, res) => {
        const id = req.params.id;
        const title = req.body.title;
        const text = req.body.text;
        const file = req.file.path;

        if (!title || !text) {
            return res.status(500).send("Es necesario titulo y text para editar una publicacion");
        }

        if (!file) {
            const queryWithoutFile = 'UPDATE public.posts SET title = $1, text = $2 WHERE id = $3';

            try {
                const editWithoutFile = await client.query(queryWithoutFile, [title, text, id]);
                return res.status(200).send("Publicacion editada correctamente", editWithoutFile);
            } catch (err) {
                return res.status(400).send("Error al editar publicacion")
            }
        }

        else {
            const resultCloudinary = await cloudinary.uploader.upload(file, {
                folder: "publicaciones",
            });

            const fileUrl = resultCloudinary.secure_url;

            const queryWithFile = 'UPDATE public.posts SET title = $1, text = $2, file = $3 WHERE id = $4';

            try {
                const editWithFile = await client.query(queryWithFile, [title, text, fileUrl, id]);
                return res.status(200).send("Publicacion editada correctamente", editWithFile);
            } catch (err) {
                return res.status(400).send("Error al editar publicacion")
            }
        }
    },
    deletePost: async (req, res) => {
        const id = req.params.id;
        const query = 'DELETE FROM public.posts WHERE id = $1';

        try {
            const deletePost = await client.query(query, [id]);
            return res.status(200).send("Publicacion eliminada correctamente", deletePost);
        } catch (err) {
            return res.status(400).send("Error al eliminar publicacion");
        }
    },
    createComment: async (req, res) => {
        const text = req.body.text;
        const file = req.file.path;
        const id_user = req.userId;
        const id_post = req.body.id_post;

        if (!text) {
            return res.status(500).send("Es necesario text para crear un comentario");
        }

        if (!file) {
            const queryWithoutFile = 'INSERT INTO public.comments (text, id_user, id_post) VALUES ($1, $2, $3)';

            try {
                const uploadWithoutFile = await client.query(queryWithoutFile, [text, id_user, id_post]);
                return res.status(200).send("Comentario creado correctamente", uploadWithoutFile);
            } catch (err) {
                return res.status(400).send("Error al crear comentario")
            }
        }

        else {
            const resultCloudinary = await cloudinary.uploader.upload(file, {
                folder: "comentarios",
            });

            const fileUrl = resultCloudinary.secure_url;

            const queryWithFile = 'INSERT INTO public.comments (text, file, id_user, id_post) VALUES ($1, $2, $3, $4)';

            try {
                const uploadWithFile = await client.query(queryWithFile, [text, fileUrl, id_user, id_post]);
                return res.status(200).send("Comentario creado correctamente", uploadWithFile);
            } catch (err) {
                return res.status(400).send("Error al crear comentario")
            }
        }
    },
    commentsByPost: async (req, res) => {
        const id = req.params.id;
        const query = 'SELECT * FROM public.comments WHERE id_post = $1';

        try {
            const comments = await client.query(query, [id]);
            return res.status(200).send(comments);
        } catch (err) {
            return res.status(400).send("Error al cargar comentarios");
        }
    },
    editComment: async (req, res) => {
        const id = req.params.id;
        const text = req.body.text;
        const file = req.file.path;

        if (!text) {
            return res.status(500).send("Es necesario text para editar un comentario");
        }

        if (!file) {
            const queryWithoutFile = 'UPDATE public.comments SET text = $1 WHERE id = $2';

            try {
                const editWithoutFile = await client.query(queryWithoutFile, [text, id]);
                return res.status(200).send("Comentario editado correctamente", editWithoutFile);
            } catch (err) {
                return res.status(400).send("Error al editar comentario")
            }
        }

        else {
            const resultCloudinary = await cloudinary.uploader.upload(file, {
                folder: "comentarios",
            });

            const fileUrl = resultCloudinary.secure_url;

            const queryWithFile = 'UPDATE public.comments SET text = $1, file = $2 WHERE id = $3';

            try {
                const editWithFile = await client.query(queryWithFile, [text, fileUrl, id]);
                return res.status(200).send("Comentario editado correctamente", editWithFile);
            } catch (err) {
                return res.status(400).send("Error al editar comentario")
            }
        }
    },
    deleteComment: async (req, res) => {
        const id = req.params.id;
        const query = 'DELETE FROM public.comments WHERE id = $1';

        try {
            const deleteComment = await client.query(query, [id]);
            return res.status(200).send("Comentario eliminado correctamente", deleteComment);
        } catch (err) {
            return res.status(400).send("Error al eliminar comentario");
        }
    }
}

export default controller;