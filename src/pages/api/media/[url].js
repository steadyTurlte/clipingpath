import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  const { url } = req.query;
  
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Decode the URL
    const decodedUrl = decodeURIComponent(url);
    
    // Remove the leading slash if present
    const relativePath = decodedUrl.startsWith('/') ? decodedUrl.substring(1) : decodedUrl;
    
    // Get the absolute path to the file
    const filePath = path.join(process.cwd(), 'public', relativePath);
    
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
