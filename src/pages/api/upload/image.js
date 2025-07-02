import { formidable } from "formidable";
import fs from "fs";
import { uploadToCloudinary } from "@/utils/cloudinaryUtils";
import { saveMediaFile, deleteMediaFile } from "@/utils/dataUtils";

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the query parameters
    const folder = req.query.folder || "photodit";
    const oldPublicId = req.query.oldPublicId || null;

    // Configure formidable for temporary file handling
    const options = {
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    };

    // Parse the form data
    const form = formidable(options);

    // Process the form
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Error parsing form:", err);
          return reject(err);
        }
        resolve([fields, files]);
      });
    });

    // Get the file
    const fileArray = files.file;
    if (!fileArray || fileArray.length === 0) {
      console.error("No file found in the request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = fileArray[0];

    // Check if the file is an image
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      // Delete the temporary file
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ message: "Only image files are allowed" });
    }

    // Read the file buffer
    const fileBuffer = fs.readFileSync(file.filepath);

    // Prepare upload options
    const uploadOptions = {
      folder: `photodit/${folder}`,
      public_id: `${Date.now()}-${file.originalFilename
        .replace(/\s+/g, "-")
        .replace(/\.[^/.]+$/, "")}`,
      resource_type: "image",
      oldPublicId: oldPublicId, // Pass the old public ID to delete the old image
    };

    // If we have an oldPublicId, delete the old image from the database first
    if (oldPublicId) {
      try {
        await deleteMediaFile(oldPublicId);
        console.log(`Deleted old image with public ID: ${oldPublicId}`);
      } catch (deleteError) {
        console.error("Error deleting old image from database:", deleteError);
        // Continue with the upload even if deletion fails
      }
    }

    // Upload to Cloudinary (this will also delete the old image from Cloudinary if oldPublicId is provided)
    const cloudinaryResult = await uploadToCloudinary(fileBuffer, uploadOptions);

    // Clean up temporary file
    fs.unlinkSync(file.filepath);

    // Save file metadata to database
    try {
      await saveMediaFile({
        filename: `${cloudinaryResult.public_id}.${cloudinaryResult.format}`,
        originalName: file.originalFilename,
        cloudinaryUrl: cloudinaryResult.secure_url,
        cloudinaryPublicId: cloudinaryResult.public_id,
        fileSize: cloudinaryResult.bytes,
        mimeType: file.mimetype,
        folder: folder,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
      });
    } catch (dbError) {
      console.error("Error saving file metadata to database:", dbError);
      // Continue with the response even if database save fails
    }

    return res.status(200).json({
      message: "File uploaded successfully",
      path: cloudinaryResult.secure_url,
      filePath: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      width: cloudinaryResult.width,
      height: cloudinaryResult.height,
      size: cloudinaryResult.bytes,
      format: cloudinaryResult.format,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
}
