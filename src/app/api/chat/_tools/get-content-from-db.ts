import { generateQuery, runGenerateSQLQuery } from "@/lib/natural-sql/query";
import { tool } from "ai";
import z from "zod";

export const getContentFromDb = tool({
  description: "Pega conteúdos sobre agendamentos diretamente do banco de dados",
  parameters: z.object({
    input: z.string().describe("O que você quer saber sobre agendamentos?"),
  }),

  execute: async ({ input }) => {
    try {
      const query = await generateQuery(input);
      const data = await runGenerateSQLQuery(query);
      return { data, instructions: "Agora rode a tool cleanData para limpar os dados e retornar para o usuário" };
    } catch (error) {
      console.error(error);
      return `Erro ao buscar conteúdo do banco de dados: ${error}`;
    }
  },
});