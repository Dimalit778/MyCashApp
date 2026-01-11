import React, { useState } from 'react';
import { format, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import './calendarStyle.css';
import { monthItemVariants, overlayVariants } from './animation';

const CalendarMonth = ({ date, setDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrevMonth = () => setDate(subMonths(date, 1));
  const handleNextMonth = () => setDate(addMonths(date, 1));
  const handlePrevYear = () => setDate(subYears(date, 1));
  const handleNextYear = () => setDate(addYears(date, 1));

  const handleMonthSelect = (month) => {
    setDate(new Date(date.getFullYear(), month, 1));
    setIsExpanded(false);
  };

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div data-cy="calendar-container" className="calendar-container">
      <div className="calendar-header">
        <motion.button
          data-cy="calendar-prev-button"
          className="nav-button"
          onClick={() => (!isExpanded ? handlePrevMonth() : handlePrevYear())}
          whileHover={{ scale: 1.08, rotate: -5 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label={isExpanded ? 'Previous year' : 'Previous month'}
        >
          <span className="calendar-nav-arrow">❮</span>
        </motion.button>

        <motion.h2
          data-cy="calendar-title"
          onClick={handleToggleExpanded}
          className="calendar-title"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleExpanded();
            }
          }}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Select month' : 'View all months'}
        >
          {format(date, isExpanded ? 'yyyy' : 'MMMM yyyy')}
        </motion.h2>

        <motion.button
          data-cy="calendar-next-button"
          className="nav-button"
          onClick={() => (!isExpanded ? handleNextMonth() : handleNextYear())}
          whileHover={{ scale: 1.08, rotate: 5 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label={isExpanded ? 'Next year' : 'Next month'}
        >
          <span className="nav-arrow">❯</span>
        </motion.button>
      </div>

      {/* Months Overlay */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            data-cy="months-overlay"
            className="months-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div data-cy="months-grid" className="months-grid">
              {Array.from({ length: 12 }, (_, i) => {
                const monthDate = new Date(date.getFullYear(), i, 1);
                const isCurrentMonth = i === date.getMonth();
                const isSelectedMonth = i === date.getMonth();

                return (
                  <motion.button
                    data-cy={`month-button-${i}`}
                    data-month={i}
                    data-current={isCurrentMonth}
                    data-selected={isSelectedMonth}
                    key={i}
                    variants={monthItemVariants}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`month-button ${isCurrentMonth ? 'current' : ''} ${isSelectedMonth ? 'selected' : ''}`}
                    onClick={() => handleMonthSelect(i)}
                    aria-label={`Select ${format(monthDate, 'MMMM')}`}
                  >
                    {format(monthDate, 'MMM')}
                  </motion.button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default CalendarMonth;
