import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

type NoteProgressCardProps = {
  todayCount: number;
  futureCount: number;
  completedTodayCount: number;
  progressPercent: number;
};

export default function NoteProgressCard({
  todayCount,
  futureCount,
  completedTodayCount,
  progressPercent,
}: NoteProgressCardProps) {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroTop}>
        <View>
          <Text style={styles.heroLabel}>Bugünkü ilerleme</Text>
          <Text style={styles.heroTitle}>
            {completedTodayCount}/{todayCount} tamamlandı
          </Text>
        </View>

        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>%{progressPercent}</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, styles.todayStatIcon]}>
            <Ionicons name="today-outline" size={18} color={colors.income} />
          </View>
          <Text style={styles.statValue}>{todayCount}</Text>
          <Text style={styles.statLabel}>Günün Notu</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIcon, styles.futureStatIcon]}>
            <Ionicons name="calendar-outline" size={18} color={colors.purple} />
          </View>
          <Text style={styles.statValue}>{futureCount}</Text>
          <Text style={styles.statLabel}>Planlı Not</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIcon, styles.doneStatIcon]}>
            <Ionicons
              name="checkmark-done-outline"
              size={18}
              color={colors.income}
            />
          </View>
          <Text style={styles.statValue}>{completedTodayCount}</Text>
          <Text style={styles.statLabel}>Tamamlandı</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    marginTop: 24,
    padding: 20,
    borderRadius: 34,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
  },
  heroTitle: {
    marginTop: 5,
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  progressCircle: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    color: colors.purpleLight,
    fontSize: 15,
    fontWeight: "900",
  },
  progressBar: {
    marginTop: 18,
    height: 9,
    borderRadius: 999,
    backgroundColor: colors.background,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.purple,
  },
  statsRow: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  todayStatIcon: {
    backgroundColor: colors.incomeSoft,
    borderWidth: 1,
    borderColor: colors.incomeBorder,
  },
  futureStatIcon: {
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  doneStatIcon: {
    backgroundColor: colors.incomeSoft,
    borderWidth: 1,
    borderColor: colors.incomeBorder,
  },
  statValue: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "900",
  },
  statLabel: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
  },
  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.panelBorder,
  },
});
