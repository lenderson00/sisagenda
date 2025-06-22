"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  backButton?: boolean;
};

export const PageHeader = ({
  title,
  subtitle,
  children,
  backButton,
}: PageHeaderProps) => {
  const router = useRouter();

  return (
    <header
      className={cn("p-4", "flex w-full max-w-full items-center truncate")}
    >
      <div
        className={cn("w-full truncate ltr:mr-4 rtl:ml-4 flex items-center")}
      >
        {backButton && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="mr-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voltar</TooltipContent>
          </Tooltip>
        )}
        <div className="flex flex-col ">
          <h3
            className={cn(
              "font-cal text-emphasis max-w-28 sm:max-w-72 md:max-w-80 inline truncate text-lg font-semibold tracking-wide sm:text-xl md:block xl:max-w-full",
            )}
          >
            {title}
          </h3>

          {subtitle && (
            <p
              className="text-muted-foreground hidden text-sm md:block"
              data-testid="subtitle"
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div
        className={cn(
          "relative",
          "flex-shrink-0 md:relative md:bottom-auto md:right-auto",
        )}
      >
        {children}
      </div>
    </header>
  );
};
