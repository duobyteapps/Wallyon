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

export const getCurrentMonthKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

export const formatTodayTR = () => {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
};
