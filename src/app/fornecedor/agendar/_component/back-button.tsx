"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const isNotFirstStep = pathname.includes("/agendar/");

  if (isNotFirstStep) {
    return (
      <Button
        variant="outline"
        className="absolute top-4 left-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>
    );
  }

  return null;
}
