"use client";

import { motion } from "framer-motion";

interface CalendarSkeletonProps {
  currentDate: any; // dayjs object
}

export function CalendarSkeleton({ currentDate }: CalendarSkeletonProps) {
  // Generate 5 weeks of skeleton days (35 days total)
  const skeletonWeeks = Array.from({ length: 5 }, (_, weekIndex) => ({
    week: weekIndex + 1,
    days: Array.from({ length: 7 }, (_, dayIndex) => ({
      day: dayIndex + 1,
      // Simulate current month days (first 3 weeks mostly current month)
      isCurrentMonth: weekIndex < 3 ? Math.random() > 0.2 : Math.random() > 0.7,
    })),
  }));

  return (
    <div className="relative">
      <table className="w-full table-fixed border-separate border-spacing-1">
        <thead>
          <tr>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
              (weekDay) => (
                <th
                  key={weekDay}
                  className="w-10 h-8 text-xs font-medium text-muted-foreground text-center"
                >
                  {weekDay}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {skeletonWeeks.map(({ week, days }, weekIndex) => (
            <motion.tr
              key={`skeleton-week-${week}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: weekIndex * 0.05,
              }}
            >
              {days.map(({ day, isCurrentMonth }, dayIndex) => (
                <td key={`skeleton-day-${day}`} className="p-0 relative">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: weekIndex * 0.05 + dayIndex * 0.01,
                    }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <div
                      className={`
                        w-10 h-10 rounded-md flex items-center justify-center relative
                        ${isCurrentMonth ? "bg-muted" : "bg-muted/50"}
                      `}
                    />
                  </motion.div>
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
