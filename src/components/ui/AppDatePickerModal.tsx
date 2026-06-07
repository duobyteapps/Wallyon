import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/theme";
import AppButton from "./AppButton";
import AppInput from "./AppInput";

type AppDatePickerModalProps = {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
};

export default function AppDatePickerModal({
  visible,
  value,
  onClose,
  onConfirm,
}: AppDatePickerModalProps) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (!visible) return;

    setDay(String(value.getDate()).padStart(2, "0"));
    setMonth(String(value.getMonth() + 1).padStart(2, "0"));
    setYear(String(value.getFullYear()));
  }, [visible, value]);

  const handleConfirm = () => {
    const parsedDay = Number(day);
    const parsedMonth = Number(month);
    const parsedYear = Number(year);

    if (
      Number.isNaN(parsedDay) ||
      Number.isNaN(parsedMonth) ||
      Number.isNaN(parsedYear) ||
      parsedDay < 1 ||
      parsedDay > 31 ||
      parsedMonth < 1 ||
      parsedMonth > 12 ||
      parsedYear < 2000
    ) {
      Alert.alert("Uyarı", "Lütfen geçerli bir tarih gir.");
      return;
    }

    const selectedDate = new Date(parsedYear, parsedMonth - 1, parsedDay);

    if (
      selectedDate.getDate() !== parsedDay ||
      selectedDate.getMonth() !== parsedMonth - 1 ||
      selectedDate.getFullYear() !== parsedYear
    ) {
      Alert.alert("Uyarı", "Lütfen geçerli bir tarih gir.");
      return;
    }

    onConfirm(selectedDate);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={styles.modalCard}
          onPress={(event) => event.stopPropagation()}
        >
          <Text style={styles.title}>Tarih Seç</Text>

          <Text style={styles.description}>
            Gün, ay ve yıl bilgilerini gir.
          </Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Gün</Text>

              <AppInput
                value={day}
                onChangeText={setDay}
                placeholder="31"
                keyboardType="number-pad"
                height={46}
                maxLength={2}
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Ay</Text>

              <AppInput
                value={month}
                onChangeText={setMonth}
                placeholder="05"
                keyboardType="number-pad"
                height={46}
                maxLength={2}
              />
            </View>

            <View style={styles.column}>
              <Text style={styles.label}>Yıl</Text>

              <AppInput
                value={year}
                onChangeText={setYear}
                placeholder="2026"
                keyboardType="number-pad"
                height={46}
                maxLength={4}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <AppButton
              title="Vazgeç"
              onPress={onClose}
              variant="secondary"
              width={84}
              height={42}
            />

            <AppButton
              title="Seç"
              onPress={handleConfirm}
              variant="primary"
              width={84}
              height={42}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    backgroundColor: "#030817",
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    padding: 16,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
  },
  description: {
    marginTop: 6,
    color: colors.label,
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    marginTop: 18,
    flexDirection: "row",
    gap: 8,
  },
  column: {
    flex: 1,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },
  footer: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.08)",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
