"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  IconDatabase,
  IconSearch,
  IconTable,
  IconRefresh,
  IconFilter,
} from "@tabler/icons-react";
import { useState } from "react";
import { ConsultaResultsTable } from "./_components/consulta-results-table";
import { useConsultaData } from "./_hooks/use-consulta-data";

type QueryType =
  | "appointments"
  | "organizations"
  | "users"
  | "deliveryTypes"
  | "custom";

interface QueryBuilder {
  type: QueryType;
  filters: Record<string, any>;
  customQuery?: string;
}

export function ConsultaParametrizadaClient() {
  const [queryBuilder, setQueryBuilder] = useState<QueryBuilder>({
    type: "appointments",
    filters: {},
  });

  const { data: results, isLoading, refetch } = useConsultaData(queryBuilder);

  const handleQueryTypeChange = (type: QueryType) => {
    setQueryBuilder((prev) => ({ ...prev, type, filters: {} }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setQueryBuilder((prev) => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
    }));
  };

  const handleCustomQueryChange = (query: string) => {
    setQueryBuilder((prev) => ({ ...prev, customQuery: query }));
  };

  const executeQuery = async () => {
    await refetch();
  };

  const clearFilters = () => {
    setQueryBuilder((prev) => ({
      ...prev,
      filters: {},
      customQuery: undefined,
    }));
  };

  const renderFilterFields = () => {
    switch (queryBuilder.type) {
      case "appointments":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING_CONFIRMATION">
                    Pendente de Confirmação
                  </SelectItem>
                  <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                  <SelectItem value="REJECTED">Rejeitado</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                  <SelectItem value="SUPPLIER_NO_SHOW">
                    Fornecedor Não Compareceu
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="organization">Organização</Label>
              <Input
                id="organization"
                placeholder="Nome da organização"
                onChange={(e) =>
                  handleFilterChange("organization", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                placeholder="Nome do fornecedor"
                onChange={(e) => handleFilterChange("supplier", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateFrom">Data Início</Label>
              <Input
                id="dateFrom"
                type="date"
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Data Fim</Label>
              <Input
                id="dateTo"
                type="date"
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ordemDeCompra">Ordem de Compra</Label>
              <Input
                id="ordemDeCompra"
                placeholder="Número da OC"
                onChange={(e) =>
                  handleFilterChange("ordemDeCompra", e.target.value)
                }
              />
            </div>
          </div>
        );

      case "organizations":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="role">Papel</Label>
              <Select
                onValueChange={(value) => handleFilterChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DEPOSITO">Depósito</SelectItem>
                  <SelectItem value="COMIMSUP">COMIMSUP</SelectItem>
                  <SelectItem value="COMRJ">COMRJ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Nome da organização"
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sigla">Sigla</Label>
              <Input
                id="sigla"
                placeholder="Sigla da organização"
                onChange={(e) => handleFilterChange("sigla", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="isActive">Status</Label>
              <Select
                onValueChange={(value) =>
                  handleFilterChange("isActive", value === "true")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="userRole">Papel do Usuário</Label>
              <Select
                onValueChange={(value) => handleFilterChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FORNECEDOR">Fornecedor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="COMIMSUP_ADMIN">COMIMSUP Admin</SelectItem>
                  <SelectItem value="COMRJ_ADMIN">COMRJ Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="USER">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="userName">Nome</Label>
              <Input
                id="userName"
                placeholder="Nome do usuário"
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                placeholder="Email do usuário"
                onChange={(e) => handleFilterChange("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="postoGraduacao">Posto/Graduação</Label>
              <Input
                id="postoGraduacao"
                placeholder="Posto ou graduação"
                onChange={(e) =>
                  handleFilterChange("postoGraduacao", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor="isActive">Status</Label>
              <Select
                onValueChange={(value) =>
                  handleFilterChange("isActive", value === "true")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "deliveryTypes":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dtName">Nome</Label>
              <Input
                id="dtName"
                placeholder="Nome do tipo de entrega"
                onChange={(e) => handleFilterChange("name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dtSlug">Slug</Label>
              <Input
                id="dtSlug"
                placeholder="Slug do tipo de entrega"
                onChange={(e) => handleFilterChange("slug", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dtIsActive">Status</Label>
              <Select
                onValueChange={(value) =>
                  handleFilterChange("isActive", value === "true")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dtOrganization">Organização</Label>
              <Input
                id="dtOrganization"
                placeholder="Nome da organização"
                onChange={(e) =>
                  handleFilterChange("organization", e.target.value)
                }
              />
            </div>
          </div>
        );

      case "custom":
        return (
          <div>
            <Label htmlFor="customQuery">Query SQL Personalizada</Label>
            <Textarea
              id="customQuery"
              placeholder="Digite sua query SQL aqui... (Ex: SELECT * FROM appointments WHERE status = 'CONFIRMED')"
              className="min-h-[120px] font-mono text-sm"
              onChange={(e) => handleCustomQueryChange(e.target.value)}
            />
            <div className="mt-2 space-y-2">
              <p className="text-sm text-muted-foreground">
                ⚠️ Use com cuidado. Queries personalizadas podem afetar a
                performance do sistema.
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>Tabelas disponíveis:</strong> appointments,
                  organizations, users, delivery_types, appointment_items,
                  appointment_activities
                </p>
                <p>
                  <strong>Exemplo:</strong> SELECT a.*, o.name as org_name FROM
                  appointments a JOIN organizations o ON a.organization_id =
                  o.id WHERE o.role = 'DEPOSITO'
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader
        title="Consulta Parametrizada"
        subtitle="Construa consultas personalizadas no banco de dados das organizações sob sua responsabilidade"
      />

      <div className="grid gap-6 p-4">
        {/* Query Builder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDatabase className="h-5 w-5" />
              Construtor de Consulta
            </CardTitle>
            <CardDescription>
              Selecione o tipo de consulta e configure os filtros desejados.
              Você tem acesso a todas as organizações onde COMIMSUP é o parent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Query Type Selection */}
            <div>
              <Label htmlFor="queryType">Tipo de Consulta</Label>
              <Select
                onValueChange={(value: QueryType) =>
                  handleQueryTypeChange(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de consulta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appointments">Agendamentos</SelectItem>
                  <SelectItem value="organizations">
                    Organizações Militares
                  </SelectItem>
                  <SelectItem value="users">Usuários</SelectItem>
                  <SelectItem value="deliveryTypes">
                    Tipos de Entrega
                  </SelectItem>
                  <SelectItem value="custom">Query Personalizada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Fields */}
            {queryBuilder.type && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IconFilter className="h-4 w-4" />
                  <Label>Filtros</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="ml-auto"
                  >
                    <IconRefresh className="mr-2 h-4 w-4" />
                    Limpar
                  </Button>
                </div>
                <div className="space-y-4">{renderFilterFields()}</div>
              </div>
            )}

            {/* Execute Button */}
            <Button
              onClick={executeQuery}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              <IconSearch className="mr-2 h-4 w-4" />
              {isLoading ? "Executando..." : "Executar Consulta"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {results && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTable className="h-5 w-5" />
                Resultados da Consulta
              </CardTitle>
              <CardDescription>
                Dados encontrados com base nos filtros aplicados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConsultaResultsTable
                data={results}
                queryType={queryBuilder.type}
              />
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {results && results.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-muted-foreground">
                <IconTable className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Nenhum resultado encontrado com os filtros aplicados</p>
                <p className="text-sm">
                  Tente ajustar os filtros ou selecionar outro tipo de consulta
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
