import { getData } from './dataUtils';

/**
 * Get the admin email address from settings with fallback to environment variables
 * @returns {Promise<string>} The admin email address
 */
export const getAdminEmail = async () => {
  try {
    // Get settings from the database
    const settings = await getData('settings') || {};
    
    // Check in this order:
    // 1. settings.email.adminEmail (from admin settings)
    // 2. settings.contact.email (legacy)
    // 3. process.env.EMAIL_USER (from environment)
    // 4. Default fallback
    return (
      settings.email?.adminEmail ||
      settings.contact?.email ||
      process.env.EMAIL_USER ||
      'admin@photodit.com'
    );
  } catch (error) {
    console.error('Error getting admin email:', error);
    return process.env.EMAIL_USER || 'admin@photodit.com';
  }
};

/**
 * Get complete email settings
 * @returns {Promise<Object>} Email settings object
 */
export const getEmailSettings = async () => {
  try {
    const settings = await getData('settings') || {};
    return {
      adminEmail: await getAdminEmail(),
      // Add other email settings here if needed
      ...settings.email
    };
  } catch (error) {
    console.error('Error getting email settings:', error);
    return {
      adminEmail: process.env.EMAIL_USER || 'admin@photodit.com',
      // Default email settings
    };
  }
};
