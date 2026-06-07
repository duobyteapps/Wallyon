import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

type ProfileNameCardProps = {
  name: string;
};

export default function ProfileNameCard({ name }: ProfileNameCardProps) {
  return (
    <View style={styles.profileCard}>
      <View style={styles.nameRow}>
        <View>
          <Text style={styles.label}>Adın</Text>
          <Text style={styles.nameText}>{name ? name : "İsim bulunamadı"}</Text>
        </View>

        <Ionicons name="sparkles" size={22} color={colors.white} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    borderRadius: 28,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
  },
  nameText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "900",
  },
});
