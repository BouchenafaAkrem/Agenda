import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  const [direction, setDirection] = useState(0);

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const nextMonth = () => {
    setDirection(1);
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-4">
        <motion.button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded touch-manipulation"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.h2 
          key={currentMonth.toString()}
          initial={{ opacity: 0, x: direction * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -direction * 20 }}
          className="text-lg font-semibold"
        >
          {format(currentMonth, 'MMMM yyyy')}
        </motion.h2>
        <motion.button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded touch-manipulation"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <motion.button
            key={day.toString()}
            onClick={() => onDateSelect(day)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={clsx(
              'p-2 text-sm rounded-full touch-manipulation transition-colors duration-200',
              'min-w-[2.5rem] min-h-[2.5rem] md:min-w-0 md:min-h-0',
              isSameDay(day, selectedDate)
                ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
          >
            {format(day, 'd')}
          </motion.button>
        ))}
      </div>
    </div>
  );
};