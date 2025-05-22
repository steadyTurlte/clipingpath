import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { path: imagePath } = req.query;
    
    if (!imagePath) {
      return res.status(400).json({ message: 'Image path is required' });
    }
    
    // Make sure the path is within the public directory
    if (!imagePath.startsWith('/images/')) {
      return res.status(400).json({ message: 'Invalid image path' });
    }
    
    // Get the absolute path to the image
    const absolutePath = path.join(process.cwd(), 'public', imagePath);
    
    // Check if the file exists
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Delete the file
    fs.unlinkSync(absolutePath);
    
    return res.status(200).json({ 
      message: 'Image deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json({ message: 'Error deleting image', success: false });
  }
}
