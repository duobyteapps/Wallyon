import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

export default function ProfileHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={42} color={colors.white} />
      </View>

      <Text style={styles.title}>Profil</Text>
      <Text style={styles.subtitle}>Hesap bilgilerini buradan yönet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    marginBottom: 16,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
