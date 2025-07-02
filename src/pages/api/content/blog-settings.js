import { getData, saveData } from "@/utils/dataUtils";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = await getData("blog-settings");
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching blog-settings data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  if (req.method === "PUT") {
    try {
      const updatedData = req.body;
      const success = await saveData("blog-settings", updatedData);
      if (!success) {
        return res
          .status(500)
          .json({ message: "Failed to save blog-settings data" });
      }
      return res
        .status(200)
        .json({
          message: "Blog-settings data updated successfully",
          data: updatedData,
        });
    } catch (error) {
      console.error("Error updating blog-settings data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  return res.status(405).json({ message: "Method not allowed" });
}
