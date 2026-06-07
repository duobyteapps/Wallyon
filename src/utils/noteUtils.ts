import { Note } from "../types/note";
import { formatDateTR } from "./dateUtils";

export type NoteGroup = {
  date: string;
  notes: Note[];
};

export const getTodayKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatNoteDate = (dateKey: string) => {
  return formatDateTR(parseDateKey(dateKey));
};

export const getNoteBadgeText = (dateKey: string) => {
  if (dateKey === getTodayKey()) return "Bugün";

  return formatNoteDate(dateKey);
};

export const getCompletedCount = (notes: Note[]) => {
  return notes.filter((note) => note.isCompleted).length;
};

export const groupNotesByDate = (notes: Note[]): NoteGroup[] => {
  const groupedNotes = notes.reduce<Record<string, Note[]>>((groups, note) => {
    if (!groups[note.date]) {
      groups[note.date] = [];
    }

    groups[note.date].push(note);

    return groups;
  }, {});

  return Object.entries(groupedNotes)
    .map(([date, groupedDateNotes]) => ({
      date,
      notes: groupedDateNotes.sort(
        (a, b) => Number(a.isCompleted) - Number(b.isCompleted),
      ),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
