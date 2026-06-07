import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import { formatCurrency } from "../../utils/formatCurrency";

type BalanceCardProps = {
  remainingBalance: number;
};

export default function BalanceCard({ remainingBalance }: BalanceCardProps) {
  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceTopRow}>
        <Text style={styles.balanceLabel}>Kalan Para</Text>
        <Text style={styles.cardBrand}>WALLYON</Text>
      </View>

      <Text style={styles.balanceAmount}>
        {formatCurrency(remainingBalance)}
      </Text>

      <View style={styles.balanceBottomRow}>
        <Text style={styles.cardNumber}>**** **** **** 4568</Text>

        <View style={styles.cardCircleGroup}>
          <View style={styles.cardCircle} />
          <View style={[styles.cardCircle, styles.cardCircleSecond]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: {
    borderRadius: 30,
    backgroundColor: colors.panel,
    padding: 24,
    minHeight: 190,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  balanceTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceLabel: {
    color: colors.label,
    fontSize: 15,
    fontWeight: "600",
  },
  cardBrand: {
    color: colors.purpleLight,
    fontSize: 18,
    fontWeight: "900",
  },
  balanceAmount: {
    marginTop: 26,
    color: colors.white,
    fontSize: 36,
    fontWeight: "900",
  },
  balanceBottomRow: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardNumber: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: "700",
  },
  cardCircleGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.purple,
  },
  cardCircleSecond: {
    marginLeft: -8,
    backgroundColor: "rgba(139, 92, 246, 0.45)",
  },
});
