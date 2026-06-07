import { Note } from "../types/note";
import { getTodayKey } from "./noteUtils";

export type ArchiveMonthlySummary = {
  monthKey: string;
  monthLabel: string;
  year: number;
  monthNumber: number;
  noteCount: number;
};

const monthLabels: Record<string, string> = {
  "01": "Ocak",
  "02": "Şubat",
  "03": "Mart",
  "04": "Nisan",
  "05": "Mayıs",
  "06": "Haziran",
  "07": "Temmuz",
  "08": "Ağustos",
  "09": "Eylül",
  "10": "Ekim",
  "11": "Kasım",
  "12": "Aralık",
};

export function getArchivedNotes(notes: Note[]) {
  const today = getTodayKey();

  return notes.filter((note) => note.date < today);
}

export function getArchiveMonthKey(dateKey: string) {
  const [year, month] = dateKey.split("-");

  return `${year}-${month}`;
}

export function getArchiveYear(dateKey: string) {
  const year = Number(dateKey.split("-")[0]);

  return Number.isNaN(year) ? new Date().getFullYear() : year;
}

export function getArchiveMonthNumber(dateKey: string) {
  const month = Number(dateKey.split("-")[1]);

  return Number.isNaN(month) ? 1 : month;
}

export function getArchiveMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const monthLabel = monthLabels[month] || "Bilinmeyen Ay";

  return `${monthLabel} ${year}`;
}

export function getArchiveMonthlyData(
  archivedNotes: Note[],
): ArchiveMonthlySummary[] {
  const groupedMonths = archivedNotes.reduce<
    Record<string, ArchiveMonthlySummary>
  >((acc, note) => {
    const monthKey = getArchiveMonthKey(note.date);
    const year = getArchiveYear(note.date);
    const monthNumber = getArchiveMonthNumber(note.date);

    if (!acc[monthKey]) {
      acc[monthKey] = {
        monthKey,
        monthLabel: getArchiveMonthLabel(monthKey),
        year,
        monthNumber,
        noteCount: 0,
      };
    }

    acc[monthKey].noteCount += 1;

    return acc;
  }, {});

  return Object.values(groupedMonths).sort((a, b) =>
    b.monthKey.localeCompare(a.monthKey),
  );
}

export function getArchiveYears(monthlyData: ArchiveMonthlySummary[]) {
  const years = Array.from(new Set(monthlyData.map((item) => item.year)));

  return years.sort((a, b) => b - a);
}

export function getFilteredArchiveMonthsByYear(
  monthlyData: ArchiveMonthlySummary[],
  year: number | null,
) {
  if (!year) return [];

  return monthlyData
    .filter((item) => item.year === year)
    .sort((a, b) => b.monthNumber - a.monthNumber);
}

export function getFilteredArchivedNotes(
  archivedNotes: Note[],
  selectedMonthKey: string | null,
) {
  if (!selectedMonthKey) return archivedNotes;

  return archivedNotes.filter(
    (note) => getArchiveMonthKey(note.date) === selectedMonthKey,
  );
}
