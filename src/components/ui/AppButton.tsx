import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { colors } from "../../constants/theme";

type AppButtonVariant = "primary" | "secondary" | "purple" | "danger";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  width,
  height = 42,
  style,
}: AppButtonProps) {
  const variantStyle = getVariantStyle(variant);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.button,
        variantStyle.button,
        {
          width,
          height,
        },
        style,
      ]}
    >
      <Text style={[styles.buttonText, variantStyle.text]}>{title}</Text>
    </TouchableOpacity>
  );
}

const getVariantStyle = (variant: AppButtonVariant) => {
  if (variant === "secondary") {
    return {
      button: {
        backgroundColor: "#111827",
        borderColor: colors.panelBorder,
      },
      text: {
        color: colors.white,
      },
    };
  }

  if (variant === "purple") {
    return {
      button: {
        backgroundColor: colors.purple,
        borderColor: colors.purple,
      },
      text: {
        color: colors.white,
      },
    };
  }

  if (variant === "danger") {
    return {
      button: {
        backgroundColor: "rgba(255, 92, 124, 0.18)",
        borderColor: "rgba(255, 92, 124, 0.18)",
      },
      text: {
        color: "#fda4af",
      },
    };
  }

  return {
    button: {
      backgroundColor: colors.income,
      borderColor: colors.income,
    },
    text: {
      color: colors.background,
    },
  };
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 13,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 12,
    fontWeight: "900",
  },
});
