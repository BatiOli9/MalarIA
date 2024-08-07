import fs from "fs";
import path from "path";

const controller = {
    index: (req, res) => {
        res.render("index");
    }
}

export default controller;