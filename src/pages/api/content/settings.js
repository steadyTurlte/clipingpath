import { getData, saveData } from "@/utils/dataUtils";

export default async function handler(req, res) {
  // GET request to retrieve settings
  if (req.method === "GET") {
    try {
      const data = await getData("settings");

      // Define complete default settings structure
      const defaultSettings = {
        site: {
          title: "Photodit - Clipping Path Service",
          description:
            "Professional photo editing services for e-commerce businesses and photographers.",
          logo: "/images/logo.png",
          logoLight: "/images/logo-light.png",
          favicon: "/images/favicon.ico",
        },
        contact: {
          email: "info@photodit.com",
          phone: "+1 (732) 798-0976",
          address: "785 15h Street, Office 478 Berlin",
          mapUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.654394599325!2d13.372469776926638!3d52.50793287206592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851c655f20989%3A0x26bbfb4e84674c63!2sBrandenburg%20Gate!5e0!3m2!1sen!2sde!4v1687456518039!5m2!1sen!2sde",
        },
        social: {
          facebook: "https://facebook.com",
          twitter: "https://twitter.com",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
          youtube: "https://youtube.com",
        },
        footer: {
          description:
            "Professional photo editing services for e-commerce businesses and photographers.",
          copyright: "© 2023 Photodit. All rights reserved.",
        },
        email: {
          adminEmail: "admin@photodit.com",
        },
      };

      // Get existing data or use defaults
      let settingsData = data || {};

      if (Object.keys(settingsData).length === 0) {
        settingsData = defaultSettings;

        // Save the default data
        await saveData("settings", settingsData);
      } else {
        // Ensure all sections exist by merging with defaults
        settingsData = {
          site: { ...defaultSettings.site, ...settingsData.site },
          contact: { ...defaultSettings.contact, ...settingsData.contact },
          social: { ...defaultSettings.social, ...settingsData.social },
          footer: { ...defaultSettings.footer, ...settingsData.footer },
          email: { ...defaultSettings.email, ...settingsData.email },
        };
      }

      return res.status(200).json(settingsData);
    } catch (error) {
      console.error("Error fetching settings data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT request to update settings
  if (req.method === "PUT") {
    try {
      const { section } = req.query;
      const updatedData = req.body;

      // Get current settings
      let currentSettings = await getData("settings");

      if (!currentSettings || Object.keys(currentSettings).length === 0) {
        currentSettings = {
          site: {},
          contact: {},
          social: {},
          footer: {},
          email: {},
        };
      }

      let newSettings;

      // If updating a specific section
      if (section) {
        // Update only the specified section
        newSettings = {
          ...currentSettings,
          [section]: updatedData,
        };
      } else {
        // Update the entire settings object
        newSettings = updatedData;
      }

      // Validate the data before saving
      if (!newSettings || typeof newSettings !== "object") {
        console.error("Invalid settings data:", newSettings);
        return res.status(400).json({ message: "Invalid settings data" });
      }

      try {
        // Try to stringify the data to make sure it's valid JSON
        JSON.stringify(newSettings);
      } catch (jsonError) {
        console.error("Invalid JSON data:", jsonError);
        return res
          .status(400)
          .json({ message: "Settings data contains invalid JSON" });
      }

      // Save the settings
      const success = await saveData("settings", newSettings);

      if (!success) {
        return res
          .status(500)
          .json({
            message:
              "Failed to save settings data. Check server logs for details.",
          });
      }

      // Verify the data was saved correctly
      const savedData = await getData("settings");
      if (!savedData || !savedData[section]) {
        console.error("Data verification failed after save");
        return res
          .status(500)
          .json({ message: "Data verification failed after save" });
      }

      return res.status(200).json(savedData);
    } catch (error) {
      console.error("Error updating settings data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
