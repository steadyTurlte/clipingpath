import { getData, saveData } from '@/utils/dataUtils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const newsData = req.body;
    
    // Validate required fields
    if (!newsData.title || !newsData.slug || !newsData.content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Get existing news data
    const data = getData('news') || { news: [] };
    
    // Add ID if not provided
    if (!newsData.id) {
      newsData.id = Date.now();
    }
    
    // Add the new news article
    data.news.unshift(newsData);
    
    // Save the updated data
    const success = saveData('news', data);
    
    if (!success) {
      return res.status(500).json({ message: 'Failed to save news data' });
    }
    
    return res.status(201).json({ message: 'News created successfully', news: newsData });
  } catch (error) {
    console.error('Error creating news:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
