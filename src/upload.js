import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: "dkalwayyj",
  api_key: "446337119928959",
  api_secret: "Z5a5ZOtU3zUV3xqUq80AA77mA0U"
});

export default cloudinary;