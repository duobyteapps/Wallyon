import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

export default function AnalyticsHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerTextWrapper}>
        <Text style={styles.pageTitle}>Aylık Özet</Text>

        <Text style={styles.pageDescription}>
          Gelir, gider ve yatırım hareketlerini aylık olarak incele.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 12,
  },
  headerTextWrapper: {
    flex: 1,
  },
  pageTitle: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.7,
  },
  pageDescription: {
    marginTop: 7,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
  },
});
