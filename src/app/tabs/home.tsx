import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import BalanceCard from "../../components/home/BalanceCard";
import HomeActionSection from "../../components/home/HomeActionSection";
import HomeHeader from "../../components/home/HomeHeader";
import HomeSummarySection from "../../components/home/HomeSummarySection";
import HomeTransactionModals from "../../components/home/HomeTransactionModals";
import RecentTransactionsCard from "../../components/home/RecentTransactionsCard";
import { colors } from "../../constants/theme";
import { useHomeModals } from "../../hooks/useHomeModals";
import { useTransactionFields } from "../../hooks/useTransactionFields";
import { useTransactions } from "../../hooks/useTransactions";
import { getStoredNotes } from "../../services/noteStorage";
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
            .filter((note) => note.date <= today && !note.isCompleted)
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
          onEdit={handleEditTransaction}
          onDelete={deleteTransaction}
        />
      </ScrollView>

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
