import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../constants/theme";
import { MonthlySummary } from "../../utils/analyticsHelpers";
import { formatCurrency } from "../../utils/formatCurrency";

type MonthlySummaryCardProps = {
  monthlyData: MonthlySummary[];
  selectedMonthKey: string | null;
  onSelectMonth: (monthKey: string) => void;
};

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

function getMonthNumber(monthLabel: string) {
  const monthName = monthLabel.split(" ")[0];
  const monthIndex = monthNames.findIndex((item) => item === monthName);

  return monthIndex === -1 ? 0 : monthIndex + 1;
}

function getYear(monthLabel: string) {
  const parts = monthLabel.split(" ");
  const year = Number(parts[1]);

  return Number.isNaN(year) ? new Date().getFullYear() : year;
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 5;
  }

  return Math.min(100, Math.max(5, value));
}

export default function MonthlySummaryCard({
  monthlyData,
  selectedMonthKey,
  onSelectMonth,
}: MonthlySummaryCardProps) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const selectedMonthData =
    monthlyData.find((item) => item.monthKey === selectedMonthKey) || null;

  const balance = selectedMonthData?.balance || 0;
  const isNegativeBalance = balance < 0;

  const progressPercent = useMemo(() => {
    if (!selectedMonthData) {
      return 5;
    }

    const totalIncome = Math.abs(selectedMonthData.totalIncome || 0);
    const totalExpense = Math.abs(selectedMonthData.totalExpense || 0);
    const totalInvestment = Math.abs(selectedMonthData.totalInvestment || 0);
    const totalOut = totalExpense + totalInvestment;
    const currentBalance = selectedMonthData.balance || 0;

    if (currentBalance < 0) {
      if (totalOut === 0) {
        return 5;
      }

      return clampPercent((Math.abs(currentBalance) / totalOut) * 100);
    }

    if (totalIncome === 0) {
      return 5;
    }

    return clampPercent((currentBalance / totalIncome) * 100);
  }, [selectedMonthData]);

  const years = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(monthlyData.map((item) => getYear(item.monthLabel))),
    );

    return uniqueYears.sort((a, b) => b - a);
  }, [monthlyData]);

  const [selectedFilterYear, setSelectedFilterYear] = useState(
    years[0] || null,
  );

  const activeFilterYear =
    selectedFilterYear ||
    getYear(selectedMonthData?.monthLabel || "") ||
    years[0];

  const filteredMonths = useMemo(() => {
    return monthlyData
      .filter((item) => getYear(item.monthLabel) === activeFilterYear)
      .sort(
        (a, b) => getMonthNumber(b.monthLabel) - getMonthNumber(a.monthLabel),
      );
  }, [monthlyData, activeFilterYear]);

  const handleOpenFilter = () => {
    if (selectedMonthData) {
      setSelectedFilterYear(getYear(selectedMonthData.monthLabel));
    } else if (years.length > 0) {
      setSelectedFilterYear(years[0]);
    }

    setIsFilterVisible(true);
  };

  const handleSelectMonth = (monthKey: string) => {
    onSelectMonth(monthKey);
    setIsFilterVisible(false);
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardTitle}>
              {selectedMonthData
                ? selectedMonthData.monthLabel
                : "Ay seçilmedi"}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleOpenFilter}
            style={styles.filterButton}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={colors.purpleLight}
            />

            <Text style={styles.filterButtonText}>Filtrele</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.transactionBadgeRow}>
          <View style={styles.transactionBadge}>
            <Ionicons
              name="receipt-outline"
              size={13}
              color={colors.purpleLight}
            />

            <Text style={styles.transactionBadgeText}>
              {selectedMonthData ? selectedMonthData.transactionCount : 0} işlem
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: isNegativeBalance
                  ? colors.expense
                  : colors.purple,
              },
            ]}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <View style={[styles.iconCircle, styles.incomeIcon]}>
              <Ionicons name="trending-up" size={18} color={colors.income} />
            </View>

            <Text style={styles.summaryValue}>
              {formatCurrency(selectedMonthData?.totalIncome || 0)}
            </Text>

            <Text style={styles.summaryLabel}>Gelir</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <View style={[styles.iconCircle, styles.expenseIcon]}>
              <Ionicons name="trending-down" size={18} color={colors.expense} />
            </View>

            <Text style={styles.summaryValue}>
              {formatCurrency(selectedMonthData?.totalExpense || 0)}
            </Text>

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
              {formatCurrency(selectedMonthData?.totalInvestment || 0)}
            </Text>

            <Text style={styles.summaryLabel}>Yatırım</Text>
          </View>
        </View>

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
                color: isNegativeBalance ? colors.expense : colors.purpleLight,
              },
            ]}
          >
            {formatCurrency(balance)}
          </Text>
        </View>

        {monthlyData.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="analytics-outline"
              size={34}
              color={colors.purpleLight}
            />

            <Text style={styles.emptyStateTitle}>İşlem bulunamadı</Text>

            <Text style={styles.emptyStateText}>
              Gelir, gider veya yatırım eklediğinde aylık özet burada görünür.
            </Text>
          </View>
        )}
      </View>

      <Modal
        visible={isFilterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsFilterVisible(false)}
        >
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
                onPress={() => setIsFilterVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={22} color={colors.white} />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionTitle}>Yıl</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.yearList}
            >
              {years.map((year) => {
                const isSelected = activeFilterYear === year;

                return (
                  <TouchableOpacity
                    key={year}
                    activeOpacity={0.85}
                    onPress={() => setSelectedFilterYear(year)}
                    style={[
                      styles.yearChip,
                      isSelected && styles.selectedYearChip,
                    ]}
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
            </ScrollView>

            <Text style={styles.filterSectionTitle}>Ay</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.monthScrollArea}
              contentContainerStyle={styles.monthGrid}
            >
              {filteredMonths.map((item) => {
                const isSelected = selectedMonthKey === item.monthKey;

                return (
                  <TouchableOpacity
                    key={item.monthKey}
                    activeOpacity={0.85}
                    onPress={() => handleSelectMonth(item.monthKey)}
                    style={[
                      styles.monthOption,
                      isSelected && styles.selectedMonthOption,
                    ]}
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
                        size={24}
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
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 22,
    padding: 18,
    borderRadius: 30,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
  },

  cardHeaderLeft: {
    flex: 1,
  },

  cardLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },

  cardTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  filterButton: {
    minHeight: 36,
    paddingHorizontal: 13,
    borderRadius: 16,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  filterButtonText: {
    color: colors.purpleLight,
    fontSize: 12,
    fontWeight: "900",
  },

  transactionBadgeRow: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  transactionBadge: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.18)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  transactionBadgeText: {
    color: colors.purpleLight,
    fontSize: 11,
    fontWeight: "900",
  },

  progressBar: {
    marginTop: 24,
    height: 11,
    borderRadius: 999,
    backgroundColor: colors.background,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
  },

  divider: {
    height: 1,
    backgroundColor: colors.panelBorder,
    marginTop: 24,
    marginBottom: 22,
  },

  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginBottom: 8,
  },

  incomeIcon: {
    backgroundColor: colors.incomeSoft,
    borderColor: colors.incomeBorder,
  },

  expenseIcon: {
    backgroundColor: colors.expenseSoft,
    borderColor: colors.expenseBorder,
  },

  investmentIcon: {
    backgroundColor: colors.investmentSoft,
    borderColor: colors.investmentBorder,
  },

  summaryValue: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
    textAlign: "center",
  },

  summaryLabel: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },

  summaryDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.panelBorder,
  },

  balanceBox: {
    marginTop: 22,
    padding: 15,
    borderRadius: 22,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  balanceLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },

  balanceDescription: {
    marginTop: 4,
    color: colors.label,
    fontSize: 11,
    fontWeight: "700",
  },

  balanceValue: {
    fontSize: 18,
    fontWeight: "900",
    flexShrink: 1,
    textAlign: "right",
  },

  emptyState: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 20,
  },

  emptyStateTitle: {
    marginTop: 10,
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyStateText: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 19,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.62)",
    justifyContent: "flex-end",
  },

  filterModal: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  modalHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.panelBorder,
    marginBottom: 18,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },

  modalTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  modalDescription: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  filterSectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  yearList: {
    gap: 10,
  },

  yearChip: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  selectedYearChip: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },

  yearChipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "900",
  },

  selectedYearChipText: {
    color: colors.white,
  },

  monthScrollArea: {
    maxHeight: 432,
  },

  monthGrid: {
    gap: 10,
    paddingBottom: 4,
  },

  monthOption: {
    minHeight: 62,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedMonthOption: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },

  monthOptionTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  selectedMonthOptionTitle: {
    color: colors.white,
  },

  monthOptionText: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },

  selectedMonthOptionText: {
    color: colors.white,
  },
});
