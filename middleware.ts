import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const response = NextResponse.next()

    // Add request tracking headers
    response.headers.set("X-Request-Id", crypto.randomUUID())
    response.headers.set("X-Timestamp", new Date().toISOString())

    // Add rate limiting headers (mock implementation)
    response.headers.set("X-RateLimit-Limit", "1000")
    response.headers.set("X-RateLimit-Remaining", "999")
    response.headers.set("X-RateLimit-Reset", new Date(Date.now() + 3600000).toISOString())

    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
