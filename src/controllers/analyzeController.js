import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join, extname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDir = join(__dirname, "../uploads");

const storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, res, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer( { storage: storage } );

const controller = {
    
}

export default controller;