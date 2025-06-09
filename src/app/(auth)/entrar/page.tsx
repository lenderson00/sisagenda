"server only";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col gap-6">
        <LoginForm />
      </div>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Ao continuar, você concorda com nossos{" "}
        <a href="/termos-de-servico">Termos de Serviço</a> e{" "}
        <a href="/politica-de-privacidade">Política de Privacidade</a>.
      </div>
    </>
  );
}
