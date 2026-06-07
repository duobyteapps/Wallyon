export const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export function getMonthNumber(monthLabel: string) {
  const monthName = monthLabel.split(" ")[0];
  const monthIndex = monthNames.findIndex((item) => item === monthName);

  return monthIndex === -1 ? 0 : monthIndex + 1;
}

export function getYear(monthLabel: string) {
  const parts = monthLabel.split(" ");
  const year = Number(parts[1]);

  return Number.isNaN(year) ? new Date().getFullYear() : year;
}
