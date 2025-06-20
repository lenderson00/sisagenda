import { Stepper } from "@/app/fornecedor/agendar/_component/stepper";
import { DetailsForm } from "./_components/details-form";

export default function AppointmentDetailsPage() {
  return (
    <>
      <Stepper step={5} totalSteps={6} />
      <div className="container mx-auto w-full">
        <DetailsForm />
      </div>
    </>
  );
}
