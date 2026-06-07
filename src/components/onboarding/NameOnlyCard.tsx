import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/theme";

type NameOnlyCardProps = {
  name: string;
  onChangeName: (value: string) => void;
  onStart: () => void;
};

export default function NameOnlyCard({
  name,
  onChangeName,
  onStart,
}: NameOnlyCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>W</Text>
      </View>

      <Text style={styles.title}>Wallyon'a Hoş Geldin</Text>

      <Text style={styles.description}>
        Başlamak için sadece ismini girmen yeterli.
      </Text>

      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color={colors.purpleLight} />

        <TextInput
          value={name}
          onChangeText={onChangeName}
          placeholder="İsmini gir"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onStart}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Başla</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 30,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    padding: 24,
    alignItems: "center",
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 26,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
  },
  logoText: {
    color: colors.purpleLight,
    fontSize: 34,
    fontWeight: "900",
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
  },
  description: {
    marginTop: 10,
    color: colors.label,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 22,
  },
  inputWrapper: {
    marginTop: 28,
    width: "100%",
    height: 58,
    borderRadius: 20,
    backgroundColor: "#0b1326",
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },
  button: {
    marginTop: 18,
    width: "100%",
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
});
