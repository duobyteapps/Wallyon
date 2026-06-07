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
import {
    ArchiveMonthlySummary,
    getArchiveMonthLabel,
    getArchiveYears,
    getFilteredArchiveMonthsByYear,
} from "../../utils/archiveNoteHelpers";

type ArchiveSummaryCardProps = {
  monthlyData: ArchiveMonthlySummary[];
  selectedMonthKey: string | null;
  filteredNoteCount: number;
  onSelectMonth: (monthKey: string) => void;
  onClearFilter: () => void;
};

export default function ArchiveSummaryCard({
  monthlyData,
  selectedMonthKey,
  filteredNoteCount,
  onSelectMonth,
  onClearFilter,
}: ArchiveSummaryCardProps) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedFilterYear, setSelectedFilterYear] = useState<number | null>(
    null,
  );

  const years = useMemo(() => {
    return getArchiveYears(monthlyData);
  }, [monthlyData]);

  const selectedMonthData =
    monthlyData.find((item) => item.monthKey === selectedMonthKey) || null;

  const activeFilterYear =
    selectedFilterYear || selectedMonthData?.year || years[0] || null;

  const filteredMonths = useMemo(() => {
    return getFilteredArchiveMonthsByYear(monthlyData, activeFilterYear);
  }, [monthlyData, activeFilterYear]);

  const selectedFilterLabel = selectedMonthKey
    ? getArchiveMonthLabel(selectedMonthKey)
    : "Tüm arşiv";

  const handleOpenFilter = () => {
    if (selectedMonthData) {
      setSelectedFilterYear(selectedMonthData.year);
    } else if (years.length > 0) {
      setSelectedFilterYear(years[0]);
    }

    setIsFilterVisible(true);
  };

  const handleSelectMonth = (monthKey: string) => {
    onSelectMonth(monthKey);
    setIsFilterVisible(false);
  };

  const handleClearFilter = () => {
    onClearFilter();
    setIsFilterVisible(false);
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.cardLabel}>Arşivlenen Not</Text>

            <Text style={styles.cardTitle}>{selectedFilterLabel}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleOpenFilter}
            style={styles.filterButton}
          >
            <Ionicons
              name="options-outline"
              size={16}
              color={colors.purpleLight}
            />

            <Text style={styles.filterButtonText}>Filtrele</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.countBox}>
          <View>
            <Text style={styles.countLabel}>Gösterilen Not</Text>

            <Text style={styles.countDescription}>
              Seçili filtreye göre listeleniyor
            </Text>
          </View>

          <Text style={styles.countValue}>{filteredNoteCount}</Text>
        </View>

        {selectedMonthKey && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleClearFilter}
            style={styles.clearFilterButton}
          >
            <Ionicons
              name="close-circle-outline"
              size={16}
              color={colors.mutedLight}
            />

            <Text style={styles.clearFilterText}>Filtreyi temizle</Text>
          </TouchableOpacity>
        )}

        {monthlyData.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="archive-outline"
              size={24}
              color={colors.purpleLight}
            />

            <Text style={styles.emptyStateTitle}>Arşiv kaydı yok</Text>

            <Text style={styles.emptyStateText}>
              Tarihi geçen notlar otomatik olarak burada arşivlenir.
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
              <View style={styles.modalHeaderTextWrapper}>
                <Text style={styles.modalTitle}>Ay ve Yıl Seç</Text>

                <Text style={styles.modalDescription}>
                  Görmek istediğin arşiv notlarını filtrele.
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

            {years.length > 0 ? (
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
            ) : (
              <Text style={styles.emptyFilterText}>Arşiv kaydı yok.</Text>
            )}

            <Text style={styles.filterSectionTitle}>Ay</Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.monthScrollArea}
              contentContainerStyle={styles.monthGrid}
            >
              {filteredMonths.length > 0 ? (
                filteredMonths.map((item) => {
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
                          {item.noteCount} not
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
                })
              ) : (
                <Text style={styles.emptyFilterText}>
                  Bu yıl için arşivlenmiş not yok.
                </Text>
              )}
            </ScrollView>

            {selectedMonthKey && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleClearFilter}
                style={styles.modalClearButton}
              >
                <Text style={styles.modalClearButtonText}>
                  Tüm arşivi göster
                </Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    borderRadius: 26,
    padding: 18,
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
    marginTop: 4,
    color: colors.white,
    fontSize: 24,
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

  countBox: {
    marginTop: 18,
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

  countLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
  },

  countDescription: {
    marginTop: 4,
    color: colors.label,
    fontSize: 11,
    fontWeight: "700",
  },

  countValue: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "900",
  },

  clearFilterButton: {
    marginTop: 13,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  clearFilterText: {
    color: colors.mutedLight,
    fontSize: 12,
    fontWeight: "900",
  },

  emptyState: {
    minHeight: 112,
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

  modalHeaderTextWrapper: {
    flex: 1,
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

  emptyFilterText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  modalClearButton: {
    marginTop: 18,
    minHeight: 48,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: "center",
    justifyContent: "center",
  },

  modalClearButtonText: {
    color: colors.mutedLight,
    fontSize: 13,
    fontWeight: "900",
  },
});
