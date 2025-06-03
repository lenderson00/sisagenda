"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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
        <p className="font-semibold text-lg capitalize text-slate-800">
          {currentMonth}{" "}
          <span className="text-slate-500 font-medium">{currentYear}</span>
        </p>
      </motion.div>

      <div className="flex gap-2 items-center">
        <motion.button
          type="button"
          onClick={onPreviousMonth}
          disabled={isLoading}
          title="Mês anterior"
          aria-label="Mês anterior"
          className="p-1.5 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        <motion.button
          type="button"
          onClick={onNextMonth}
          disabled={isLoading}
          title="Próximo mês"
          aria-label="Próximo mês"
          className="p-1.5 rounded text-slate-600 hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
    </header>
  );
}
