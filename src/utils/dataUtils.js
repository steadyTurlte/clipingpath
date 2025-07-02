import configManager from "./configManager";
import { uploadToCloudinary } from "./cloudinaryUtils";
import { query } from "./db";

// Replace all file system operations with configManager (PostgreSQL)

/**
 * Read data from a JSON config in the database
 * @param {string} key - The config key
 * @returns {Promise<Object>} The parsed JSON data
 */
export async function getData(key) {
  try {
    const res = await query(
      `SELECT config_data FROM json_configs WHERE config_key = $1 LIMIT 1`,
      [key]
    );
    if (res.rows.length > 0) {
      return res.rows[0].config_data;
    }
    return null;
  } catch (error) {
    console.error(`Error getting data for ${key}:`, error);
    return null;
  }
}

/**
 * Write data to a JSON config in the database
 * @param {string} key - The config key
 * @param {Object} data - The data to write
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function saveData(key, data) {
  console.log(`Saving data for key: ${key}`, { data });
  
  try {
    // Ensure data is a proper object
    if (!data || typeof data !== 'object') {
      throw new Error(`Invalid data type: ${typeof data}. Expected object.`);
    }
    
    // Stringify the data for storage
    const jsonData = JSON.stringify(data);
    
    console.log('Executing database query...');
    const result = await query(
      `INSERT INTO json_configs (config_key, config_data, last_updated)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (config_key) 
       DO UPDATE SET 
         config_data = EXCLUDED.config_data, 
         last_updated = CURRENT_TIMESTAMP
       RETURNING config_key`,
      [key, data]
    );
    
    if (!result || !result.rows || result.rows.length === 0) {
      throw new Error('No rows returned from database after save');
    }
    
    console.log(`Successfully saved data for key: ${key}`);
    return true;
  } catch (error) {
    console.error(`Error saving data for ${key}:`, {
      message: error.message,
      stack: error.stack,
      data: JSON.stringify(data, null, 2).substring(0, 500) // Log first 500 chars of data
    });
    return false;
  }
}

/**
 * Update a specific section in a config
 * @param {string} filename - The config key
 * @param {string} section - The section to update
 * @param {Object} newData - The new data for the section
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function updateSection(filename, section, newData) {
  try {
    const data = await getData(filename);
    if (!data) return false;
    data[section] = newData;
    return await saveData(filename, data);
  } catch (error) {
    console.error(`Error updating section ${section} in ${filename}:`, error);
    return false;
  }
}

/**
 * Get a specific section from a config
 * @param {string} filename - The config key
 * @param {string} section - The section to get
 * @returns {Promise<Object|null>} The section data or null if not found
 */
export async function getSection(filename, section) {
  try {
    const data = await getData(filename);
    if (!data) return null;
    return data[section] || null;
  } catch (error) {
    console.error(`Error getting section ${section} from ${filename}:`, error);
    return null;
  }
}

/**
 * Save media file metadata to database
 * @param {Object} fileData - The file metadata
 * @returns {Promise<number|null>} The file ID or null if failed
 */
export async function saveMediaFile(fileData) {
  try {
    return await configManager.saveMediaFile(fileData);
  } catch (error) {
    console.error("Error saving media file:", error);
    return null;
  }
}

/**
 * Get media files from database
 * @param {string} folder - Optional folder filter
 * @returns {Promise<Array>} Array of media files
 */
export async function getMediaFiles(folder = null) {
  try {
    return await configManager.getMediaFiles(folder);
  } catch (error) {
    console.error("Error getting media files:", error);
    return [];
  }
}

/**
 * Delete media file from database
 * @param {string} publicId - The Cloudinary public ID to delete
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function deleteMediaFile(publicId) {
  try {
    await configManager.deleteMediaFile(publicId);
    return true;
  } catch (error) {
    console.error("Error deleting media file:", error);
    return false;
  }
}

/**
 * Save quote request to database
 * @param {Object} quoteData - The quote request data
 * @returns {Promise<number|null>} The quote ID or null if failed
 */
export async function saveQuoteRequest(quoteData) {
  try {
    return await configManager.saveQuoteRequest(quoteData);
  } catch (error) {
    console.error("Error saving quote request:", error);
    return null;
  }
}

/**
 * Get quote requests from database
 * @param {string} status - Optional status filter
 * @returns {Promise<Array>} Array of quote requests
 */
export async function getQuoteRequests(status = null) {
  try {
    return await configManager.getQuoteRequests(status);
  } catch (error) {
    console.error("Error getting quote requests:", error);
    return [];
  }
}

/**
 * Uploads an image to Cloudinary and saves its metadata to the database.
 * @param {Buffer|string} fileBuffer - The image file buffer or base64 string.
 * @param {Object} fileInfo - { originalName, mimeType, size, folder }
 * @returns {Promise<number|null>} The media file ID or null if failed.
 */
export async function uploadImageAndSaveMetadata(fileBuffer, fileInfo) {
  try {
    const uploadResult = await uploadToCloudinary(fileBuffer, { folder: fileInfo.folder });
    const fileData = {
      filename: uploadResult.public_id,
      originalName: fileInfo.originalName,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      fileSize: fileInfo.size,
      mimeType: fileInfo.mimeType,
      folder: fileInfo.folder,
      width: uploadResult.width,
      height: uploadResult.height,
    };
    return await configManager.saveMediaFile(fileData);
  } catch (error) {
    console.error("Error uploading image and saving metadata:", error);
    return null;
  }
}
