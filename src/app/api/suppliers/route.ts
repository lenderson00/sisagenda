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
    const search = searchParams.get("search");

    const where = {
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { cnpj: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const suppliers = await prisma.supplier.findMany({
      where: where as any,
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

    if (
      session.user.role !== "ADMIN" &&
      session.user.role !== "SUPER_ADMIN" &&
      session.user.role !== "COMRJ_ADMIN"
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const validatedBody = createSupplierSchema.safeParse(body);

    if (!validatedBody.success) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    const { name, email, phone, cnpj, address } = validatedBody.data;

    // Check if a supplier with this CNPJ already exists globally
    const existingSupplier = await prisma.supplier.findFirst({
      where: {
        cnpj: cnpj,
        deletedAt: null,
      },
    });

    if (existingSupplier) {
      return new NextResponse("A supplier with this CNPJ already exists", {
        status: 409,
      });
    }

    const hashedPassword = await hash("Fornecedor@2025", 10);

    const supplier = await prisma.supplier.create({
      data: {
        name,
        email,
        whatsapp: phone,
        cnpj,
        address: address || "",
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
