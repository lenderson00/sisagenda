"use client";

import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { StepTitle } from "../step-title";

interface TimeBlock {
  startTime: string;
  endTime: string;
}

interface Step1ConfigurationProps {
  selectedDates: Date[];
  onSelectedDatesChange: (dates: Date[]) => void;
  timeBlocks: Record<string, TimeBlock>;
  onTimeBlockChange: (date: string, timeBlock: TimeBlock) => void;
}

export function Step1Configuration({
  selectedDates,
  onSelectedDatesChange,
  timeBlocks,
  onTimeBlockChange,
}: Step1ConfigurationProps) {
  const sortedDateKeys = Object.keys(timeBlocks).sort();

  return (
    <>
      <StepTitle
        title="Configurar Período de Bloqueio"
        description="Selecione uma ou mais datas e defina os horários de bloqueio para cada uma."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => onSelectedDatesChange(dates || [])}
            disabled={{ before: new Date() }}
            fromDate={new Date()}
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-md font-medium text-foreground">
            Datas Selecionadas
          </h3>
          <ScrollArea className="h-72 pr-4 border rounded-lg">
            {sortedDateKeys.length > 0 ? (
              <div className="space-y-4 p-4">
                <AnimatePresence>
                  {sortedDateKeys.map((dateKey) => (
                    <motion.div
                      key={dateKey}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-3 bg-muted/50 rounded-md border"
                    >
                      <p className="font-medium text-sm mb-3">
                        {dayjs(dateKey).format("dddd, DD [de] MMMM")}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label
                            htmlFor={`start-${dateKey}`}
                            className="text-xs"
                          >
                            Início
                          </Label>
                          <Input
                            id={`start-${dateKey}`}
                            type="time"
                            value={timeBlocks[dateKey].startTime}
                            onChange={(e) =>
                              onTimeBlockChange(dateKey, {
                                ...timeBlocks[dateKey],
                                startTime: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`end-${dateKey}`} className="text-xs">
                            Fim
                          </Label>
                          <Input
                            id={`end-${dateKey}`}
                            type="time"
                            value={timeBlocks[dateKey].endTime}
                            onChange={(e) =>
                              onTimeBlockChange(dateKey, {
                                ...timeBlocks[dateKey],
                                endTime: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Selecione uma ou mais datas no calendário.
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
}
