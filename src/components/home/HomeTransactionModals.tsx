import ExpenseFieldsModal from "../transaction/ExpenseFieldsModal";
import ExpenseTransactionModal from "../transaction/ExpenseTransactionModal";
import IncomeFieldsModal from "../transaction/IncomeFieldsModal";
import IncomeTransactionModal from "../transaction/IncomeTransactionModal";
import InvestmentFieldsModal from "../transaction/InvestmentFieldsModal";
import InvestmentTransactionModal from "../transaction/InvestmentTransactionModal";

import { Transaction } from "../../types/transaction";

type HomeTransactionModalsProps = {
  editingTransaction: Transaction | null;

  incomeFields: string[];
  expenseFields: string[];
  investmentFields: string[];

  isIncomeModalVisible: boolean;
  isIncomeFieldsModalVisible: boolean;
  isExpenseModalVisible: boolean;
  isExpenseFieldsModalVisible: boolean;
  isInvestmentModalVisible: boolean;
  isInvestmentFieldsModalVisible: boolean;

  onCloseIncomeModal: () => void;
  onCloseExpenseModal: () => void;
  onCloseInvestmentModal: () => void;

  onOpenIncomeFieldsModal: () => void;
  onOpenExpenseFieldsModal: () => void;
  onOpenInvestmentFieldsModal: () => void;

  onCloseIncomeFieldsModal: () => void;
  onCloseExpenseFieldsModal: () => void;
  onCloseInvestmentFieldsModal: () => void;

  onSaveIncome: (transaction: Transaction) => void;
  onSaveExpense: (transactions: Transaction[]) => void;
  onSaveInvestment: (transaction: Transaction) => void;

  onAddIncomeField: (fieldName: string) => void;
  onDeleteIncomeField: (fieldName: string) => void;
  onAddExpenseField: (fieldName: string) => void;
  onDeleteExpenseField: (fieldName: string) => void;
  onAddInvestmentField: (fieldName: string) => void;
  onDeleteInvestmentField: (fieldName: string) => void;
};

export default function HomeTransactionModals({
  editingTransaction,

  incomeFields,
  expenseFields,
  investmentFields,

  isIncomeModalVisible,
  isIncomeFieldsModalVisible,
  isExpenseModalVisible,
  isExpenseFieldsModalVisible,
  isInvestmentModalVisible,
  isInvestmentFieldsModalVisible,

  onCloseIncomeModal,
  onCloseExpenseModal,
  onCloseInvestmentModal,

  onOpenIncomeFieldsModal,
  onOpenExpenseFieldsModal,
  onOpenInvestmentFieldsModal,

  onCloseIncomeFieldsModal,
  onCloseExpenseFieldsModal,
  onCloseInvestmentFieldsModal,

  onSaveIncome,
  onSaveExpense,
  onSaveInvestment,

  onAddIncomeField,
  onDeleteIncomeField,
  onAddExpenseField,
  onDeleteExpenseField,
  onAddInvestmentField,
  onDeleteInvestmentField,
}: HomeTransactionModalsProps) {
  return (
    <>
      <IncomeTransactionModal
        visible={isIncomeModalVisible}
        incomeFields={incomeFields}
        editTransaction={
          editingTransaction?.type === "income" ? editingTransaction : null
        }
        onClose={onCloseIncomeModal}
        onOpenFieldsModal={onOpenIncomeFieldsModal}
        onSave={onSaveIncome}
      />

      <IncomeFieldsModal
        visible={isIncomeFieldsModalVisible}
        fields={incomeFields}
        onClose={onCloseIncomeFieldsModal}
        onAddField={onAddIncomeField}
        onDeleteField={onDeleteIncomeField}
      />

      <ExpenseTransactionModal
        visible={isExpenseModalVisible}
        expenseFields={expenseFields}
        editTransaction={
          editingTransaction?.type === "expense" ? editingTransaction : null
        }
        onClose={onCloseExpenseModal}
        onOpenFieldsModal={onOpenExpenseFieldsModal}
        onSave={onSaveExpense}
      />

      <ExpenseFieldsModal
        visible={isExpenseFieldsModalVisible}
        fields={expenseFields}
        onClose={onCloseExpenseFieldsModal}
        onAddField={onAddExpenseField}
        onDeleteField={onDeleteExpenseField}
      />

      <InvestmentTransactionModal
        visible={isInvestmentModalVisible}
        investmentFields={investmentFields}
        editTransaction={
          editingTransaction?.type === "investment" ? editingTransaction : null
        }
        onClose={onCloseInvestmentModal}
        onOpenFieldsModal={onOpenInvestmentFieldsModal}
        onSave={onSaveInvestment}
      />

      <InvestmentFieldsModal
        visible={isInvestmentFieldsModalVisible}
        fields={investmentFields}
        onClose={onCloseInvestmentFieldsModal}
        onAddField={onAddInvestmentField}
        onDeleteField={onDeleteInvestmentField}
      />
    </>
  );
}
