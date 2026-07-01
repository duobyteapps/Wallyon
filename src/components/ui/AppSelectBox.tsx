import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "../../constants/theme";
import AppIconButton from "../ui/AppIconButton";

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

type DropdownLayout = {
  top: number;
  left: number;
  width: number;
};

const ITEM_HEIGHT = 42;
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
  const selectButtonWrapperRef = useRef<View>(null);
  const [dropdownLayout, setDropdownLayout] = useState<DropdownLayout | null>(
    null,
  );

  const dropdownItems = ["", ...options];
  const maxDropdownHeight = ITEM_HEIGHT * MAX_VISIBLE_ITEM_COUNT;

  const closeDropdown = () => {
    setDropdownLayout(null);

    if (isOpen) {
      onToggle();
    }
  };

  const handleToggle = () => {
    if (Platform.OS === "ios") {
      onToggle();
      return;
    }

    if (isOpen) {
      setDropdownLayout(null);
      onToggle();
      return;
    }

    selectButtonWrapperRef.current?.measureInWindow((x, y, width, height) => {
      const screenHeight = Dimensions.get("window").height;
      const dropdownHeight = Math.min(
        dropdownItems.length * ITEM_HEIGHT,
        maxDropdownHeight,
      );

      const dropdownTop =
        y + height + 6 + dropdownHeight > screenHeight - 16
          ? Math.max(16, y - dropdownHeight - 6)
          : y + height + 6;

      setDropdownLayout({
        top: dropdownTop,
        left: x,
        width,
      });

      onToggle();
    });
  };

  const handleSelect = (selectedValue: string) => {
    setDropdownLayout(null);
    onChange(selectedValue);
  };

  const renderDropdownItem = ({
    item,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    const isPlaceholder = item === "";
    const isSelected = value === item;

    return (
      <TouchableOpacity
        key={`${item || "empty"}-${index}`}
        activeOpacity={0.85}
        style={[
          styles.dropdownItem,
          isSelected && { backgroundColor: activeBackgroundColor },
        ]}
        onPress={() => handleSelect(item)}
      >
        {!isPlaceholder && isSelected ? (
          <Ionicons name="checkmark-circle" size={18} color={activeColor} />
        ) : (
          <View style={styles.dropdownIconPlaceholder} />
        )}

        <Text style={styles.dropdownText} numberOfLines={1}>
          {isPlaceholder ? placeholder : item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderIosDropdownItems = () => (
    <ScrollView
      nestedScrollEnabled
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={
        dropdownItems.length > MAX_VISIBLE_ITEM_COUNT
      }
      style={[styles.dropdownScroll, { maxHeight: maxDropdownHeight }]}
      contentContainerStyle={styles.dropdownContent}
    >
      {dropdownItems.map((item, index) => renderDropdownItem({ item, index }))}
    </ScrollView>
  );

  const renderAndroidDropdownItems = () => (
    <FlatList
      data={dropdownItems}
      keyExtractor={(item, index) => `${item || "empty"}-${index}`}
      renderItem={renderDropdownItem}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      scrollEnabled
      bounces={false}
      overScrollMode="always"
      showsVerticalScrollIndicator={
        dropdownItems.length > MAX_VISIBLE_ITEM_COUNT
      }
      style={[styles.dropdownScroll, { maxHeight: maxDropdownHeight }]}
      contentContainerStyle={styles.dropdownContent}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );

  return (
    <>
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}

        <View style={styles.selectRow}>
          <View
            ref={selectButtonWrapperRef}
            collapsable={false}
            style={styles.selectButtonWrapper}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.selectButton, isOpen && styles.selectButtonActive]}
              onPress={handleToggle}
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

            {isOpen && Platform.OS === "ios" ? (
              <View style={styles.iosDropdown}>{renderIosDropdownItems()}</View>
            ) : null}
          </View>

          {onAddPress ? (
            <AppIconButton icon="add" onPress={onAddPress} />
          ) : null}
        </View>
      </View>

      <Modal
        visible={isOpen && Platform.OS === "android" && !!dropdownLayout}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDropdown}
      >
        <View style={styles.dropdownModalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDropdown} />

          {dropdownLayout ? (
            <View
              style={[
                styles.androidDropdown,
                {
                  top: dropdownLayout.top,
                  left: dropdownLayout.left,
                  width: dropdownLayout.width,
                  maxHeight: maxDropdownHeight,
                },
              ]}
              onStartShouldSetResponder={() => true}
            >
              {renderAndroidDropdownItems()}
            </View>
          ) : null}
        </View>
      </Modal>
    </>
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
  iosDropdown: {
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
  dropdownModalRoot: {
    flex: 1,
    backgroundColor: "transparent",
  },
  androidDropdown: {
    position: "absolute",
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
    paddingVertical: 4,
  },
  dropdownItem: {
    height: ITEM_HEIGHT,
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
