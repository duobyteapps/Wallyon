import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BalanceCard from "../../components/home/BalanceCard";
import HomeActionSection from "../../components/home/HomeActionSection";
import HomeHeader from "../../components/home/HomeHeader";
import HomeSummarySection from "../../components/home/HomeSummarySection";
import HomeTransactionModals from "../../components/home/HomeTransactionModals";
import RecentTransactionsCard from "../../components/home/RecentTransactionsCard";
import TransactionDetailModal from "../../components/transaction/TransactionDetailModal";
import { colors } from "../../constants/theme";
import { useHomeModals } from "../../hooks/useHomeModals";
import { useTransactionFields } from "../../hooks/useTransactionFields";
import { useTransactions } from "../../hooks/useTransactions";
import { getStoredNotes, saveStoredNotes } from "../../services/noteStorage";
import { getStoredUserName } from "../../services/profileStorage";
import { Note } from "../../types/note";
import { Transaction } from "../../types/transaction";
import { formatTodayTR } from "../../utils/transactionDateUtils";

const getTodayKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function HomeScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name?: string }>();

  const [storedName, setStoredName] = useState("");
  const [dueNotes, setDueNotes] = useState<Note[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const todayText = formatTodayTR();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadHomeData = async () => {
        try {
          if (name && name.trim()) {
            setStoredName(name);
          } else {
            const savedName = await getStoredUserName();

            if (isActive) {
              setStoredName(savedName || "");
            }
          }

          const storedNotes = await getStoredNotes();
          const today = getTodayKey();

          const activeDueNotes = storedNotes
            .filter(
              (note) =>
                note.date <= today &&
                !note.isCompleted &&
                !note.notificationReadAt,
            )
            .sort((a, b) => a.date.localeCompare(b.date));

          if (isActive) {
            setDueNotes(activeDueNotes);
          }
        } catch (error) {
          console.log("Home data could not be loaded on home:", error);

          if (isActive) {
            setDueNotes([]);
          }
        }
      };

      loadHomeData();

      return () => {
        isActive = false;
      };
    }, [name]),
  );

  const displayName = name && name.trim() ? name : storedName;

  const {
    currentMonthTransactions,
    remainingBalance,
    currentMonthIncome,
    currentMonthExpense,
    currentMonthInvestment,
    saveIncomeTransaction,
    saveExpenseTransactions,
    saveInvestmentTransaction,
    deleteTransaction,
  } = useTransactions();

  const {
    incomeFields,
    expenseFields,
    investmentFields,
    handleAddIncomeField,
    handleDeleteIncomeField,
    handleAddExpenseField,
    handleDeleteExpenseField,
    handleAddInvestmentField,
    handleDeleteInvestmentField,
  } = useTransactionFields();

  const {
    editingTransaction,
    isIncomeModalVisible,
    isIncomeFieldsModalVisible,
    isExpenseModalVisible,
    isExpenseFieldsModalVisible,
    isInvestmentModalVisible,
    isInvestmentFieldsModalVisible,
    resetEditingTransaction,
    openIncomeModal,
    openExpenseModal,
    openInvestmentModal,
    closeIncomeModal,
    closeExpenseModal,
    closeInvestmentModal,
    openIncomeFieldsModal,
    openExpenseFieldsModal,
    openInvestmentFieldsModal,
    closeIncomeFieldsModal,
    closeExpenseFieldsModal,
    closeInvestmentFieldsModal,
    handleEditTransaction,
  } = useHomeModals();

  const handleSaveIncome = (transaction: Transaction) => {
    saveIncomeTransaction(transaction);
    resetEditingTransaction();
  };

  const handleSaveExpense = (transactions: Transaction[]) => {
    saveExpenseTransactions(transactions);
    resetEditingTransaction();
  };

  const handleSaveInvestment = (transaction: Transaction) => {
    saveInvestmentTransaction(transaction);
    resetEditingTransaction();
  };

  const handleDeleteTransaction = (transactionId: number) => {
    const selectedTransaction = currentMonthTransactions.find(
      (transaction) => transaction.id === transactionId,
    );

    const transactionTitle = selectedTransaction?.title || "Bu işlem";

    Alert.alert(
      "İşlem Silinsin mi?",
      `"${transactionTitle}" işlemini silmek istediğine emin misin?`,
      [
        {
          text: "Vazgeç",
          style: "cancel",
        },
        {
          text: "Sil",
          style: "destructive",
          onPress: () => deleteTransaction(transactionId),
        },
      ],
    );
  };

  const handleReadDueNotifications = async (noteIds: number[]) => {
    if (noteIds.length === 0) return;

    try {
      const storedNotes = await getStoredNotes();
      const readAt = new Date().toISOString();

      const updatedNotes = storedNotes.map((note) =>
        noteIds.includes(note.id)
          ? {
              ...note,
              notificationReadAt: note.notificationReadAt || readAt,
            }
          : note,
      );

      await saveStoredNotes(updatedNotes);

      setDueNotes((currentNotes) =>
        currentNotes.filter((note) => !noteIds.includes(note.id)),
      );
    } catch (error) {
      console.log("Notifications could not be marked as read:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <HomeHeader
          name={displayName}
          dueNotes={dueNotes}
          onOpenNotesPress={() => router.push("/tabs/notes")}
          onReadDueNotifications={handleReadDueNotifications}
        />

        <BalanceCard remainingBalance={remainingBalance} />

        <HomeSummarySection
          currentMonthIncome={currentMonthIncome}
          currentMonthExpense={currentMonthExpense}
          currentMonthInvestment={currentMonthInvestment}
        />

        <HomeActionSection
          onAddIncome={openIncomeModal}
          onAddExpense={openExpenseModal}
          onAddInvestment={openInvestmentModal}
          onAddNote={() => router.push("/add-note")}
        />

        <RecentTransactionsCard
          todayText={todayText}
          transactions={currentMonthTransactions}
          onPress={setSelectedTransaction}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </ScrollView>

      <TransactionDetailModal
        visible={selectedTransaction !== null}
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      <HomeTransactionModals
        editingTransaction={editingTransaction}
        incomeFields={incomeFields}
        expenseFields={expenseFields}
        investmentFields={investmentFields}
        isIncomeModalVisible={isIncomeModalVisible}
        isIncomeFieldsModalVisible={isIncomeFieldsModalVisible}
        isExpenseModalVisible={isExpenseModalVisible}
        isExpenseFieldsModalVisible={isExpenseFieldsModalVisible}
        isInvestmentModalVisible={isInvestmentModalVisible}
        isInvestmentFieldsModalVisible={isInvestmentFieldsModalVisible}
        onCloseIncomeModal={closeIncomeModal}
        onCloseExpenseModal={closeExpenseModal}
        onCloseInvestmentModal={closeInvestmentModal}
        onOpenIncomeFieldsModal={openIncomeFieldsModal}
        onOpenExpenseFieldsModal={openExpenseFieldsModal}
        onOpenInvestmentFieldsModal={openInvestmentFieldsModal}
        onCloseIncomeFieldsModal={closeIncomeFieldsModal}
        onCloseExpenseFieldsModal={closeExpenseFieldsModal}
        onCloseInvestmentFieldsModal={closeInvestmentFieldsModal}
        onSaveIncome={handleSaveIncome}
        onSaveExpense={handleSaveExpense}
        onSaveInvestment={handleSaveInvestment}
        onAddIncomeField={handleAddIncomeField}
        onDeleteIncomeField={handleDeleteIncomeField}
        onAddExpenseField={handleAddExpenseField}
        onDeleteExpenseField={handleDeleteExpenseField}
        onAddInvestmentField={handleAddInvestmentField}
        onDeleteInvestmentField={handleDeleteInvestmentField}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});
