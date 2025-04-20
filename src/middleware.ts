import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/getSession";

export async function middleware(Request: NextRequest) {
    const session = await getSession();
    const path = Request.nextUrl.pathname;

    if(!(session?.user)) {
        if(path.startsWith("/profile") || path.startsWith("/admin") || path.startsWith("/orders")) {
            return NextResponse.redirect(new URL("/login", Request.url));
        }
        return NextResponse.next();
    }
    
    if(path.startsWith("/login") || path.startsWith("/sign-up")) {
        return NextResponse.redirect(new URL("/home", Request.url));
    }
    
    if(path.startsWith("/admin")) {
        if(session.user.role === "admin") return NextResponse.next();
        return NextResponse.redirect(new URL("/home", Request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/sign-up",
        "/profile/:path*",
        "/admin/:path*",
        "/orders/:path*",
    ]
}