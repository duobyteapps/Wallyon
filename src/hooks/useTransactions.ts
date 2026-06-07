import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";

import { Transaction } from "../types/transaction";
import {
  getCurrentMonthKey,
  getTransactionMonthKey,
} from "../utils/transactionDateUtils";

const TRANSACTIONS_STORAGE_KEY = "WALLYON_TRANSACTIONS";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem(
          TRANSACTIONS_STORAGE_KEY,
        );

        if (!storedTransactions) {
          setTransactions([]);
          return;
        }

        const parsedTransactions = JSON.parse(storedTransactions);

        if (Array.isArray(parsedTransactions)) {
          setTransactions(parsedTransactions as Transaction[]);
          return;
        }

        setTransactions([]);
      } catch (error) {
        console.log("Transactions could not be loaded:", error);
        setTransactions([]);
      } finally {
        setIsStorageLoaded(true);
      }
    };

    loadTransactions();
  }, []);

  useEffect(() => {
    if (!isStorageLoaded) return;

    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem(
          TRANSACTIONS_STORAGE_KEY,
          JSON.stringify(transactions),
        );
      } catch (error) {
        console.log("Transactions could not be saved:", error);
      }
    };

    saveTransactions();
  }, [transactions, isStorageLoaded]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const totalInvestment = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "investment")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const remainingBalance = totalIncome - totalExpense - totalInvestment;

  const currentMonthTransactions = useMemo(() => {
    const currentMonthKey = getCurrentMonthKey();

    return transactions.filter((transaction) => {
      return getTransactionMonthKey(transaction.date) === currentMonthKey;
    });
  }, [transactions]);

  const currentMonthIncome = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [currentMonthTransactions]);

  const currentMonthExpense = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [currentMonthTransactions]);

  const currentMonthInvestment = useMemo(() => {
    return currentMonthTransactions
      .filter((transaction) => transaction.type === "investment")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [currentMonthTransactions]);

  const saveIncomeTransaction = (transaction: Transaction) => {
    setTransactions((currentTransactions) => {
      const isEditing = currentTransactions.some(
        (currentTransaction) => currentTransaction.id === transaction.id,
      );

      if (isEditing) {
        return currentTransactions.map((currentTransaction) =>
          currentTransaction.id === transaction.id
            ? transaction
            : currentTransaction,
        );
      }

      return [transaction, ...currentTransactions];
    });
  };

  const saveExpenseTransactions = (newTransactions: Transaction[]) => {
    setTransactions((currentTransactions) => {
      const editingTransaction = newTransactions.find((newTransaction) =>
        currentTransactions.some(
          (currentTransaction) => currentTransaction.id === newTransaction.id,
        ),
      );

      if (editingTransaction) {
        return currentTransactions.map((currentTransaction) =>
          currentTransaction.id === editingTransaction.id
            ? editingTransaction
            : currentTransaction,
        );
      }

      return [...newTransactions, ...currentTransactions];
    });
  };

  const saveInvestmentTransaction = (transaction: Transaction) => {
    setTransactions((currentTransactions) => {
      const isEditing = currentTransactions.some(
        (currentTransaction) => currentTransaction.id === transaction.id,
      );

      if (isEditing) {
        return currentTransactions.map((currentTransaction) =>
          currentTransaction.id === transaction.id
            ? transaction
            : currentTransaction,
        );
      }

      return [transaction, ...currentTransactions];
    });
  };

  const deleteTransaction = (transactionId: number) => {
    setTransactions((currentTransactions) =>
      currentTransactions.filter(
        (transaction) => transaction.id !== transactionId,
      ),
    );
  };

  return {
    transactions,
    currentMonthTransactions,
    totalIncome,
    totalExpense,
    totalInvestment,
    remainingBalance,
    currentMonthIncome,
    currentMonthExpense,
    currentMonthInvestment,
    saveIncomeTransaction,
    saveExpenseTransactions,
    saveInvestmentTransaction,
    deleteTransaction,
  };
};
