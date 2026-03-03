import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    // Contenedor principal con fondo inspirado en el césped (Slate/Green)
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 relative p-4">
      {/* Decoración: Círculos desenfocados para dar profundidad (UI Moderna) */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[120px]" />

      {/* El 'children' es donde Next.js inyectará tu LoginForm automáticamente */}
      <section className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter">
            AGENDA<span className="text-green-500">GOL</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Gestión profesional de canchas deportivas 
          </p>
        </div>

        {children}
      </section>

      {/* Footer legal/informativo */}
      <footer className="absolute bottom-6 text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} Naowee Evaluación Técnica 
      </footer>
    </main>
  );
}
