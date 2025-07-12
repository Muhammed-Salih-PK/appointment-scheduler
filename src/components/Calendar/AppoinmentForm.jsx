import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useCalendar } from "../../context/CalendarContext";
import { generateId, generateTimeSlots } from "../../utils/helpers";
import { motion, AnimatePresence } from "framer-motion";

const AppointmentForm = ({ onClose }) => {
  const { selectedDate, selectedAppointment, addAppointment, updateAppointment, deleteAppointment, doctors, patients } = useCalendar();

  const initialFormState = useMemo(
    () => ({
      id: generateId(),
      date: format(selectedDate, "yyyy-MM-dd"),
      time: "08:00",
      patientId: patients[0]?.id || "",
      doctorId: doctors[0]?.id || "",
      notes: "",
      duration: "30",
    }),
    [selectedDate, doctors, patients]
  );

  const [newPatientMode, setNewPatientMode] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAge, setNewPatientAge] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = useMemo(() => generateTimeSlots(), []);
  const durationOptions = ["15", "30", "45", "60"];

  useEffect(() => {
    setFormData(selectedAppointment || initialFormState);
  }, [selectedAppointment, initialFormState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let selectedPatient;

      if (newPatientMode) {
        selectedPatient = {
          id: generateId(),
          name: newPatientName,
          age: parseInt(newPatientAge, 10),
        };
        patients.push(selectedPatient);
      } else {
        selectedPatient = patients.find((p) => p.id === formData.patientId);
      }

      const selectedDoctor = doctors.find((d) => d.id === formData.doctorId);

      if (!selectedPatient || !selectedDoctor) {
        throw new Error("Invalid patient or doctor selection");
      }

      const appointmentData = {
        ...formData,
        patientName: selectedPatient.name,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
      };

      if (selectedAppointment) {
        await updateAppointment(appointmentData);
      } else {
        await addAppointment(appointmentData);
      }

      onClose();
    } catch (error) {
      console.error("Appointment submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAppointment) return;

    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointment(selectedAppointment.id);
        onClose();
      } catch (error) {
        console.error("Failed to delete appointment:", error);
      }
    }
  };

  return (
    <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Full-screen backdrop with blur */}
      <motion.div 
        className="absolute inset-0 bg-black/40 backdrop-blur-lg"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 my-8 overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
          {/* Header with gradient background */}
          <div className='bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-800 dark:to-blue-700 p-5'>
            <h2 className='text-xl font-semibold text-white'>{selectedAppointment ? "Edit Appointment" : "New Appointment"}</h2>
            <p className='text-blue-100 text-sm mt-1'>{format(new Date(formData.date), "EEEE, MMMM d, yyyy")}</p>
          </div>

          {/* Form content area */}
          <div className='p-5'>
            <form onSubmit={handleSubmit}>
              {/* Time and Duration in a 2-column grid */}
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Time</label>
                  <select
                    name='time'
                    value={formData.time}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                    required
                    disabled={isSubmitting}
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Duration (min)</label>
                  <select
                    name='duration'
                    value={formData.duration}
                    onChange={handleChange}
                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                    required
                    disabled={isSubmitting}
                  >
                    {durationOptions.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Patient selection section */}
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Patient</label>

                {!newPatientMode ? (
                  <>
                    <select
                      name='patientId'
                      value={formData.patientId}
                      onChange={(e) => {
                        if (e.target.value === "__new__") {
                          setNewPatientMode(true);
                          setFormData((prev) => ({ ...prev, patientId: "" }));
                        } else {
                          handleChange(e);
                        }
                      }}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                      required
                      disabled={isSubmitting}
                    >
                      <option value=''>Select a patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} (Age: {patient.age})
                        </option>
                      ))}
                      <option value='__new__'>➕ Add new patient</option>
                    </select>
                  </>
                ) : (
                  <div className='space-y-3'>
                    <input
                      type='text'
                      placeholder='Patient name'
                      value={newPatientName}
                      onChange={(e) => setNewPatientName(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                      required
                      disabled={isSubmitting}
                    />
                    <input
                      type='number'
                      placeholder='Patient age'
                      value={newPatientAge}
                      onChange={(e) => setNewPatientAge(e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                      required
                      min='0'
                      max='120'
                      disabled={isSubmitting}
                    />
                    <button
                      type='button'
                      onClick={() => setNewPatientMode(false)}
                      className='text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center'
                    >
                      <svg className='w-4 h-4 mr-1' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                      </svg>
                      Back to patient list
                    </button>
                  </div>
                )}
              </div>

              {/* Doctor selection section */}
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Doctor</label>
                <select
                  name='doctorId'
                  value={formData.doctorId}
                  onChange={handleChange}
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                  required
                  disabled={isSubmitting}
                >
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.name} ({doctor.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes section */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Notes</label>
                <textarea
                  name='notes'
                  value={formData.notes}
                  onChange={handleChange}
                  rows='3'
                  placeholder='Any additional notes about the appointment...'
                  className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                  disabled={isSubmitting}
                />
              </div>

              {/* Action buttons */}
              <div className='flex justify-between items-center'>
                <div>
                  {selectedAppointment && (
                    <button
                      type='button'
                      onClick={handleDelete}
                      className='px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors duration-200'
                      disabled={isSubmitting}
                    >
                      <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                <div className='flex space-x-3'>
                  <button
                    type='button'
                    onClick={onClose}
                    className='px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center space-x-1 transition-colors duration-200'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                        >
                          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                          <path
                            className='opacity-75'
                            fill='currentColor'
                            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                          ></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg>
                        <span>{selectedAppointment ? "Update" : "Create"} Appointment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppointmentForm;
