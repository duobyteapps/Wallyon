import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { colors } from "../../../constants/theme";
import { styles } from "./monthlySummaryStyles";

type MonthlySummaryBadgesProps = {
  selectedTransactionCount: number;
  totalMonthCount: number;
};

export default function MonthlySummaryBadges({
  selectedTransactionCount,
}: MonthlySummaryBadgesProps) {
  return (
    <View style={styles.transactionBadgeRow}>
      <View style={styles.transactionBadge}>
        <Ionicons name="receipt-outline" size={14} color={colors.purpleLight} />
        <Text style={styles.transactionBadgeText}>
          {selectedTransactionCount} işlem
        </Text>
      </View>
    </View>
  );
}
