import { getData, saveData } from '@/utils/dataUtils';

export default function handler(req, res) {
  // Only allow GET and PUT methods
  if (req.method !== 'GET' && req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Handle GET request
  if (req.method === 'GET') {
    try {
      const settings = getData('settings');
      return res.status(200).json(settings || {});
    } catch (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle PUT request
  if (req.method === 'PUT') {
    try {
      const updatedSettings = req.body;
      const success = saveData('settings', updatedSettings);
      
      if (!success) {
        return res.status(500).json({ message: 'Failed to save settings' });
      }
      
      return res.status(200).json({ 
        message: 'Settings updated successfully', 
        data: updatedSettings 
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
