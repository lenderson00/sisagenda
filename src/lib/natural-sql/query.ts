import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { Client } from "pg";
import { z } from "zod";

const systemPrompt = `
Você é um especialista em SQL (Postgres) e visualização de dados. Seu trabalho é ajudar o usuário a escrever uma query SQL para recuperar os dados que ele precisa. O esquema da tabela é o seguinte:

CREATE TYPE AppointmentStatus AS ENUM (
  'PENDING_CONFIRMATION',
  'CONFIRMED',
  'REJECTED',
  'CANCELLATION_REQUESTED',
  'CANCELLATION_REJECTED',
  'CANCELLED',
  'RESCHEDULE_REQUESTED',
  'RESCHEDULE_CONFIRMED',
  'RESCHEDULE_REJECTED',
  'RESCHEDULED',
  'COMPLETED',
  'SUPPLIER_NO_SHOW'
);

CREATE TYPE ActivityType AS ENUM (
  'CREATED',
  'UPDATED',
  'CANCELLED',
  'COMPLETED',
  'COMMENT',
  'STATUS_CHANGE',
  'RESCHEDULE_REQUESTED',
  'RESCHEDULE_CONFIRMED',
  'RESCHEDULE_REJECTED',
  'SUPPLIER_NO_SHOW',
  'DELIVERY_CONFIRMED',
  'DELIVERY_REJECTED',
  'OTHER'
);

CREATE TABLE Organization (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sigla VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  isActive BOOLEAN DEFAULT true,
  comimsupId VARCHAR(255),
  role OMRole DEFAULT 'DEPOSITO',
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  deletedAt TIMESTAMP
);

CREATE TABLE DeliveryType (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  isActive BOOLEAN DEFAULT true,
  organizationId VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  deletedAt TIMESTAMP
);

CREATE TABLE Appointment (
  id VARCHAR(255) PRIMARY KEY,
  internalId VARCHAR(255) NOT NULL UNIQUE,
  date TIMESTAMP NOT NULL,
  duration INTEGER NOT NULL,
  userId VARCHAR(255) NOT NULL,
  deliveryTypeId VARCHAR(255) NOT NULL,
  organizationId VARCHAR(255) NOT NULL,
  ordemDeCompra VARCHAR(255) NOT NULL UNIQUE,
  observations JSON,
  status AppointmentStatus DEFAULT 'PENDING_CONFIRMATION',
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now(),
  deletedAt TIMESTAMP
);

CREATE TABLE AppointmentActivity (
  id VARCHAR(255) PRIMARY KEY,
  type ActivityType NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  metadata JSON,
  appointmentId VARCHAR(255) NOT NULL,
  userId VARCHAR(255) NOT NULL,
  previousStatus AppointmentStatus,
  newStatus AppointmentStatus,
  priority INTEGER DEFAULT 0,
  isInternal BOOLEAN DEFAULT false,
  isVisible BOOLEAN DEFAULT true,
  parentId VARCHAR(255),
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);

Somente são permitidas queries de leitura (SELECT).

Para campos como industry, company e outros campos de texto, utilize o operador ILIKE e converta tanto o termo de busca quanto o campo para minúsculas usando a função LOWER().
Por exemplo:

LOWER(industry) ILIKE LOWER('%termo_de_busca%')

Observações importantes:
Como é POSTGRES use \" entre os campos.
Se o usuário solicitar uma número, retorne o valor como um decimal. Por exemplo, 0.1 significa 10%.

Se o usuário solicitar dados "ao longo do tempo", retorne os dados agrupados por ano (YEAR(date_joined)).

Ao buscar por Organization se o nome for grande use o campo name se for pequeno use o campo sigla.

Quando for buscar o que importa para o usuário é:
- Nome ou Sigla da Organização
- Data do agendamento
- Tipo de entrega

NUNCA INFORME O ID da Organização, SEMPRE INFORME O NOME OU SIGLA.

Quando for der a contagem de agendamentos sempre agrupe por organização caso não seja pedido outra coisa.

Toda query deve retornar dados quantitativos que possam ser plotados em um gráfico!
Deve haver pelo menos duas colunas.
Se o usuário pedir apenas uma coluna, retorne a coluna e a contagem dela (COUNT).
Se for uma taxa, retorne o valor como decimal. Por exemplo, 0.1 representa 10%.

`;

export const generateQuery = async (input: string) => {
  try {
    const result = await generateObject({
      model: openai("gpt-4o"),
      system: systemPrompt,
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
  // if (
  //   !query.trim().includes("SELECT") ||
  //   query.trim().toLowerCase().includes("drop") ||
  //   query.trim().toLowerCase().includes("delete") ||
  //   query.trim().toLowerCase().includes("insert") ||
  //   query.trim().toLowerCase().includes("update") ||
  //   query.trim().toLowerCase().includes("alter") ||
  //   query.trim().toLowerCase().includes("truncate") ||
  //   query.trim().toLowerCase().includes("create") ||
  //   query.trim().toLowerCase().includes("grant") ||
  //   query.trim().toLowerCase().includes("revoke")
  // ) {
  //   throw new Error("Only SELECT queries are allowed");
  // }

  let data: any;
  try {
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    data = await client.query(query);
    await client.end();
  } catch (e: any) {
    if (e.message.includes('relation "unicorns" does not exist')) {
      // throw error
      throw Error("Table does not exist");
    }

    throw e;
  }

  return data.rows;
};

// Define the schema for chart configuration
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

export const generateChartConfig = async (
  results: any[],
  userQuery: string,
) => {
  "use server";
  const system = "You are a data visualization expert. ";

  try {
    const { object: config } = await generateObject({
      model: openai("gpt-4o"),
      system,
      prompt: `Given the following data from a SQL query result, generate the chart config that best visualises the data and answers the users query.
      For multiple groups use multi-lines.

      Here is an example complete config:
      export const chartConfig = {
        type: "pie",
        xKey: "month",
        yKeys: ["sales", "profit", "expenses"],
        colors: {
          sales: "#4CAF50",    // Green for sales
          profit: "#2196F3",   // Blue for profit
          expenses: "#F44336"  // Red for expenses
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
