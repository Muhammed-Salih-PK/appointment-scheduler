export const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};


export const generateTimeSlots = () => {
  const slots = [];
  const start = 8; // 8 AM
  const end = 17;  // 5 PM

  for (let hour = start; hour <= end; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  return slots;
};
