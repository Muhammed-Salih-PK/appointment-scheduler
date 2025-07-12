import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { doctors, patients } from "../utils/constants";
import { format } from "date-fns";

const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
  const [appointments, setAppointments] = useLocalStorage("appointments", []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filter, setFilter] = useState({ doctor: "", patient: "" });
  const [darkMode, setDarkMode] = useState(true);

  const addAppointment = (appointment) => {
    const exists = appointments.some(
      (app) => app.date === appointment.date && app.time === appointment.time && app.doctorId === appointment.doctorId
    );

    if (exists) {
      alert("An appointment already exists at this time for this doctor.");
      return;
    }

    setAppointments([...appointments, appointment]);
  };

  const updateAppointment = (updatedAppointment) => {
    const exists = appointments.some(
      (app) =>
        app.id !== updatedAppointment.id &&
        app.date === updatedAppointment.date &&
        app.time === updatedAppointment.time &&
        app.doctorId === updatedAppointment.doctorId
    );

    if (exists) {
      alert("Another appointment exists at this time for this doctor.");
      return;
    }

    setAppointments(appointments.map((app) => (app.id === updatedAppointment.id ? updatedAppointment : app)));
  };

  const deleteAppointment = (id) => {
    setAppointments(appointments.filter((app) => app.id !== id));
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return appointments
      .filter((app) => app.date === dateStr)
      .filter((app) => (!filter.doctor || app.doctorId === filter.doctor) && (!filter.patient || app.patientId === filter.patient))
      .sort((a, b) => a.time.localeCompare(b.time));
  };
  // Initialize dark mode on first render
  useEffect(() => {
    updateDarkMode(darkMode);
  }, []);

  const updateDarkMode = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.theme = "light";
    }
    setDarkMode(isDark);
  };

  const toggleDarkMode = () => {
    updateDarkMode(!darkMode);
  };
  return (
    <CalendarContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        selectedDate,
        setSelectedDate,
        selectedAppointment,
        setSelectedAppointment,
        getAppointmentsForDate,
        doctors,
        patients,
        filter,
        setFilter,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => useContext(CalendarContext);
