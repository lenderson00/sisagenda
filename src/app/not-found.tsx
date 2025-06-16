import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <Link href="/" className="text-blue-500">
        Voltar para a página inicial
      </Link>
    </div>
  );
}
