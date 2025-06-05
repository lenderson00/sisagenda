"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconDots } from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function DeleteResourceForm({
  resourceName,
}: {
  resourceName: string;
}) {
  const { resourceId: id } = useParams() as { resourceId: string };

  const router = useRouter();
  return (
    <form
      action={async (data: FormData) => {
        window.confirm("Você tem certeza que quer deletar esse resource?");
        console.log(data);
      }}
      className="rounded-lg border border-zinc-200 dark:border-zinc-800 transition-all duration-500 ease-in-out hover:border-red-600 dark:hover:border-red-500 bg-white dark:bg-black"
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white font-bold">
          Deletar Framer Resource
        </h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Exclui o seu Framer Resource. Digite o nome do seu resource{" "}
          <b>{resourceName}</b> para confirmar.
        </p>

        <Input
          name="confirm"
          type="text"
          required
          pattern={resourceName}
          placeholder={resourceName}
          className="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-center text-sm text-stone-500 dark:text-stone-400">
          Essa ação é irreversivel. Você não poderá recuperar o seu site.
        </p>
        <div className="w-full md:w-fit">
          <FormButton />
        </div>
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 px-4 items-center justify-center font-bold space-x-2 rounded-md border w-full text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-red-600 bg-red-600 text-white hover:bg-white hover:text-red-600 dark:hover:bg-transparent",
      )}
      disabled={pending}
      type="submit"
    >
      {pending ? <IconDots color="#808080" /> : <p>Confirmar Exclusão</p>}
    </button>
  );
}
