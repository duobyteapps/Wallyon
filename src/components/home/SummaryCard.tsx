import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/theme";
import { formatCurrency } from "../../utils/formatCurrency";

type SummaryCardProps = {
  title: string;
  amount: number;
  dotColor: string;
  progressColor: string;
  progressWidth: `${number}%`;
};

export default function SummaryCard({
  title,
  amount,
  dotColor,
  progressColor,
  progressWidth,
}: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTopRow}>
        <Text style={styles.summaryLabel} numberOfLines={1}>
          {title}
        </Text>

        <View style={[styles.summaryDot, { backgroundColor: dotColor }]} />
      </View>

      <Text style={styles.summaryAmount} numberOfLines={1}>
        {formatCurrency(amount)}
      </Text>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: progressWidth,
              backgroundColor: progressColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    flex: 1,
    minWidth: 0,
    minHeight: 118,
    borderRadius: 20,
    backgroundColor: colors.panel,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },

  summaryLabel: {
    flex: 1,
    minWidth: 0,
    color: colors.label,
    fontSize: 10.5,
    fontWeight: "700",
  },

  summaryDot: {
    width: 9,
    height: 9,
    borderRadius: 999,
  },

  summaryAmount: {
    marginTop: 16,
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  progressTrack: {
    height: 5,
    marginTop: 19,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "rgba(30, 41, 59, 0.9)",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
});
