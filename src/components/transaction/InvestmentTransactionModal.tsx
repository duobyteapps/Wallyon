import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../constants/theme";
import { Transaction } from "../../types/transaction";
import { formatDateTR } from "../../utils/dateUtils";
import AppButton from "../ui/AppButton";
import AppDateField from "../ui/AppDateField";
import AppDatePickerModal from "../ui/AppDatePickerModal";
import AppIconButton from "../ui/AppIconButton";
import AppInput from "../ui/AppInput";

type InvestmentTransactionModalProps = {
  visible: boolean;
  investmentFields: string[];
  editTransaction?: Transaction | null;
  onClose: () => void;
  onOpenFieldsModal: () => void;
  onSave: (transaction: Transaction) => void;
};

type DropdownLayout = {
  top: number;
  left: number;
  width: number;
};

const parseTransactionDate = (dateText: string) => {
  const numericDateMatch = dateText.match(
    /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/,
  );

  if (numericDateMatch) {
    const day = Number(numericDateMatch[1]);
    const month = Number(numericDateMatch[2]) - 1;
    const year = Number(numericDateMatch[3]);

    return new Date(year, month, day);
  }

  const parsedDate = new Date(dateText);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  return new Date();
};

export default function InvestmentTransactionModal({
  visible,
  investmentFields,
  editTransaction,
  onClose,
  onOpenFieldsModal,
  onSave,
}: InvestmentTransactionModalProps) {
  const selectButtonRef = useRef<View>(null);

  const [selectedField, setSelectedField] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectDropdownLayout, setSelectDropdownLayout] =
    useState<DropdownLayout | null>(null);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const selectedDateText = formatDateTR(selectedDate);

  const resetForm = () => {
    setSelectedField("");
    setIsSelectOpen(false);
    setSelectDropdownLayout(null);
    setAmount("");
    setNote("");
    setSelectedDate(new Date());
    setIsDatePickerVisible(false);
  };

  useEffect(() => {
    if (!visible) return;

    if (editTransaction) {
      setSelectedField(editTransaction.title);
      setAmount(String(editTransaction.amount));
      setNote(editTransaction.note || "");
      setSelectedDate(parseTransactionDate(editTransaction.date));
      setIsSelectOpen(false);
      setSelectDropdownLayout(null);
      setIsDatePickerVisible(false);
      return;
    }

    resetForm();
  }, [visible, editTransaction]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOpenFieldsModal = () => {
    setIsSelectOpen(false);
    setSelectDropdownLayout(null);
    onOpenFieldsModal();
  };

  const handleOpenSelect = () => {
    if (isSelectOpen) {
      setIsSelectOpen(false);
      setSelectDropdownLayout(null);
      return;
    }

    selectButtonRef.current?.measureInWindow((x, y, width, height) => {
      setSelectDropdownLayout({
        top: y + height + 6,
        left: x,
        width,
      });

      setIsSelectOpen(true);
    });
  };

  const handleSelectField = (field: string) => {
    setSelectedField(field);
    setIsSelectOpen(false);
    setSelectDropdownLayout(null);
  };

  const handleSave = () => {
    const parsedAmount = Number(amount.replace(",", "."));

    if (!selectedField) {
      Alert.alert("Uyarı", "Lütfen alan seç.");
      return;
    }

    if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Uyarı", "Lütfen geçerli bir tutar gir.");
      return;
    }

    onSave({
      id: editTransaction?.id ?? Date.now(),
      title: selectedField,
      category: "Yatırım",
      amount: parsedAmount,
      type: "investment",
      date: selectedDateText,
      note: note.trim() || undefined,
    });

    resetForm();
    onClose();
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <Pressable style={styles.backdrop} onPress={handleClose}>
          <KeyboardAvoidingView
            style={styles.keyboardView}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Pressable
              style={styles.modalCard}
              onPress={(event) => event.stopPropagation()}
            >
              <View style={styles.header}>
                <Text style={styles.title}>
                  {editTransaction ? "Yatırım Güncelle" : "Yatırım Ekle"}
                </Text>
                <Text style={styles.description}>
                  İşlem detaylarını doldur ve kaydet.
                </Text>
              </View>

              <View style={styles.divider} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContent}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                scrollEnabled={!isSelectOpen}
              >
                <Text style={styles.label}>Alan</Text>

                <View style={styles.selectWrapper}>
                  <View style={styles.selectRow}>
                    <View
                      ref={selectButtonRef}
                      collapsable={false}
                      style={styles.selectButtonWrapper}
                    >
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={[
                          styles.selectButton,
                          isSelectOpen && styles.selectButtonActive,
                        ]}
                        onPress={handleOpenSelect}
                      >
                        <Text
                          style={[
                            styles.selectText,
                            !selectedField && styles.placeholderText,
                          ]}
                        >
                          {selectedField || "Seçiniz"}
                        </Text>

                        <Ionicons
                          name={isSelectOpen ? "chevron-up" : "chevron-down"}
                          size={18}
                          color={colors.white}
                        />
                      </TouchableOpacity>
                    </View>

                    <AppIconButton
                      icon="add"
                      onPress={handleOpenFieldsModal}
                      size={46}
                      iconSize={22}
                    />
                  </View>
                </View>

                <View style={styles.twoColumnRow}>
                  <View style={styles.column}>
                    <Text style={styles.label}>Tutar</Text>
                    <AppInput
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="numeric"
                      placeholder="0"
                      style={styles.input}
                    />
                  </View>

                  <View style={styles.column}>
                    <Text style={styles.label}>Tarih</Text>
                    <AppDateField
                      value={selectedDateText}
                      onPress={() => {
                        setIsSelectOpen(false);
                        setSelectDropdownLayout(null);
                        setIsDatePickerVisible(true);
                      }}
                    />
                  </View>
                </View>

                <Text style={styles.label}>Not</Text>
                <AppInput
                  value={note}
                  onChangeText={setNote}
                  placeholder="Not gir"
                  multilineInput
                  height={84}
                  textAlignVertical="top"
                  style={styles.noteInput}
                />
              </ScrollView>

              <View style={styles.footer}>
                <AppButton
                  title="Vazgeç"
                  variant="secondary"
                  width={92}
                  onPress={handleClose}
                />

                <AppButton
                  title={editTransaction ? "Güncelle" : "Kaydet"}
                  variant="purple"
                  width={92}
                  onPress={handleSave}
                />
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <Modal
        visible={visible && isSelectOpen}
        transparent
        animationType="none"
        onRequestClose={() => {
          setIsSelectOpen(false);
          setSelectDropdownLayout(null);
        }}
        statusBarTranslucent
      >
        <Pressable
          style={styles.dropdownModalOverlay}
          onPress={() => {
            setIsSelectOpen(false);
            setSelectDropdownLayout(null);
          }}
        >
          <View
            style={[
              styles.dropdown,
              {
                top: selectDropdownLayout?.top ?? 150,
                left: selectDropdownLayout?.left ?? 18,
                width: selectDropdownLayout?.width ?? 260,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <FlatList
              data={["", ...investmentFields]}
              keyExtractor={(item, index) => `${item || "empty"}-${index}`}
              style={styles.dropdownScroll}
              contentContainerStyle={styles.dropdownContent}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              renderItem={({ item }) => {
                const isPlaceholder = item === "";
                const isSelected = selectedField === item;

                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.dropdownItem,
                      isSelected && styles.dropdownItemActive,
                    ]}
                    onPress={() => handleSelectField(item)}
                  >
                    {!isPlaceholder && selectedField === item ? (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.investment}
                      />
                    ) : (
                      <View style={styles.dropdownIconPlaceholder} />
                    )}

                    <Text style={styles.dropdownText}>
                      {isPlaceholder ? "Seçiniz" : item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>

      <AppDatePickerModal
        visible={visible && isDatePickerVisible}
        value={selectedDate}
        onClose={() => setIsDatePickerVisible(false)}
        onConfirm={setSelectedDate}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  keyboardView: {
    width: "100%",
    alignItems: "center",
  },
  modalCard: {
    width: "100%",
    maxWidth: 500,
    minHeight: 470,
    maxHeight: "92%",
    borderRadius: 22,
    backgroundColor: "#030817",
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    padding: 18,
    zIndex: 10,
    elevation: 10,
  },
  header: {},
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
  },
  description: {
    marginTop: 4,
    color: colors.label,
    fontSize: 12,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(148, 163, 184, 0.08)",
    marginTop: 12,
    marginBottom: 12,
  },
  formContent: {
    paddingBottom: 4,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },
  selectWrapper: {
    position: "relative",
    zIndex: 20,
    marginBottom: 12,
  },
  selectRow: {
    flexDirection: "row",
    gap: 8,
  },
  selectButtonWrapper: {
    flex: 1,
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
  },
  selectButtonActive: {
    borderColor: colors.white,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  selectText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  placeholderText: {
    color: colors.white,
  },

  dropdownModalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdown: {
    position: "absolute",
    zIndex: 999,
    elevation: 999,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.65)",
    backgroundColor: colors.panel,
    overflow: "hidden",
    maxHeight: 170,
  },
  dropdownScroll: {
    maxHeight: 170,
  },
  dropdownContent: {
    paddingVertical: 4,
  },
  dropdownItem: {
    minHeight: 38,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownItemActive: {
    backgroundColor: "rgba(139, 92, 246, 0.12)",
  },
  dropdownIconPlaceholder: {
    width: 18,
    height: 18,
  },
  dropdownText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },

  twoColumnRow: {
    flexDirection: "row",
    gap: 10,
  },
  column: {
    flex: 1,
  },
  input: {
    marginBottom: 12,
  },
  noteInput: {
    marginBottom: 0,
  },
  footer: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.08)",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
});
