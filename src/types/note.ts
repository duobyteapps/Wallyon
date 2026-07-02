export type NoteContentType = "text" | "checklist";

export type NoteChecklistItem = {
  id: number;
  text: string;
  isCompleted: boolean;
};

export type Note = {
  id: number;
  title: string;
  description?: string;
  contentType?: NoteContentType;
  checklistItems?: NoteChecklistItem[];
  date: string;
  isCompleted: boolean;
  createdAt: string;
};
