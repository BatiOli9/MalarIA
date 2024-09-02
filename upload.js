import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: "dkalwayyj",
    api_key: "171947958839266",
    api_secret: "eKwOVsZSZ8d3BWPCn3MYqMoHNKQ",
});

const image = "./uploads/cdj.png";

(async function run() {
    const result = await cloudinary.uploader.upload(image);
    console.log(result);
})();