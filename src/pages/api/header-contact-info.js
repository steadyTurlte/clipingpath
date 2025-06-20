import { getData } from '@/utils/dataUtils';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the contact info data from the JSON file
    const contactInfo = getData('contact-info');
    
    // If no data exists, return empty object
    if (!contactInfo || Object.keys(contactInfo).length === 0) {
      return res.status(200).json({});
    }
    
    // Return the contact information
    return res.status(200).json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact information for header:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
