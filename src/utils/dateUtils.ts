export const formatDateTR = (date: Date) => {
  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const addMonthsToDate = (date: Date, monthCount: number) => {
  const copiedDate = new Date(date);
  copiedDate.setMonth(copiedDate.getMonth() + monthCount);
  return copiedDate;
};
