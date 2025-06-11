import { AgendamentosClient } from "./_components/client";

const AgendamentosPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AgendamentosClient />
      </div>
    </div>
  );
};

export default AgendamentosPage;
