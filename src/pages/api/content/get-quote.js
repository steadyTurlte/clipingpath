import { getData, saveData } from "@/utils/dataUtils";

export default async function handler(req, res) {
  // GET request to retrieve get-quote data
  if (req.method === "GET") {
    try {
      const { section } = req.query;

      // Get the get-quote data from the JSON file
      let quoteData = await getData("get-quote");

      // If no data exists, return an empty object
      if (!quoteData) {
        return res.status(404).json({ message: "Quote data not found" });
      }

      // If a specific section is requested, return only that section
      if (section && quoteData[section]) {
        return res.status(200).json(quoteData[section]);
      }

      // Return the entire get-quote data
      return res.status(200).json(quoteData);
    } catch (error) {
      console.error("Error fetching quote data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT request to update get-quote data
  if (req.method === "PUT") {
    try {
      const { section } = req.query;
      const updatedData = req.body;

      // Get the current get-quote data
      let quoteData = (await getData("get-quote")) || {};

      // If a specific section is being updated
      if (section) {
        quoteData = {
          ...quoteData,
          [section]: updatedData,
        };
      } else {
        // Update the entire get-quote data
        quoteData = updatedData;
      }

      // Save the updated data
      const success = await saveData("get-quote", quoteData);

      if (!success) {
        return res.status(500).json({ message: "Failed to save quote data" });
      }

      return res.status(200).json({
        message: "Quote data updated successfully",
        data: section ? quoteData[section] : quoteData,
      });
    } catch (error) {
      console.error("Error updating quote data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
