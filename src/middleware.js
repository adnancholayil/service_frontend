import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Retrieve token and role from cookies
  const token = request.cookies.get('auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  // Paths requiring authentication
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password') || pathname.startsWith('/verify-otp');
  const isAdminRoute = pathname.startsWith('/admin');
  const isProviderRoute = pathname.startsWith('/provider');
  const isCustomerProtectedRoute = pathname.startsWith('/bookings') || pathname.startsWith('/profile') || pathname.startsWith('/messages') || pathname.startsWith('/notifications');

  // 1. If trying to access protected routes but not authenticated, redirect to /?auth=login
  if ((isAdminRoute || isProviderRoute || isCustomerProtectedRoute) && !token) {
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('auth', 'login');
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated, prevent accessing auth pages
  if (isAuthRoute && token) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else if (role === 'provider') {
      return NextResponse.redirect(new URL('/provider/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // 3. Role verification checks
  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isProviderRoute && role !== 'provider') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/provider/:path*',
    '/bookings/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/notifications/:path*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
  ],
};
