import { getData, saveData } from "@/utils/dataUtils";

// Default contact information
const DEFAULT_CONTACT_INFO = {
  address: "123 Business Avenue, New York, NY 10001",
  phone: "+1 (555) 123-4567",
  email: "info@photodit.com",
  googleMapUrl: "https://www.google.com/maps/place/New+York,+NY,+USA/",
  mapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20342.411046372905!2d-74.16638039276373!3d40.719832743885284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1649562691355!5m2!1sen!2sbd",
  socialLinks: {
    facebook: "https://facebook.com/photodit",
    twitter: "https://twitter.com/photodit",
    instagram: "https://instagram.com/photodit",
    linkedin: "https://linkedin.com/company/photodit",
  },
};

// Function to sync contact info with settings
const syncWithSettings = async (contactData) => {
  try {
    // Get current settings
    const settings = (await getData("settings")) || {};

    // Update contact and social sections in settings
    settings.contact = {
      ...settings.contact,
      address: contactData.address,
      phone: contactData.phone,
      email: contactData.email,
      googleMapUrl: contactData.googleMapUrl,
      mapUrl: contactData.mapUrl,
    };

    settings.social = {
      ...settings.social,
      ...contactData.socialLinks,
    };

    // Save updated settings
    await saveData("settings", settings);
  } catch (error) {
    console.error("Error syncing contact info with settings:", error);
  }
};

export default async function handler(req, res) {
  // GET request to retrieve contact information
  if (req.method === "GET") {
    try {
      let data = await getData("contact-info");
      if (!data || Object.keys(data).length === 0) {
        await saveData("contact-info", DEFAULT_CONTACT_INFO);
        data = { ...DEFAULT_CONTACT_INFO };
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching contact info:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT request to update contact information
  if (req.method === "PUT") {
    try {
      const updatedData = req.body;
      const success = await saveData("contact-info", updatedData);
      if (!success) {
        return res.status(500).json({ message: "Failed to save contact info" });
      }
      await syncWithSettings(updatedData);
      return res.status(200).json({ message: "Contact info updated successfully", data: updatedData });
    } catch (error) {
      console.error("Error updating contact info:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
