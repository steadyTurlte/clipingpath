export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Clear the authentication cookie
    res.setHeader(
      'Set-Cookie',
      `admin_auth=; HttpOnly; Path=/; Max-Age=0; ${
        process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
      }SameSite=Strict`
    );
    
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
