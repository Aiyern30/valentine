// lib/routes.ts or config/routes.ts

// Protected routes that require authentication
export const protectedRoutes = [
  "/dashboard",
  "/milestones",
  "/confessions",
  "/gallery",
  "/photos",
  "/settings",
  "/profile",
  "/game",
] as const;

// Auth routes - only for login/signup pages that logged-in users shouldn't see
export const authRoutes = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

// Helper function to check if a path is protected
export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

// Helper function to check if a path is an auth route
export function isAuthRoute(pathname: string): boolean {
  return authRoutes.some((route) => pathname.startsWith(route));
}
