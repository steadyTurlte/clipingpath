import { getData, saveData } from '@/utils/dataUtils';

export default async function handler(req, res) {
  // Get the news data
  const newsData = getData('news') || { 
    news: [],
    categories: [],
    tags: []
  };
  
  // Handle POST request to add a new category
  if (req.method === 'POST') {
    try {
      const { name, slug } = req.body;
      
      // Validate required fields
      if (!name || !slug) {
        return res.status(400).json({ message: 'Name and slug are required' });
      }
      
      // Check if category already exists
      const categoryExists = newsData.categories.some(
        cat => cat.name.toLowerCase() === name.toLowerCase() || cat.slug === slug
      );
      
      if (categoryExists) {
        return res.status(400).json({ message: 'Category already exists' });
      }
      
      // Generate a new ID
      const newId = Math.max(0, ...newsData.categories.map(cat => cat.id)) + 1;
      
      // Add the new category
      newsData.categories.push({
        id: newId,
        name,
        slug
      });
      
      // Save the updated news data
      const success = saveData('news', newsData);
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to save category' });
      }
      
      return res.status(200).json({ 
        message: 'Category added successfully',
        category: { id: newId, name, slug }
      });
    } catch (error) {
      console.error('Error adding category:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Handle DELETE request to remove a category
  if (req.method === 'DELETE') {
    try {
      const { name } = req.body;
      
      // Validate required fields
      if (!name) {
        return res.status(400).json({ message: 'Category name is required' });
      }
      
      // Find the category
      const categoryIndex = newsData.categories.findIndex(
        cat => cat.name === name
      );
      
      if (categoryIndex === -1) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      // Remove the category
      const removedCategory = newsData.categories[categoryIndex];
      newsData.categories.splice(categoryIndex, 1);
      
      // Save the updated news data
      const success = saveData('news', newsData);
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to remove category' });
      }
      
      return res.status(200).json({ 
        message: 'Category removed successfully',
        category: removedCategory
      });
    } catch (error) {
      console.error('Error removing category:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Handle GET request to get all categories
  if (req.method === 'GET') {
    try {
      return res.status(200).json({ categories: newsData.categories });
    } catch (error) {
      console.error('Error getting categories:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
