import { getData, saveData } from "@/utils/dataUtils";

export default async function handler(req, res) {
  // GET request to retrieve teams data
  if (req.method === "GET") {
    try {
      const { section } = req.query;

      // Get the teams data from the JSON file
      const teamsData = await getData("teams");

      // If no data exists, return an empty object
      if (!teamsData) {
        return res.status(404).json({ message: "Teams data not found" });
      }

      // If a specific section is requested, return only that section
      if (section && teamsData[section]) {
        return res.status(200).json(teamsData[section]);
      }

      // Return the entire teams data
      return res.status(200).json(teamsData);
    } catch (error) {
      console.error("Error fetching teams data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT request to update teams data
  if (req.method === "PUT") {
    try {
      const { section } = req.query;
      const updatedData = req.body;

      // Save the updated data
      const success = await saveData("teams", updatedData);

      if (!success) {
        return res.status(500).json({ message: "Failed to save teams data" });
      }

      return res.status(200).json({
        message: "Teams data updated successfully",
        data: updatedData,
      });
    } catch (error) {
      console.error("Error updating teams data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
