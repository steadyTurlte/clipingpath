import { query } from '@/utils/db';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // List images from the media_files table (which stores Cloudinary URLs)
    const result = await query('SELECT * FROM media_files ORDER BY created_at DESC');
    const files = result.rows.map(row => ({
      name: row.filename,
      url: row.cloudinary_url,
      publicId: row.cloudinary_public_id,
      size: row.file_size,
      mimeType: row.mime_type,
      folder: row.folder,
      width: row.width,
      height: row.height,
      createdAt: row.created_at,
    }));
    return res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching media files:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
