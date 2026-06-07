import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/theme";

type EmptyCardProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

export default function EmptyCard({
  icon = "receipt-outline",
  title,
  description,
}: EmptyCardProps) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={24} color={colors.mutedLight} />
      </View>

      <Text style={styles.emptyTitle}>{title}</Text>

      <Text style={styles.emptyText}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    minHeight: 160,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 26,
    backgroundColor: "rgba(15, 23, 42, 0.42)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.10)",
  },

  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    backgroundColor: "rgba(148, 163, 184, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    textAlign: "center",
  },
});
