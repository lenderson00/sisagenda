import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useRouterStuff } from "@/hooks/use-router-stuffs";
import { cn } from "@/lib/utils";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

function WelcomeModal({
  showWelcomeModal,
  setShowWelcomeModal,
}: {
  showWelcomeModal: boolean;
  setShowWelcomeModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { queryParams } = useRouterStuff();

  return (
    <Modal
      showModal={showWelcomeModal}
      setShowModal={setShowWelcomeModal}
      onClose={() =>
        queryParams({
          del: ["bem-vindo"],
        })
      }
    >
      <div className="relative z-[9999] flex flex-col">
        <div className="px-6 py-8 sm:px-12">
          <div className="relative text-center">
            <div className="scrollbar-hide max-h-[calc(100vh-350px)] overflow-y-auto pb-6">
              <h1 className={cn("text-lg font-medium text-neutral-950")}>
                Bem vindo(a) ao SisAgenda
              </h1>
              <p className={cn("mt-2 text-sm text-neutral-500")}>
                Mensagem de Boas-vindas
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="default"
            className="mt-2 w-full"
            onClick={() =>
              queryParams({
                del: ["bem-vindo"],
              })
            }
          >
            Começar agora!
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function useWelcomeModal() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const WelcomeModalCallback = useCallback(() => {
    return (
      <WelcomeModal
        showWelcomeModal={showWelcomeModal}
        setShowWelcomeModal={setShowWelcomeModal}
      />
    );
  }, [showWelcomeModal]);

  return useMemo(
    () => ({
      setShowWelcomeModal,
      WelcomeModal: WelcomeModalCallback,
    }),
    [WelcomeModalCallback],
  );
}
