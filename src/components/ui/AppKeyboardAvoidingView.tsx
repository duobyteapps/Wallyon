import { PropsWithChildren } from "react";
import { KeyboardAvoidingView, StyleProp, ViewStyle } from "react-native";

type AppKeyboardAvoidingViewProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
}>;

export default function AppKeyboardAvoidingView({
  children,
  style,
  keyboardVerticalOffset = 0,
}: AppKeyboardAvoidingViewProps) {
  return (
    <KeyboardAvoidingView
      style={style}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
