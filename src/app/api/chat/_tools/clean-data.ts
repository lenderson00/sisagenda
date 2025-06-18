import { generateChartConfig, generateQuery, runGenerateSQLQuery } from "@/lib/natural-sql/query";
import { tool } from "ai";
import z from "zod";

export const cleanData = tool({
  description: "Limpa os dados para o usuário",
  parameters: z.object({
    data: z.string().describe("Os dados brutos que você recebeu da tool getContentFromDb"),
    userQuery: z.string().describe("A consulta do usuário"),
  }),
  execute: async ({ data, userQuery }) => {
    try {
      const result = await generateChartConfig(JSON.parse(data), userQuery);
      console.log("result", result);
      return result;
    } catch (error) {
      console.error(error);
      return `Erro ao buscar conteúdo do banco de dados: ${error}`;
    }
  },
});