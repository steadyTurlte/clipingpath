import { formidable } from 'formidable';
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
    // Get the folder from the query parameters or use 'uploads' as default
    const folder = req.query.folder || 'uploads';

    // Create the directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'images', folder);

    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch (dirError) {
        console.error(`Error creating directory: ${dirError.message}`);
        return res.status(500).json({ message: `Error creating upload directory: ${dirError.message}` });
      }
    }

    // Configure formidable
    const options = {
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filename: (name, ext, part, form) => {
        const timestamp = Date.now();
        return `${timestamp}-${part.originalFilename.replace(/\s+/g, '-')}`;
      }
    };

    // Parse the form data
    const form = formidable(options);

    // Process the form
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return reject(err);
        }
        resolve([fields, files]);
      });
    });

    // Get the file
    const fileArray = files.file;
    if (!fileArray || fileArray.length === 0) {
      console.error('No file found in the request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = fileArray[0];

    // Check if the file is an image
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      // Delete the file if it's not an allowed type
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ message: 'Only image files are allowed' });
    }

    // Return the path relative to the public directory
    const filename = path.basename(file.filepath);
    const relativePath = `/images/${folder}/${filename}`;

    // Add a timestamp query parameter to force cache busting
    const cacheBustedPath = `${relativePath}?t=${Date.now()}`;

    return res.status(200).json({
      message: 'File uploaded successfully',
      path: relativePath,
      cacheBustedPath: cacheBustedPath,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
}
