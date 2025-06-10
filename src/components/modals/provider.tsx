"use client";

import { useSearchParams } from "next/navigation";
import { type ReactNode, Suspense, useEffect } from "react";

import { useWelcomeModal } from "./welcome-modal";

export function ModalProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();

  const { setShowWelcomeModal, WelcomeModal } = useWelcomeModal();

  useEffect(
    () => setShowWelcomeModal(searchParams.has("bem-vindo")),
    [searchParams, setShowWelcomeModal]
  );

  return (
    <Suspense>
      <WelcomeModal />
      {children}
    </Suspense>
  );
}
