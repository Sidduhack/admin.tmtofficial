import { createServerSupabaseClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/videos", "/gallery", "/community", "/about", "/contact", "/join"];
  const isPublicPath = publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  const isApiPath = pathname.startsWith("/api/");
  const isStaticAsset = pathname.startsWith("/_next/") || pathname.startsWith("/favicon") || pathname.includes(".");

  if (isPublicPath || isApiPath || isStaticAsset) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const supabase = createServerSupabaseClient({
      get: (name) => request.cookies.get(name)?.value,
      set: (name, value, options) => request.cookies.set({ name, value, ...options }),
      remove: (name, options) => request.cookies.set({ name, value: "", ...options, maxAge: 0 }),
    });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = new URL("/join", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (!adminUser) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-admin-role", adminUser.role);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
};