"use client";

import { useQuery } from "@tanstack/react-query";
import type { Appointment, Organization, User, DeliveryType } from "@prisma/client";

type AppointmentWithRelations = Appointment & {
  deliveryType: DeliveryType;
  user: User;
  organization: Organization;
};

type OrganizationWithRelations = Organization & {
  comimsup: Organization | null;
  militares: User[];
  deliveryTypes: DeliveryType[];
  appointments: Appointment[];
};

type UserWithRelations = User & {
  organization: Organization | null;
  appointments: Appointment[];
};

interface ConsultaFilters {
  type: "appointments" | "organizations" | "users" | "deliveryTypes" | "custom";
  filters: Record<string, any>;
  customQuery?: string;
}

async function fetchConsultaData(filters: ConsultaFilters) {
  const response = await fetch("/api/comimsup-admin/consulta", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  return response.json();
}

export function useConsultaData(filters: ConsultaFilters) {
  return useQuery({
    queryKey: ["consulta-data", filters],
    queryFn: () => fetchConsultaData(filters),
    enabled: false, // Only fetch when explicitly called
  });
}

// Mock data for development - replace with real API calls
export function useMockConsultaData(filters: ConsultaFilters) {
  return useQuery({
    queryKey: ["consulta-data", filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockData = {
        appointments: [
          {
            id: "1",
            internalId: "AP001",
            date: new Date("2024-01-15T10:00:00Z"),
            status: "CONFIRMED",
            ordemDeCompra: "OC001",
            user: { name: "João Silva", email: "joao@example.com" },
            organization: { name: "Depósito Central", sigla: "DC" },
            deliveryType: { name: "Entrega Padrão" },
          },
          {
            id: "2",
            internalId: "AP002",
            date: new Date("2024-01-16T14:30:00Z"),
            status: "PENDING_CONFIRMATION",
            ordemDeCompra: "OC002",
            user: { name: "Maria Santos", email: "maria@example.com" },
            organization: { name: "Depósito Norte", sigla: "DN" },
            deliveryType: { name: "Entrega Expressa" },
          },
        ],
        organizations: [
          {
            id: "1",
            name: "Depósito Central",
            sigla: "DC",
            role: "DEPOSITO",
            isActive: true,
            createdAt: new Date("2024-01-01"),
            militares: [{ id: "1", name: "Capitão Silva" }],
            deliveryTypes: [{ id: "1", name: "Entrega Padrão" }],
          },
          {
            id: "2",
            name: "Depósito Norte",
            sigla: "DN",
            role: "DEPOSITO",
            isActive: true,
            createdAt: new Date("2024-01-02"),
            militares: [{ id: "2", name: "Tenente Santos" }],
            deliveryTypes: [{ id: "2", name: "Entrega Expressa" }],
          },
        ],
        users: [
          {
            id: "1",
            name: "João Silva",
            email: "joao@example.com",
            role: "FORNECEDOR",
            postoGraduacao: "Capitão",
            isActive: true,
            organization: { name: "Depósito Central", sigla: "DC" },
          },
          {
            id: "2",
            name: "Maria Santos",
            email: "maria@example.com",
            role: "FORNECEDOR",
            postoGraduacao: "Tenente",
            isActive: true,
            organization: { name: "Depósito Norte", sigla: "DN" },
          },
        ],
        deliveryTypes: [
          {
            id: "1",
            name: "Entrega Padrão",
            description: "Entrega padrão com prazo de 24h",
            slug: "entrega-padrao",
            duration: 60,
            isActive: true,
            organization: { name: "Depósito Central", sigla: "DC" },
          },
          {
            id: "2",
            name: "Entrega Expressa",
            description: "Entrega expressa com prazo de 4h",
            slug: "entrega-expressa",
            duration: 30,
            isActive: true,
            organization: { name: "Depósito Norte", sigla: "DN" },
          },
        ],
      };

      if (filters.type === "custom") {
        return [{ result: "Custom query result", query: filters.customQuery }];
      }

      return mockData[filters.type] || [];
    },
    enabled: false,
  });
}
