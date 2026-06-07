import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";

type ProfileActionsProps = {
  onChangeName: () => void;
  onDeleteProfile: () => void;
};

export default function ProfileActions({
  onChangeName,
  onDeleteProfile,
}: ProfileActionsProps) {
  return (
    <>
      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.changeButton}
          onPress={onChangeName}
        >
          <Ionicons name="create-outline" size={22} color={colors.white} />
          <Text style={styles.changeButtonText}>Adı Değiştir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.deleteButton}
          onPress={onDeleteProfile}
        >
          <Ionicons name="trash-outline" size={22} color="#fecaca" />
          <Text style={styles.deleteButtonText}>Profili Sil</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.infoText}>
        Adını değiştirmek için tekrar ilk giriş ekranına yönlendirilirsin.
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    marginTop: 22,
    gap: 12,
  },
  changeButton: {
    height: 58,
    borderRadius: 22,
    backgroundColor: colors.purple,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  changeButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
  deleteButton: {
    height: 58,
    borderRadius: 22,
    backgroundColor: "rgba(239, 68, 68, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.35)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  deleteButtonText: {
    color: "#fecaca",
    fontSize: 16,
    fontWeight: "900",
  },
  infoText: {
    marginTop: 18,
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },
});
