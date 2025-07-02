import { deleteFromCloudinary } from '@/utils/cloudinaryUtils';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { publicId } = req.query;
    if (!publicId) {
      return res.status(400).json({ message: 'Cloudinary publicId is required' });
    }
    const result = await deleteFromCloudinary(publicId);
    if (result.result === 'ok' || result.result === 'not found') {
      return res.status(200).json({ message: 'Image deleted from Cloudinary', success: true });
    } else {
      return res.status(500).json({ message: 'Failed to delete image from Cloudinary', success: false });
    }
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return res.status(500).json({ message: 'Error deleting image', success: false });
  }
}
