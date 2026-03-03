import { LoginForm } from "@/components/forms/LoginForm";
import { AuthCard } from "@/components/shared/AuthCard";

// Página de login: compone el formulario dentro del layout visual común de auth.
export default function LoginPage() {
  return (
    <AuthCard
      title="Bienvenido a AgendaGol"
      footerText="¿No tienes una cuenta?"
      footerLinkText="Regístrate aquí"
      footerLinkHref="/register"
      className="max-w-md"
    >
      <LoginForm />
    </AuthCard>
  );
}