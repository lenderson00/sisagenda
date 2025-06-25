import type { TablerIcon } from "@tabler/icons-react";
import { CardContent } from "./ui/card";

import { Card } from "./ui/card";

type Props = {
  icon: TablerIcon;
  title: string;
  description: string;
  children: React.ReactNode;
};

export const EmptyCard = ({ children, icon, title, description }: Props) => {
  const Icon = icon;
  return (
    <Card className="text-center rounded-[6px] py-12 h-full  border-muted flex-1">
      <CardContent>
        <div className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};
