import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check if the request is for an admin page
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip authentication for the login page and API routes
    if (request.nextUrl.pathname === '/admin/login' ||
        request.nextUrl.pathname.startsWith('/api/')) {
      return;
    }

    // Check if the user is authenticated
    const authCookie = request.cookies.get('admin_auth');

    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to the login page
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
}

// Only run middleware on admin routes
export const config = {
  matcher: '/admin/:path*',
};
