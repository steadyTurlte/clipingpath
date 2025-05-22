import { IncomingForm } from 'formidable';
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
    // Create a promise to handle the form parsing
    const formData = await new Promise((resolve, reject) => {
      const form = new IncomingForm({
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB
      });

      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    const { fields, files } = formData;

    // Get the directory from the form data or use 'uploads' as default
    // Handle the case where fields.directory is an array
    const directory = Array.isArray(fields.directory)
      ? fields.directory[0]
      : (fields.directory || 'uploads');

    // Create the directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', directory);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get the file - handle both array and single file cases
    const fileArray = files.file;
    if (!fileArray) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Handle both array and single file cases
    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    // Check if the file is an image
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      // Delete the file if it's not an allowed type
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ message: 'Only image files are allowed' });
    }

    // Move the file to the correct directory
    const timestamp = Date.now();
    const originalFilename = file.originalFilename.replace(/\s+/g, '-');
    const newFilename = `${timestamp}-${originalFilename}`;
    const newFilepath = path.join(uploadDir, newFilename);

    try {
      // Create a read stream from the uploaded file
      const readStream = fs.createReadStream(file.filepath);
      // Create a write stream to the new location
      const writeStream = fs.createWriteStream(newFilepath);

      // Pipe the read stream to the write stream
      readStream.pipe(writeStream);

      // Wait for the write stream to finish
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', (err) => {
          console.error('Error writing file:', err);
          reject(err);
        });
      });

      // Delete the temporary file
      fs.unlinkSync(file.filepath);

      // Return the path relative to the public directory
      const relativePath = `/${directory}/${newFilename}`;

      return res.status(200).json({
        message: 'File uploaded successfully',
        filePath: relativePath
      });
    } catch (fileError) {
      console.error('Error processing file:', fileError);
      // Try to clean up any temporary files
      if (fs.existsSync(file.filepath)) {
        fs.unlinkSync(file.filepath);
      }
      throw fileError;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
}
