import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Uploads a Buffer to Cloudinary.
 * @param {Buffer} buffer The file buffer to upload.
 * @param {string} filename The filename to use as public_id base.
 * @returns {Promise<object>} The Cloudinary upload result.
 */
export function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    // Generate a clean public ID without extension
    const cleanPublicId = filename ? filename.replace(/\.[^/.]+$/, "") : `file_${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "sync-uploads",
        public_id: cleanPublicId,
        resource_type: "auto", // Automatically determine file type (image, video, raw)
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
}

export default cloudinary;
