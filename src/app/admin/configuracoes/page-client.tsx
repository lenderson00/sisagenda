"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganization } from "@/hooks/use-organization";
import { AdvancedTab } from "./_components/advanced-tab";
import { GeneralTab } from "./_components/general-tab";

interface ConfiguracoesPageClientProps {
  organizationId: string;
}

export function ConfiguracoesPageClient({
  organizationId,
}: ConfiguracoesPageClientProps) {
  const { data: organization, isLoading } = useOrganization(organizationId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Organização não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <GeneralTab organization={organization} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <AdvancedTab organization={organization} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
