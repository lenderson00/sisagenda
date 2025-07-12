import { auth } from "@/lib/auth";
import { prisma as db } from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "COMIMSUP_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, filters, customQuery } = body;

    // Get the COMIMSUP organization ID for the current user
    const comimsupOrg = await db.organization.findFirst({
      where: {
        role: "COMIMSUP",
        militares: {
          some: {
            id: session.user.id,
          },
        },
      },
    });

    if (!comimsupOrg) {
      return NextResponse.json(
        { error: "COMIMSUP organization not found" },
        { status: 404 },
      );
    }

    // Get all child organizations where COMIMSUP is the parent
    const childOrganizations = await db.organization.findMany({
      where: {
        comimsupId: comimsupOrg.id,
        isActive: true,
      },
      select: { id: true },
    });

    const childOrgIds = childOrganizations.map((org: { id: string }) => org.id);

    let results: any[] = [];

    switch (type) {
      case "appointments":
        results = await db.appointment.findMany({
          where: {
            organizationId: { in: childOrgIds },
            ...(filters.status && { status: filters.status }),
            ...(filters.organization && {
              organization: {
                name: { contains: filters.organization, mode: "insensitive" },
              },
            }),
            ...(filters.supplier && {
              Supplier: {
                name: { contains: filters.supplier, mode: "insensitive" },
              },
            }),
            ...(filters.ordemDeCompra && {
              ordemDeCompra: {
                contains: filters.ordemDeCompra,
                mode: "insensitive",
              },
            }),
            ...(filters.dateFrom && {
              date: { gte: new Date(filters.dateFrom) },
            }),
            ...(filters.dateTo && { date: { lte: new Date(filters.dateTo) } }),
          },
          include: {
            user: {
              select: { name: true, email: true },
            },
            Supplier: {
              select: { name: true, email: true },
            },
            organization: {
              select: { name: true, sigla: true },
            },
            deliveryType: {
              select: { name: true },
            },
          },
          orderBy: { date: "desc" },
        });
        break;

      case "organizations":
        results = await db.organization.findMany({
          where: {
            comimsupId: comimsupOrg.id,
            ...(filters.role && { role: filters.role }),
            ...(filters.name && {
              name: { contains: filters.name, mode: "insensitive" },
            }),
            ...(filters.sigla && {
              sigla: { contains: filters.sigla, mode: "insensitive" },
            }),
            ...(filters.isActive !== undefined && {
              isActive: filters.isActive,
            }),
          },
          include: {
            militares: {
              select: { id: true, name: true },
            },
            deliveryTypes: {
              select: { id: true, name: true },
            },
            appointments: {
              select: { id: true },
            },
          },
          orderBy: { name: "asc" },
        });
        break;

      case "users":
        results = await db.user.findMany({
          where: {
            organizationId: { in: childOrgIds },
            ...(filters.role && { role: filters.role }),
            ...(filters.name && {
              name: { contains: filters.name, mode: "insensitive" },
            }),
            ...(filters.email && {
              email: { contains: filters.email, mode: "insensitive" },
            }),
            ...(filters.postoGraduacao && {
              postoGraduacao: {
                contains: filters.postoGraduacao,
                mode: "insensitive",
              },
            }),
            ...(filters.isActive !== undefined && {
              isActive: filters.isActive,
            }),
          },
          include: {
            organization: {
              select: { name: true, sigla: true },
            },
            appointments: {
              select: { id: true },
            },
          },
          orderBy: { name: "asc" },
        });
        break;

      case "deliveryTypes":
        results = await db.deliveryType.findMany({
          where: {
            organizationId: { in: childOrgIds },
            ...(filters.name && {
              name: { contains: filters.name, mode: "insensitive" },
            }),
            ...(filters.slug && {
              slug: { contains: filters.slug, mode: "insensitive" },
            }),
            ...(filters.isActive !== undefined && {
              isActive: filters.isActive,
            }),
            ...(filters.organization && {
              organization: {
                name: { contains: filters.organization, mode: "insensitive" },
              },
            }),
          },
          include: {
            organization: {
              select: { name: true, sigla: true },
            },
          },
          orderBy: { name: "asc" },
        });
        break;

      case "custom":
        if (!customQuery) {
          return NextResponse.json(
            { error: "Custom query is required" },
            { status: 400 },
          );
        }

        // For security, only allow SELECT queries
        if (!customQuery.trim().toUpperCase().startsWith("SELECT")) {
          return NextResponse.json(
            { error: "Only SELECT queries are allowed" },
            { status: 400 },
          );
        }

        // Execute custom query (be careful with this in production)
        try {
          const customResults = await db.$queryRawUnsafe(customQuery);
          results = customResults as any[];
        } catch (error) {
          return NextResponse.json(
            { error: "Invalid SQL query" },
            { status: 400 },
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: "Invalid query type" },
          { status: 400 },
        );
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in consulta API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
