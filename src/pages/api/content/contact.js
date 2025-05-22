import { getData, saveData } from '@/utils/dataUtils';

// Default data for the contact page
const defaultContactData = {
  banner: {
    title: "Contact Us",
    image: ""
  },
  main: {
    title: "Have something in mind? Let's talk.",
    description: "We're here to answer any questions you may have about our services. Reach out to us and we'll respond as soon as we can.",
    image: "/images/arrow.png",
    subject: [
      "Account",
      "Service",
      "Pricing",
      "Support"
    ]
  },
  map: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20342.411046372905!2d-74.16638039276373!3d40.719832743885284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1649562691355!5m2!1sen!2sbd"
  }
};

export default async function handler(req, res) {
  // GET request to retrieve contact page data
  if (req.method === 'GET') {
    try {
      const { section } = req.query;

      // Get the contact page data from the JSON file
      let data = getData('contact');

      // If no data exists, use the default data
      if (!data || Object.keys(data).length === 0) {
        // Save the default data to the JSON file
        saveData('contact', defaultContactData);
        data = { ...defaultContactData };
      }

      // If a specific section is requested, return only that section
      if (section) {
        // If the section doesn't exist, return the default section data
        if (!data[section] && defaultContactData[section]) {
          // Update the contact data with the default section
          data[section] = defaultContactData[section];
          saveData('contact', data);

          return res.status(200).json(defaultContactData[section]);
        }

        // Return the requested section
        return res.status(200).json(data[section] || {});
      }

      // Return the entire contact page data
      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching contact page data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // PUT request to update contact page data
  if (req.method === 'PUT') {
    try {
      const { section } = req.query;
      const updatedData = req.body;

      // Get the current contact page data
      let data = getData('contact') || {};

      // If a specific section is being updated
      if (section) {
        // Update only the specified section
        data = {
          ...data,
          [section]: updatedData
        };
      } else {
        // Update the entire contact page data
        data = updatedData;
      }

      // Save the updated data
      const success = saveData('contact', data);

      if (!success) {
        return res.status(500).json({ message: 'Failed to save contact page data' });
      }

      return res.status(200).json({ message: 'Contact page data updated successfully', data });
    } catch (error) {
      console.error('Error updating contact page data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: 'Method not allowed' });
}
