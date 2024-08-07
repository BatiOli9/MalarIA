import express from "express"
import path from "path"

const app = express();
// Definir puerto
const PORT = 8000;

// Configurar carpeta publica
app.use(express.static("./public"));
app.set("view engine", "ejs");

// Capturar el body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

import indexRouter from "./src/routers/indexRouter.js";

// Configuramos las rutas index
app.use("/", indexRouter);

// Configurar ERR 404
app.use((req, res, next) => {
    res.status(404).send('Lo siento, no se encontró la página solicitada. ERROR 404');
});

// Correr servidor local en puerto definido
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});