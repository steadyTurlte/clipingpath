import { getData, saveData } from '@/utils/dataUtils';

export default async function handler(req, res) {
  // GET request to retrieve blog settings
  if (req.method === 'GET') {
    try {
      // Get the blog settings from the JSON file
      let blogSettings = await getData('blog-settings');
      
      // If no settings exist, return default settings
      if (!blogSettings) {
        blogSettings = {
          pageTitle: 'Blog',
          pageDescription: 'Latest news and updates from our team',
          postsPerPage: 6,
          showAuthor: true,
          showDate: true,
          showCategory: true,
          showComments: true,
          showRelatedPosts: true,
          relatedPostsCount: 3,
          defaultThumbnail: '/images/blog/default-thumbnail.jpg',
          categories: ['News', 'Tutorials', 'Updates', 'Tips & Tricks'],
          singlePageSettings: {
            showAuthor: true,
            showDate: true,
            showCategory: true,
            showTags: true,
            showShareButtons: true,
            showComments: true,
            showRelatedPosts: true,
            relatedPostsCount: 3,
            showAuthorBio: true
          }
        };
        
        // Save default settings
        await saveData('blog-settings', blogSettings);
      }
      
      return res.status(200).json(blogSettings);
    } catch (error) {
      console.error('Error fetching blog settings:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // PUT request to update blog settings
  if (req.method === 'PUT') {
    try {
      const updatedData = req.body;
      
      // Validate required fields
      if (!updatedData.pageTitle) {
        return res.status(400).json({ message: 'Page title is required' });
      }
      
      // Save the updated settings
      const success = await saveData('blog-settings', updatedData);
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to save blog-settings data' });
      }
      
      return res.status(200).json({ 
        message: 'Blog-settings data updated successfully', 
        data: updatedData 
      });
    } catch (error) {
      console.error('Error updating blog-settings data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
