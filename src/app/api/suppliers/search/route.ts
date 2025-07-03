import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const cnpj = searchParams.get("cnpj");

    if (!cnpj) {
      return new NextResponse("CNPJ is required", { status: 400 });
    }

    // Search for supplier by CNPJ across all organizations
    const supplier = await prisma.user.findFirst({
      where: {
        cnpj: cnpj,
        role: "FORNECEDOR",
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        whatsapp: true,
        cnpj: true,
        address: true,
        isActive: true,
        organization: {
          select: {
            id: true,
            name: true,
            sigla: true,
          },
        },
      },
    });

    if (!supplier) {
      return new NextResponse("Supplier not found", { status: 404 });
    }

    // Transform the data to match the expected format
    const transformedSupplier = {
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.whatsapp,
      cnpj: supplier.cnpj,
      address: supplier.address,
      isActive: supplier.isActive,
      organization: supplier.organization,
    };

    return NextResponse.json(transformedSupplier);
  } catch (error) {
    console.error("[SUPPLIERS_SEARCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
