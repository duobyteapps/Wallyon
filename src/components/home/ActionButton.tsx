import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";

type ActionButtonProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  iconBackgroundColor?: string;
  borderColor?: string;
  onPress?: () => void;
};

export default function ActionButton({
  title,
  icon,
  color = colors.purpleLight,
  iconBackgroundColor = colors.purpleSoft,
  borderColor = colors.panelBorder,
  onPress,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.actionButton,
        {
          borderColor,
        },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: iconBackgroundColor,
          },
        ]}
      >
        <Ionicons name={icon} size={28} color={color} />
      </View>

      <Text
        style={[
          styles.actionText,
          {
            color,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    width: "23%",
    minHeight: 92,
    borderRadius: 22,
    backgroundColor: colors.panel,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    borderWidth: 1,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },
});
