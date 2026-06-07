import { useState } from "react";

import { Transaction } from "../types/transaction";

export const useHomeModals = () => {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isIncomeFieldsModalVisible, setIsIncomeFieldsModalVisible] =
    useState(false);

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isExpenseFieldsModalVisible, setIsExpenseFieldsModalVisible] =
    useState(false);

  const [isInvestmentModalVisible, setIsInvestmentModalVisible] =
    useState(false);
  const [isInvestmentFieldsModalVisible, setIsInvestmentFieldsModalVisible] =
    useState(false);

  const resetEditingTransaction = () => {
    setEditingTransaction(null);
  };

  const openIncomeModal = () => {
    setEditingTransaction(null);
    setIsIncomeModalVisible(true);
  };

  const openExpenseModal = () => {
    setEditingTransaction(null);
    setIsExpenseModalVisible(true);
  };

  const openInvestmentModal = () => {
    setEditingTransaction(null);
    setIsInvestmentModalVisible(true);
  };

  const closeIncomeModal = () => {
    setIsIncomeModalVisible(false);
    setEditingTransaction(null);
  };

  const closeExpenseModal = () => {
    setIsExpenseModalVisible(false);
    setEditingTransaction(null);
  };

  const closeInvestmentModal = () => {
    setIsInvestmentModalVisible(false);
    setEditingTransaction(null);
  };

  const closeTransactionModalsForFields = () => {
    setIsIncomeModalVisible(false);
    setIsExpenseModalVisible(false);
    setIsInvestmentModalVisible(false);
  };

  const openIncomeFieldsModal = () => {
    closeTransactionModalsForFields();

    setTimeout(() => {
      setIsIncomeFieldsModalVisible(true);
    }, 0);
  };

  const openExpenseFieldsModal = () => {
    closeTransactionModalsForFields();

    setTimeout(() => {
      setIsExpenseFieldsModalVisible(true);
    }, 0);
  };

  const openInvestmentFieldsModal = () => {
    closeTransactionModalsForFields();

    setTimeout(() => {
      setIsInvestmentFieldsModalVisible(true);
    }, 0);
  };

  const closeIncomeFieldsModal = () => {
    setIsIncomeFieldsModalVisible(false);

    setTimeout(() => {
      setIsIncomeModalVisible(true);
    }, 0);
  };

  const closeExpenseFieldsModal = () => {
    setIsExpenseFieldsModalVisible(false);

    setTimeout(() => {
      setIsExpenseModalVisible(true);
    }, 0);
  };

  const closeInvestmentFieldsModal = () => {
    setIsInvestmentFieldsModalVisible(false);

    setTimeout(() => {
      setIsInvestmentModalVisible(true);
    }, 0);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);

    if (transaction.type === "income") {
      setIsIncomeModalVisible(true);
      return;
    }

    if (transaction.type === "expense") {
      setIsExpenseModalVisible(true);
      return;
    }

    setIsInvestmentModalVisible(true);
  };

  return {
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
  };
};
