import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronUp } from "lucide-react";
import { useState } from "react";

export const ToolCall = ({ toolInvocation }: { toolInvocation: any }) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log("toolInvocation", toolInvocation);
  // Guard against invalid or incomplete toolInvocation objects
  if (!toolInvocation?.toolName) {
    return null;
  }

  const title = toolInvocation.toolName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l: string) => l.toUpperCase());
  const { type } = toolInvocation;
  const hasArgs =
    toolInvocation.args && Object.keys(toolInvocation.args).length > 0;

  if (toolInvocation.state === "call") {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AnimatedShinyText>
            <span className="text-sm font-semibold">Ação em execução...</span>
          </AnimatedShinyText>
        </div>
      </div>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-md -mt-2 mb-4"
    >
      <div className="flex items-center justify-between bg-muted rounded-md border-2 px-4 py-2">
        <div className="flex items-center gap-2 rounded-md">
          <span className="text-sm font-semibold">Ação Executada</span>
        </div>
        {hasArgs && (
          <CollapsibleTrigger asChild>
            <button type="button" className="text-sm cursor-pointer">
              <div className="flex items-center">
                <span>Detalhes</span>
                <ChevronUp
                  size={16}
                  className={`ml-1 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>
          </CollapsibleTrigger>
        )}
      </div>
      {hasArgs && (
        <CollapsibleContent>
          <div className="mt-4 rounded-md border">
            <div className="flex items-center justify-between border-b bg-muted p-2 px-4">
              <p className="text-sm font-medium">
                O seguinte conteúdo foi compartilhado:
              </p>
            </div>
            <div className="space-y-2 p-2 px-4">
              {Object.entries(toolInvocation.args).map(([key, value]) => (
                <div key={key} className="flex items-start">
                  <span className="w-24 shrink-0 text-sm font-semibold text-muted-foreground">
                    {key}:
                  </span>
                  <span className="text-sm">"{String(value)}"</span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};
