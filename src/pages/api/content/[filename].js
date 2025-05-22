import { getData, saveData, getSection, updateSection } from '@/utils/dataUtils';

export default function handler(req, res) {
  const { filename } = req.query;
  
  // GET request to retrieve data
  if (req.method === 'GET') {
    const section = req.query.section;
    
    if (section) {
      // Get a specific section
      const data = getSection(filename, section);
      
      if (data === null) {
        return res.status(404).json({ message: `Section ${section} not found in ${filename}.json` });
      }
      
      return res.status(200).json(data);
    } else {
      // Get the entire file
      const data = getData(filename);
      
      if (data === null) {
        return res.status(404).json({ message: `File ${filename}.json not found` });
      }
      
      return res.status(200).json(data);
    }
  }
  
  // PUT request to update data
  if (req.method === 'PUT') {
    const section = req.query.section;
    const data = req.body;
    
    if (section) {
      // Update a specific section
      const success = updateSection(filename, section, data);
      
      if (!success) {
        return res.status(500).json({ message: `Failed to update section ${section} in ${filename}.json` });
      }
      
      return res.status(200).json({ message: `Section ${section} updated successfully` });
    } else {
      // Update the entire file
      const success = saveData(filename, data);
      
      if (!success) {
        return res.status(500).json({ message: `Failed to update ${filename}.json` });
      }
      
      return res.status(200).json({ message: `File ${filename}.json updated successfully` });
    }
  }
  
  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
