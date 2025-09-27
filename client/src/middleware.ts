import { NextRequest, NextResponse } from 'next/server'

// Route access definitions
const ROUTE_ACCESS = {
  superadmin: ['/super-admin','/admin','/team','/client'],
  admin: ['/admin','/team','/client'],
  team: ['/team'],
  client: ['/client'],
  legacy: ['/dashboard'] // old dashboard route that redirects based on role
}

// Role dashboard mappings
const ROLE_DASHBOARDS = {
  superadmin: '/super-admin/dashboard',
  admin: '/admin/dashboard',
  team: '/team/dashboard',
  client: '/client/dashboard'
}

// Get all protected routes
const ALL_PROTECTED_ROUTES = [
  ...ROUTE_ACCESS.superadmin,
  ...ROUTE_ACCESS.admin,
  ...ROUTE_ACCESS.team,
  ...ROUTE_ACCESS.client,
  ...ROUTE_ACCESS.legacy
]

// Helper function to check if a path starts with any of the route patterns
function isProtectedRoute(pathname: string): boolean {
  return ALL_PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

// Helper function to check if user role can access the requested path
function canAccessRoute(userRole: string, pathname: string): boolean {
  // Handle legacy dashboard route - always allow, will redirect based on role
  if (pathname.startsWith('/dashboard')) {
    return true
  }

  // Check if user's role allows access to this route
  const allowedRoutes = ROUTE_ACCESS[userRole as keyof typeof ROUTE_ACCESS]
  return allowedRoutes ? allowedRoutes.some(route => pathname.startsWith(route)) : false
}

// Helper function to create redirect with toast message
function createRedirectWithToast(url: string, message: string, type: 'error' | 'info' = 'error') {
  const redirectUrl = new URL(url)
  redirectUrl.searchParams.set('toast', message)
  redirectUrl.searchParams.set('toastType', type)
  return NextResponse.redirect(redirectUrl)
}

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname

  // Step 1: Check if route is protected
  if (!isProtectedRoute(currentPath)) {
    console.log('🟢 Public route, allowing access')
    return NextResponse.next()
  }

  // Step 2: Verify session and get user role (only for protected routes)
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    const response = await fetch(`${apiBaseUrl}/users/me`, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const user = await response.json()

    // Step 3: Handle legacy dashboard route - redirect to role-specific dashboard
    if (currentPath.startsWith('/dashboard')) {
      const roleBasedDashboard = ROLE_DASHBOARDS[user.role as keyof typeof ROLE_DASHBOARDS]
      if (roleBasedDashboard) {
        console.log('🔄 Legacy dashboard route, redirecting to role-specific dashboard:', roleBasedDashboard)
        return NextResponse.redirect(new URL(roleBasedDashboard, request.url))
      }
    }

    // Step 4: Check if user role can access the requested route
    if (!canAccessRoute(user.role, currentPath)) {
      const userDashboard = ROLE_DASHBOARDS[user.role as keyof typeof ROLE_DASHBOARDS]
      if (userDashboard) {
        console.log('🚫 User role cannot access route, redirecting to user dashboard with toast')
        return createRedirectWithToast(
          new URL(userDashboard, request.url).toString(),
          'You do not have access to this page',
          'error'
        )
      }
    }

    console.log('✅ User authorized, continuing to route')

  } catch (error) {
    console.log('💥 Error calling API:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/super-admin',
    '/super-admin/:path*',
    '/admin',
    '/admin/:path*',
    '/team',
    '/team/:path*',
    '/client',
    '/client/:path*'
  ]
}