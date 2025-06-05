import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateCNPJ } from "@/lib/utils";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSupplierSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  cnpj: z.string().min(1, "CNPJ é obrigatório"),
  address: z.string().optional(),
});

const updateSupplierSchema = createSupplierSchema.partial();

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ supplierId: string }> },
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const validatedBody = updateSupplierSchema.safeParse(body);

    if (!validatedBody.success) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    const { name, email, phone, cnpj, address } = validatedBody.data;

    if (cnpj && !validateCNPJ(cnpj)) {
      return new NextResponse("Invalid CNPJ", { status: 400 });
    }

    const { supplierId } = await params;

    if (!supplierId) {
      return new NextResponse("Supplier ID is required", { status: 400 });
    }

    const supplier = await prisma.user.update({
      where: {
        id: supplierId,
        role: "FORNECEDOR",
      },
      data: {
        name,
        email,
        whatsapp: phone,
        cnpj: cnpj || null,
        address: address || "",
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ supplierId: string }> },
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { supplierId } = await params;

    if (!supplierId) {
      return new NextResponse("Supplier ID is required", { status: 400 });
    }

    const supplier = await prisma.user.delete({
      where: {
        id: supplierId,
        role: "FORNECEDOR",
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
