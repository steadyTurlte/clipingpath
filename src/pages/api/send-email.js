import { getData } from '@/utils/dataUtils';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, data } = req.body;

    // Get the admin email from settings
    const settings = getData('settings');
    const adminEmail = settings?.email?.adminEmail;

    if (!adminEmail) {
      return res.status(500).json({ message: 'Admin email not configured' });
    }

    // Configure email subject based on type
    let subject = 'New Message from Website';
    if (type === 'contact') {
      subject = settings?.email?.contactFormSubject || 'New Contact Form Submission';
    } else if (type === 'quote') {
      subject = settings?.email?.quoteFormSubject || 'New Quote Request';
    }

    // Create email content
    let html = '<h1>' + subject + '</h1>';
    html += '<table style="border-collapse: collapse; width: 100%;">';

    // Add all data fields to the email
    Object.entries(data).forEach(([key, value]) => {
      html += `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${key}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${value}</td>
        </tr>
      `;
    });

    html += '</table>';

    // Configure email transport with enhanced Gmail compatibility
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || adminEmail,
      to: adminEmail,
      subject: subject,
      html: html,
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
