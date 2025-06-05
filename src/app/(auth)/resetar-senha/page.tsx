import { ResetarSenhaForm } from "./_components/resetar-senha-form";

const ResetarSenhaPage = () => {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetarSenhaForm />
      </div>
    </div>
  );
};

export default ResetarSenhaPage;
