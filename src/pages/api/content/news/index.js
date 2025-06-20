import { getData, saveData } from '@/utils/dataUtils';

export default async function handler(req, res) {
  // GET request to retrieve all news
  if (req.method === 'GET') {
    try {
      const data = getData('news') || { news: [] };
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching news data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
