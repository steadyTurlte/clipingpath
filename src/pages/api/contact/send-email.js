import { getData } from '@/utils/dataUtils';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, termsAccepted } = req.body;

    // Validate the form data
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Get the email settings from the settings data
    const settings = getData('settings') || {};
    const emailSettings = settings.email || {};


    // Prioritize admin email from settings.email.adminEmail
    const adminEmail = emailSettings.adminEmail || process.env.EMAIL_USER || settings.contact?.email || 'admin@photodit.com';

    // Create email content
    let html = '<h1>New Contact Form Submission</h1>';
    html += '<table style="border-collapse: collapse; width: 100%;">';
    html += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Name</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Email</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${email}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Subject</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${subject}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Message</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${message}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">Terms Accepted</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${termsAccepted ? 'Yes' : 'No'}</td>
      </tr>
    `;
    html += '</table>';

    // Log the email data for debugging
    console.log('Contact form submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Admin Email:', adminEmail);

    // Get email configuration from settings with fallback to environment variables
    const emailHost = emailSettings.emailHost || process.env.EMAIL_HOST || 'smtp.gmail.com';
    const emailPort = parseInt(emailSettings.emailPort || process.env.EMAIL_PORT || 587);
    const emailUser = emailSettings.emailUser || process.env.EMAIL_USER;
    const emailPass = emailSettings.emailPass || process.env.EMAIL_PASS;
    const emailSecure = emailSettings.emailSecure === true || process.env.EMAIL_SECURE === 'true';
    const emailFrom = emailSettings.emailFrom || process.env.EMAIL_FROM || emailUser || adminEmail;
    const contactFormSubject = emailSettings.contactFormSubject || settings.email?.contactFormSubject || 'New Contact Form Submission';

    // Check if email sending is configured
    if (emailHost && emailUser && emailPass) {
      // Configure email transport
      // For Gmail, we need to use specific settings
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

      // Send the email
      await transporter.sendMail({
        from: emailFrom,
        to: adminEmail,
        subject: `${contactFormSubject}: ${subject}`,
        html: html,
        replyTo: email
      });

      console.log('Email sent successfully');
    } else {
      console.log('Email sending not configured. Would send to:', adminEmail);
      console.log('Missing email configuration. Please set up email settings in the admin panel.');
    }

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again later.'
    });
  }
}
