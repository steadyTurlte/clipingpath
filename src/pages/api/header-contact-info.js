import configManager from "@/utils/configManager";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    // Get the contact info data from the database using the config manager
    const contactInfo = await configManager.getConfig("contact-info");
    if (!contactInfo || Object.keys(contactInfo).length === 0) {
      return res.status(200).json({});
    }
    return res.status(200).json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact information for header:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
