import fs from "fs";
import path from "path";
import cors from "cors"

app.use(cors());

const controller = {
    index: (req, res) => {
        res.send("INDEX Home");
    }
}

export default controller;