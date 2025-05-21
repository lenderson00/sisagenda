import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type BoxProps = PropsWithChildren & {
	className?: string;
};

export const Box = ({ children, className, ...props }: BoxProps) => {
	return <div {...props} className={cn("", className)}>{children}</div>;
};
