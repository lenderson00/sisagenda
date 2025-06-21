import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
  return (
    <header
      className={cn("p-4", "flex w-full max-w-full items-center truncate")}
    >
      <div className={cn("hidden w-full truncate ltr:mr-4 rtl:ml-4 md:block")}>
        <h3
          className={cn(
            "font-cal text-emphasis max-w-28 sm:max-w-72 md:max-w-80 inline truncate text-lg font-semibold tracking-wide sm:text-xl md:block xl:max-w-full",
          )}
        >
          {title}
        </h3>

        <p
          className="text-default hidden text-sm md:block"
          data-testid="subtitle"
        >
          {subtitle}
        </p>
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
