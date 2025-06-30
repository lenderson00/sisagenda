import { ModeToggle } from "@/components/mode-toggle";
import { GalleryVerticalEnd } from "lucide-react";

export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          SisAgenda
        </a>
        {children}
      </div>
      <div className="flex items-center gap-1 fixed bottom-6 right-6 z-20 p-1">
        <ModeToggle />
      </div>
    </div>
  );
}
