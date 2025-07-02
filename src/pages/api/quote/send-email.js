import nodemailer from "nodemailer";
import { getData, uploadImageAndSaveMetadata } from "@/utils/dataUtils";
import { getAdminEmail } from "@/utils/emailUtils";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get admin email and settings
    const [adminEmail, settings] = await Promise.all([
      getAdminEmail(),
      getData("settings") || {},
    ]);
    
    const emailSettings = settings.email || {};

    // Extract form data
    const {
      name,
      email,
      service,
      fileOptions,
      message,
      uploadedFile,
      cloudLink,
    } = req.body;

    // Handle uploaded file URL
    let fileMetadata = null;
    if (uploadedFile) {
      // If uploadedFile is a URL, create a basic metadata object
      fileMetadata = {
        cloudinaryUrl: uploadedFile,
        originalName: uploadedFile.split('/').pop() || 'uploaded-file',
        fileSize: 0 // Size not available since we only have the URL
      };
    }

    // Format file options for email
    let fileOptionsText = "";
    if (typeof fileOptions === "object") {
      fileOptionsText = Object.entries(fileOptions)
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option)
        .join(", ");
    } else {
      fileOptionsText = fileOptions;
    }

    // Prepare email content
    const emailContent = `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>File Options:</strong> ${
        fileOptionsText || "None selected"
      }</p>
      <p><strong>Message:</strong> ${message || "No message provided"}</p>
      ${
        fileMetadata
          ? `<p><strong>Uploaded File:</strong> <a href="${fileMetadata.cloudinaryUrl}">${fileMetadata.originalName}</a> (${(fileMetadata.fileSize / 1024).toFixed(2)} KB)</p>`
          : "<p><strong>Uploaded File:</strong> No file uploaded</p>"
      }
      ${
        cloudLink
          ? `<p><strong>Cloud Link:</strong> <a href="${cloudLink}">${cloudLink}</a></p>`
          : "<p><strong>Cloud Link:</strong> No link provided</p>"
      }
      <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
      
      <hr>
      <p>You can view and manage this quote request in the admin panel.</p>
    `;

    // Log the request details for debugging
    console.log("Quote request received:", {
      from: `${name} <${email}>`,
      service,
      fileOptions: fileOptionsText || "None selected",
      message: message ? "[Provided]" : "No message",
      hasUploadedFile: !!fileMetadata,
      cloudLink: cloudLink || "None",
      timestamp: new Date().toISOString()
    });

    // Save the quote request to database
    try {
      const { saveQuoteRequest } = await import("@/utils/dataUtils");
      await saveQuoteRequest({
        name,
        email,
        service,
        fileOptions: fileOptionsText,
        message,
        uploadedFile: fileMetadata ? {
          url: fileMetadata.cloudinaryUrl,
          name: fileMetadata.originalName,
          size: fileMetadata.fileSize,
          publicId: fileMetadata.cloudinaryPublicId
        } : null,
        cloudLink,
        status: 'new',
        createdAt: new Date().toISOString()
      });
      console.log("Quote request saved to database successfully");
    } catch (dbError) {
      console.error("Error saving quote request to database:", dbError);
      // Continue with email sending even if database save fails
    }

    // Log the settings data for debugging
    console.log("Settings data:", settings);
    console.log("Email settings:", emailSettings);

    // Try to send the email using settings first, then fall back to environment variables
    const emailHost =
      process.env.EMAIL_HOST || emailSettings.emailHost || "smtp.gmail.com";
    const emailPort = parseInt(
      process.env.EMAIL_PORT || emailSettings.emailPort || 587
    );
    const emailUser = process.env.EMAIL_USER || emailSettings.emailUser;
    const emailPass = process.env.EMAIL_PASS || emailSettings.emailPass;
    const emailSecure =
      process.env.EMAIL_SECURE === "true" || emailSettings.emailSecure === true;
    const emailFrom =
      process.env.EMAIL_FROM || emailSettings.emailFrom || emailUser || adminEmail;

    // Use the admin email from our utility function
    const emailTo = adminEmail;

    console.log("Sending quote request to:", emailTo);

    // Check if we have the minimum required settings to send an email
    if (emailHost && emailUser && emailPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: emailHost,
          port: emailPort,
          secure: emailSecure, // true for 465, false for other ports
          auth: {
            user: emailUser,
            pass: emailPass,
          },
          tls: {
            // Do not fail on invalid certificates
            rejectUnauthorized: false,
            // Add ciphers for Gmail compatibility
            ciphers: "SSLv3",
          },
          debug: true, // Show debug output
          logger: true, // Log information about the mail transaction
        });

        const mailOptions = {
          from: emailFrom,
          to: emailTo,
          subject: `New Quote Request from ${name}`,
          html: emailContent,
          replyTo: email,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", emailTo);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // We don't throw the error here to avoid breaking the API response
        // The quote data is still saved to a file
      }
    } else {
      console.log("Email sending not configured. Missing required settings.");
    }

    return res.status(200).json({ message: "Quote request sent successfully" });
  } catch (error) {
    console.error("Error sending quote request:", error);
    return res
      .status(500)
      .json({ message: "Failed to send quote request", error: error.message });
  }
}
