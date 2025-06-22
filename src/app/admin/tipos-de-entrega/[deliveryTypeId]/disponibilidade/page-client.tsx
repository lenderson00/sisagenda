"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Horário de Trabalho</CardTitle>
          <CardDescription>
            Selecione um horário de trabalho pré-definido para este tipo de
            entrega.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Select
              value={selectedScheduleId ?? ""}
              onValueChange={(value) => setSelectedScheduleId(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um horário" />
              </SelectTrigger>
              <SelectContent>
                {schedules?.map((schedule: Schedule) => (
                  <SelectItem key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedSchedule && (
        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização da Disponibilidade</CardTitle>
            <CardDescription>
              Estes são os horários para o agendamento de{" "}
              <strong>{selectedSchedule.name}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <span className="font-semibold">{day}</span>
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
                      <span className="text-sm text-gray-500">
                        Indisponível
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={handleSave} disabled={isUpdating}>
        {isUpdating ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </div>
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
