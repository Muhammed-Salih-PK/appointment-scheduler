import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths } from "date-fns";
import { useCalendar } from "../../context/CalendarContext";
import AppoinmentForm from "./AppoinmentForm";

const DayNames = () => (
  <div className='grid grid-cols-7 gap-1 mb-2 bg-gray-50 dark:bg-gray-900'>
    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
      <div key={day} className='py-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-500  dark:text-gray-400'>
        {day}
      </div>
    ))}
  </div>
);

const MonthNavigation = ({ monthName, onPrev, onNext }) => (
  <div className='flex items-center justify-between p-4'>
    <motion.button
      onClick={onPrev}
      className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors'
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label='Previous month'
    >
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
      </svg>
    </motion.button>

    <h2 className='text-xl font-semibold text-gray-800 dark:text-white'>{monthName}</h2>

    <motion.button
      onClick={onNext}
      className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors'
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label='Next month'
    >
      <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
      </svg>
    </motion.button>
  </div>
);

const DayCell = ({ day, isToday, appointments, onDateClick, onAppointmentClick }) => {
  const hasAppointments = appointments.length > 0;
  const isCurrentMonth = isSameDay(day, new Date());

  return (
    <motion.div
      onClick={() => onDateClick(day)}
      className={`min-h-24 p-1 rounded-lg flex flex-col border border-transparent 
        ${isToday ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"}
        ${isCurrentMonth ? "" : "opacity-50"}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`text-right p-1 text-sm font-medium
        ${isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
      >
        {format(day, "d")}
      </div>

      <div className='flex-1 space-y-1 overflow-y-auto max-h-32 overflow-x-hidden custom-scrollbar'>
        {hasAppointments ? (
          appointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              onClick={(e) => {
                e.stopPropagation();
                onAppointmentClick(e, appointment);
              }}
              className='text-xs p-1 rounded bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/80 dark:to-blue-800/80 
                text-blue-800 dark:text-blue-200 truncate hover:from-blue-200 hover:to-blue-100 dark:hover:from-blue-800 dark:hover:to-blue-700/80
                border border-blue-200 dark:border-blue-800 transition-colors'
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className='font-medium'>{appointment.time}</span> - {appointment.patientName}
            </motion.div>
          ))
        ) : (
          <div className='text-xs text-gray-400 dark:text-gray-500 text-center py-1'>No appointments</div>
        )}
      </div>
    </motion.div>
  );
};

const MonthView = ({ className }) => {
  const { selectedDate, setSelectedDate, getAppointmentsForDate, setSelectedAppointment } = useCalendar();
  const [showForm, setShowForm] = useState(false);

  const { monthName, allDays, firstDayOfMonth, lastDayOfMonth } = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    return {
      monthName: format(selectedDate, "MMMM yyyy"),
      allDays: eachDayOfInterval({ start: monthStart, end: monthEnd }),
      firstDayOfMonth: getDay(monthStart),
      lastDayOfMonth: getDay(monthEnd),
    };
  }, [selectedDate]);

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setSelectedAppointment(null);
    setShowForm(true);
  };

  const handleAppointmentClick = (e, appointment) => {
    e.stopPropagation();
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const navigateMonth = (direction) => {
    setSelectedDate(addMonths(selectedDate, direction));
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <MonthNavigation monthName={monthName} onPrev={() => navigateMonth(-1)} onNext={() => navigateMonth(1)} />

      <DayNames />

      <motion.div className='grid grid-cols-7 gap-2' layout>
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-start-${index}`} aria-hidden='true' />
        ))}

        {allDays.map((day) => {
          const appointments = getAppointmentsForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <DayCell
              key={day}
            
              day={day}
              isToday={isToday}
              appointments={appointments}
              onDateClick={handleDateClick}
              onAppointmentClick={handleAppointmentClick}
            />
          );
        })}

        {Array.from({ length: 6 - lastDayOfMonth }).map((_, index) => (
          <div key={`empty-end-${index}`} aria-hidden='true' />
        ))}
      </motion.div>

      <AnimatePresence>{showForm && <AppoinmentForm onClose={() => setShowForm(false)} />}</AnimatePresence>
    </motion.div>
  );
};

export default MonthView;
