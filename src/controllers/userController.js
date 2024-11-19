import fs, { appendFile } from "fs";
import path from "path";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { client } from "../dbconfig.js";
import "dotenv/config";
import cloudinary from '../upload.js';
import nodemailer from "nodemailer";

const saltRounds = 10;

const sendEmail = async (to, subject, text, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
    };

    await transporter.sendMail(mailOptions);
};

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
        let query = "SELECT id, nombre, apellido, username, email FROM public.users WHERE id = $1";
    
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
            console.log(user.id);
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
    
            return res.status(200).json({ token, id: user.id });
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
    },
    editEmail: async (req, res) => {
        const id = req.params.id;
        const email = req.body.email;
        console.log(email)

        const query = 'UPDATE public.users SET email = $1 WHERE id = $2'
        try {
            const resulthOLA = await client.query(query, [email, id]);
            res.json({message: "Editado Correctamente"});
        } catch (err) {
            console.error("Error al modificar mail");
        }
    },
    editNombre: async (req, res) => {
        const id = req.params.id;
        const nombre = req.body.nombre;

        const query = 'UPDATE public.users SET nombre = $1 WHERE id = $2'
        try {
            await client.query(query, [nombre, id]);
            res.json({message: "Editado Correctamente"});
        } catch (err) {
            console.error("Error al modificar nombre");
        }
    },
    editApellido: async (req, res) => {
        const id = req.params.id;
        const apellido = req.body.apellido;

        const query = 'UPDATE public.users SET apellido = $1 WHERE id = $2'
        try {
            await client.query(query, [apellido, id]);
            res.json({message: "Editado Correctamente"});
        } catch (err) {
            console.error("Error al modificar apellido");
        }
    },
    editUsername: async (req, res) => {
        const id = req.params.id;
        const username = req.body.username;

        const query = 'UPDATE public.users SET username = $1 WHERE id = $2'
        try {
            await client.query(query, [username, id]);
            res.json({message: "Editado Correctamente"});
        } catch (err) {
            console.error("Error al modificar username");
        }
    },
    sendPasswordResetEmail: async (req, res) => {
        const email = req.body.email;

        try {
            const query = 'SELECT id, email FROM public.users WHERE email = $1';
            const result = await client.query(query, [email]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Email no encontrado" });
            }

            const user = result.rows[0];
            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
            const resetLink = `https://tuweb.com/reset-password?token=${token}`;

            // Configuración del transporte para enviar el correo electrónico
            const transporter = nodemailer.createTransport({
                service: 'gmail', // o cualquier servicio que uses
                auth: {
                    user: process.env.EMAIL_USER, // email del remitente
                    pass: process.env.EMAIL_PASS  // contraseña del remitente
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Recuperación de contraseña',
                text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
                html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`
            };

            await transporter.sendMail(mailOptions);

            res.json({ message: "Correo de recuperación enviado" });
        } catch (error) {
            console.error('Error al enviar el correo de recuperación:', error);
            res.status(500).json({ message: "Error al enviar el correo de recuperación", error: error.message });
        }
    },
    resetPassword: async (req, res) => {
        const { token, newPassword } = req.body;

        try {
            const decoded = jwt.verify(token, secret);
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            const query = 'UPDATE public.users SET password = $1 WHERE id = $2';
            await client.query(query, [hashedPassword, decoded.userId]);

            res.json({ message: "Contraseña restablecida correctamente" });
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            res.status(500).json({ message: "Error al restablecer la contraseña", error: error.message });
        }
    },
    sendPasswordResetEmail: async (req, res) => {
        const email = req.body.email;
        const secret = "HolaMundo";

        try {
            const query = 'SELECT id, email FROM public.users WHERE email = $1';
            const result = await client.query(query, [email]);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "Email no encontrado" });
            }

            const user = result.rows[0];
            const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
            const resetLink = `https://tuweb.com/reset-password?token=${token}`;
            const youtubeLink = "https://www.youtube.com/";

            await sendEmail(
                email,
                'Recuperación de contraseña',
                `Haz clic en el siguiente enlace para restablecer tu contraseña: ${youtubeLink}`,
                `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${youtubeLink}">${youtubeLink}</a>`
            );

            console.log(token);
            res.json({ message: "Correo de recuperación enviado" });
        } catch (error) {
            console.error('Error al enviar el correo de recuperación:', error);
            res.status(500).json({ message: "Error al enviar el correo de recuperación", error: error.message });
        }
    },
    resetPassword: async (req, res) => {
        const { token, newPassword } = req.body;
        const secret = "HolaMundo";

        try {
            const decoded = jwt.verify(token, secret);
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            const query = 'UPDATE public.users SET password = $1 WHERE id = $2';
            await client.query(query, [hashedPassword, decoded.userId]);

            const userQuery = 'SELECT email FROM public.users WHERE id = $1';
            const userResult = await client.query(userQuery, [decoded.userId]);
            const userEmail = userResult.rows[0].email;

            await sendEmail(
                userEmail,
                'Confirmación de cambio de contraseña',
                'Tu contraseña ha sido cambiada exitosamente.',
                '<p>Tu contraseña ha sido cambiada exitosamente.</p>'
            );

            res.json({ message: "Contraseña restablecida correctamente" });
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            res.status(500).json({ message: "Error al restablecer la contraseña", error: error.message });
        }
    }
}

export default controller;
