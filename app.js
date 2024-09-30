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
import userRouter from "./src/routers/userRouter.js";
import analyzeRouter from "./src/routers/analyzeRouter.js";
import patientsRouter from "./src/routers/patientsRouter.js";
import comunnityRouter from "./src/routers/comunnityRouter.js";

// Configuramos las rutas index
app.use("/", indexRouter);

// Configuramos las rutas user
app.use("/user", userRouter);

// Configuramos las rutas de analisis
app.use("/analyze", analyzeRouter);

// Configuramos las rutas de pacientes
app.use("/patients", patientsRouter);

// Configuramos las rutas de la comunidad
app.use("/community", comunnityRouter);

// Configurar ERR 404
app.use((req, res, next) => {
    res.status(404).send('Lo siento, no se encontró la página solicitada. ERROR 404');
});

// Correr servidor local en puerto definido
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});