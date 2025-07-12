"use client";

import { DeliveryType, Organization } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ClipboardCopy } from "lucide-react";

interface DeliveryTypesListProps {
  organizationId: string;
  organizationSigla: string;
}

async function getDeliveryTypes(
  organizationId: string,
): Promise<DeliveryType[]> {
  const response = await fetch(
    `/api/organizations/${organizationId}/delivery-types`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch delivery types");
  }
  return response.json();
}

export function DeliveryTypesList({
  organizationId,
  organizationSigla,
}: DeliveryTypesListProps) {
  const { data: deliveryTypes = [], isLoading } = useQuery({
    queryKey: ["deliveryTypes", organizationId],
    queryFn: () => getDeliveryTypes(organizationId),
  });

  const handleCopyLink = (deliverySlug: string) => {
    const url = `${window.location.origin}/agendar/${organizationSigla}/${deliverySlug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado para a área de transferência!");
  };

  if (isLoading) return <div>Carregando tipos de entrega...</div>;

  return (
    <div>
      {deliveryTypes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deliveryTypes.map((deliveryType) => (
            <Card key={deliveryType.id}>
              <CardHeader>
                <CardTitle>{deliveryType.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{deliveryType.description}</p>
                <div className="mt-4">
                  <Badge>{deliveryType.duration} min</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(deliveryType.slug)}
                >
                  <ClipboardCopy className="w-4 h-4 mr-2" />
                  Copiar Link
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>Nenhum tipo de entrega encontrado.</p>
      )}
    </div>
  );
}
