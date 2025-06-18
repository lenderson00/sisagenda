import RegrasDeDisponibilidadePageClient from "./page-client";

export default function BloqueioDeDatasPage() {
  return (
    <>
      <div className="border-b ">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between mt-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Bloqueio de Datas
              </h1>
              <p className="text-gray-600">
                Gerencie os bloqueios de datas para os transportes
              </p>
            </div>
          </div>
        </div>
      </div>
      <RegrasDeDisponibilidadePageClient />
    </>
  );
}
