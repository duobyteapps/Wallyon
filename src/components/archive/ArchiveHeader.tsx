import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import AppIconButton from "../ui/AppIconButton";

export default function ArchiveHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <AppIconButton
          icon="chevron-back"
          onPress={() => router.back()}
          size={43}
          iconSize={21}
          iconColor={colors.white}
          backgroundColor={colors.panel}
          borderColor={colors.panelBorder}
          style={styles.backButton}
        />

        <Text style={styles.title}>Arşiv</Text>
      </View>

      <Text style={styles.description}>
        Tarihi geçmiş notlarını burada görüntüleyebilirsin.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 12,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  backButton: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },

  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  description: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
});
