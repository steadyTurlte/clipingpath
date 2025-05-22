import { getData, saveData } from '@/utils/dataUtils';

export default function handler(req, res) {
  // GET request to retrieve teams data
  if (req.method === 'GET') {
    try {
      const { section } = req.query;
      
      // Get the teams data from the JSON file
      let teamsData = getData('teams');
      
      // If no data exists, return an empty object
      if (!teamsData) {
        return res.status(404).json({ message: 'Teams data not found' });
      }
      
      // If a specific section is requested, return only that section
      if (section && teamsData[section]) {
        return res.status(200).json(teamsData[section]);
      }
      
      // Return the entire teams data
      return res.status(200).json(teamsData);
    } catch (error) {
      console.error('Error fetching teams data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // PUT request to update teams data
  if (req.method === 'PUT') {
    try {
      const { section } = req.query;
      const updatedData = req.body;
      
      // Get the current teams data
      let teamsData = getData('teams') || {};
      
      // If a specific section is being updated
      if (section) {
        teamsData = {
          ...teamsData,
          [section]: updatedData
        };
      } else {
        // Update the entire teams data
        teamsData = updatedData;
      }
      
      // Save the updated data
      const success = saveData('teams', teamsData);
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to save teams data' });
      }
      
      return res.status(200).json({ 
        message: 'Teams data updated successfully', 
        data: section ? teamsData[section] : teamsData 
      });
    } catch (error) {
      console.error('Error updating teams data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
