import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../../constants/theme";

type AppIconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
};

export default function AppIconButton({
  icon,
  onPress,
  size = 46,
  iconSize = 24,
  iconColor = "#ddd6fe",
  backgroundColor = colors.purpleSoft,
  borderColor = colors.purpleBorder,
  style,
}: AppIconButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.button,
        {
          width: size,
          minHeight: size,
          borderRadius: 14,
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
