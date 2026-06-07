import { StyleSheet } from "react-native";

import { colors } from "../../../constants/theme";

export const styles = StyleSheet.create({
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
    marginTop: 8,
    color: colors.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  filterButton: {
    minHeight: 42,
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
    width: "64%",
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.purple,
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
    fontSize: 16,
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
    flexDirection: "row",
    flexWrap: "wrap",
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
