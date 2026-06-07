import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import {
  deleteProfileStorage,
  getStoredUserName,
  removeStoredUserName,
} from "../../services/profileStorage";

export default function ProfileScreen() {
  const [name, setName] = useState("");

  const loadUserName = async () => {
    try {
      const storedName = await getStoredUserName();
      setName(storedName || "");
    } catch (error) {
      console.log("User name could not be loaded:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserName();
    }, []),
  );

  const goToOnboardingForNameChange = async () => {
    try {
      await removeStoredUserName();
      setName("");
      router.replace("/onboarding");
    } catch (error) {
      console.log("User name could not be removed:", error);
      Alert.alert("Hata", "İsim değiştirme ekranına geçilirken sorun oluştu.");
    }
  };

  const deleteProfileAndRedirect = async () => {
    try {
      await deleteProfileStorage();
      setName("");
      router.replace("/onboarding");
    } catch (error) {
      console.log("Profile could not be deleted:", error);
      Alert.alert("Hata", "Profil silinirken bir sorun oluştu.");
    }
  };

  const handleDeleteProfile = () => {
    Alert.alert("Profili Sil", "Profilini silmek istediğine emin misin?", [
      {
        text: "Vazgeç",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: deleteProfileAndRedirect,
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={42} color={colors.white} />
          </View>

          <Text style={styles.title}>Profil</Text>
          <Text style={styles.subtitle}>Hesap bilgilerini buradan yönet.</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.nameRow}>
            <View>
              <Text style={styles.label}>Adın</Text>
              <Text style={styles.nameText}>
                {name ? name : "İsim bulunamadı"}
              </Text>
            </View>

            <Ionicons name="sparkles" size={22} color={colors.white} />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.changeButton}
            onPress={goToOnboardingForNameChange}
          >
            <Ionicons name="create-outline" size={22} color={colors.white} />
            <Text style={styles.changeButtonText}>Adı Değiştir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.deleteButton}
            onPress={handleDeleteProfile}
          >
            <Ionicons name="trash-outline" size={22} color="#fecaca" />
            <Text style={styles.deleteButtonText}>Profili Sil</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
          Adını değiştirmek için tekrar ilk giriş ekranına yönlendirilirsin.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
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
  nameIconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
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
