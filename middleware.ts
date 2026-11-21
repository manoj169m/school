import { NextRequest, NextResponse } from 'next/server';

export default function middleware(req: NextRequest) {
  // Allow all requests without any auth checks
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Optionally, you can remove or comment out this matcher config
     * if you want the middleware to apply to every route.
     * If kept, this just says "these routes will go through this (now empty) middleware".
     */
    '/',
    '/login',
    '/dashboard/:path*',
    '/master/:path*',
    '/process/:path*',
    '/api/:path*',
    '/settings/:path*',
  ],
};
