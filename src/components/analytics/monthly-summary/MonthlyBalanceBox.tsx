import { Text, View } from "react-native";

import { colors } from "../../../constants/theme";
import { formatCurrency } from "../../../utils/formatCurrency";
import { styles } from "./monthlySummaryStyles";

type MonthlyBalanceBoxProps = {
  balance: number;
};

export default function MonthlyBalanceBox({ balance }: MonthlyBalanceBoxProps) {
  return (
    <View style={styles.balanceBox}>
      <View>
        <Text style={styles.balanceLabel}>Kalan Para</Text>
        <Text style={styles.balanceDescription}>
          Seçili aya göre hesaplandı
        </Text>
      </View>

      <Text
        style={[
          styles.balanceValue,
          {
            color: balance >= 0 ? colors.purpleLight : colors.expense,
          },
        ]}
      >
        {formatCurrency(balance)}
      </Text>
    </View>
  );
}
