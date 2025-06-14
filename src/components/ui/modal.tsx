"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
//import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import type { ComponentProps, Dispatch, SetStateAction } from "react";
import { Drawer } from "vaul";

export function Modal({
  children,
  className,
  showModal,
  setShowModal,
  onClose,
  desktopOnly,
  preventDefaultClose,
  drawerRootProps,
}: {
  children: React.ReactNode;
  className?: string;
  showModal?: boolean;
  setShowModal?: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void;
  desktopOnly?: boolean;
  preventDefaultClose?: boolean;
  drawerRootProps?: ComponentProps<typeof Drawer.Root>;
}) {
  const router = useRouter();

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return;
    }
    // fire onClose event if provided
    onClose?.();

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false);
      // else, this is intercepting route @modal
    } else {
      router.back();
    }
  };
  const isMobile = useIsMobile();

  if (isMobile && !desktopOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : true}
        onOpenChange={(open) => {
          if (!open) {
            closeModal({ dragged: true });
          }
        }}
        {...drawerRootProps}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-50  bg-opacity-10 backdrop-blur" />
          <Drawer.Content
            onPointerDownOutside={(e) => {
              // Prevent dismissal when clicking inside a toast
              if (
                e.target instanceof Element &&
                e.target.closest("[data-sonner-toast]")
              ) {
                e.preventDefault();
              }
            }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 flex flex-col",
              "rounded-t-[10px] border-t border-neutral-200 bg-white",
              className,
            )}
          >
            <div className="scrollbar-hide flex-1 overflow-y-auto rounded-t-[10px] bg-inherit">
              <VisuallyHidden.Root>
                <Drawer.Title>Modal</Drawer.Title>
                <Drawer.Description>This is a modal</Drawer.Description>
              </VisuallyHidden.Root>
              <DrawerIsland />
              {children}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <Dialog
      open={setShowModal ? showModal : true}
      onOpenChange={(open) => {
        if (!open) {
          closeModal();
        }
      }}
    >
      <DialogOverlay className="animate-fade-in fixed inset-0 z-40 bg-neutral-100 bg-opacity-50 backdrop-blur-xs" />
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          // Prevent dismissal when clicking inside a toast
          if (
            e.target instanceof Element &&
            e.target.closest("[data-sonner-toast]")
          ) {
            e.preventDefault();
          }
        }}
        className={cn(
          "fixed  z-[9999999] m-auto h-fit w-full max-w-md",
          "border border-neutral-200 bg-white p-0 shadow-xl sm:rounded-2xl",
          "scrollbar-hide animate-scale-in overflow-y-auto",
          className,
        )}
      >
        <VisuallyHidden.Root>
          <DialogTitle>Modal</DialogTitle>
          <DialogDescription>This is a modal</DialogDescription>
        </VisuallyHidden.Root>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function DrawerIsland() {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-center rounded-t-[10px] bg-inherit">
      <div className="my-3 h-1 w-12 rounded-full bg-neutral-300" />
    </div>
  );
}
