"use server";

import { openai } from "@ai-sdk/openai";
import { Client } from "pg";
import { generateObject } from "ai";
import { z } from "zod";

export type Result = Record<string, string | number>;

export const configSchema = z
  .object({
    description: z
      .string()
      .describe(
        "Describe the chart. What is it showing? What is interesting about the way the data is displayed?",
      ),
    takeaway: z.string().describe("What is the main takeaway from the chart?"),
    type: z.enum(["bar", "line", "area", "pie"]).describe("Type of chart"),
    title: z.string(),
    xKey: z.string().describe("Key for x-axis or category"),
    yKeys: z
      .array(z.string())
      .describe(
        "Key(s) for y-axis values this is typically the quantitative column",
      ),
    multipleLines: z
      .boolean()
      .describe(
        "For line charts only: whether the chart is comparing groups of data.",
      )
      .optional(),
    measurementColumn: z
      .string()
      .describe(
        "For line charts only: key for quantitative y-axis column to measure against (eg. values, counts etc.)",
      )
      .optional(),
    lineCategories: z
      .array(z.string())
      .describe(
        "For line charts only: Categories used to compare different lines or data series. Each category represents a distinct line in the chart.",
      )
      .optional(),
    colors: z
      .record(
        z.string().describe("Any of the yKeys"),
        z.string().describe("Color value in CSS format (e.g., hex, rgb, hsl)"),
      )
      .describe("Mapping of data keys to color values for chart elements")
      .optional(),
    legend: z.boolean().describe("Whether to show legend"),
  })
  .describe("Chart configuration object");

export type Config = z.infer<typeof configSchema>;

export const generateQuery = async (input: string) => {
  "use server";
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: `You are a SQL (postgres) and data visualization expert. Your job is to help the user write a SQL query to retrieve the data they need. The database schema is as follows, focusing on appointments.

      The main table is "Appointment":
      - id: String (Primary Key)
      - internalId: String (Unique)
      - date: DateTime
      - duration: Int (in minutes)
      - userId: String (Foreign Key to User.id)
      - deliveryTypeId: String (Foreign Key to DeliveryType.id)
      - organizationId: String (Foreign Key to Organization.id)
      - ordemDeCompra: String (Unique)
      - observations: JSON
      - status: String (Enum)
      - createdAt: DateTime
      - updatedAt: DateTime

      Related tables:
      - "User": Contains user information. Key columns: id, name, email.
      - "Organization": Contains organization information. Key columns: id, name, sigla.
      - "DeliveryType": Contains delivery type information. Key columns: id, name, slug.

      When user asks about user, organization, or delivery type, you should focus on their names. For example, to get user name for an appointment, you would join "Appointment" with "User" on "Appointment"."userId" = "User"."id" and select "User"."name".

      The possible values for the "status" column in the "Appointment" table are:
      - PENDING_CONFIRMATION
      - CONFIRMED
      - REJECTED
      - CANCELLATION_REQUESTED
      - CANCELLATION_REJECTED
      - CANCELLED
      - RESCHEDULE_REQUESTED
      - RESCHEDULE_CONFIRMED
      - RESCHEDULE_REJECTED
      - RESCHEDULED
      - COMPLETED
      - SUPPLIER_NO_SHOW

      Guidelines:
      - Only retrieval queries (SELECT) are allowed.
      - For string comparisons, use the ILIKE operator and convert both the search term and the field to lowercase using the LOWER() function. For example: LOWER("User".name) ILIKE LOWER('%search_term%').
      - Remember to use double quotes for table and column names with mixed case, like "User" or "deliveryTypeId".
      - When dealing with dates, you can use functions like DATE_TRUNC to group by year, month, day, etc.
      - If the user asks for 'over time' data, return by year or month depending on the context.
      - EVERY QUERY SHOULD RETURN QUANTITATIVE DATA THAT CAN BE PLOTTED ON A CHART! There should always be at least two columns. If the user asks for a single metric (e.g., 'how many appointments are confirmed?'), you should return the status and the count.
      - The user's main interest is in appointments. All queries should primarily serve to answer questions about appointments.
    `,
      prompt: `Generate the query necessary to retrieve the data the user wants: ${input}`,
      schema: z.object({
        query: z.string(),
      }),
    });
    return result.object.query;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to generate query");
  }
};

export const runGenerateSQLQuery = async (query: string) => {
  "use server";
  // Check if the query is a SELECT statement
  if (
    !query.trim().toLowerCase().startsWith("select") ||
    query.trim().toLowerCase().includes("drop") ||
    query.trim().toLowerCase().includes("delete") ||
    query.trim().toLowerCase().includes("insert") ||
    query.trim().toLowerCase().includes("update") ||
    query.trim().toLowerCase().includes("alter") ||
    query.trim().toLowerCase().includes("truncate") ||
    query.trim().toLowerCase().includes("create") ||
    query.trim().toLowerCase().includes("grant") ||
    query.trim().toLowerCase().includes("revoke")
  ) {
    throw new Error("Only SELECT queries are allowed");
  }

  let data: any;
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    data = await client.query(query);
    await client.end();
  } catch (e: any) {
    if (e.message.includes('relation "Appointment" does not exist')) {
      console.log(
        "Table 'Appointment' does not exist. Please check your database.",
      );
      // throw error
      throw Error("Table 'Appointment' does not exist");
    } else {
      throw e;
    }
  }

  return data.rows as Result[];
};

export const generateChartConfig = async (
  results: Result[],
  userQuery: string,
) => {
  "use server";
  const system = `You are a data visualization expert. `;

  try {
    const { object: config } = await generateObject({
      model: openai("gpt-4o"),
      system,
      prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
      For multiple groups use multi-lines.

      Here is an example complete config:
      export const chartConfig = {
        type: "pie",
        xKey: "status",
        yKeys: ["count"],
        colors: {
          count: "#4CAF50"
        },
        legend: true
      }

      User Query:
      ${userQuery}

      Data:
      ${JSON.stringify(results, null, 2)}`,
      schema: configSchema,
    });

    const colors: Record<string, string> = {};
    config.yKeys.forEach((key, index) => {
      colors[key] = `hsl(var(--chart-${index + 1}))`;
    });

    const updatedConfig: Config = { ...config, colors };
    return { config: updatedConfig };
  } catch (e) {
    // @ts-expect-errore
    console.error(e.message);
    throw new Error("Failed to generate chart suggestion");
  }
};
