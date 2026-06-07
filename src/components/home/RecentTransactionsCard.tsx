import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/theme";
import { Transaction } from "../../types/transaction";
import Pagination from "../ui/Pagination";
import EmptyCard from "./EmptyCard";
import TransactionItem from "./TransactionItem";

const RECENT_TRANSACTIONS_PAGE_SIZE = 5;

type RecentTransactionsCardProps = {
  todayText: string;
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: number) => void;
};

export default function RecentTransactionsCard({
  todayText,
  transactions,
  onEdit,
  onDelete,
}: RecentTransactionsCardProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const isEmpty = transactions.length === 0;

  const totalPages = Math.max(
    1,
    Math.ceil(transactions.length / RECENT_TRANSACTIONS_PAGE_SIZE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [transactions.length]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * RECENT_TRANSACTIONS_PAGE_SIZE;
    const endIndex = startIndex + RECENT_TRANSACTIONS_PAGE_SIZE;

    return transactions.slice(startIndex, endIndex);
  }, [transactions, currentPage]);

  return (
    <View style={styles.transactionsCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Son İşlemler</Text>

        <Text style={styles.todayText}>{todayText}</Text>
      </View>

      {isEmpty ? (
        <EmptyCard
          icon="receipt-outline"
          title="Henüz işlem yok"
          description="Gelir, gider veya yatırım eklediğinde son işlemlerin burada listelenir."
        />
      ) : (
        <>
          {paginatedTransactions.map((item) => (
            <TransactionItem
              key={item.id}
              transaction={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

          <Pagination
            currentPage={currentPage}
            totalItems={transactions.length}
            pageSize={RECENT_TRANSACTIONS_PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  transactionsCard: {
    marginTop: 24,
    borderRadius: 30,
    backgroundColor: colors.panel,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  sectionHeader: {
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
  },

  todayText: {
    color: colors.label,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    flexShrink: 1,
  },
});
