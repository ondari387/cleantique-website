import { NextResponse, type NextRequest } from "next/server";

/**
 * HTTP Basic Auth for the enquiries admin.
 * Set ADMIN_USER and ADMIN_PASSWORD in the hosting environment.
 * If they are not set, the admin area is disabled (404) rather than left open.
 */
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass) {
    return new NextResponse("Not found", { status: 404 });
  }
  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    const decoded = atob(header.slice(6));
    const i = decoded.indexOf(":");
    if (i > -1 && decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) return NextResponse.next();
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Cleantique admin", charset="UTF-8"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
