import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug) {
    return new Response(JSON.stringify({ error: "Slug is required" }), {
      status: 400,
    });
  }

  try {
    const organization = await prisma.organization.findUnique({
      where: {
        sigla: slug,
      },
    });

    if (!organization) {
      return new Response(JSON.stringify({ error: "Organization not found" }), {
        status: 404,
      });
    }

    return NextResponse.json(organization);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "An error occurred while fetching the organization",
      }),
      { status: 500 },
    );
  }
}
