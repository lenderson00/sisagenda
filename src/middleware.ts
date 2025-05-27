import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "@prisma/client";

export const publicRoutes: string[] = [];

export const authRoutes = ["/entrar", "/registrar", "/resetar-senha"];

export const defaultRedirects = {
  isNotAuthenticated: "/entrar",
  onAuthPageToLoggedUser: "/",
  onboarding: "/onboarding",
};

type NextAuthRequest = NextRequest & {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

  const isLogged = !!req.auth;

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const role = token?.role as UserRole;
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

  if (token?.mustChangePassword && !isNewPasswordRoute) {
    return NextResponse.redirect(new URL("/nova-senha", nextUrl));
  }

  // Redirect logged in users away from auth routes
  if (isAuthRoute) {
    return NextResponse.redirect(
      new URL(defaultRedirects.onAuthPageToLoggedUser, nextUrl),
    );
  }

  const path = nextUrl.pathname;
  // Handle root path
  if (path === "/") {
    switch (token?.role) {
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

  if (isLogged && isNewPasswordRoute && token?.mustChangePassword) {
    return response;
  }

  const rolePrefix = role.toLowerCase().replace("_", "-");
  const newPath = `/${rolePrefix}${path}`;
  return NextResponse.rewrite(new URL(newPath, nextUrl));
});
