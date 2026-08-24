export const formatCurrency = (amount: number) => {
  return amount.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const formatCurrencyInput = (value: string) => {
  const cleanedValue = value.replace(/\./g, "").replace(/[^\d,]/g, "");

  const commaIndex = cleanedValue.indexOf(",");

  const integerPartRaw =
    commaIndex >= 0 ? cleanedValue.slice(0, commaIndex) : cleanedValue;

  const decimalPartRaw =
    commaIndex >= 0
      ? cleanedValue
          .slice(commaIndex + 1)
          .replace(/,/g, "")
          .slice(0, 2)
      : "";

  const integerPart = integerPartRaw.replace(/^0+(?=\d)/, "") || "";

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  if (commaIndex >= 0) {
    return `${formattedInteger || "0"},${decimalPartRaw}`;
  }

  return formattedInteger;
};

export const parseCurrencyInput = (value: string) => {
  return Number(value.replace(/\./g, "").replace(",", "."));
};
