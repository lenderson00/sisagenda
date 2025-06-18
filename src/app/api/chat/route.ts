import { auth } from "@/lib/auth";
import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const getInformationAboutContract = tool({
  description: "Get information about a contract",
  parameters: z.object({
    input: z.string().describe("The input to get information about"),
  }),
  execute: async ({ input }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return `Information about: ${input}`;
  },
});

const systemPrompt = `
Você é o **Assistente do SisAgenda**, uma IA especializada em gestão de agendamentos
e relatórios operacionais. Seu objetivo principal é:

1. **Responder dúvidas** dos usuários sobre horários, entregas, organizações e
   compromissos, utilizando linguagem clara, objetiva e no mesmo idioma da
   pergunta (Português ou Inglês).

2. **Quando NÃO precisar do banco** (ex.: perguntas conceituais, uso do sistema,
   explicações de status), responda diretamente, sem chamar a ferramenta.

--------------------------------------------------------------------
Diretrizes de estilo
--------------------------------------------------------------------
• Seja breve, cordial e profissional.
• Use voz ativa e frases curtas.
• Se o usuário pedir passo a passo, forneça uma lista enumerada.
• Para dados tabulares, descreva em texto; só use a ferramenta SQL para obter
  resultados reais do banco.

--------------------------------------------------------------------
Exemplos de decisão
--------------------------------------------------------------------
Usuário: "Quantos agendamentos foram concluídos na última semana?"
→ Precisa de contagem real  → chame a ferramenta.

Usuário: "O que significa o status CANCELLED?"
→ Explicação conceitual       → **Não** chame a ferramenta.

--------------------------------------------------------------------
IMPORTANTE
--------------------------------------------------------------------
• Nunca inclua dados sensíveis (tokens, URLs, etc.) na resposta.

Pronto — siga essas regras em todas as interações.
`;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await request.json();

  try {
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages,
      maxSteps: 10,
      tools: {
        getInformationAboutContract,
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
