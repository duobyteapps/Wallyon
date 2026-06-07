import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../constants/theme";

type AppDateFieldProps = {
  value: string;
  onPress: () => void;
  marginBottom?: number;
};

export default function AppDateField({
  value,
  onPress,
  marginBottom = 12,
}: AppDateFieldProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.dateBox,
        {
          marginBottom,
        },
      ]}
    >
      <Text style={styles.dateText}>{value}</Text>

      <Ionicons name="calendar-outline" size={18} color={colors.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dateBox: {
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
