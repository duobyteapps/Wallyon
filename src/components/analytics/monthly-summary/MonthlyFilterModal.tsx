import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { colors } from "../../../constants/theme";
import { MonthlySummary } from "../../../utils/analyticsHelpers";
import { styles } from "./monthlySummaryStyles";

type MonthlyFilterModalProps = {
  visible: boolean;
  years: number[];
  activeFilterYear: number;
  filteredMonths: MonthlySummary[];
  selectedMonthKey: string | null;
  onClose: () => void;
  onSelectYear: (year: number) => void;
  onSelectMonth: (monthKey: string) => void;
};

export default function MonthlyFilterModal({
  visible,
  years,
  activeFilterYear,
  filteredMonths,
  selectedMonthKey,
  onClose,
  onSelectYear,
  onSelectMonth,
}: MonthlyFilterModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.filterModal}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Ay ve Yıl Seç</Text>
              <Text style={styles.modalDescription}>
                Görmek istediğin aylık özeti filtrele.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionTitle}>Yıl</Text>

          <View style={styles.yearList}>
            {years.map((year) => {
              const isSelected = activeFilterYear === year;

              return (
                <TouchableOpacity
                  key={year}
                  activeOpacity={0.85}
                  style={[
                    styles.yearChip,
                    isSelected && styles.selectedYearChip,
                  ]}
                  onPress={() => onSelectYear(year)}
                >
                  <Text
                    style={[
                      styles.yearChipText,
                      isSelected && styles.selectedYearChipText,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.filterSectionTitle}>Ay</Text>

          <ScrollView
            style={styles.monthScrollArea}
            contentContainerStyle={styles.monthGrid}
            showsVerticalScrollIndicator={false}
          >
            {filteredMonths.map((item) => {
              const isSelected = selectedMonthKey === item.monthKey;

              return (
                <TouchableOpacity
                  key={item.monthKey}
                  activeOpacity={0.85}
                  style={[
                    styles.monthOption,
                    isSelected && styles.selectedMonthOption,
                  ]}
                  onPress={() => onSelectMonth(item.monthKey)}
                >
                  <View>
                    <Text
                      style={[
                        styles.monthOptionTitle,
                        isSelected && styles.selectedMonthOptionTitle,
                      ]}
                    >
                      {item.monthLabel}
                    </Text>

                    <Text
                      style={[
                        styles.monthOptionText,
                        isSelected && styles.selectedMonthOptionText,
                      ]}
                    >
                      {item.transactionCount} işlem
                    </Text>
                  </View>

                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={22}
                      color={colors.white}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
