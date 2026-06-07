export type TransactionType = "income" | "expense" | "investment";

export type Transaction = {
  id: number;
  title: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  note?: string;
};
