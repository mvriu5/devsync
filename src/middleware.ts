import {NextRequest, NextResponse} from "next/server"
import {getSessionCookie} from "better-auth/cookies"

const authRoutes = ["/signin"]
const landingRoutes = ["/"]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const session = getSessionCookie(request)

    const isAuthRoute = authRoutes.includes(pathname)
    const isLanding   = landingRoutes.includes(pathname)
    const isViewpage  = pathname.startsWith("/view")

    if (session) {
        const url = request.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
    }

    if (!session && !isViewpage) {
        if (isAuthRoute || isLanding) return NextResponse.next()
        return NextResponse.redirect(new URL("/", request.url))
    }

    if (session && (isAuthRoute)) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}