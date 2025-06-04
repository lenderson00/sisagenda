"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DeliveryType {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organization: string;
}

interface DeliveryTypePageClientProps {
  deliveryType: DeliveryType;
}

export function DeliveryTypePageClient({
  deliveryType,
}: DeliveryTypePageClientProps) {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge
                  variant={deliveryType.isActive ? "default" : "secondary"}
                  className="mt-1"
                >
                  {deliveryType.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Slug</p>
                <p className="mt-1 text-sm text-gray-900">
                  {deliveryType.slug}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Criado em</p>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(deliveryType.createdAt), "PPP", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Última atualização
                </p>
                <p className="mt-1 text-sm text-gray-900">
                  {format(new Date(deliveryType.updatedAt), "PPP", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
