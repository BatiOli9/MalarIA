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
        const ocupacion = req.body.ocupacion;
        const pais = req.body.pais;

        const jerarquia = 0;

        console.log(
            nombre,
            apellido,
            username,
            email,
            ocupacion,
            pais,
            jerarquia
        );

        let query = 'INSERT INTO public."users" (nombre, apellido, username, email, id_jerarquia, id_ocupacion, id_pais) VALUES ($1, $2, $3, $4, $5, $6, $7)';

        try {
            await client.query(query, [nombre, apellido, username, email, jerarquia, ocupacion, pais]);
            res.json({ message: "Usuario registrado correctamente" });
        } catch (error) {
            res.json({ message: "Error al registrar usuario" });
        }
    },
    register: (req, res) => {
        res.render("register");
    }
}

export default controller; 