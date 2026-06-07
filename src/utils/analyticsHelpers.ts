import { Transaction } from "../types/transaction";

export type MonthlySummary = {
  monthKey: string;
  monthLabel: string;
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
  balance: number;
  transactionCount: number;
  transactions: Transaction[];
};

const turkishMonths: Record<string, string> = {
  ocak: "01",
  şubat: "02",
  subat: "02",
  mart: "03",
  nisan: "04",
  mayıs: "05",
  mayis: "05",
  haziran: "06",
  temmuz: "07",
  ağustos: "08",
  agustos: "08",
  eylül: "09",
  eylul: "09",
  ekim: "10",
  kasım: "11",
  kasim: "11",
  aralık: "12",
  aralik: "12",
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

const normalizeText = (value: string) => {
  return value.trim().toLocaleLowerCase("tr-TR").replace(",", "");
};

export const getTransactionMonthKey = (dateText: string) => {
  if (!dateText) return "";

  const numericDateMatch = dateText.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/,
  );

  if (numericDateMatch) {
    const month = numericDateMatch[2].padStart(2, "0");
    const year = numericDateMatch[3];

    return `${year}-${month}`;
  }

  const parsedDate = new Date(dateText);

  if (!Number.isNaN(parsedDate.getTime())) {
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}`;
  }

  const parts = dateText.split(" ").filter(Boolean);

  if (parts.length >= 3) {
    const monthText = normalizeText(parts[1]);
    const month = turkishMonths[monthText];
    const year = parts[2];

    if (!month || !year) return "";

    return `${year}-${month}`;
  }

  return "";
};

export const getTransactionDateTime = (dateText: string) => {
  if (!dateText) return 0;

  const numericDateMatch = dateText.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/,
  );

  if (numericDateMatch) {
    const day = Number(numericDateMatch[1]);
    const month = Number(numericDateMatch[2]) - 1;
    const year = Number(numericDateMatch[3]);

    return new Date(year, month, day).getTime();
  }

  const parsedDate = new Date(dateText);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.getTime();
  }

  const parts = dateText.split(" ").filter(Boolean);

  if (parts.length >= 3) {
    const day = Number(parts[0]);
    const monthText = normalizeText(parts[1]);
    const month = turkishMonths[monthText];
    const year = Number(parts[2]);

    if (!day || !month || !year) return 0;

    return new Date(year, Number(month) - 1, day).getTime();
  }

  return 0;
};

export const getMonthLabel = (monthKey: string) => {
  const [year, month] = monthKey.split("-");
  const monthLabel = monthLabels[month] || "Bilinmeyen Ay";

  return `${monthLabel} ${year}`;
};

export const getMonthlyAnalyticsData = (
  transactions: Transaction[],
): MonthlySummary[] => {
  const groupedTransactions = transactions.reduce<
    Record<string, MonthlySummary>
  >((acc, transaction) => {
    const monthKey = getTransactionMonthKey(transaction.date);

    if (!monthKey) return acc;

    if (!acc[monthKey]) {
      acc[monthKey] = {
        monthKey,
        monthLabel: getMonthLabel(monthKey),
        totalIncome: 0,
        totalExpense: 0,
        totalInvestment: 0,
        balance: 0,
        transactionCount: 0,
        transactions: [],
      };
    }

    if (transaction.type === "income") {
      acc[monthKey].totalIncome += transaction.amount;
    }

    if (transaction.type === "expense") {
      acc[monthKey].totalExpense += transaction.amount;
    }

    if (transaction.type === "investment") {
      acc[monthKey].totalInvestment += transaction.amount;
    }

    acc[monthKey].transactionCount += 1;
    acc[monthKey].transactions.push(transaction);

    return acc;
  }, {});

  return Object.values(groupedTransactions)
    .map((item) => ({
      ...item,
      balance: item.totalIncome - item.totalExpense - item.totalInvestment,
      transactions: item.transactions.sort(
        (a, b) =>
          getTransactionDateTime(b.date) - getTransactionDateTime(a.date),
      ),
    }))
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey));
};
