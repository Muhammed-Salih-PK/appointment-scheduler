import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { useCalendar } from "../../context/CalendarContext";
import AppoinmentForm from "./AppoinmentForm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DayView = ({ className }) => {
  const { selectedDate, setSelectedDate, getAppointmentsForDate, setSelectedAppointment } = useCalendar();
  const [showForm, setShowForm] = useState(false);
  const [visibleDays, setVisibleDays] = useState([]);

  const appointments = getAppointmentsForDate(selectedDate);
  const isToday = isSameDay(selectedDate, new Date());

  // Initialize visible days (current day + next 6 days)
  useEffect(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(selectedDate, i));
    }
    setVisibleDays(days);
  }, [selectedDate]);

  const navigateDay = (direction) => {
    const newDate = direction === "next" ? addDays(selectedDate, 1) : subDays(selectedDate, 1);
    setSelectedDate(newDate);
    
    // Auto-scroll to the selected day
    setTimeout(() => {
      const element = document.getElementById(`day-${format(newDate, 'yyyy-MM-dd')}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setShowForm(true);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const scrollToDay = (day) => {
    setSelectedDate(day);
    setTimeout(() => {
      const element = document.getElementById(`day-${format(day, 'yyyy-MM-dd')}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  };

  return (
    <div className={`${className} flex flex-col h-full`}>
      {/* Fixed header */}
      <div className=" pt-4 px-4 rounded-2xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {format(selectedDate, "MMMM yyyy")}
          </h2>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            className="text-center bg-white dark:bg-gray-800 text-sm font-medium text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 focus:outline-none"
            dateFormat="MMM d, yyyy"
            showPopperArrow={false}
          />
        </div>
        
        {/* Horizontal day selector - no scrolling here */}
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          {visibleDays.map((day) => (
            <button
              key={day.toString()}
              onClick={() => scrollToDay(day)}
              className={`flex flex-col items-center justify-center px-3 py-2 mx-1 rounded-lg min-w-[50px] transition-colors ${
                isSameDay(day, selectedDate)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <span className="text-xs font-medium">{format(day, "EEE")}</span>
              <span className="text-sm font-semibold">{format(day, "d")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content area with single scroll */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {visibleDays.map((day) => (
          <motion.div
            key={day.toString()}
            id={`day-${format(day, 'yyyy-MM-dd')}`}
            className={`mb-4 ${isSameDay(day, selectedDate) ? "" : "opacity-70"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              {/* Day header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                  {format(day, "EEEE, MMMM d")}
                  {isSameDay(day, new Date()) && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                      Today
                    </span>
                  )}
                </h3>
                {isSameDay(day, selectedDate) && (
                  <motion.button
                    onClick={handleAddAppointment}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center space-x-1"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add</span>
                  </motion.button>
                )}
              </div>

              {/* Appointments for the day */}
              {getAppointmentsForDate(day).length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No appointments</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {getAppointmentsForDate(day).map((appointment) => (
                    <motion.div
                      key={appointment.id}
                      onClick={() => handleAppointmentClick(appointment)}
                      className="p-2 border rounded-lg border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-800 dark:text-white text-sm">
                              {appointment.time}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                              {appointment.duration} min
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{appointment.patientName}</p>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {appointment.doctorName}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation arrows - Fixed at bottom */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center space-x-4">
        <motion.button
          onClick={() => navigateDay("prev")}
          className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
        <motion.button
          onClick={() => navigateDay("next")}
          className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && <AppoinmentForm onClose={() => setShowForm(false)} />}
      </AnimatePresence>
    </div>
  );
};

// Add this to your CSS to hide the horizontal scrollbar


export default DayView;