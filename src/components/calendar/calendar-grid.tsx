"use client";

import dayjs from "@/lib/dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDay } from "./calendar-day";
import { CalendarSkeleton } from "./calendar-skeleton";

interface CalendarGridProps {
  weeks: any[];
  selectedDate?: Date | null;
  onDateClick: (date: dayjs.Dayjs) => void;
  isLoading: boolean;
  currentDate: dayjs.Dayjs;
}

export function CalendarGrid({
  weeks,
  selectedDate,
  onDateClick,
  isLoading,
  currentDate,
}: CalendarGridProps) {
  const shortWeekDays = getWeekDays({ short: true });

  // Ensure we always have exactly 5 weeks (35 days total)
  const normalizedWeeks = [...weeks];
  while (normalizedWeeks.length < 5) {
    const lastWeek = normalizedWeeks[normalizedWeeks.length - 1];
    const lastDate = lastWeek?.days[6]?.date || currentDate.endOf("month");
    const newWeekDays = Array.from({ length: 7 }, (_, i) => ({
      date: lastDate.add(i + 1, "day"),
      disabled: true,
    }));
    normalizedWeeks.push({
      week: normalizedWeeks.length + 1,
      days: newWeekDays,
    });
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CalendarSkeleton currentDate={currentDate} />
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <table className="w-full table-fixed border-separate border-spacing-1">
              <thead>
                <tr>
                  {shortWeekDays.map((weekDay) => (
                    <th
                      key={weekDay}
                      className="w-10 h-8 text-xs font-medium text-muted-foreground text-center"
                    >
                      {weekDay}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {normalizedWeeks.slice(0, 5).map(({ week, days }, index) => (
                  <motion.tr
                    key={`${currentDate.format("YYYY-MM")}-week-${week}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                    }}
                    className=""
                  >
                    {days.map(
                      ({
                        date,
                        disabled,
                      }: {
                        date: dayjs.Dayjs;
                        disabled: boolean;
                      }) => {
                        const isSelected = selectedDate
                          ? dayjs(selectedDate).isSame(date, "day")
                          : false;
                        const isToday = date.isSame(dayjs(), "day");
                        const isCurrentMonth = date.isSame(
                          currentDate,
                          "month",
                        );

                        return (
                          <td key={date.toString()} className="p-0 relative">
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
                      },
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface GetWeekDaysParams {
  short?: boolean;
}

export function getWeekDays({
  short = false,
}: GetWeekDaysParams = {}): string[] {
  const formatter = new Intl.DateTimeFormat("pt-BR", { weekday: "long" });

  return Array.from(Array(7).keys()).map((dayIndex) => {
    // Using a known week: 2023-01-01 was a Sunday.
    const date = new Date(2023, 0, 1 + dayIndex); // 0 = Sunday, 1 = Monday ...

    let weekDay = formatter.format(date);
    weekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);

    return short ? weekDay.substring(0, 3) : weekDay;
  });
}
