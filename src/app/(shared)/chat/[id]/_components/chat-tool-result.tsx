import type { Config } from "@/lib/natural-sql/query";
import { DynamicChart } from "./dynamic-chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ToolResults = ({
  results,
  columns,
  chartConfig,
}: {
  results: any[];
  columns: string[];
  chartConfig: Config | null;
}) => {
  const formatColumnTitle = (title: string) => {
    return title
      .split("_")
      .map((word, index) =>
        index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
      )
      .join(" ");
  };

  const formatCellValue = (column: string, value: any) => {
    if (column.toLowerCase().includes("valuation")) {
      const parsedValue = Number.parseFloat(value);
      if (Number.isNaN(parsedValue)) {
        return "";
      }
      const formattedValue = parsedValue.toFixed(2);
      const trimmedValue = formattedValue.replace(/\.?0+$/, "");
      return `$${trimmedValue}B`;
    }
    if (column.toLowerCase().includes("rate")) {
      const parsedValue = Number.parseFloat(value);
      if (Number.isNaN(parsedValue)) {
        return "";
      }
      const percentage = (parsedValue * 100).toFixed(2);
      return `${percentage}%`;
    }
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  };

  return (
    <div className="flex-grow flex flex-col">
      <Tabs defaultValue="table" className="w-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger
            value="charts"
            disabled={
              Object.keys(results[0] || {}).length <= 1 || results.length < 2
            }
          >
            Chart
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="flex-grow">
          <div className="sm:min-h-[10px] relative">
            <Table className="min-w-full divide-y divide-border">
              <TableHeader className="bg-secondary sticky top-0 shadow-sm">
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {formatColumnTitle(column)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-card divide-y divide-border">
                {results.map((company, index) => (
                  <TableRow key={index} className="hover:bg-muted">
                    {columns.map((column, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-foreground"
                      >
                        {formatCellValue(column, company[column as keyof any])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="charts" className="flex-grow overflow-auto">
          <div className="mt-4">
            {chartConfig && results.length > 0 ? (
              <DynamicChart chartData={results} chartConfig={chartConfig} />
            ) : (
              <SkeletonCard />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-2 w-full">
      <div className="w-full flex items-center justify-center">
        <Skeleton className="h-[28px] w-72 rounded-xl" />
      </div>
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <div className="w-full flex justify-center items-center">
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[450px]" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[350px]" />
      </div>
    </div>
  );
}
