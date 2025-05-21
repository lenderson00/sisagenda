import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export const Hero = ({ children, ...props }: PropsWithChildren & { className?: string }) => {
	return <div {...props} className={cn("max-w-[480px] px-0 py-10", props.className)}>{children}</div>;
};
