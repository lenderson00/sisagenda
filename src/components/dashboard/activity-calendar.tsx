"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Activity } from "@/lib/services/activity-service";
import { CalendarIcon } from "lucide-react";
import { ActivityCalendar } from "react-activity-calendar";

interface ActivityCalendarProps {
  data: Activity[];
  totalActivity: number;
  activeDays: number;
  averageActivity: number;
}

export function ActivityCalendarComponent({
  data,
  totalActivity,
  activeDays,
  averageActivity,
}: ActivityCalendarProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Atividade do Ano
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <div className="space-y-4 w-full">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {totalActivity}
              </div>
              <div className="text-sm text-muted-foreground">
                Total de Agendamentos
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {activeDays}
              </div>
              <div className="text-sm text-muted-foreground">
                Dias com Atividade
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {averageActivity}
              </div>
              <div className="text-sm text-muted-foreground">Média Diária</div>
            </div>
          </div>

          <div className="w-full flex justify-center">
            <div className="w-full max-w-none ">
              <ActivityCalendar
                data={data}
                labels={{
                  totalCount: "{{count}} agendamentos em {{date}}",
                  legend: {
                    less: "Menos",
                    more: "Mais",
                  },
                }}
                colorScheme="light"
                blockSize={16}
                blockMargin={4}
                fontSize={16}
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Menos atividade</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="h-3 w-3 rounded-sm"
                  style={{
                    backgroundColor:
                      level === 0
                        ? "hsl(var(--muted))"
                        : `hsl(var(--primary) / ${0.2 + level * 0.2})`,
                  }}
                />
              ))}
            </div>
            <span>Mais atividade</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
