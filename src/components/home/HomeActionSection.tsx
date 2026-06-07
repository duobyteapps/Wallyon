import { StyleSheet, View } from "react-native";

import { colors } from "../../constants/theme";
import ActionButton from "./ActionButton";

type HomeActionSectionProps = {
  onAddIncome: () => void;
  onAddExpense: () => void;
  onAddInvestment: () => void;
  onAddNote: () => void;
};

export default function HomeActionSection({
  onAddIncome,
  onAddExpense,
  onAddInvestment,
  onAddNote,
}: HomeActionSectionProps) {
  return (
    <View style={styles.actionRow}>
      <ActionButton
        title="Gelir"
        icon="trending-up"
        color={colors.income}
        iconBackgroundColor={colors.incomeSoft}
        borderColor={colors.incomeBorder}
        onPress={onAddIncome}
      />

      <ActionButton
        title="Gider"
        icon="trending-down"
        color={colors.expense}
        iconBackgroundColor={colors.expenseSoft}
        borderColor={colors.expenseBorder}
        onPress={onAddExpense}
      />

      <ActionButton
        title="Yatırım"
        icon="business"
        color={colors.investment}
        iconBackgroundColor={colors.investmentSoft}
        borderColor={colors.investmentBorder}
        onPress={onAddInvestment}
      />

      <ActionButton
        title="Yeni Not"
        icon="create-outline"
        color={colors.purpleLight}
        iconBackgroundColor={colors.purpleSoft}
        borderColor={colors.purpleBorder}
        onPress={onAddNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
