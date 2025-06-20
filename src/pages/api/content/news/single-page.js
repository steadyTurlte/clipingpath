import { getData, saveData } from '@/utils/dataUtils';

export default function handler(req, res) {
  // GET request to retrieve blog single page settings
  if (req.method === 'GET') {
    try {
      // Get the blog single page settings from the JSON file
      let singlePageSettings = getData('blog-single-page');
      
      // If no settings exist, return default settings
      if (!singlePageSettings) {
        singlePageSettings = {
          banner: {
            title: 'Blog Details',
            breadcrumbs: [
              { text: 'Home', link: '/' },
              { text: 'Blog', link: '/blog' },
              { text: 'Blog Details', link: '' }
            ]
          },
          layout: {
            showSidebar: true,
            sidebarPosition: 'right',
            contentWidth: 'wide'
          },
          display: {
            showAuthor: true,
            showDate: true,
            showCategory: true,
            showTags: true,
            showShareButtons: true,
            showComments: true,
            showRelatedPosts: true
          },
          relatedPosts: {
            title: 'Related Posts',
            count: 3,
            criteria: 'category' // category, tag, author
          },
          comments: {
            title: 'Comments',
            allowComments: true,
            requireApproval: true,
            requireName: true,
            requireEmail: true,
            notificationEmail: ''
          },
          author: {
            showBio: true,
            showSocialLinks: true,
            showOtherPosts: false
          },
          socialShare: {
            platforms: ['facebook', 'twitter', 'linkedin', 'pinterest']
          },
          seo: {
            metaTitleFormat: '{post_title} | {site_name}',
            metaDescriptionFormat: '{post_excerpt}',
            usePostImageAsSocialImage: true
          }
        };
        
        // Save default settings
        saveData('blog-single-page', singlePageSettings);
      }
      
      return res.status(200).json(singlePageSettings);
    } catch (error) {
      console.error('Error fetching blog single page settings:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // PUT request to update blog single page settings
  if (req.method === 'PUT') {
    try {
      const updatedSettings = req.body;
      
      // Validate required fields
      if (!updatedSettings.banner || !updatedSettings.layout || !updatedSettings.display) {
        return res.status(400).json({ message: 'Missing required settings' });
      }
      
      // Save the updated settings
      const success = saveData('blog-single-page', updatedSettings);
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to save blog single page settings' });
      }
      
      return res.status(200).json({ 
        message: 'Blog single page settings updated successfully', 
        data: updatedSettings 
      });
    } catch (error) {
      console.error('Error updating blog single page settings:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
