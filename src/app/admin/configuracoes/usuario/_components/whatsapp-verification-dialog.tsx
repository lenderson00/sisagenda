"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { OTPInput, type SlotProps } from "input-otp";
import { useEffect, useRef, useState } from "react";

type WhatsappVerificationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (code: string) => Promise<boolean>;
};

export function WhatsappVerificationDialog({
  open,
  onOpenChange,
  onVerify,
}: WhatsappVerificationDialogProps) {
  const [value, setValue] = useState("");
  const [hasGuessed, setHasGuessed] = useState<undefined | boolean>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (hasGuessed) {
      closeButtonRef.current?.focus();
    }
  }, [hasGuessed]);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault?.();
    const success = await onVerify(value);
    setHasGuessed(success);
    if (success) {
      setTimeout(() => onOpenChange(false), 1000);
    }
    setValue("");
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setHasGuessed(undefined);
      setValue("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <DialogHeader>
            <DialogTitle className="sm:text-center">
              {hasGuessed ? "Code verified!" : "Enter confirmation code"}
            </DialogTitle>
            <DialogDescription className="sm:text-center">
              {hasGuessed
                ? "Your code has been successfully verified."
                : "Check your messages and enter the code."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {hasGuessed ? (
          <div className="text-center">
            <DialogClose asChild>
              <Button type="button" ref={closeButtonRef}>
                Close
              </Button>
            </DialogClose>
          </div>
        ) : (
          <div className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center">
                <OTPInput
                  id="confirmation-code"
                  ref={inputRef}
                  value={value}
                  onChange={setValue}
                  containerClassName="flex items-center gap-3 has-disabled:opacity-50"
                  maxLength={4}
                  onFocus={() => setHasGuessed(undefined)}
                  render={({ slots }) => (
                    <div className="flex gap-2">
                      {slots.map((slot, idx) => (
                        <Slot key={idx} {...slot} />
                      ))}
                    </div>
                  )}
                  onComplete={handleSubmit}
                />
              </div>
              {hasGuessed === false && (
                <p
                  className="text-muted-foreground text-center text-xs"
                  role="alert"
                  aria-live="polite"
                >
                  Invalid code. Please try again.
                </p>
              )}
              <p className="text-center text-sm">
                <button
                  type="button"
                  className="underline hover:no-underline"
                  // onClick={onResend}
                >
                  Resend code
                </button>
              </p>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground flex size-9 items-center justify-center rounded-md border font-medium shadow-xs transition-[color,box-shadow]",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
