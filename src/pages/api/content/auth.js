import { getData, saveData } from '@/utils/dataUtils';

export default function handler(req, res) {
  // GET request to retrieve auth data
  if (req.method === 'GET') {
    try {
      const { section } = req.query;
      
      // Get the auth data from the JSON file
      let authData = getData('auth');
      
      // If no data exists, return an empty object
      if (!authData) {
        return res.status(404).json({ message: 'Auth data not found' });
      }
      
      // If a specific section is requested, return only that section
      if (section && authData[section]) {
        return res.status(200).json(authData[section]);
      }
      
      // Return the entire auth data
      return res.status(200).json(authData);
    } catch (error) {
      console.error('Error fetching auth data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // PUT request to update auth data
  if (req.method === 'PUT') {
    try {
      const { section } = req.query;
      const updatedData = req.body;
      
      // Get the current auth data
      let authData = getData('auth') || {};
      
      // If a specific section is being updated
      if (section) {
        authData = {
          ...authData,
          [section]: updatedData
        };
      } else {
        // Update the entire auth data
        authData = updatedData;
      }
      
      // Save the updated data
      const success = saveData('auth', authData);
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to save auth data' });
      }
      
      return res.status(200).json({ 
        message: 'Auth data updated successfully', 
        data: section ? authData[section] : authData 
      });
    } catch (error) {
      console.error('Error updating auth data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
