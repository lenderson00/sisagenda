"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  currentMonth: string;
  currentYear: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isLoading?: boolean;
}

export function CalendarHeader({
  currentMonth,
  currentYear,
  onPreviousMonth,
  onNextMonth,
  isLoading = false,
}: CalendarHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <motion.div
        key={`${currentMonth}-${currentYear}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <p className="font-semibold text-lg capitalize text-foreground">
          {currentMonth}{" "}
          <span className="text-muted-foreground font-medium">
            {currentYear}
          </span>
        </p>
      </motion.div>

      <div className="flex gap-2 items-center">
        <motion.button
          type="button"
          onClick={onPreviousMonth}
          disabled={isLoading}
          title="Mês anterior"
          aria-label="Mês anterior"
          className="p-1.5 rounded text-muted-foreground hover:bg-muted cursor-pointer hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-muted focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        <motion.button
          type="button"
          onClick={onNextMonth}
          disabled={isLoading}
          title="Próximo mês"
          aria-label="Próximo mês"
          className="p-1.5 rounded text-muted-foreground hover:bg-muted cursor-pointer hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-muted focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
    </header>
  );
}
