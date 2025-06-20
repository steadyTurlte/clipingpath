import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Check if the user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export function isAuthenticated() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin_auth');
  return !!authCookie;
}

/**
 * Authenticate the user
 * @param {string} password - The password to check
 * @returns {boolean} True if authentication successful, false otherwise
 */
export function authenticate(password) {
  // Get the admin password from environment variables
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return false;
  }
  
  return password === adminPassword;
}

/**
 * Set the authentication cookie
 * @param {Response} response - The response object
 */
export function setAuthCookie(response) {
  // Set a cookie that expires in 24 hours
  response.cookies.set({
    name: 'admin_auth',
    value: 'authenticated',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

/**
 * Clear the authentication cookie
 * @param {Response} response - The response object
 */
export function clearAuthCookie(response) {
  response.cookies.set({
    name: 'admin_auth',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Middleware to protect admin routes
 * @param {Request} request - The request object
 * @returns {Response|undefined} Redirect response or undefined to continue
 */
export function authMiddleware(request) {
  // Check if the request is for an admin page
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip authentication for the login page
    if (request.nextUrl.pathname === '/admin/login') {
      return;
    }
    
    // Check if the user is authenticated
    const cookieStore = cookies();
    const authCookie = cookieStore.get('admin_auth');
    
    if (!authCookie) {
      // Redirect to the login page
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
}
