import { v2 as cloudinary } from 'cloudinary'
import { ApiError } from '../utils/apiError.js';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadImagetoCloudianry = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'Nexus_App',
            resource_type: 'auto',
        })

        fs.unlinkSync(filePath); // Delete the file after upload

        return { url: result.secure_url };



    } catch (error) {
        fs.unlinkSync(filePath); // Ensure the file is deleted even if upload fails
        throw new ApiError("Error uploading image to Cloudinary: " + error.message);
    }
}

export { uploadImagetoCloudianry };