import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication
const protectedPaths = [
  '/profile',
  '/appointments',
  '/reviews',
  '/notifications'
]

// Add paths that should redirect to home if user is already authenticated
const authPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authState = request.cookies.get('lawyer-platform-auth')
  let isAuthenticated = false
  let userRole = null
  
  try {
    if (authState?.value) {
      let parsedValue;
      // Try to parse the cookie value
      try {
        parsedValue = JSON.parse(decodeURIComponent(authState.value));
      } catch (e) {
        // If decodeURIComponent fails, try direct parsing
        parsedValue = JSON.parse(authState.value);
      }
      
      // Check if the token exists in the parsed value
      const hasToken = parsedValue?.state?.token != null && parsedValue.state.token !== '';
      const hasIsAuthenticated = parsedValue?.state?.isAuthenticated === true;

      isAuthenticated = hasToken || hasIsAuthenticated;
      
      // Extract user role if available
      if (parsedValue?.state?.user?.role) {
        userRole = parsedValue.state.user.role;
      }
    }
  } catch (error) {
    // Silent error handling for cookie parsing
  }

  // Check if the path requires authentication
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))
  const isAdminPath = pathname.startsWith('/admin')
  const isLawyersPage = pathname === '/lawyers' || pathname.startsWith('/lawyers/')
  const isAppointmentBooking = pathname === '/appointments/book' || pathname.startsWith('/appointments/book/')

  // Prevent lawyers from accessing appointment booking pages
  if (isAuthenticated && userRole === 'lawyer' && isAppointmentBooking) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Redirect to login if accessing protected path while not authenticated
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to home if accessing auth paths while already authenticated
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Previously: Redirect admin users to /admin if they try to access non-admin routes
  // if (isAuthenticated && userRole === 'admin' && !isAdminPath && pathname !== '/') {
  //   return NextResponse.redirect(new URL('/admin', request.url))
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 