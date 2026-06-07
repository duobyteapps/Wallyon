import { StyleSheet, TextInput, TextInputProps } from "react-native";

import { colors } from "../../constants/theme";

type AppInputProps = TextInputProps & {
  height?: number;
  multilineInput?: boolean;
};

export default function AppInput({
  height = 46,
  multilineInput = false,
  style,
  placeholderTextColor = colors.muted,
  ...props
}: AppInputProps) {
  return (
    <TextInput
      placeholderTextColor={placeholderTextColor}
      multiline={multilineInput}
      textAlignVertical={multilineInput ? "top" : "center"}
      style={[
        styles.input,
        {
          height,
          paddingTop: multilineInput ? 12 : 0,
          paddingBottom: multilineInput ? 12 : 0,
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    color: colors.white,
    paddingHorizontal: 13,
    fontSize: 13,
    fontWeight: "700",
    includeFontPadding: false,
  },
});
