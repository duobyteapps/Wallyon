import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { colors } from "../../../constants/theme";
import { styles } from "./monthlySummaryStyles";

type MonthlySummaryHeaderProps = {
  selectedMonthLabel: string;
  onOpenFilter: () => void;
};

export default function MonthlySummaryHeader({
  selectedMonthLabel,
  onOpenFilter,
}: MonthlySummaryHeaderProps) {
  return (
    <View style={styles.cardHeader}>
      <View style={styles.cardHeaderLeft}>
        <Text style={styles.cardLabel}>Aylık Özet</Text>
        <Text style={styles.cardTitle}>{selectedMonthLabel}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.filterButton}
        onPress={onOpenFilter}
      >
        <Ionicons name="options-outline" size={16} color={colors.purpleLight} />
        <Text style={styles.filterButtonText}>Filtrele</Text>
      </TouchableOpacity>
    </View>
  );
}
