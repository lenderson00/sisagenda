import { authOptions } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import NextAuth from "next-auth";
import { getToken } from "next-auth/jwt";
import { type NextRequest, NextResponse } from "next/server";

export const publicRoutes: string[] = [];

export const authRoutes = ["/entrar", "/registrar", "/resetar-senha"];

export const defaultRedirects = {
  isNotAuthenticated: "/entrar",
  onAuthPageToLoggedUser: "/",
  onboarding: "/onboarding",
};

type NextAuthRequest = NextRequest & {
  auth?: any;
};

const { auth } = NextAuth(authOptions);

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (proxies for third-party services)
     * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
     */
    "/((?!api/|_next/|_proxy/|sw.js|swe-worker-development.js|ingest/|pagead/js/adsbygoogle.js|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
};

export default auth(async (req: NextAuthRequest) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-current-path", nextUrl.pathname);

  const isLogged = !!req.auth

  let role = null;
  let mustChangePassword = false;

  if (req.auth) {
    role = req.auth.user.role;
    mustChangePassword = req.auth.user.mustChangePassword;
  }

  // Check route types
  const isAuthRoute = authRoutes.includes(pathname);
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicRoute = publicRoutes.includes(pathname);
  const isNewPasswordRoute = pathname === "/nova-senha";

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Allow API routes to pass through
  if (isApiRoute) {
    console.log(`Middleware: API route ${pathname} passed through.`);
    return response;
  }

  // Allow public routes to pass through
  if (isPublicRoute) {
    return response;
  }

  // Handle unauthenticated users
  if (!isLogged) {
    // Allow access to auth routes
    if (isAuthRoute) {
      return response;
    }

    // Redirect to login for protected routes
    return NextResponse.redirect(
      new URL(defaultRedirects.isNotAuthenticated, nextUrl),
    );
  }

  if (mustChangePassword && !isNewPasswordRoute) {
    return NextResponse.redirect(new URL("/nova-senha", nextUrl));
  }

  // Redirect logged in users away from auth routes
  if (isAuthRoute) {
    return NextResponse.redirect(
      new URL(defaultRedirects.onAuthPageToLoggedUser, nextUrl),
    );
  }

  const path = nextUrl.pathname;

  if (isNewPasswordRoute) {
    return response;
  }

  // Handle root path
  if (path === "/") {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return NextResponse.rewrite(new URL("/super-admin", nextUrl));
      case UserRole.ADMIN:
        return NextResponse.rewrite(new URL("/admin", nextUrl));
      case UserRole.USER:
        return NextResponse.rewrite(new URL("/user", nextUrl));
      case UserRole.FORNECEDOR:
        return NextResponse.rewrite(new URL("/fornecedor", nextUrl));
    }
  }
  // Allow access to protected routes for logged in users

  if (isLogged && isNewPasswordRoute && mustChangePassword) {
    return response;
  }

  // If we're here, user is logged in, not on a special route handled above,
  // not root, and not a likely static asset. Proceed with role-based rewrite.
  if (role && typeof role === "string") {
    const rolePrefix = role.toLowerCase().replace("_", "-");

    // Avoid re-prefixing if the path ALREADY starts with the correct role prefix.
    if (pathname.startsWith(`/${rolePrefix}/`)) {
      // console.log(`Middleware: Path ${pathname} already correctly prefixed for role ${role}. Passing through.`);
      return response;
    }

    // Ensure pathname is not "/" here, as root path rewrites are handled earlier.
    const newPath = `/${rolePrefix}${pathname === "/" ? "" : pathname}`;
    // console.log(`Middleware: Rewriting path ${pathname} to ${newPath} for role ${role}`);
    return NextResponse.rewrite(new URL(newPath, nextUrl), {
      request: { headers: requestHeaders },
    });
  }

  // If role is not valid for a logged-in user reaching this point (which means isLogged is true).
  // This is an unexpected state for a logged-in user on a path that wasn't handled by earlier checks.
  // It implies the user is logged in, but their role is missing or not a string.
  // console.warn(`Middleware: User is logged in, but role is missing or invalid ('${role}') for path ${pathname}. Passing through without rewrite.`);
  return response; // Pass through without rewrite
});
