import { getFilterFieldsConfig } from "@/lib/query/buildWhere";

export async function GET() {
  try {
    const config = getFilterFieldsConfig();

    return Response.json({
      success: true,
      data: config,
    });
  } catch (error) {
    console.error("Error getting filter configuration:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to get filter configuration",
      },
      { status: 500 },
    );
  }
}
