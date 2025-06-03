export default function AgendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-start pt-24 h-screen bg-muted">
      <div className="max-w-md w-full flex flex-col gap-4 items-center">
        <h1 className="text-xl font-bold">Novo Agendamento</h1>
        {children}
      </div>
      <div className=" mt-4 text-sm text-muted-foreground">SisAgenda</div>
    </div>
  );
}
