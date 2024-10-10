import fs, { appendFile } from "fs";
import path from "path";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { client } from "../dbconfig.js";
import "dotenv/config";
import cloudinary from '../upload.js';

const saltRounds = 10;

const controller = {
    registerPost: async (req, res) => {
        console.log(req.body);
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const username = req.body.username;
        const email = req.body.email;
        /* const photo = req.file.path; */
        const password = req.body.password;
        const admin = false;

        /* console.log(photo); */

        console.log(
            nombre,
            apellido,
            password,
            username,
            email,
            admin
        );
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        


        let checkQuery = 'SELECT * FROM public.users WHERE email = $1 OR username = $2';
        try {
            const checkResult = await client.query(checkQuery, [email, username]);
            if (checkResult.rows.length > 0) {
            console.error('Error: El email o el username ya existen');
            return res.status(400).json({ message: "El email o el username ya existen" });
        }
        } catch (error) {
            console.error('Error al verificar email o username:', error);
            return res.status(500).json({ message: "Error al verificar email o username", error: error.message });
        }

        let query = 'INSERT INTO public.users (nombre, apellido, username, email, admin, password) VALUES ($1, $2, $3, $4, $5, $6)';

        try {
            await client.query(query, [nombre, apellido, username, email, admin, hashedPassword]);
            res.json({ message: "Usuario registrado correctamente" });
        } catch (error) {
            console.error('Error al registrar usuario:', error); // Imprime el error en la consola
            res.status(500).json({ message: "Error al registrar usuario", error: error.message });
        }
    },
    registerAdminPost: async (req, res) => {
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const admin = false;

        console.log(
            nombre,
            apellido,
            password,
            username,
            email,
        );

        let checkQuery = 'SELECT * FROM public.users WHERE email = $1 OR username = $2';
        try {
            const checkResult = await client.query(checkQuery, [email, username]);
            if (checkResult.rows.length > 0) {
            console.error('Error: El email o el username ya existen');
            return res.status(400).json({ message: "El email o el username ya existen" });
        }
        } catch (error) {
            console.error('Error al verificar email o username:', error);
            return res.status(500).json({ message: "Error al verificar email o username", error: error.message });
        }

        let query = 'INSERT INTO public.users (nombre, apellido, username, email, admin, password) VALUES ($1, $2, $3, $4, $5, $6)';

        try {
            await client.query(query, [nombre, apellido, username, email, admin, hashedPassword]);
            res.json({ message: "Usuario registrado correctamente" });
        } catch (error) {
            console.error('Error al registrar usuario:', error); // Imprime el error en la consola
            res.status(500).json({ message: "Error al registrar usuario", error: error.message });
        }
    },
    allUsers: async (req, res) => {
        let query = 'SELECT * FROM public.users';
        try {
            const result = await client.query(query);
            res.json(result);
        } catch (err) {
            console.error('Error al requerir usuario:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al requerir usuario", err: err.message });
        }
    },
    userById: async (req, res) => {
        const id = req.params.id;
        let query = "SELECT id, nombre, apellido, username, email, id_jerarquia, id_ocupacion, id_pais, password FROM public.users WHERE id = $1";
    
        try {
            const result = await client.query(query, [id]);
            if (result.rows.length > 0) {
                res.json(result.rows[0]); // Devuelve solo los datos del usuario
            } else {
                res.status(404).json({ message: "Usuario no encontrado" });
            }
        } catch (err) {
            console.error('Error al requerir usuario:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al requerir usuario", err: err.message });
        }
    },
    editUser: async (req, res) => {
        const id = req.params.id;
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const id_pais = req.body.pais;
        const id_ocupacion = req.body.ocupacion;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        console.log(
            nombre,
            apellido,
            email,
            username,
            password,
            id_pais,
            id_ocupacion
        );

        let checkQuery = 'SELECT * FROM public.users WHERE email = $1 OR username = $2';
        try {
            const checkResult = await client.query(checkQuery, [email, username]);
            if (checkResult.rows.length > 0) {
            console.error('Error: El email o el username ya existen');
            return res.status(400).json({ message: "El email o el username ya existen" });
        }
        } catch (error) {
            console.error('Error al verificar email o username:', error);
            return res.status(500).json({ message: "Error al verificar email o username", error: error.message });
        }
    
        let query = 'UPDATE public.users SET nombre = $1, apellido = $2, username = $3, password = $4, email = $5, id_pais = $6, id_ocupacion = $7 WHERE id = $8';
    
        try {
            await client.query(query, [nombre, apellido, username, hashedPassword, email, id_pais, id_ocupacion, id]);
            res.send("Usuario Editado Correctamente");
        } catch (err) {
            console.error('Error al editar usuario:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al editar usuario", err: err.message });
        }
    },
    deleteUser: async (req, res) => {
        const id = req.params.id;

        const query = 'DELETE FROM public.users WHERE id = $1';

        try {
            await client.query(query, [id]);
            res.send("Usuario Correctamente Eliminado");
        } catch (err) {
            console.error('Error al eliminar usuario:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al eliminar usuario", err: err.message });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
    
        try {
            const query = 'SELECT id, email, password FROM public.users WHERE email = $1';
            const result = await client.query(query, [email]);
            const secret = "HolaMundo";
    
            if (result.rows.length === 0) {
                return res.status(401).json({ message: "Usuario no encontrado" });
            }
    
            const user = result.rows[0];
            console.log('User found:', user); // Log para verificar el usuario encontrado
    
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Password comparison result:', isPasswordValid); // Log para verificar la comparación de contraseñas
    
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }
    
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                secret,
                { expiresIn: "1h" }
            );
    
            return res.status(200).json({ token });
        } catch (err) {
            console.error('Error al hacer login:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al hacer login", err: err.message });
        }
    },
    photoProfile: async (req, res) => {
        const photo = req.file.path;
        const id = req.params.id;
        
        const result = await cloudinary.uploader.upload(photo, {
            folder: "profile",
        });

        const photoUrl = result.secure_url;

        const query = 'UPDATE public.users SET photo = $1 WHERE id = $2';
        try {
            await client.query(query, [photoUrl, id]);
            res.json({ message: "Imagen subida correctamente" });
        } catch (error) {
            console.error('Error al subir foto:', error);
            res.status(500).json({ message: "Error al subir foto", error: error.message });
        }
    }
}

export default controller;
