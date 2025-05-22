import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { getData } from '@/utils/dataUtils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get email settings from the settings data
    const settings = getData('settings') || {};
    const emailSettings = settings.email || {};

    // Extract form data
    const { name, email, service, fileOptions, message, uploadedFile, cloudLink } = req.body;

    // Format file options for email
    let fileOptionsText = '';
    if (typeof fileOptions === 'object') {
      fileOptionsText = Object.entries(fileOptions)
        .filter(([_, isSelected]) => isSelected)
        .map(([option]) => option)
        .join(', ');
    } else {
      fileOptionsText = fileOptions;
    }

    // Prepare email content
    const emailContent = `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>File Options:</strong> ${fileOptionsText || 'None selected'}</p>
      <p><strong>Message:</strong> ${message || 'No message provided'}</p>
      <p><strong>Uploaded File:</strong> ${uploadedFile ? `${req.headers.origin}${uploadedFile}` : 'No file uploaded'}</p>
      <p><strong>Cloud Link:</strong> ${cloudLink || 'No link provided'}</p>
    `;

    // For development, just log the email content instead of sending
    console.log('Quote request received:');
    console.log(`From: ${name} (${email})`);
    console.log(`Service: ${service}`);
    console.log(`File Options: ${fileOptionsText || 'None selected'}`);
    console.log(`Message: ${message || 'No message provided'}`);
    console.log(`Uploaded File: ${uploadedFile || 'None'}`);
    console.log(`Cloud Link: ${cloudLink || 'None'}`);

    // Save the quote request to a file for development purposes
    const quotesDir = path.join(process.cwd(), 'src', 'data', 'quotes');
    if (!fs.existsSync(quotesDir)) {
      fs.mkdirSync(quotesDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const quoteFile = path.join(quotesDir, `quote-${timestamp}.json`);

    fs.writeFileSync(quoteFile, JSON.stringify({
      name,
      email,
      service,
      fileOptions: fileOptionsText,
      message,
      uploadedFile,
      cloudLink,
      timestamp: new Date().toISOString(),
    }, null, 2));

    // Log the settings data for debugging
    console.log('Settings data:', settings);
    console.log('Email settings:', emailSettings);

    // Try to send the email using settings first, then fall back to environment variables
    const emailHost = process.env.EMAIL_HOST || emailSettings.emailHost || 'smtp.gmail.com';
    const emailPort = parseInt(process.env.EMAIL_PORT || emailSettings.emailPort || 587);
    const emailUser = process.env.EMAIL_USER || emailSettings.emailUser;
    const emailPass = process.env.EMAIL_PASS || emailSettings.emailPass;
    const emailSecure = process.env.EMAIL_SECURE === 'true' || emailSettings.emailSecure === true;
    const emailFrom = process.env.EMAIL_FROM || emailSettings.emailFrom || emailUser;

    // Make sure we're using the correct recipient email - prioritize the admin email from settings
    const emailTo = emailSettings.adminEmail || process.env.EMAIL_USER || settings.contact?.email || 'admin@photodit.com';

    console.log('Using admin email:', emailTo);

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
            ciphers: 'SSLv3'
          },
          debug: true, // Show debug output
          logger: true // Log information about the mail transaction
        });

        const mailOptions = {
          from: emailFrom,
          to: emailTo,
          subject: `New Quote Request from ${name}`,
          html: emailContent,
          replyTo: email
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to', emailTo);
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // We don't throw the error here to avoid breaking the API response
        // The quote data is still saved to a file
      }
    } else {
      console.log('Email sending not configured. Missing required settings.');
    }

    return res.status(200).json({ message: 'Quote request sent successfully' });
  } catch (error) {
    console.error('Error sending quote request:', error);
    return res.status(500).json({ message: 'Failed to send quote request', error: error.message });
  }
}
