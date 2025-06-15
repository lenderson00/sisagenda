import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useOrganizations } from "../_hooks/use-organizations";

export function SectionCards() {
  const { data: organizations, isLoading } = useOrganizations();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const totalOrganizations = organizations?.length || 0;
  const activeOrganizations =
    organizations?.filter((org) => org.isActive).length || 0;
  const inactiveOrganizations =
    organizations?.filter((org) => !org.isActive).length || 0;

  return (
    <div className="flex flex-col md:flex-row gap-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card flex-1">
        <CardHeader className="relative">
          <CardDescription>Total de Organizações</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {totalOrganizations}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              {((activeOrganizations / totalOrganizations) * 100).toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total de organizações registradas{" "}
            <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Todas as organizações no sistema
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card flex-1">
        <CardHeader className="relative">
          <CardDescription>Organizações Ativas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {activeOrganizations}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              {((activeOrganizations / totalOrganizations) * 100).toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Atualmente ativas <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Organizações em situação regular
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card flex-1">
        <CardHeader className="relative">
          <CardDescription>Organizações Inativas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {inactiveOrganizations}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              {((inactiveOrganizations / totalOrganizations) * 100).toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Necessitam atenção <TrendingDownIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Organizações que precisam de revisão
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
