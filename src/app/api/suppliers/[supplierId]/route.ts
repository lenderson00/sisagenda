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

    const supplier = await prisma.supplier.update({
      where: {
        id: supplierId,
      },
      data: {
        name,
        email,
        whatsapp: phone,
        cnpj: cnpj || undefined,
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
  { params }: { params: { supplierId: string } },
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const supplier = await prisma.supplier.update({
      where: {
        id: params.supplierId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

const patchSupplierSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
  whatsapp: z.string().min(1, "Telefone é obrigatório").optional(),
  cnpj: z.string().min(1, "CNPJ é obrigatório").optional(),
  address: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { supplierId: string } },
) {
  try {
    const session = await auth();

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "COMRJ_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const validatedBody = patchSupplierSchema.safeParse(body);

    if (!validatedBody.success) {
      return new NextResponse("Invalid body", { status: 400 });
    }

    const supplier = await prisma.supplier.update({
      where: {
        id: params.supplierId,
      },
      data: validatedBody.data,
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
