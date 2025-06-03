import { Stepper } from "../../../_component/stepper";
import { DataPageClient } from "./page-client";

export default function DataPage() {
  return (
    <>
      <Stepper step={4} totalSteps={5} />
      <DataPageClient />
    </>
  );
}
