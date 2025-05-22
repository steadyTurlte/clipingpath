import { getData, saveData } from '@/utils/dataUtils';

export default async function handler(req, res) {
  const { id } = req.query;
  
  // Convert id to number if it's a string
  const newsId = typeof id === 'string' ? parseInt(id, 10) : id;
  
  // Get existing news data
  const data = getData('news') || { news: [] };
  
  // Find the news article
  const newsIndex = data.news.findIndex(item => item.id === newsId);
  
  if (newsIndex === -1) {
    return res.status(404).json({ message: 'News not found' });
  }
  
  // GET request to retrieve the news article
  if (req.method === 'GET') {
    return res.status(200).json(data.news[newsIndex]);
  }
  
  // PUT request to update the news article
  if (req.method === 'PUT') {
    const updatedNews = req.body;
    
    // Validate required fields
    if (!updatedNews.title || !updatedNews.slug || !updatedNews.content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Update the news article
    data.news[newsIndex] = {
      ...data.news[newsIndex],
      ...updatedNews
    };
    
    // Save the updated data
    const success = saveData('news', data);
    
    if (!success) {
      return res.status(500).json({ message: 'Failed to update news data' });
    }
    
    return res.status(200).json({ message: 'News updated successfully', news: data.news[newsIndex] });
  }
  
  // DELETE request to delete the news article
  if (req.method === 'DELETE') {
    // Remove the news article
    data.news.splice(newsIndex, 1);
    
    // Save the updated data
    const success = saveData('news', data);
    
    if (!success) {
      return res.status(500).json({ message: 'Failed to delete news data' });
    }
    
    return res.status(200).json({ message: 'News deleted successfully' });
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
