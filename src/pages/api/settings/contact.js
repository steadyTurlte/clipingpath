import { getData, saveData } from '@/utils/dataUtils';

// Default contact information
const DEFAULT_CONTACT_INFO = {
  address: '123 Business Avenue, New York, NY 10001',
  phone: '+1 (555) 123-4567',
  email: 'info@photodit.com',
  googleMapUrl: 'https://www.google.com/maps/place/New+York,+NY,+USA/',
  socialLinks: {
    facebook: 'https://facebook.com/photodit',
    twitter: 'https://twitter.com/photodit',
    instagram: 'https://instagram.com/photodit',
    linkedin: 'https://linkedin.com/company/photodit'
  }
};

export default async function handler(req, res) {
  // GET request to retrieve contact information
  if (req.method === 'GET') {
    try {
      // Get the settings data from the JSON file
      let settings = getData('settings') || {};
      
      // If contact info doesn't exist, use the default data
      if (!settings.contact || Object.keys(settings.contact).length === 0) {
        // Update settings with default contact info
        settings = {
          ...settings,
          contact: DEFAULT_CONTACT_INFO
        };
        
        // Save the updated settings
        saveData('settings', settings);
      }
      
      // Return the contact information
      return res.status(200).json(settings.contact || DEFAULT_CONTACT_INFO);
    } catch (error) {
      console.error('Error fetching contact information:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // PUT request to update contact information
  if (req.method === 'PUT') {
    try {
      const updatedContactInfo = req.body;
      
      // Get the current settings data
      let settings = getData('settings') || {};
      
      // Update the contact information
      settings = {
        ...settings,
        contact: {
          ...DEFAULT_CONTACT_INFO,
          ...updatedContactInfo
        }
      };
      
      // Save the updated settings
      const success = saveData('settings', settings);
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to save contact information' });
      }
      
      return res.status(200).json({ 
        message: 'Contact information updated successfully', 
        data: settings.contact 
      });
    } catch (error) {
      console.error('Error updating contact information:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
