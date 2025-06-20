import { NextResponse } from 'next/server';
import { loadEnvVariables } from '@/utils/envLoader';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Load environment variables from .env.local file
    loadEnvVariables();

    const { password } = req.body;

    const adminPassword = process.env.ADMIN_PASSWORD ;

    if ( !adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set');
      return res.status(500).json({ message: 'Server error' });
    }

    if (password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Set a cookie that expires in 24 hours
    res.setHeader(
      'Set-Cookie',
      `admin_auth=authenticated; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; ${
        process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
      }SameSite=Strict`
    );

    return res.status(200).json({ message: 'Authentication successful' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
