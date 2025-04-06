import { NextRequest , NextResponse } from "next/server";
import { getSession } from "./lib/getSession";

export async function middleware(Request: NextRequest) {
    const session = await getSession();

    if(session?.user){
        console.log("reached in middleware")
        return NextResponse.redirect(new URL("/home", Request.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/sign-up"
    ]
}