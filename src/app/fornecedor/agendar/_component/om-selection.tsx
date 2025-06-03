import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

type OmSelectionProps = {
  omName: string;
  omSigla: string;
  omDescription: string;
  position?: "top" | "bottom" | "middle";
};

export default function OmSelection({
  omName,
  omSigla,
  omDescription,
  position = "top",
}: OmSelectionProps) {
  return (
    <Link href={`/agendar/${omSigla}/data`}>
      <Card
        className={cn(
          "w-full",
          position === "top" && "rounded-b-none",
          position === "bottom" && "rounded-t-none border-t-0",
          position === "middle" && "rounded-none border-t-0",

          "shadow-none hover:bg-muted cursor-pointer group duration-300 transition-all ease-in-out",
        )}
      >
        <CardHeader className="relative">
          <CardTitle>{omName}</CardTitle>
          <CardDescription>{omDescription}</CardDescription>
          <div className="flex items-center gap-2 absolute right-6 top-1/2 -translate-y-1/2">
            <IconChevronRight
              size={24}
              className="text-muted-foreground group-hover:text-primary"
            />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
