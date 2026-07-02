import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
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

  const checklistInputRefs = useRef<Record<number, TextInput | null>>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<NoteContentType>("text");
  const [checklistItems, setChecklistItems] = useState<NoteChecklistItem[]>([
    createEmptyChecklistItem(),
  ]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const hasDescriptionContent = useMemo(() => {
    return description.trim().length > 0;
  }, [description]);

  const hasChecklistContent = useMemo(() => {
    return checklistItems.some((item) => item.text.trim().length > 0);
  }, [checklistItems]);

  const isTypeLocked = useMemo(() => {
    if (contentType === "text") {
      return hasDescriptionContent;
    }

    return hasChecklistContent;
  }, [contentType, hasDescriptionContent, hasChecklistContent]);

  const isTextButtonDisabled = contentType !== "text" && isTypeLocked;
  const isChecklistButtonDisabled = contentType !== "checklist" && isTypeLocked;

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
    if (nextType === contentType) return;

    if (isTypeLocked) {
      return;
    }

    setContentType(nextType);

    if (nextType === "text") {
      setChecklistItems([createEmptyChecklistItem()]);
      return;
    }

    setDescription("");

    if (checklistItems.length === 0) {
      setChecklistItems([createEmptyChecklistItem()]);
    }
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

    delete checklistInputRefs.current[itemId];
  };

  const focusChecklistItem = (itemId: number) => {
    setTimeout(() => {
      checklistInputRefs.current[itemId]?.focus();
    }, 80);
  };

  const handleChecklistSubmit = (itemId: number) => {
    const currentIndex = checklistItems.findIndex((item) => item.id === itemId);

    if (currentIndex === -1) return;

    const currentItem = checklistItems[currentIndex];

    if (!currentItem.text.trim()) return;

    const nextExistingItem = checklistItems[currentIndex + 1];

    if (nextExistingItem) {
      focusChecklistItem(nextExistingItem.id);
      return;
    }

    const nextItem = createEmptyChecklistItem();

    setChecklistItems((currentItems) => [...currentItems, nextItem]);
    focusChecklistItem(nextItem.id);
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
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
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

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {isEditing ? "Notu Düzenle" : "Yeni Not"}
                </Text>

                <Text style={styles.description}>
                  {isEditing
                    ? "Not başlığını, tipini, içeriğini veya tarihini güncelle."
                    : "Önce not tipini seç, sonra notunu oluştur."}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.noteTypeCard}>
            <View style={styles.noteTypeHeader}>
              <View style={styles.infoIcon}>
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color={colors.purpleLight}
                />
              </View>

              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Not Tipi</Text>
                <Text style={styles.infoText}>
                  İçerik yazmaya başladıktan sonra not tipi kilitlenir.
                </Text>
              </View>
            </View>

            <View style={styles.contentTypeRow}>
              <TouchableOpacity
                activeOpacity={0.84}
                disabled={isTextButtonDisabled}
                onPress={() => selectContentType("text")}
                style={[
                  styles.contentTypeButton,
                  contentType === "text" && styles.contentTypeButtonActive,
                  isTextButtonDisabled && styles.contentTypeButtonDisabled,
                ]}
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
                activeOpacity={0.84}
                disabled={isChecklistButtonDisabled}
                onPress={() => selectContentType("checklist")}
                style={[
                  styles.contentTypeButton,
                  contentType === "checklist" && styles.contentTypeButtonActive,
                  isChecklistButtonDisabled && styles.contentTypeButtonDisabled,
                ]}
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
                    contentType === "checklist" && styles.contentTypeTextActive,
                  ]}
                >
                  Liste
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Not Başlığı</Text>

              <View style={styles.inputBox}>
                <Ionicons
                  name="sparkles-outline"
                  size={21}
                  color={colors.muted}
                  style={styles.inputIcon}
                />

                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Başlık yaz"
                  placeholderTextColor={colors.mutedLight}
                  style={styles.textInput}
                />
              </View>
            </View>

            {contentType === "text" ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Açıklama</Text>

                <View style={styles.descriptionBox}>
                  <Ionicons
                    name="document-text-outline"
                    size={21}
                    color={colors.muted}
                    style={styles.descriptionIcon}
                  />

                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Notunu yaz"
                    placeholderTextColor={colors.mutedLight}
                    style={styles.descriptionInput}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>
            ) : null}

            {contentType === "checklist" ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Liste</Text>

                <View style={styles.checklistBox}>
                  {checklistItems.map((item, index) => (
                    <View key={item.id} style={styles.checklistRow}>
                      <TouchableOpacity
                        activeOpacity={0.82}
                        onPress={() => toggleChecklistItem(item.id)}
                        style={[
                          styles.checklistCheckbox,
                          item.isCompleted && styles.checklistCheckboxActive,
                        ]}
                      >
                        {item.isCompleted ? (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={colors.background}
                          />
                        ) : null}
                      </TouchableOpacity>

                      <TextInput
                        ref={(input) => {
                          checklistInputRefs.current[item.id] = input;
                        }}
                        value={item.text}
                        onChangeText={(text) =>
                          updateChecklistItemText(item.id, text)
                        }
                        placeholder={index === 0 ? "Liste yaz" : ""}
                        placeholderTextColor={colors.mutedLight}
                        style={[
                          styles.checklistInput,
                          item.isCompleted && styles.checklistInputCompleted,
                        ]}
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => handleChecklistSubmit(item.id)}
                      />

                      {checklistItems.length > 1 ? (
                        <TouchableOpacity
                          activeOpacity={0.82}
                          onPress={() => removeChecklistItem(item.id)}
                          style={styles.removeChecklistButton}
                        >
                          <Ionicons
                            name="close"
                            size={18}
                            color={colors.muted}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  ))}
                </View>

                <Text style={styles.helperText}>
                  Klavyedeki ileri tuşuna bastığında yeni checkbox oluşur ve
                  imleç alt satıra geçer.
                </Text>
              </View>
            ) : null}

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
              title={isEditing ? "Değişiklikleri Kaydet" : "Notu Kaydet"}
              onPress={handleSave}
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
  noteTypeCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 26,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },
  noteTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
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
    gap: 8,
  },
  contentTypeButton: {
    flex: 1,
    height: 46,
    borderRadius: 17,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },
  contentTypeButtonActive: {
    backgroundColor: colors.purpleSoft,
    borderColor: colors.purpleBorder,
  },
  contentTypeButtonDisabled: {
    opacity: 0.42,
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
    minHeight: 150,
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  checklistRow: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
  },
  checklistCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  checklistCheckboxActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purpleBorder,
  },
  checklistInput: {
    flex: 1,
    minHeight: 36,
    color: colors.white,
    fontSize: 15,
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
  saveButton: {
    borderRadius: 21,
    shadowColor: colors.purple,
    shadowOpacity: 0.42,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 9 },
    elevation: 8,
  },
});
