"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDeliveryType } from "./_hooks/use-delivery-type";
import { useSchedules } from "./_hooks/use-schedules";
import { useUpdateDeliveryType } from "./_hooks/use-update-delivery-type";
import type { Schedule } from "@prisma/client";
import { cn } from "@/lib/utils";
import LoadingDots from "@/components/icons/loading-dots";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";

interface Availability {
  weekDay: number;
  startTime: number;
  endTime: number;
}

const weekDays = getWeekDays();

function formatTimeFromMinutes(minutes: number): string {
  if (minutes === null || minutes === undefined) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

function DeliveryTypeSkeleton() {
  return (
    <Card className="pb-0 overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>Horário de Trabalho</CardTitle>
        <CardDescription>
          Selecione um horário de trabalho pré-definido para este tipo de
          entrega.
        </CardDescription>
        <div className="max-w-md">
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {weekDays.map((day, index) => (
            <div key={index} className="flex items-center justify-between">
              <span>{day}</span>
              <div className="text-right">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center bg-neutral-100 h-14 mt-2 border-t !p-4">
        <p className="text-xs text-muted-foreground">
          A duração será usada para calcular os horários disponíveis.
        </p>
        <Skeleton className="h-8 w-20" />
      </CardFooter>
    </Card>
  );
}

export function DeliveryTypePageClient() {
  const params = useParams();
  const deliveryTypeId = params.deliveryTypeId as string;

  const { data: deliveryType, isLoading: isLoadingDeliveryType } =
    useDeliveryType(deliveryTypeId);
  const { data: schedules, isLoading: isLoadingSchedules } = useSchedules(
    deliveryType?.organizationId,
  );
  const { mutate: updateDeliveryType, isPending: isUpdating } =
    useUpdateDeliveryType(deliveryTypeId);

  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (deliveryType?.scheduleId) {
      setSelectedScheduleId(deliveryType.scheduleId);
    } else {
      setSelectedScheduleId(null);
    }
  }, [deliveryType]);

  const selectedSchedule = useMemo(() => {
    if (!schedules || !selectedScheduleId) return null;
    return schedules.find((s: Schedule) => s.id === selectedScheduleId);
  }, [schedules, selectedScheduleId]);

  const handleSave = () => {
    updateDeliveryType({ scheduleId: selectedScheduleId });
  };

  const availabilityByDay = useMemo(() => {
    const availabilityMap = new Map<number, Availability[]>();
    if (selectedSchedule) {
      for (const item of selectedSchedule.availability) {
        if (!availabilityMap.has(item.weekDay)) {
          availabilityMap.set(item.weekDay, []);
        }
        availabilityMap.get(item.weekDay)?.push(item);
      }
    }
    return availabilityMap;
  }, [selectedSchedule]);

  if (isLoadingDeliveryType || isLoadingSchedules) {
    return <DeliveryTypeSkeleton />;
  }

  console.log(schedules);

  return (
    <Card className=" pb-0 overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>Horário de Trabalho</CardTitle>
        <CardDescription>
          Selecione um horário de trabalho pré-definido para este tipo de
          entrega.
        </CardDescription>
        <div className="max-w-md">
          <Select
            value={selectedScheduleId ?? ""}
            onValueChange={(value) => setSelectedScheduleId(value)}
          >
            <SelectTrigger className="w-full h-10 mt-4">
              <SelectValue placeholder="Selecione um horário" />
            </SelectTrigger>
            <SelectContent>
              {schedules
                ?.sort((a: Schedule, b: Schedule) => (b.isDefault ? 1 : -1))
                .map((schedule: Schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    {schedule.name}
                    {schedule.isDefault && (
                      <Badge variant="secondary">Padrão</Badge>
                    )}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {selectedSchedule && (
        <CardContent>
          <div className="space-y-4">
            {weekDays.map((day, index) => {
              const isAvailable = availabilityByDay.has(index);
              return (
                <div key={index} className="flex items-center justify-between ">
                  <span
                    className={cn(
                      "font-semibold",
                      !isAvailable && "line-through text-muted-foreground",
                    )}
                  >
                    {day}
                  </span>
                  <div className="text-right">
                    {availabilityByDay.has(index) ? (
                      availabilityByDay.get(index)?.map((avail, i) => (
                        <div key={i}>
                          <span>{formatTimeFromMinutes(avail.startTime)}</span>
                          <span className="mx-2">-</span>
                          <span>{formatTimeFromMinutes(avail.endTime)}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Indisponível
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      )}

      <CardFooter className="flex justify-between items-center bg-neutral-100 h-14 mt-2 border-t !p-4">
        <p className="text-xs text-muted-foreground">
          A duração será usada para calcular os horários disponíveis.
        </p>
        <div className="flex items-center gap-2">
          <Link
            href={`/disponibilidade/${selectedSchedule?.id}`}
            target="_blank"
            className="text-xs text-muted-foreground underline flex w-fit gap-2 mr-2"
          >
            Editar horário <IconExternalLink className="w-4 h-4" />
          </Link>
          <Button
            type="submit"
            className={cn(
              "flex !h-8 md:w-fit px-4 text-xs items-center justify-center space-x-2 rounded-md w-full border  transition-all focus:outline-none sm:h-10 ",
              isUpdating
                ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400  "
                : "border-black bg-black text-white  hover:opacity-80 cursor-pointer  ",
            )}
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? <LoadingDots color="#808080" /> : <p>Salvar</p>}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

interface GetWeekDaysParams {
  short?: boolean;
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
  const formatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase();
      }

      return weekDay.substring(0, 1).toUpperCase().concat(weekDay.substring(1));
    });
}
