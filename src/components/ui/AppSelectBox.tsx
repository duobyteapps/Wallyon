import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "../../constants/theme";
import AppIconButton from "./AppIconButton";

type AppSelectBoxProps = {
  label?: string;
  value: string;
  placeholder?: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
  onAddPress?: () => void;
  activeColor?: string;
  activeBackgroundColor?: string;
  containerStyle?: ViewStyle;
};

const ITEM_HEIGHT = 50;
const MAX_VISIBLE_ITEM_COUNT = 4;

export default function AppSelectBox({
  label = "Kategori",
  value,
  placeholder = "Kategori seçiniz",
  options,
  isOpen,
  onToggle,
  onChange,
  onAddPress,
  activeColor = colors.white,
  activeBackgroundColor = "rgba(255, 255, 255, 0.08)",
  containerStyle,
}: AppSelectBoxProps) {
  const dropdownItems = ["", ...options];

  const maxDropdownHeight = ITEM_HEIGHT * MAX_VISIBLE_ITEM_COUNT;

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.selectRow}>
        <View style={styles.selectButtonWrapper}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.selectButton, isOpen && styles.selectButtonActive]}
            onPress={onToggle}
          >
            <Text
              style={[styles.selectText, !value && styles.placeholderText]}
              numberOfLines={1}
            >
              {value || placeholder}
            </Text>

            <Ionicons
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={18}
              color={colors.white}
            />
          </TouchableOpacity>

          {isOpen ? (
            <View style={[styles.dropdown, { maxHeight: maxDropdownHeight }]}>
              <ScrollView
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={dropdownItems.length > 3}
                style={styles.dropdownScroll}
                contentContainerStyle={styles.dropdownContent}
              >
                {dropdownItems.map((item, index) => {
                  const isPlaceholder = item === "";
                  const isSelected = value === item;

                  return (
                    <TouchableOpacity
                      key={`${item || "empty"}-${index}`}
                      activeOpacity={0.85}
                      style={[
                        styles.dropdownItem,
                        isSelected && {
                          backgroundColor: activeBackgroundColor,
                        },
                      ]}
                      onPress={() => handleSelect(item)}
                    >
                      {!isPlaceholder && isSelected ? (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color={activeColor}
                        />
                      ) : (
                        <View style={styles.dropdownIconPlaceholder} />
                      )}

                      <Text style={styles.dropdownText} numberOfLines={1}>
                        {isPlaceholder ? placeholder : item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}
        </View>

        {onAddPress ? (
          <AppIconButton
            icon="add"
            onPress={onAddPress}
            size={46}
            iconSize={22}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
  },
  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },
  selectRow: {
    height: 46,
    flexDirection: "row",
    gap: 8,
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
  },
  selectButtonWrapper: {
    flex: 1,
    height: 46,
    position: "relative",
    zIndex: 9999,
    elevation: 9999,
    overflow: "visible",
  },
  selectButton: {
    width: "100%",
    minHeight: 46,
    borderRadius: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10000,
    elevation: 10000,
  },
  selectButtonActive: {
    borderColor: colors.white,
  },
  selectText: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    marginRight: 8,
  },
  placeholderText: {
    color: colors.white,
  },
  dropdown: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    zIndex: 20000,
    elevation: 20000,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
    backgroundColor: colors.panel,
    overflow: "hidden",
  },
  dropdownScroll: {
    width: "100%",
  },
  dropdownContent: {
    paddingVertical: 0,
  },
  dropdownItem: {
    minHeight: ITEM_HEIGHT,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownIconPlaceholder: {
    width: 18,
    height: 18,
  },
  dropdownText: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
});
