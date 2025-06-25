"use client";

import dynamic from "next/dynamic";

const ActivityCalendar = dynamic(() => import("react-activity-calendar"), {
  ssr: false,
});

interface Activity {
  date: string;
  count: number;
  level: number;
}

interface ActivityCalendarWrapperProps {
  activity: Activity[];
}

export default function ActivityCalendarWrapper({
  activity,
}: ActivityCalendarWrapperProps) {
  // If no activity data or only dummy data with 0 count, show a message
  if (
    !activity ||
    activity.length === 0 ||
    (activity.length === 1 && activity[0].count === 0)
  ) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">No activity data available</p>
          <p className="text-sm">No appointments found for this period</p>
        </div>
      </div>
    );
  }

  return (
    <ActivityCalendar
      data={activity}
      blockSize={14}
      blockRadius={4}
      blockMargin={3}
      weekStart={1}
      labels={{
        months: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        totalCount: "Total appointments in {{year}}: {{count}}",
        legend: {
          less: "Less",
          more: "More",
        },
      }}
      colorScheme="light"
      showWeekdayLabels
    />
  );
}
