import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../constants/theme";
import { getStoredUserName } from "../services/profileStorage";

export default function IndexScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [storedName, setStoredName] = useState<string | null>(null);

  useEffect(() => {
    const checkUserName = async () => {
      try {
        const name = await getStoredUserName();
        setStoredName(name);
      } catch (error) {
        console.log("User name could not be loaded:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserName();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.purpleLight} />
      </View>
    );
  }

  if (storedName) {
    return <Redirect href="/tabs/home" />;
  }

  return <Redirect href="/onboarding" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
