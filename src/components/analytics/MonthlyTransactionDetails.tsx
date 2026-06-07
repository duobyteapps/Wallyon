import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/theme";
import { MonthlySummary } from "../../utils/analyticsHelpers";
import { formatCurrency } from "../../utils/formatCurrency";
import TransactionItem from "../home/TransactionItem";
import Pagination from "../ui/Pagination";

type MonthlyTransactionDetailsProps = {
  selectedMonthData: MonthlySummary | null;
};

const MONTHLY_DETAILS_PAGE_SIZE = 5;

export default function MonthlyTransactionDetails({
  selectedMonthData,
}: MonthlyTransactionDetailsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const transactions = selectedMonthData?.transactions || [];

  const totalPages = Math.max(
    1,
    Math.ceil(transactions.length / MONTHLY_DETAILS_PAGE_SIZE),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedMonthData?.monthKey]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * MONTHLY_DETAILS_PAGE_SIZE;
    const endIndex = startIndex + MONTHLY_DETAILS_PAGE_SIZE;

    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage]);

  if (!selectedMonthData) {
    return null;
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{selectedMonthData.monthLabel}</Text>

        <Text style={styles.description}>
          Bu ay yapılan işlemler son işlemler görünümünde listelenir.
        </Text>
      </View>

      <View style={styles.summaryGrid}>
        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: colors.incomeSoft,
              borderColor: colors.incomeBorder,
            },
          ]}
        >
          <Text style={styles.summaryLabel}>Gelir</Text>

          <Text style={[styles.summaryValue, { color: colors.income }]}>
            + {formatCurrency(selectedMonthData.totalIncome)}
          </Text>
        </View>

        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: colors.expenseSoft,
              borderColor: colors.expenseBorder,
            },
          ]}
        >
          <Text style={styles.summaryLabel}>Gider</Text>

          <Text style={[styles.summaryValue, { color: colors.expense }]}>
            - {formatCurrency(selectedMonthData.totalExpense)}
          </Text>
        </View>

        <View
          style={[
            styles.summaryBox,
            {
              backgroundColor: colors.investmentSoft,
              borderColor: colors.investmentBorder,
            },
          ]}
        >
          <Text style={styles.summaryLabel}>Yatırım</Text>

          <Text style={[styles.summaryValue, { color: colors.investment }]}>
            - {formatCurrency(selectedMonthData.totalInvestment)}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.balanceBox,
          {
            backgroundColor:
              selectedMonthData.balance >= 0
                ? colors.purpleSoft
                : colors.expenseSoft,
            borderColor:
              selectedMonthData.balance >= 0
                ? colors.purpleBorder
                : colors.expenseBorder,
          },
        ]}
      >
        <Text style={styles.balanceLabel}>Kalan</Text>

        <Text
          style={[
            styles.balanceValue,
            {
              color:
                selectedMonthData.balance >= 0
                  ? colors.purpleLight
                  : colors.expense,
            },
          ]}
        >
          {formatCurrency(selectedMonthData.balance)}
        </Text>
      </View>

      <View style={styles.transactionsHeader}>
        <Text style={styles.transactionsTitle}>Aylık İşlemler</Text>

        <Text style={styles.transactionsCount}>
          {selectedMonthData.transactionCount} işlem
        </Text>
      </View>

      <View style={styles.transactionsList}>
        {paginatedTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}

        {transactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>İşlem bulunamadı</Text>

            <Text style={styles.emptyStateText}>
              Bu ay için kayıtlı işlem bulunmuyor.
            </Text>
          </View>
        )}

        <Pagination
          currentPage={currentPage}
          totalItems={transactions.length}
          pageSize={MONTHLY_DETAILS_PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    borderRadius: 30,
    backgroundColor: colors.panel,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  header: {
    marginBottom: 18,
  },

  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
  },

  description: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },

  summaryGrid: {
    flexDirection: "row",
    gap: 8,
  },

  summaryBox: {
    flex: 1,
    minHeight: 54,
    borderRadius: 16,
    paddingHorizontal: 9,
    paddingVertical: 9,
    borderWidth: 1,
    justifyContent: "center",
    overflow: "hidden",
  },

  summaryLabel: {
    color: colors.label,
    fontSize: 10,
    fontWeight: "800",
  },

  summaryValue: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "900",
  },

  balanceBox: {
    marginTop: 12,
    minHeight: 58,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  balanceLabel: {
    color: colors.label,
    fontSize: 13,
    fontWeight: "800",
  },

  balanceValue: {
    fontSize: 16,
    fontWeight: "900",
  },

  transactionsHeader: {
    marginTop: 24,
    marginBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  transactionsTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },

  transactionsCount: {
    color: colors.purpleLight,
    fontSize: 12,
    fontWeight: "800",
  },

  transactionsList: {
    marginTop: 2,
  },

  emptyState: {
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 20,
  },

  emptyStateTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyStateText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 19,
  },
});
