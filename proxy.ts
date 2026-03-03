import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // <--- Corregido de 'next/request' a 'next/server'

export function proxy(request: NextRequest) {
  // 1. Obtenemos las cookies directamente del request
  const token = request.cookies.get("auth-token")?.value;
  const userRole = request.cookies.get("user-role")?.value;

  const { pathname } = request.nextUrl;

  // 2. Si intenta entrar al dashboard sin estar logueado
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Protección de Rutas por Rol (Admin intentando entrar a User o viceversa)
  if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/user", request.url));
  }

  if (pathname.startsWith("/dashboard/user") && userRole !== "user") {
    // Si no es user (es admin), lo mandamos a su panel
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  }

  // 4. Evitar que alguien logueado vuelva al Login/Register
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(
      new URL(`/dashboard/${userRole}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Aplicar a todas las rutas de dashboard y auth
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
