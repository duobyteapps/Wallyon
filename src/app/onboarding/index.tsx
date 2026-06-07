import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NameOnlyCard from "../../components/onboarding/NameOnlyCard";
import { colors } from "../../constants/theme";
import { saveStoredUserName } from "../../services/profileStorage";

export default function OnboardingScreen() {
  const [name, setName] = useState("");

  const handleStart = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert("Uyarı", "Lütfen ismini gir.");
      return;
    }

    try {
      await saveStoredUserName(trimmedName);

      router.replace({
        pathname: "/tabs/home",
        params: {
          name: trimmedName,
        },
      });
    } catch (error) {
      console.log("User name could not be saved:", error);
      Alert.alert("Hata", "İsim kaydedilirken bir sorun oluştu.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <NameOnlyCard
            name={name}
            onChangeName={setName}
            onStart={handleStart}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});
