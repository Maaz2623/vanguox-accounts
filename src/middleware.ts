import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth"; // Import NextAuth

export async function middleware(req: NextRequest) {
  const session = await auth(); // Get user session
  const { pathname } = req.nextUrl;

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const authRoutes = ["/sign-in", "/register"]; // Pages to block when logged in

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // If logged in, prevent access to login & register pages
  if (session && authRoutes.includes(pathname)) {
    const redirectUrl = new URL(req.nextUrl).searchParams.get("redirect_url");

    if (redirectUrl) {
      return NextResponse.redirect(new URL(redirectUrl));
    }

    return NextResponse.redirect(new URL("/", req.url)); // Redirect to dashboard
  }

  return NextResponse.next(); // Continue request
}

// Apply middleware to protected and auth routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/sign-in",
    "/register",
  ],
};
