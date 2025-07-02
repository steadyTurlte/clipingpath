import { getData, saveData } from "@/utils/dataUtils";

// Default email settings from environment variables
const DEFAULT_EMAIL_SETTINGS = {
  adminEmail: process.env.EMAIL_USER || "admin@example.com",
};

// Get email settings
const getEmailSettings = async () => {
  try {
    // Get settings from the settings.json file
    const settings = (await getData("settings")) || {};

    // If email settings exist, return only the admin email
    if (settings.email) {
      // Return only the admin email, all other settings come from env vars
      return {
        adminEmail:
          settings.email.adminEmail || DEFAULT_EMAIL_SETTINGS.adminEmail,
      };
    } else {
      // Initialize email settings if they don't exist
      settings.email = DEFAULT_EMAIL_SETTINGS;
      await saveData("settings", settings);
      return DEFAULT_EMAIL_SETTINGS;
    }
  } catch (error) {
    console.error("Error reading email settings:", error);
    return DEFAULT_EMAIL_SETTINGS;
  }
};

// Save email settings
const saveEmailSettings = async (settings) => {
  try {
    // Get existing settings
    const existingSettings = (await getData("settings")) || {};

    // Get existing email settings or use defaults
    const existingEmailSettings =
      existingSettings.email || DEFAULT_EMAIL_SETTINGS;

    // Only update the admin email, preserve all other settings
    const updatedEmailSettings = {
      ...existingEmailSettings,
      adminEmail: settings.adminEmail || existingEmailSettings.adminEmail,
    };

    // Update the email settings in the settings object
    existingSettings.email = updatedEmailSettings;

    // Save the updated settings
    const success = await saveData("settings", existingSettings);

    return success;
  } catch (error) {
    console.error("Error saving email settings:", error);
    return false;
  }
};

export default async function handler(req, res) {
  // Only allow GET and PUT methods
  if (req.method !== "GET" && req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Handle GET request
  if (req.method === "GET") {
    const settings = await getEmailSettings();
    return res.status(200).json(settings);
  }

  // Handle PUT request
  if (req.method === "PUT") {
    const success = await saveEmailSettings(req.body);

    if (success) {
      return res
        .status(200)
        .json({ message: "Email settings saved successfully" });
    } else {
      return res.status(500).json({ message: "Failed to save email settings" });
    }
  }
}
