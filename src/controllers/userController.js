import fs from "fs";
import path from "path";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { client } from "../dbconfig.js";
import "dotenv/config";

const saltRounds = 10;

const controller = {
    registerPost: async (req, res) => {
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const ocupacion = req.body.ocupacion;
        const pais = req.body.pais;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const jerarquia = 2;

        console.log(
            nombre,
            apellido,
            password,
            username,
            email,
            ocupacion,
            pais,
            jerarquia
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

        let query = 'INSERT INTO public.users (nombre, apellido, username, email, id_jerarquia, id_ocupacion, id_pais, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

        try {
            await client.query(query, [nombre, apellido, username, email, jerarquia, ocupacion, pais, hashedPassword]);
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
        const ocupacion = req.body.ocupacion;
        const pais = req.body.pais;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const jerarquia = 1;

        console.log(
            nombre,
            apellido,
            password,
            username,
            email,
            ocupacion,
            pais,
            jerarquia
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

        let query = 'INSERT INTO public.users (nombre, apellido, username, email, id_jerarquia, id_ocupacion, id_pais, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

        try {
            await client.query(query, [nombre, apellido, username, email, jerarquia, ocupacion, pais, hashedPassword]);
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
    }
}

export default controller;
