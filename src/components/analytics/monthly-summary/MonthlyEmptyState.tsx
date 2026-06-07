import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { colors } from "../../../constants/theme";
import { styles } from "./monthlySummaryStyles";

export default function MonthlyEmptyState() {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="bar-chart-outline" size={26} color={colors.purpleLight} />

      <Text style={styles.emptyStateTitle}>İşlem bulunamadı</Text>

      <Text style={styles.emptyStateText}>
        Gelir, gider veya yatırım eklediğinde aylık özet burada görünür.
      </Text>
    </View>
  );
}
