import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { colors } from "../../../constants/theme";
import { formatCurrency } from "../../../utils/formatCurrency";
import { styles } from "./monthlySummaryStyles";

type MonthlySummaryTotalsProps = {
  totalIncome: number;
  totalExpense: number;
  totalInvestment: number;
};

export default function MonthlySummaryTotals({
  totalIncome,
  totalExpense,
  totalInvestment,
}: MonthlySummaryTotalsProps) {
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryItem}>
        <View style={[styles.iconCircle, styles.incomeIcon]}>
          <Ionicons name="trending-up" size={18} color={colors.income} />
        </View>

        <Text style={styles.summaryValue}>{formatCurrency(totalIncome)}</Text>
        <Text style={styles.summaryLabel}>Gelir</Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryItem}>
        <View style={[styles.iconCircle, styles.expenseIcon]}>
          <Ionicons name="trending-down" size={18} color={colors.expense} />
        </View>

        <Text style={styles.summaryValue}>{formatCurrency(totalExpense)}</Text>
        <Text style={styles.summaryLabel}>Gider</Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryItem}>
        <View style={[styles.iconCircle, styles.investmentIcon]}>
          <Ionicons
            name="business-outline"
            size={18}
            color={colors.investment}
          />
        </View>

        <Text style={styles.summaryValue}>
          {formatCurrency(totalInvestment)}
        </Text>
        <Text style={styles.summaryLabel}>Yatırım</Text>
      </View>
    </View>
  );
}
