import { deleteFromCloudinary, extractPublicId } from "@/utils/cloudinaryUtils";
import { deleteMediaFile } from "@/utils/dataUtils";

export default async function handler(req, res) {
  const { url } = req.query;

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Decode the URL - this should be either a Cloudinary URL or public ID
    const decodedUrl = decodeURIComponent(url);

    let publicId;

    // Check if it's a Cloudinary URL or just a public ID
    if (decodedUrl.includes("cloudinary.com")) {
      publicId = extractPublicId(decodedUrl);
    } else {
      // Assume it's already a public ID
      publicId = decodedUrl;
    }

    if (!publicId) {
      return res.status(400).json({ message: "Invalid file identifier" });
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(publicId);
    } catch (cloudinaryError) {
      console.error("Error deleting from Cloudinary:", cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete the file record from database
    await deleteMediaFile(publicId);

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
