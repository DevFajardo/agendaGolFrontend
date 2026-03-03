import { RegisterForm } from "@/components/forms/RegisterForm";
import { AuthCard } from "@/components/shared/AuthCard";

// Página de registro: reutiliza el mismo contenedor visual y cambia el formulario.
export default function RegisterPage() {
  return (
    <AuthCard
      title="Únete a AgendaGol"
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthCard>
  );
}
