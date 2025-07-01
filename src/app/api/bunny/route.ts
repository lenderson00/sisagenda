import type { NextRequest } from "next/server";

const API_KEY = process.env.BUNNY_API_KEY || "";
const STORAGE_ZONE = "framer";
const CDN_BASE_URL = "https://framer.b-cdn.net";
const STORAGE_BASE_URL = `https://storage.bunnycdn.com/${STORAGE_ZONE}/sisagenda`;

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response("Arquivo não encontrado", { status: 400 });
  }

  const uploadUrl = `${STORAGE_BASE_URL}/${file.name}`;

  try {
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: API_KEY,
        "Content-Type": "application/octet-stream",
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      console.error(await uploadResponse.text());
      return new Response("Erro ao fazer upload no BunnyCDN", { status: 500 });
    }

    return new Response(
      JSON.stringify({
        message: "Upload com sucesso!",
        url: `${CDN_BASE_URL}/sisagenda/${file.name}`,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error: any) {
    console.error("Erro ao processar imagem:", error);
    return new Response("Erro interno no processamento", { status: 500 });
  }
}
