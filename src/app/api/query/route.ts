import { prisma } from "@/lib/prisma";
import { buildSelect } from "@/lib/query/buildSelect";
import { buildWhere } from "@/lib/query/buildWhere";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filters = JSON.parse(searchParams.get("filters") || "[]");
  const columns = searchParams.get("columns")?.split(",") || [];
  const limit = Number.parseInt(searchParams.get("limit") || "100", 10);
  const cursor = searchParams.get("cursor") || undefined;

  const where = buildWhere(filters);
  const select = buildSelect(columns);

  const result = await prisma.appointment.findMany({
    where,
    select,
    take: limit + 1, // Take one extra to determine if there are more pages
    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1, // Skip the cursor itself
    }),
    orderBy: {
      createdAt: "desc",
    },
  });

  // Check if there are more pages
  const hasNextPage = result.length > limit;
  const appointments = hasNextPage ? result.slice(0, -1) : result;
  const nextCursor = hasNextPage ? result[result.length - 2]?.id : null;

  return Response.json({
    data: appointments,
    pagination: {
      hasNextPage,
      nextCursor,
      limit,
    },
  });
}
