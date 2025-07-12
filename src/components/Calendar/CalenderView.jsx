import { motion, AnimatePresence } from "framer-motion";
import DarkModeToggle from "../UI/DarkModeToggle";
import FilterControls from "../UI/FilterControls";
import MonthView from "./MounthView";
import DayView from "./DayView";
import { useState } from "react";

const CalendarView = () => {
  const [filterShow, setFilterShow] = useState(false);

  return (
    <div className='relative'>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className='p-4 '>
        <motion.div
          className='flex justify-between items-center mb-6 '
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>Appointment Calendar</h1>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Manage your medical appointments</p>
          </div>
          <DarkModeToggle />
        </motion.div>

        <motion.button
          onClick={() => setFilterShow((prev) => !prev)}
          className='mb-6 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2'
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
            />
          </svg>
          <span>{filterShow ? "Hide Filters" : "Show Filters"}</span>
        </motion.button>

        <AnimatePresence>{filterShow && <FilterControls />}</AnimatePresence>

        <AnimatePresence mode='wait'>
          <motion.div
            key='month-view'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MonthView className={"md:block hidden"} />
            <DayView className={"block md:hidden"} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CalendarView;
