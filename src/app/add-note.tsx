import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "../components/ui/AppButton";
import AppDateField from "../components/ui/AppDateField";
import AppDatePickerModal from "../components/ui/AppDatePickerModal";
import AppIconButton from "../components/ui/AppIconButton";
import { colors } from "../constants/theme";
import { getStoredNotes, saveStoredNotes } from "../services/noteStorage";
import { Note, NoteChecklistItem, NoteContentType } from "../types/note";
import { formatDateTR } from "../utils/dateUtils";

const formatStorageDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseStorageDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
};

const createEmptyChecklistItem = (): NoteChecklistItem => ({
  id: Date.now() + Math.random(),
  text: "",
  isCompleted: false,
});

export default function AddNoteScreen() {
  const { noteId } = useLocalSearchParams<{ noteId?: string }>();

  const isEditing = useMemo(() => {
    return !!noteId;
  }, [noteId]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<NoteContentType>("text");
  const [checklistItems, setChecklistItems] = useState<NoteChecklistItem[]>([
    createEmptyChecklistItem(),
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  useEffect(() => {
    if (!noteId) return;

    const loadEditingNote = async () => {
      try {
        const notes = await getStoredNotes();

        const editingNote = notes.find(
          (note) => String(note.id) === String(noteId),
        );

        if (!editingNote) {
          Alert.alert("Hata", "Düzenlenecek not bulunamadı.");
          router.back();
          return;
        }

        const editingContentType: NoteContentType =
          editingNote.contentType === "checklist" ? "checklist" : "text";

        setTitle(editingNote.title);
        setDescription(editingNote.description || "");
        setContentType(editingContentType);
        setChecklistItems(
          editingNote.checklistItems && editingNote.checklistItems.length > 0
            ? editingNote.checklistItems
            : [createEmptyChecklistItem()],
        );
        setSelectedDate(parseStorageDate(editingNote.date));
      } catch {
        Alert.alert("Hata", "Not bilgileri yüklenirken bir sorun oluştu.");
      }
    };

    loadEditingNote();
  }, [noteId]);

  const selectContentType = (nextType: NoteContentType) => {
    setContentType(nextType);

    if (nextType === "checklist" && checklistItems.length === 0) {
      setChecklistItems([createEmptyChecklistItem()]);
    }
  };

  const addChecklistItem = () => {
    setChecklistItems((currentItems) => [
      ...currentItems,
      createEmptyChecklistItem(),
    ]);
  };

  const updateChecklistItemText = (itemId: number, text: string) => {
    setChecklistItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              text,
            }
          : item,
      ),
    );
  };

  const toggleChecklistItem = (itemId: number) => {
    setChecklistItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              isCompleted: !item.isCompleted,
            }
          : item,
      ),
    );
  };

  const removeChecklistItem = (itemId: number) => {
    setChecklistItems((currentItems) => {
      if (currentItems.length === 1) {
        return [createEmptyChecklistItem()];
      }

      return currentItems.filter((item) => item.id !== itemId);
    });
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Uyarı", "Not başlığı boş olamaz.");
      return;
    }

    const normalizedChecklistItems = checklistItems
      .map((item) => ({
        ...item,
        text: item.text.trim(),
      }))
      .filter((item) => item.text.length > 0);

    if (contentType === "checklist" && normalizedChecklistItems.length === 0) {
      Alert.alert("Uyarı", "Liste için en az bir madde eklemelisin.");
      return;
    }

    const nextDescription = contentType === "text" ? description.trim() : "";

    const nextChecklistItems =
      contentType === "checklist" ? normalizedChecklistItems : undefined;

    const nextIsCompleted =
      contentType === "checklist"
        ? normalizedChecklistItems.length > 0 &&
          normalizedChecklistItems.every((item) => item.isCompleted)
        : false;

    try {
      const notes = await getStoredNotes();

      if (isEditing && noteId) {
        const updatedNotes = notes.map((note) =>
          String(note.id) === String(noteId)
            ? {
                ...note,
                title: title.trim(),
                description: nextDescription,
                contentType,
                checklistItems: nextChecklistItems,
                date: formatStorageDate(selectedDate),
                isCompleted:
                  contentType === "checklist"
                    ? nextIsCompleted
                    : note.isCompleted,
              }
            : note,
        );

        await saveStoredNotes(updatedNotes);
        router.back();
        return;
      }

      const newNote: Note = {
        id: Date.now(),
        title: title.trim(),
        description: nextDescription,
        contentType,
        checklistItems: nextChecklistItems,
        date: formatStorageDate(selectedDate),
        isCompleted: nextIsCompleted,
        createdAt: new Date().toISOString(),
      };

      await saveStoredNotes([newNote, ...notes]);
      router.back();
    } catch {
      Alert.alert(
        "Hata",
        isEditing
          ? "Not güncellenirken bir sorun oluştu."
          : "Not kaydedilirken bir sorun oluştu.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <AppIconButton
                icon="chevron-back"
                onPress={() => router.back()}
                size={43}
                iconSize={21}
                iconColor={colors.white}
                backgroundColor={colors.panel}
                borderColor={colors.panelBorder}
                style={styles.backButton}
              />

              <Text style={styles.title}>
                {isEditing ? "Notu Düzenle" : "Yeni Not"}
              </Text>
            </View>

            <Text style={styles.description}>
              {isEditing
                ? "Not başlığını, açıklamasını veya tarihini güncelle."
                : "Bugün veya ileri tarih için yapılacak not oluştur."}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name={isEditing ? "create-outline" : "calendar-outline"}
                size={20}
                color={colors.purple}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>
                {isEditing ? "Not düzenleme" : "İleri tarihli not"}
              </Text>
              <Text style={styles.infoText}>
                {isEditing
                  ? "Kaydettiğinde mevcut not bilgileri güncellenir."
                  : "Günü gelince notların arasında görünür."}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Not Başlığı</Text>

              <View style={styles.inputBox}>
                <Ionicons
                  name="text-outline"
                  size={21}
                  color={colors.mutedLight}
                  style={styles.inputIcon}
                />

                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Örn: Market alışverişi"
                  placeholderTextColor={colors.mutedLight}
                  style={styles.textInput}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Not Tipi</Text>

              <View style={styles.contentTypeRow}>
                <TouchableOpacity
                  style={[
                    styles.contentTypeButton,
                    contentType === "text" && styles.contentTypeButtonActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => selectContentType("text")}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color={
                      contentType === "text" ? colors.purple : colors.mutedLight
                    }
                  />

                  <Text
                    style={[
                      styles.contentTypeText,
                      contentType === "text" && styles.contentTypeTextActive,
                    ]}
                  >
                    Açıklama
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.contentTypeButton,
                    contentType === "checklist" &&
                      styles.contentTypeButtonActive,
                  ]}
                  activeOpacity={0.85}
                  onPress={() => selectContentType("checklist")}
                >
                  <Ionicons
                    name="checkbox-outline"
                    size={18}
                    color={
                      contentType === "checklist"
                        ? colors.purple
                        : colors.mutedLight
                    }
                  />

                  <Text
                    style={[
                      styles.contentTypeText,
                      contentType === "checklist" &&
                        styles.contentTypeTextActive,
                    ]}
                  >
                    Liste
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.helperText}>
                Açıklama veya checkbox’lı liste olarak not oluşturabilirsin.
              </Text>
            </View>

            {contentType === "text" ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Açıklama</Text>

                <View style={styles.descriptionBox}>
                  <Ionicons
                    name="document-text-outline"
                    size={21}
                    color={colors.mutedLight}
                    style={styles.descriptionIcon}
                  />

                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Not detayını yaz"
                    placeholderTextColor={colors.mutedLight}
                    style={styles.descriptionInput}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Liste</Text>

                <View style={styles.checklistBox}>
                  {checklistItems.map((item, index) => (
                    <View key={item.id} style={styles.checklistRow}>
                      <TouchableOpacity
                        style={[
                          styles.checklistCheckbox,
                          item.isCompleted && styles.checklistCheckboxActive,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => toggleChecklistItem(item.id)}
                      >
                        {item.isCompleted ? (
                          <Ionicons
                            name="checkmark"
                            size={15}
                            color={colors.white}
                          />
                        ) : null}
                      </TouchableOpacity>

                      <TextInput
                        value={item.text}
                        onChangeText={(text) =>
                          updateChecklistItemText(item.id, text)
                        }
                        placeholder={`Madde ${index + 1}`}
                        placeholderTextColor={colors.mutedLight}
                        style={[
                          styles.checklistInput,
                          item.isCompleted && styles.checklistInputCompleted,
                        ]}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={addChecklistItem}
                      />

                      <TouchableOpacity
                        style={styles.removeChecklistButton}
                        activeOpacity={0.8}
                        onPress={() => removeChecklistItem(item.id)}
                      >
                        <Ionicons
                          name="close"
                          size={16}
                          color={colors.mutedLight}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.addChecklistButton}
                    activeOpacity={0.85}
                    onPress={addChecklistItem}
                  >
                    <Ionicons name="add" size={17} color={colors.purple} />

                    <Text style={styles.addChecklistText}>Yeni madde ekle</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tarih</Text>

              <AppDateField
                value={formatDateTR(selectedDate)}
                onPress={() => setIsDatePickerVisible(true)}
                marginBottom={0}
              />

              <Text style={styles.helperText}>
                Tarih alanına tıklayarak notun gösterileceği günü seç.
              </Text>
            </View>

            <AppButton
              title={isEditing ? "Notu Güncelle" : "Notu Kaydet"}
              onPress={handleSave}
              variant="purple"
              height={58}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>

        <AppDatePickerModal
          visible={isDatePickerVisible}
          value={selectedDate}
          onClose={() => setIsDatePickerVisible(false)}
          onConfirm={setSelectedDate}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  header: {
    marginTop: 12,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  backButton: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },

  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
  },

  description: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  infoCard: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 26,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },

  infoTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },

  infoText: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },

  card: {
    marginTop: 20,
    padding: 20,
    borderRadius: 34,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    marginBottom: 7,
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },

  inputBox: {
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  inputIcon: {
    marginRight: 10,
  },

  textInput: {
    flex: 1,
    height: "100%",
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
    paddingVertical: 0,
  },

  descriptionBox: {
    minHeight: 150,
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  descriptionIcon: {
    marginRight: 10,
    marginTop: 1,
  },

  descriptionInput: {
    flex: 1,
    minHeight: 105,
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    textAlignVertical: "top",
  },

  helperText: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
  },

  contentTypeRow: {
    flexDirection: "row",
    gap: 10,
  },

  contentTypeButton: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  contentTypeButtonActive: {
    backgroundColor: colors.purpleSoft,
    borderColor: colors.purpleBorder,
  },

  contentTypeText: {
    color: colors.mutedLight,
    fontSize: 12,
    fontWeight: "900",
  },

  contentTypeTextActive: {
    color: colors.purple,
  },

  checklistBox: {
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 14,
  },

  checklistRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  checklistCheckbox: {
    width: 27,
    height: 27,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  checklistCheckboxActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purpleBorder,
  },

  checklistInput: {
    flex: 1,
    minHeight: 44,
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
    paddingVertical: 0,
  },

  checklistInputCompleted: {
    color: colors.muted,
    textDecorationLine: "line-through",
  },

  removeChecklistButton: {
    width: 30,
    height: 30,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },

  addChecklistButton: {
    height: 45,
    borderRadius: 16,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  addChecklistText: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: "900",
  },

  saveButton: {
    borderRadius: 21,
    shadowColor: colors.purple,
    shadowOpacity: 0.42,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 8,
  },
});
