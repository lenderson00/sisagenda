import { Button } from "@/components/ui/button";
import BlockPageClient from "./page-client";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function BlockDatePage({ params }: Params) {
  const { id } = await params;

  return (
    <div className="flex-col">
      <PageHeader
        title="Bloqueio de Datas"
        subtitle="Gerencie os períodos em que os serviços não estarão disponíveis."
        className="p-0"
      >
        <Button asChild>
          <Link href={`/disponibilidade/${id}/sobescrever-datas/novo`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar uma substituição
          </Link>
        </Button>
      </PageHeader>

      <BlockPageClient />
    </div>
  );
}
