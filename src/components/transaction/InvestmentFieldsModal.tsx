import { useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/theme";
import AppButton from "../ui/AppButton";
import AppIconButton from "../ui/AppIconButton";
import AppInput from "../ui/AppInput";

type InvestmentFieldsModalProps = {
  visible: boolean;
  fields: string[];
  onClose: () => void;
  onAddField: (fieldName: string) => void;
  onDeleteField: (fieldName: string) => void;
};

export default function InvestmentFieldsModal({
  visible,
  fields,
  onClose,
  onAddField,
  onDeleteField,
}: InvestmentFieldsModalProps) {
  const [fieldName, setFieldName] = useState("");

  const handleAdd = () => {
    const trimmedFieldName = fieldName.trim();

    if (!trimmedFieldName) {
      Alert.alert("Uyarı", "Lütfen alan adı gir.");
      return;
    }

    onAddField(trimmedFieldName);
    setFieldName("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Yatırım Alanları</Text>

          <Text style={styles.description}>
            SelectBox içinde görünecek yatırım alanlarını ekleyebilir veya
            silebilirsin.
          </Text>

          <Text style={styles.label}>Yeni Alan Adı</Text>

          <View style={styles.addRow}>
            <AppInput
              value={fieldName}
              onChangeText={setFieldName}
              placeholder="Örn: Altın, Döviz, Borsa"
              style={styles.input}
              height={42}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />

            <AppButton
              title="Ekle"
              onPress={handleAdd}
              width={92}
              height={42}
              style={styles.addButton}
            />
          </View>

          <Text style={styles.sectionTitle}>Mevcut Alanlar</Text>

          <View style={styles.fieldsListBox}>
            <FlatList
              data={fields}
              keyExtractor={(item, index) => `${item}-${index}`}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator
              bounces={false}
              scrollEnabled={fields.length > 3}
              contentContainerStyle={styles.fieldsListContent}
              renderItem={({ item }) => (
                <View style={styles.fieldItem}>
                  <Text style={styles.fieldText} numberOfLines={1}>
                    {item}
                  </Text>

                  <AppIconButton
                    icon="trash-outline"
                    onPress={() => onDeleteField(item)}
                    size={38}
                    iconSize={20}
                    iconColor="#c4b5fd"
                    backgroundColor="rgba(139, 92, 246, 0.18)"
                    borderColor="rgba(139, 92, 246, 0.18)"
                  />
                </View>
              )}
            />
          </View>

          <View style={styles.footer}>
            <AppButton
              title="Kapat"
              onPress={onClose}
              variant="secondary"
              width={96}
              height={42}
              style={styles.closeButton}
            />
          </View>
        </View>
      </View>
    </Modal>
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

  modalCard: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "88%",
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
    lineHeight: 18,
    fontWeight: "600",
  },

  label: {
    marginTop: 18,
    marginBottom: 6,
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
  },

  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  input: {
    flex: 1,
    minWidth: 0,
  },

  addButton: {
    flexShrink: 0,
  },

  sectionTitle: {
    marginTop: 20,
    marginBottom: 10,
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },

  fieldsListBox: {
    height: 162,
  },

  fieldsListContent: {
    gap: 8,
    paddingBottom: 4,
  },

  fieldItem: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: "#060b1b",
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  fieldText: {
    flex: 1,
    minWidth: 0,
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },

  footer: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.08)",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  closeButton: {
    flexShrink: 0,
  },
});
