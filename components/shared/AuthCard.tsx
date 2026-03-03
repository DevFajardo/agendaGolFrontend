import Link from "next/link";
import { ReactNode } from "react";

// Contenedor visual reutilizable para pantallas de autenticación.
// Recibe el formulario como children y un pie con navegación entre login/register.
interface AuthCardProps {
  title: string;
  children: ReactNode;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
  className?: string;
}

export function AuthCard({
  title,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  className = "",
}: AuthCardProps) {
  return (
    // Card base compartida para mantener consistencia entre flujos de auth.
    <div className={`bg-white p-8 rounded-2xl shadow-xl w-full ${className}`.trim()}>
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">{title}</h2>
      {children}
      <p className="mt-6 text-center text-sm text-gray-600">
        {footerText}{" "}
        <Link href={footerLinkHref} className="text-green-600 font-bold hover:underline">
          {footerLinkText}
        </Link>
      </p>
    </div>
  );
}
