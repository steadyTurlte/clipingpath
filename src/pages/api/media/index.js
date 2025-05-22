import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const publicDir = path.join(process.cwd(), 'public');
    const files = [];

    // Function to scan directory recursively
    const scanDirectory = (dir, baseDir = '') => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const relativePath = path.join(baseDir, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          // Skip node_modules and .next directories
          if (item !== 'node_modules' && item !== '.next') {
            scanDirectory(itemPath, relativePath);
          }
        } else if (stats.isFile()) {
          // Only include image files
          const ext = path.extname(item).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
            files.push({
              name: item,
              url: '/' + relativePath.replace(/\\/g, '/'),
              size: stats.size,
              createdAt: stats.birthtime.toISOString()
            });
          }
        }
      }
    };

    // Scan the uploads directory if it exists
    const uploadsDir = path.join(publicDir, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      scanDirectory(uploadsDir, 'uploads');
    }

    // Scan the images directory if it exists
    const imagesDir = path.join(publicDir, 'images');
    if (fs.existsSync(imagesDir)) {
      scanDirectory(imagesDir, 'images');
    }

    // Sort files by creation date (newest first)
    files.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({ files });
  } catch (error) {
    console.error('Error fetching media files:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
