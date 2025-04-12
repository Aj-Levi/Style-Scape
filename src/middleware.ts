import { NextRequest , NextResponse } from "next/server";
import { getSession } from "./lib/getSession";

export async function middleware(Request: NextRequest) {
    const session = await getSession();
    const path = Request.nextUrl.pathname;

    if(session?.user){
        console.log("reached in middleware")
        if(path.startsWith("/profile")) return NextResponse.next();
        if(path.startsWith("/admin")) {
            if(session.user.role === "admin") return NextResponse.next();
        }if(path.startsWith("/api")) {
            if(path.endsWith("/users") || path.startsWith("/api/categories")) {
                if(session.user.role === "admin") return NextResponse.next();
                return NextResponse.redirect(new URL("/home", Request.url));
            }
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/home", Request.url));
    }else{
        if(!path.startsWith("/login") && !path.startsWith("/sign-up")) return NextResponse.redirect(new URL("/login", Request.url));
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        "/login",
        "/sign-up",
        "/profile/:path*",
        "/admin/:path*",
        "/api/:path*"
    ]
}