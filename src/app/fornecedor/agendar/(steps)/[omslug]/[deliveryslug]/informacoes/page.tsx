import { DetailsForm } from "./_components/details-form";

export default function AppointmentDetailsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mx-auto !container w-full">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="text-3xl font-bold">Informações do Agendamento</h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para concluir o seu agendamento.
          </p>
        </div>
        <DetailsForm />
      </div>
    </div>
  );
}
