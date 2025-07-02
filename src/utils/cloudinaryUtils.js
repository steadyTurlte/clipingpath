import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {Buffer|string} fileBuffer - The file buffer or base64 string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Cloudinary upload result
 */
/**
 * Upload image to Cloudinary with optional deletion of old image
 * @param {Buffer|string} fileBuffer - The file buffer or base64 string
 * @param {Object} options - Upload options
 * @param {string} [options.oldPublicId] - Public ID of the old image to delete
 * @param {string} [options.folder="photodit"] - Folder to upload the image to
 * @returns {Promise<Object>} Cloudinary upload result
 */
export async function uploadToCloudinary(fileBuffer, options = {}) {
  try {
    const { oldPublicId, ...uploadOptions } = options;
    
    // If there's an old public ID, delete that image first
    if (oldPublicId) {
      try {
        await deleteFromCloudinary(oldPublicId);
      } catch (error) {
        console.warn('Failed to delete old image:', error);
        // Continue with upload even if deletion fails
      }
    }

    const defaultOptions = {
      resource_type: "image",
      folder: uploadOptions.folder || "photodit",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      ...uploadOptions,
    };

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(defaultOptions, (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(fileBuffer);
    });
  } catch (error) {
    console.error("Error in uploadToCloudinary:", error);
    throw error;
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public ID of the image to delete
 * @returns {Promise<Object>} Cloudinary delete result
 */
export async function deleteFromCloudinary(publicId) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}

/**
 * Extract public ID from Cloudinary URL
 * @param {string} cloudinaryUrl - The Cloudinary URL
 * @returns {string} The public ID
 */
export function extractPublicId(cloudinaryUrl) {
  try {
    // Extract public ID from Cloudinary URL
    // Example: https://res.cloudinary.com/dr1wrjavn/image/upload/v1234567890/photodit/image.jpg
    const urlParts = cloudinaryUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return null;

    // Get everything after 'upload/v{version}/'
    const pathAfterUpload = urlParts.slice(uploadIndex + 2).join("/");

    // Remove file extension
    const publicId = pathAfterUpload.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
}

/**
 * Generate optimized image URL with transformations
 * @param {string} publicId - The public ID of the image
 * @param {Object} transformations - Transformation options
 * @returns {string} Optimized image URL
 */
export function generateOptimizedUrl(publicId, transformations = {}) {
  try {
    const defaultTransformations = {
      quality: "auto",
      fetch_format: "auto",
      ...transformations,
    };

    return cloudinary.url(publicId, defaultTransformations);
  } catch (error) {
    console.error("Error generating optimized URL:", error);
    return null;
  }
}

/**
 * Upload multiple images to Cloudinary
 * @param {Array} files - Array of file buffers
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} Array of upload results
 */
export async function uploadMultipleToCloudinary(files, options = {}) {
  try {
    const uploadPromises = files.map((file, index) => {
      const fileOptions = {
        ...options,
        public_id: options.public_id
          ? `${options.public_id}_${index}`
          : undefined,
      };
      return uploadToCloudinary(file, fileOptions);
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple files to Cloudinary:", error);
    throw error;
  }
}

export default cloudinary;
