import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";
import { Transaction, TransactionType } from "../../types/transaction";
import { formatCurrency } from "../../utils/formatCurrency";

type TransactionItemProps = {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: number) => void;
  showActions?: boolean;
};

const getTransactionIcon = (
  type: TransactionType,
): keyof typeof Ionicons.glyphMap => {
  if (type === "income") return "trending-up";
  if (type === "expense") return "trending-down";

  return "business";
};

const getTransactionColor = (type: TransactionType) => {
  if (type === "income") return colors.income;
  if (type === "expense") return colors.expense;

  return colors.investment;
};

const getTransactionBgColor = (type: TransactionType) => {
  if (type === "income") return colors.incomeSoft;
  if (type === "expense") return colors.expenseSoft;

  return colors.investmentSoft;
};

const getAmountPrefix = (type: TransactionType) => {
  if (type === "income") return "+";

  return "-";
};

export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
  showActions = true,
}: TransactionItemProps) {
  const transactionColor = getTransactionColor(transaction.type);

  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.transactionIcon,
            { backgroundColor: getTransactionBgColor(transaction.type) },
          ]}
        >
          <Ionicons
            name={getTransactionIcon(transaction.type)}
            size={22}
            color={transactionColor}
          />
        </View>

        <View style={styles.transactionInfo}>
          <Text numberOfLines={1} style={styles.transactionTitle}>
            {transaction.title}
          </Text>

          <Text numberOfLines={1} style={styles.transactionDate}>
            {transaction.date}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.amountWrapper,
          !showActions && styles.amountWrapperWithoutActions,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.transactionAmount,
            !showActions && styles.transactionAmountWithoutActions,
            { color: transactionColor },
          ]}
        >
          {getAmountPrefix(transaction.type)}{" "}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>

      {showActions && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit?.(transaction)}
          >
            <Ionicons
              name="create-outline"
              size={17}
              color={colors.mutedLight}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete?.(transaction.id)}
          >
            <Ionicons name="trash-outline" size={17} color={colors.expense} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  transactionItem: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.08)",
  },

  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  },

  transactionIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  transactionInfo: {
    flex: 1,
    minWidth: 0,
  },

  transactionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  transactionDate: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },

  amountWrapper: {
    width: 110,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  amountWrapperWithoutActions: {
    marginLeft: 10,
    marginRight: 0,
    alignItems: "flex-end",
  },

  transactionAmount: {
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },

  transactionAmountWithoutActions: {
    textAlign: "right",
  },

  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },

  editButton: {
    backgroundColor: "rgba(67, 76, 160, 0.45)",
    borderColor: "rgba(129, 140, 248, 0.22)",
  },

  deleteButton: {
    backgroundColor: "rgba(118, 32, 65, 0.45)",
    borderColor: "rgba(251, 113, 133, 0.22)",
  },
});
