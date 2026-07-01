import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../../constants/theme";
import { Transaction } from "../../types/transaction";
import { formatDateTR } from "../../utils/dateUtils";
import AppButton from "../ui/AppButton";
import AppDateField from "../ui/AppDateField";
import AppDatePickerModal from "../ui/AppDatePickerModal";
import AppInput from "../ui/AppInput";
import AppSelectBox from "../ui/AppSelectBox";

type InvestmentTransactionModalProps = {
  visible: boolean;
  investmentFields: string[];
  editTransaction?: Transaction | null;
  onClose: () => void;
  onOpenFieldsModal: () => void;
  onSave: (transaction: Transaction) => void;
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
  const [selectedField, setSelectedField] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const selectedDateText = formatDateTR(selectedDate);

  const closeSelectBox = () => {
    setIsSelectOpen(false);
  };

  const resetForm = () => {
    setSelectedField("");
    setIsSelectOpen(false);
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
    closeSelectBox();
    onOpenFieldsModal();
  };

  const handleSave = () => {
    const parsedAmount = Number(amount.replace(",", "."));

    if (!selectedField) {
      Alert.alert("Uyarı", "Lütfen kategori seç.");
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
                <AppSelectBox
                  label="Kategori"
                  value={selectedField}
                  placeholder="Yatırım kategorisi seçiniz"
                  options={investmentFields}
                  isOpen={isSelectOpen}
                  onToggle={() => setIsSelectOpen((current) => !current)}
                  onChange={(value) => {
                    setSelectedField(value);
                    closeSelectBox();
                  }}
                  onAddPress={handleOpenFieldsModal}
                  activeColor={colors.investment}
                  activeBackgroundColor="rgba(139, 92, 246, 0.12)"
                />

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
                        closeSelectBox();
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

              <AppDatePickerModal
                visible={isDatePickerVisible}
                value={selectedDate}
                onClose={() => setIsDatePickerVisible(false)}
                onConfirm={setSelectedDate}
                useNativeModal={false}
              />
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
        x
      </Modal>
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
    overflow: "visible",
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
    overflow: "visible",
  },
  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
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
