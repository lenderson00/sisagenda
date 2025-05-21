import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export const Preview = ({ children, ...props }: PropsWithChildren & { className?: string }) => {
	return <div {...props} className={cn("pr-8 overflow-hidden md:hidden", props.className)}>{children}</div>;
};
