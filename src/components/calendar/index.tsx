"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import dayjs from "@/lib/dayjs";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarGrid } from "./calendar-grid";
import { CalendarHeader } from "./calendar-header";

interface CalendarWeek {
  week: number;
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
}

type CalendarWeeks = CalendarWeek[];

interface AvailabilityResponse {
  disabledDays: number[];
  availableWeekDays: number[];
}

interface CalendarProps {
  organizationId: string;
  deliveryTypeId: string;
  selectedDate?: Date | null;
  onDateSelected?: (date: Date) => void;
}

export function Calendar({
  organizationId,
  deliveryTypeId,
  selectedDate,
  onDateSelected,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1);
  });

  const handlePreviousMonth = useCallback(() => {
    const previousMonthDate = currentDate.subtract(1, "month");
    setCurrentDate(previousMonthDate);
    // TODO: Implement toast for previous month navigation
  }, [currentDate]);

  const handleNextMonth = useCallback(() => {
    const nextMonthDate = currentDate.add(1, "month");
    setCurrentDate(nextMonthDate);
    // TODO: Implement toast for next month navigation
  }, [currentDate]);

  const handleDateClick = useCallback(
    (date: dayjs.Dayjs) => {
      const selectedDateObj = date.toDate();
      // TODO: Implement toast for date selection

      // Call the optional callback if provided
      onDateSelected?.(selectedDateObj);
    },
    [onDateSelected],
  );

  const currentMonthName = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  const { data: availabilityData, isLoading: isLoadingAvailability } =
    useQuery<AvailabilityResponse>({
      queryKey: [
        "availability",
        organizationId,
        deliveryTypeId,
        currentDate.get("year"),
        currentDate.get("month") + 1,
      ],
      queryFn: async () => {
        const year = currentDate.get("year");
        const month = currentDate.get("month") + 1; // dayjs month is 0-indexed

        const response = await fetch(
          `/api/availability/days?organizationId=${organizationId}&deliveryTypeId=${deliveryTypeId}&year=${year}&month=${month}`,
        );
        if (!response.ok) {
          toast.error("Failed to fetch availability");
          return { disabledDays: [], availableWeekDays: [] };
        }
        return response.json();
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    });

  const calendarWeeks = useMemo(() => {
    if (!availabilityData) {
      return [];
    }

    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set("date", i + 1);
    });

    const firstWeekDay = currentDate.get("day"); // 0 (Sunday) to 6 (Saturday)

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    }).map((_, i) => {
      return currentDate.subtract(firstWeekDay - i, "day");
    });

    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth(),
    );
    const totalDaysUsed =
      previousMonthFillArray.length + daysInMonthArray.length;
    const remainingDays = 35 - totalDaysUsed; // Always ensure 35 days total (7x5)

    const nextMonthFillArray = Array.from({
      length: remainingDays,
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, "day");
    });

    const calendarDays = [
      ...previousMonthFillArray.map((date) => ({
        date,
        disabled: true,
      })),
      ...daysInMonthArray.map((date) => {
        const today = dayjs().endOf("day");
        return {
          date,
          disabled:
            date.endOf("day").isBefore(today) ||
            availabilityData.disabledDays.includes(date.get("date")),
        };
      }),
      ...nextMonthFillArray.map((date) => ({
        date,
        disabled: true,
      })),
    ];

    // Ensure exactly 35 days (5 weeks of 7 days)
    const exactCalendarDays = calendarDays.slice(0, 35);

    const weeks: CalendarWeeks = [];
    for (let i = 0; i < exactCalendarDays.length; i += 7) {
      weeks.push({
        week: i / 7 + 1,
        days: exactCalendarDays.slice(i, i + 7),
      });
    }
    return weeks;
  }, [currentDate, availabilityData]);

  return (
    <div className="p-6  flex flex-col gap-4 bg-background w-full h-full">
      <CalendarHeader
        currentMonth={currentMonthName}
        currentYear={currentYear}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        isLoading={isLoadingAvailability}
      />

      <CalendarGrid
        weeks={calendarWeeks}
        selectedDate={selectedDate}
        onDateClick={handleDateClick}
        isLoading={isLoadingAvailability}
        currentDate={currentDate}
      />
    </div>
  );
}
