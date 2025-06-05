"use client";

import { cn } from "@/lib/utils";
import { IconDots } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import Uploader from "../uploader";

type FormType =
  | "image"
  | "obfuscationLevel"
  | "resourceType"
  | "framerSession"
  | "framerFolder"
  | "framerTeam"
  | "productionUrl"
  | "text";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback } from "react";
import { Input } from "../ui/input";

export default function Form({
  title,
  description,
  helpText,
  inputAttrs,
  handleSubmit,
  userEmail,
  hash,
  className,
}: {
  title: string;
  description: string;
  helpText: string;
  inputAttrs: {
    name: FormType;
    type: string;
    defaultValue: string;
    placeholder?: string;
    maxLength?: number;
    pattern?: string;
    hash?: string;
  };
  handleSubmit: any;
  userEmail?: string;
  hash?: string;
  className?: string;
}) {
  const { resourceId: id } = useParams() as { resourceId?: string };
  const router = useRouter();
  const { update } = useSession();
  const defaultCallback = useCallback(
    async (res: any) => {
      if (!res) {
        toast.success("Atualizado com sucesso!");
        return;
      }

      if (res.error) {
        toast.error(res.error);
      } else {
        if (id) {
          router.refresh();
        } else {
          await update();
          router.refresh();
        }
        toast.success("Atualizado com sucesso!");
      }
    },
    [id, router, update],
  );
  return (
    <form
      action={async (data: FormData) => {
        handleSubmit(data, id).then(defaultCallback);
      }}
      className={cn(
        "rounded-lg border border-stone-200 bg-white dark:border-stone-700 dark:bg-black",
        className,
      )}
    >
      <div className="relative flex flex-col space-y-4 p-5 sm:p-10">
        <h2 className="font-cal text-xl dark:text-white font-bold">{title}</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {description}
        </p>
        {inputAttrs.name === "image" ? (
          <Uploader
            defaultValue={inputAttrs.defaultValue || ""}
            name={inputAttrs.name}
          />
        ) : (
          <Input
            {...inputAttrs}
            required
            className="w-full max-w-md rounded-md border border-stone-300 text-sm text-stone-900 placeholder-stone-300 focus:border-stone-500 focus:outline-none focus:ring-stone-500 dark:border-stone-600 dark:bg-black dark:text-white dark:placeholder-stone-700"
          />
        )}
      </div>

      <div className="flex flex-col items-center justify-center space-y-2 rounded-b-lg border-t border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:justify-between sm:space-y-0 sm:px-10">
        <p className="text-sm text-stone-500 dark:text-stone-400">{helpText}</p>
        <FormButton />
      </div>
    </form>
  );
}

function FormButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className={cn(
        "flex h-8 md:w-fit px-8 items-center justify-center space-x-2 rounded-md w-full border text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300"
          : "border-black bg-black text-white hover:bg-white hover:text-black dark:border-stone-700 dark:hover:border-stone-200 dark:hover:bg-black dark:hover:text-white dark:active:bg-stone-800",
      )}
      disabled={pending}
      type="submit"
    >
      {pending ? (
        <IconDots color="#808080" className="animate-bounce" />
      ) : (
        <p>Salvar Alterações</p>
      )}
    </button>
  );
}
