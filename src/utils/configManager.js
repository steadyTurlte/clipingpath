// src/utils/configManager.js
// DatabaseConfigManager for managing JSON configs in PostgreSQL with caching

import { Pool } from 'pg';

class DatabaseConfigManager {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DB_URL,
      ssl: { rejectUnauthorized: false },
    });
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async getConfig(configKey) {
    // Check cache first
    const cached = this.cache.get(configKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    try {
      const result = await this.pool.query(
        "SELECT config_data FROM json_configs WHERE config_key = $1",
        [configKey]
      );
      if (result.rows.length === 0) {
        throw new Error(`Config not found: ${configKey}`);
      }
      const configData = result.rows[0].config_data;
      // Cache the result
      this.cache.set(configKey, {
        data: configData,
        timestamp: Date.now(),
      });
      return configData;
    } catch (error) {
      console.error(`Error loading config ${configKey}:`, error);
      throw error;
    }
  }

  async saveConfig(configKey, configData) {
    try {
      await this.pool.query(
        "INSERT INTO json_configs (config_key, config_data) VALUES ($1, $2) ON CONFLICT (config_key) DO UPDATE SET config_data = $2, last_updated = CURRENT_TIMESTAMP",
        [configKey, configData]
      );
      // Update cache
      this.cache.set(configKey, {
        data: configData,
        timestamp: Date.now(),
      });
      return true;
    } catch (error) {
      console.error(`Error saving config ${configKey}:`, error);
      throw error;
    }
  }

  async getAllConfigs() {
    try {
      const result = await this.pool.query(
        "SELECT config_key, config_data FROM json_configs"
      );
      const configs = {};
      result.rows.forEach((row) => {
        configs[row.config_key] = row.config_data;
      });
      return configs;
    } catch (error) {
      console.error("Error loading all configs:", error);
      throw error;
    }
  }

  clearCache() {
    this.cache.clear();
  }

  // Media files management with Cloudinary
  async saveMediaFile(fileData) {
    try {
      const result = await this.pool.query(
        `INSERT INTO media_files (filename, original_name, cloudinary_url, cloudinary_public_id, file_size, mime_type, folder, width, height)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        [
          fileData.filename,
          fileData.originalName,
          fileData.cloudinaryUrl,
          fileData.cloudinaryPublicId,
          fileData.fileSize,
          fileData.mimeType,
          fileData.folder,
          fileData.width || null,
          fileData.height || null,
        ]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error("Error saving media file:", error);
      throw error;
    }
  }

  async getMediaFiles(folder = null) {
    try {
      let query = "SELECT * FROM media_files";
      let params = [];

      if (folder) {
        query += " WHERE folder = $1";
        params.push(folder);
      }

      query += " ORDER BY created_at DESC";

      const result = await this.pool.query(query, params);
      return result.rows.map((row) => ({
        id: row.id,
        name: row.filename,
        originalName: row.original_name,
        url: row.cloudinary_url,
        publicId: row.cloudinary_public_id,
        size: row.file_size,
        mimeType: row.mime_type,
        folder: row.folder,
        width: row.width,
        height: row.height,
        createdAt: row.created_at.toISOString(),
      }));
    } catch (error) {
      console.error("Error getting media files:", error);
      throw error;
    }
  }

  async deleteMediaFile(publicId) {
    try {
      const result = await this.pool.query(
        "DELETE FROM media_files WHERE cloudinary_public_id = $1 RETURNING *",
        [publicId]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting media file:", error);
      throw error;
    }
  }

  // Quote requests management
  async saveQuoteRequest(quoteData) {
    try {
      const result = await this.pool.query(
        `INSERT INTO quote_requests (name, email, service, file_options, message, uploaded_file, cloud_link)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          quoteData.name,
          quoteData.email,
          quoteData.service,
          quoteData.fileOptions,
          quoteData.message,
          quoteData.uploadedFile,
          quoteData.cloudLink,
        ]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error("Error saving quote request:", error);
      throw error;
    }
  }

  async getQuoteRequests(status = null) {
    try {
      let query = "SELECT * FROM quote_requests";
      let params = [];

      if (status) {
        query += " WHERE status = $1";
        params.push(status);
      }

      query += " ORDER BY created_at DESC";

      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error("Error getting quote requests:", error);
      throw error;
    }
  }

  async updateQuoteStatus(id, status) {
    try {
      const result = await this.pool.query(
        "UPDATE quote_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [status, id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating quote status:", error);
      throw error;
    }
  }
}

const configManager = new DatabaseConfigManager();

export default configManager;
