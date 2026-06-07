import { StyleSheet, View } from "react-native";

import { colors } from "../../constants/theme";
import SummaryCard from "./SummaryCard";

type HomeSummarySectionProps = {
  currentMonthIncome: number;
  currentMonthExpense: number;
  currentMonthInvestment: number;
};

export default function HomeSummarySection({
  currentMonthIncome,
  currentMonthExpense,
  currentMonthInvestment,
}: HomeSummarySectionProps) {
  const maxSummaryAmount = Math.max(
    currentMonthIncome,
    currentMonthExpense,
    currentMonthInvestment,
  );

  const getSummaryProgressWidth = (amount: number): `${number}%` => {
    if (maxSummaryAmount <= 0) {
      return "5%";
    }

    if (amount <= 0) {
      return "5%";
    }

    const percent = Math.round((amount / maxSummaryAmount) * 100);
    const safePercent = Math.min(Math.max(percent, 5), 100);

    return `${safePercent}%`;
  };

  return (
    <View style={styles.summaryGrid}>
      <SummaryCard
        title="Toplam Gelir"
        amount={currentMonthIncome}
        dotColor={colors.income}
        progressColor={colors.income}
        progressWidth={getSummaryProgressWidth(currentMonthIncome)}
      />

      <SummaryCard
        title="Toplam Gider"
        amount={currentMonthExpense}
        dotColor={colors.expense}
        progressColor={colors.expense}
        progressWidth={getSummaryProgressWidth(currentMonthExpense)}
      />

      <SummaryCard
        title="Toplam Yatırım"
        amount={currentMonthInvestment}
        dotColor={colors.investment}
        progressColor={colors.investment}
        progressWidth={getSummaryProgressWidth(currentMonthInvestment)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summaryGrid: {
    marginTop: 18,
    flexDirection: "row",
    gap: 10,
  },
});
