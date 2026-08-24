import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../constants/theme";
import { Transaction, TransactionType } from "../../types/transaction";
import { formatCurrency } from "../../utils/formatCurrency";

type TransactionDetailModalProps = {
  visible: boolean;
  transaction: Transaction | null;
  onClose: () => void;
};

const getTransactionColor = (type: TransactionType) => {
  if (type === "income") return colors.income;
  if (type === "expense") return colors.expense;

  return colors.investment;
};

const getTransactionSoftColor = (type: TransactionType) => {
  if (type === "income") return colors.incomeSoft;
  if (type === "expense") return colors.expenseSoft;

  return colors.investmentSoft;
};

const getTransactionBorderColor = (type: TransactionType) => {
  if (type === "income") return colors.incomeBorder;
  if (type === "expense") return colors.expenseBorder;

  return colors.investmentBorder;
};

const getTransactionIcon = (
  type: TransactionType,
): keyof typeof Ionicons.glyphMap => {
  if (type === "income") return "trending-up";
  if (type === "expense") return "trending-down";

  return "business";
};

const getTransactionTypeLabel = (type: TransactionType) => {
  if (type === "income") return "Gelir";
  if (type === "expense") return "Gider";

  return "Yatırım";
};

const getAmountPrefix = (type: TransactionType) => {
  return type === "income" ? "+" : "-";
};

export default function TransactionDetailModal({
  visible,
  transaction,
  onClose,
}: TransactionDetailModalProps) {
  if (!transaction) {
    return null;
  }

  const transactionColor = getTransactionColor(transaction.type);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.receiptCard,
            {
              borderColor: getTransactionBorderColor(transaction.type),
            },
          ]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.header}>
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: getTransactionSoftColor(transaction.type),
                },
              ]}
            >
              <Ionicons
                name={getTransactionIcon(transaction.type)}
                size={25}
                color={transactionColor}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={22} color={colors.mutedLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.receiptLabel}>İŞLEM DETAYI</Text>

            <Text style={styles.title}>{transaction.title}</Text>

            <View
              style={[
                styles.typeBadge,
                {
                  backgroundColor: getTransactionSoftColor(transaction.type),
                },
              ]}
            >
              <Text
                style={[
                  styles.typeBadgeText,
                  {
                    color: transactionColor,
                  },
                ]}
              >
                {getTransactionTypeLabel(transaction.type)}
              </Text>
            </View>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <View style={styles.detailLabelWrapper}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color={colors.muted}
                />

                <Text style={styles.detailLabel}>İşlem Adı</Text>
              </View>

              <Text style={styles.detailValue}>{transaction.title}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelWrapper}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.muted}
                />

                <Text style={styles.detailLabel}>Tarih</Text>
              </View>

              <Text style={styles.detailValue}>{transaction.date}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLabelWrapper}>
                <Ionicons
                  name="wallet-outline"
                  size={18}
                  color={colors.muted}
                />

                <Text style={styles.detailLabel}>Tutar</Text>
              </View>

              <Text
                style={[
                  styles.amountValue,
                  {
                    color: transactionColor,
                  },
                ]}
              >
                {getAmountPrefix(transaction.type)}{" "}
                {formatCurrency(transaction.amount)}
              </Text>
            </View>
          </View>

          <View style={styles.dashedDivider} />

          <View style={styles.noteSection}>
            <Text style={styles.noteLabel}>Açıklama</Text>

            <Text
              style={[
                styles.noteText,
                !transaction.note && styles.emptyNoteText,
              ]}
            >
              {transaction.note || "Açıklama eklenmemiş."}
            </Text>
          </View>

          <View style={styles.receiptFooter}>
            <View style={styles.footerLine} />

            <View style={styles.footerContent}>
              <Ionicons name="receipt-outline" size={16} color={colors.label} />

              <Text style={styles.footerText}>Wallyon İşlem Kaydı</Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.76)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  receiptCard: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#030817",
    borderRadius: 26,
    borderWidth: 1,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(148, 163, 184, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },

  titleSection: {
    marginTop: 20,
  },

  receiptLabel: {
    color: colors.label,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
    marginTop: 6,
  },

  typeBadge: {
    alignSelf: "flex-start",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
  },

  typeBadgeText: {
    fontSize: 11,
    fontWeight: "900",
  },

  dashedDivider: {
    marginVertical: 20,
    height: 1,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(148, 163, 184, 0.20)",
  },

  details: {
    gap: 18,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },

  detailLabelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },

  detailValue: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
    flexShrink: 1,
    textAlign: "right",
  },

  amountValue: {
    fontSize: 16,
    fontWeight: "900",
    flexShrink: 1,
    textAlign: "right",
  },

  noteSection: {
    backgroundColor: "rgba(148, 163, 184, 0.05)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.08)",
  },

  noteLabel: {
    color: colors.label,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 7,
  },

  noteText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },

  emptyNoteText: {
    color: colors.muted,
  },

  receiptFooter: {
    marginTop: 22,
  },

  footerLine: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.08)",
  },

  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 14,
  },

  footerText: {
    color: colors.label,
    fontSize: 10,
    fontWeight: "700",
  },
});
