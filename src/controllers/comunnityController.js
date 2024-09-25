import fs from "fs";
import path from "path";
import { client } from "../dbconfig.js";
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');

const controller = {

}

export default controller;