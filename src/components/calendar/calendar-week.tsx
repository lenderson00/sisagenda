"use client";

import dayjs from "@/lib/dayjs";
import { CalendarDay } from "./calendar-day";

interface CalendarWeekProps {
  days: Array<{
    date: dayjs.Dayjs;
    disabled: boolean;
  }>;
  selectedDate?: Date | null;
  currentDate: dayjs.Dayjs;
  onDateClick: (date: dayjs.Dayjs) => void;
}

// This component is now simplified since we're handling the row structure in CalendarGrid
export function CalendarWeek({
  days,
  selectedDate,
  currentDate,
  onDateClick,
}: CalendarWeekProps) {
  return (
    <>
      {days.map(({ date, disabled }) => {
        const isSelected = selectedDate
          ? dayjs(selectedDate).isSame(date, "day")
          : false;
        const isToday = date.isSame(dayjs(), "day");
        const isCurrentMonth = date.isSame(currentDate, "month");

        return (
          <td key={date.toString()} className="w-10 h-10 p-0">
            <CalendarDay
              date={date}
              disabled={disabled}
              isSelected={isSelected}
              isToday={isToday}
              isCurrentMonth={isCurrentMonth}
              onClick={onDateClick}
            />
          </td>
        );
      })}
    </>
  );
}
