export type Note = {
  id: number;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  isCompleted: boolean;
  createdAt: string;
};
