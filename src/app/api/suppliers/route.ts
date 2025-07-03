import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSupplierSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  address: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return new NextResponse("Organization ID is required", { status: 400 });
    }

    const suppliers = await prisma.user.findMany({
      where: {
        organizationId,
        role: "FORNECEDOR",
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("[SUPPLIERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const validatedBody = createSupplierSchema.safeParse(body);

    if (!validatedBody.success) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    const { name, email, phone, cnpj, address } = validatedBody.data;

    // Check if a supplier with this CNPJ already exists globally
    const existingSupplier = await prisma.user.findFirst({
      where: {
        cnpj: cnpj,
        role: "FORNECEDOR",
        deletedAt: null,
      },
    });

    if (existingSupplier) {
      return new NextResponse("A supplier with this CNPJ already exists", { status: 409 });
    }

    // Check if email is already in use
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
        deletedAt: null,
      },
    });

    if (existingEmail) {
      return new NextResponse("A user with this email already exists", { status: 409 });
    }

    const hashedPassword = await hash("Fornecedor@2025", 10);

    // Create the supplier for the current organization
    const supplier = await prisma.user.create({
      data: {
        name: name,
        email: email,
        whatsapp: phone,
        cnpj: cnpj,
        address: address || "",
        organizationId: session.user.organizationId,
        role: "FORNECEDOR",
        isActive: true,
        password: hashedPassword,
        mustChangePassword: true,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
