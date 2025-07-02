import { IncomingForm } from 'formidable';
import { uploadToCloudinary } from '@/utils/cloudinaryUtils';
import fs from 'fs';
import path from 'path';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const formData = await new Promise((resolve, reject) => {
      const form = new IncomingForm({
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      });
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { files } = formData;
    const fileArray = files.file;
    if (!fileArray) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: 'Only image files are allowed' });
    }
    const fileBuffer = await fs.promises.readFile(file.filepath);
    const cloudinaryResult = await uploadToCloudinary(fileBuffer, {
      folder: 'photodit',
      public_id: `${Date.now()}-${file.originalFilename.replace(/\s+/g, '-')}`,
      resource_type: 'image',
    });
    return res.status(200).json({
      message: 'File uploaded successfully',
      url: cloudinaryResult.secure_url,
      filePath: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      size: cloudinaryResult.bytes,
      format: cloudinaryResult.format,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
}
