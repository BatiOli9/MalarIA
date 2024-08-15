import fs from "fs";
import path from "path";
import { client } from "../dbconfig.js";

const controller = {
    registerPost: async (req, res) => {
        console.log(req.body);

        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const ocupacion = req.body.ocupacion;
        const pais = req.body.pais;

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

        let query = 'INSERT INTO public.users (nombre, apellido, username, email, id_jerarquia, id_ocupacion, id_pais, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';

        try {
            await client.query(query, [nombre, apellido, username, email, jerarquia, ocupacion, pais, password]);
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
        const { nombre, apellido, username, email, id_pais, id_ocupacion, password } = req.body;
    
        // Verificar que todos los campos requeridos están presentes
        if (!nombre || !apellido || !username || !email || !id_pais || !id_ocupacion || !password) {
            return res.status(400).json({ message: "Todos los campos son requeridos" });
        }
    
        console.log(
            nombre,
            apellido,
            email,
            username,
            password,
            id_pais,
            id_ocupacion
        );
    
        let query = 'UPDATE public.users SET nombre = $1, apellido = $2, username = $3, password = $4, email = $5, id_pais = $6, id_ocupacion = $7 WHERE id = $8';
    
        try {
            await client.query(query, [nombre, apellido, username, password, email, id_pais, id_ocupacion, id]);
            res.send("Usuario Editado Correctamente");
        } catch (err) {
            console.error('Error al editar usuario:', err); // Imprime el error en la consola
            res.status(500).json({ message: "Error al editar usuario", err: err.message });
        }
    }
}

export default controller;
