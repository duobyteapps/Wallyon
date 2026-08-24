import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { MonthlySummary } from "./analyticsHelpers";

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatReportCurrency = (amount: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const createMonthlyReport = async (monthlyData: MonthlySummary) => {
  const incomeTransactions = monthlyData.transactions.filter(
    (transaction) => transaction.type === "income",
  );

  const expenseTransactions = monthlyData.transactions.filter(
    (transaction) => transaction.type === "expense",
  );

  const investmentTransactions = monthlyData.transactions.filter(
    (transaction) => transaction.type === "investment",
  );

  const transactionRows = monthlyData.transactions
    .map((transaction) => {
      const note = transaction.note?.trim()
        ? escapeHtml(transaction.note)
        : "-";

      return `
        <tr>
          <td>${escapeHtml(transaction.date)}</td>

          <td>
            <strong>${escapeHtml(transaction.title)}</strong>
          </td>

          <td>${escapeHtml(transaction.category)}</td>

          <td class="amount">
            ${formatReportCurrency(transaction.amount)}
          </td>

          <td>${note}</td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="tr">
      <head>
        <meta charset="UTF-8" />

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
            background: #ffffff;
            color: #171717;
            padding: 32px;
            font-size: 12px;
          }

          .header {
            margin-bottom: 28px;
            border-bottom: 2px solid #7c3aed;
            padding-bottom: 18px;
          }

          .brand {
            font-size: 13px;
            font-weight: 700;
            color: #7c3aed;
            margin-bottom: 5px;
          }

          h1 {
            font-size: 27px;
            margin: 0;
            color: #111827;
          }

          .subtitle {
            margin-top: 7px;
            color: #6b7280;
          }

          .summary-grid {
            display: flex;
            gap: 10px;
            margin-bottom: 12px;
          }

          .summary-box {
            flex: 1;
            padding: 14px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
          }

          .summary-title {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 7px;
          }

          .summary-value {
            font-size: 17px;
            font-weight: 700;
          }

          .income-text {
            color: #059669;
          }

          .expense-text {
            color: #dc2626;
          }

          .investment-text {
            color: #2563eb;
          }

          .balance-box {
            margin-top: 10px;
            margin-bottom: 28px;
            padding: 15px;
            border: 1px solid #ddd6fe;
            background: #f5f3ff;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
          }

          .balance-title {
            color: #6b7280;
            font-size: 12px;
          }

          .balance-value {
            font-size: 17px;
            font-weight: 700;
            color: ${monthlyData.balance >= 0 ? "#7c3aed" : "#dc2626"};
          }

          .stats {
            margin-bottom: 26px;
          }

          .stats h2,
          .transactions h2 {
            font-size: 17px;
            margin-bottom: 12px;
          }

          .stats-table {
            width: 100%;
            border-collapse: collapse;
          }

          .stats-table td {
            padding: 8px 10px;
            border-bottom: 1px solid #e5e7eb;
          }

          .stats-table td:last-child {
            text-align: right;
            font-weight: 700;
          }

          table.transactions-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          .transactions-table th {
            background: #f3f4f6;
            padding: 9px 7px;
            text-align: left;
            font-size: 10px;
            color: #4b5563;
            border-bottom: 1px solid #d1d5db;
          }

          .transactions-table td {
            padding: 10px 7px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
            font-size: 10px;
          }

          .amount {
            white-space: nowrap;
            font-weight: 700;
          }

          .empty {
            color: #6b7280;
            text-align: center;
            padding: 25px;
          }

          .footer {
            margin-top: 30px;
            padding-top: 14px;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 9px;
            text-align: center;
          }
        </style>
      </head>

      <body>
        <div class="header">
          <div class="brand">Wallyon</div>

          <h1>${escapeHtml(monthlyData.monthLabel)} Finansal Raporu</h1>

          <div class="subtitle">
            Aylık gelir, gider, yatırım ve işlem özeti
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-box">
            <div class="summary-title">Toplam Gelir</div>

            <div class="summary-value income-text">
              ${formatReportCurrency(monthlyData.totalIncome)}
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-title">Toplam Gider</div>

            <div class="summary-value expense-text">
              ${formatReportCurrency(monthlyData.totalExpense)}
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-title">Toplam Yatırım</div>

            <div class="summary-value investment-text">
              ${formatReportCurrency(monthlyData.totalInvestment)}
            </div>
          </div>
        </div>

        <div class="balance-box">
          <div class="balance-title">Ay Sonu Kalan</div>

          <div class="balance-value">
            ${formatReportCurrency(monthlyData.balance)}
          </div>
        </div>

        <div class="stats">
          <h2>Aylık İstatistikler</h2>

          <table class="stats-table">
            <tr>
              <td>Toplam işlem sayısı</td>
              <td>${monthlyData.transactionCount}</td>
            </tr>

            <tr>
              <td>Gelir işlemi</td>
              <td>${incomeTransactions.length}</td>
            </tr>

            <tr>
              <td>Gider işlemi</td>
              <td>${expenseTransactions.length}</td>
            </tr>

            <tr>
              <td>Yatırım işlemi</td>
              <td>${investmentTransactions.length}</td>
            </tr>
          </table>
        </div>

        <div class="transactions">
          <h2>Ay İçindeki Tüm İşlemler</h2>

          ${
            monthlyData.transactions.length > 0
              ? `
                <table class="transactions-table">
                  <thead>
                    <tr>
                      <th>Tarih</th>
                      <th>İşlem</th>
                      <th>Kategori</th>
                      <th>Tutar</th>
                      <th>Not</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${transactionRows}
                  </tbody>
                </table>
              `
              : `
                <div class="empty">
                  Bu ay için kayıtlı işlem bulunmuyor.
                </div>
              `
          }
        </div>

        <div class="footer">
          Bu rapor Wallyon tarafından oluşturulmuştur.
        </div>
      </body>
    </html>
  `;

  const { uri } = await Print.printToFileAsync({
    html,
  });

  const sharingAvailable = await Sharing.isAvailableAsync();

  if (!sharingAvailable) {
    throw new Error("Dosya paylaşımı bu cihazda kullanılamıyor.");
  }

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: `${monthlyData.monthLabel} Finansal Raporu`,
    UTI: "com.adobe.pdf",
  });
};
