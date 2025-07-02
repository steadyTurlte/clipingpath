import { getData, saveData } from "@/utils/dataUtils";

export default async function handler(req, res) {
  const { filename, section } = req.query;

  // GET request to retrieve data
  if (req.method === "GET") {
    try {
      let data = await getData(filename);
      if (section) {
        return res.status(200).json(data ? data[section] : {});
      }
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT request to update data
  if (req.method === "PUT") {
    try {
      let data = (await getData(filename)) || {};
      if (section) {
        data = {
          ...data,
          [section]: req.body,
        };
      } else {
        data = req.body;
      }
      const success = await saveData(filename, data);
      if (!success) {
        return res.status(500).json({ message: "Failed to save data" });
      }
      return res.status(200).json({ message: "Data updated successfully", data });
    } catch (error) {
      console.error("Error updating data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
