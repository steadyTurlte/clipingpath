import { loadEnvVariables } from '@/utils/envLoader';

export default function handler(req, res) {
  // Load environment variables
  loadEnvVariables();
  
  // Return a list of environment variables (be careful not to expose sensitive information)
  return res.status(200).json({
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    adminPasswordFirstChar: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.charAt(0) : null,
    adminPasswordLength: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.length : 0,
    nodeEnv: process.env.NODE_ENV,
  });
}
