import fs from "fs";
import path from "path";

const controller = {
    index: (req, res) => {
        res.send("INDEX Home");
    }
}

export default controller;