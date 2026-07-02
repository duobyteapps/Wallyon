import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppPageHeader from "../components/ui/AppPageHeader";
import { colors } from "../constants/theme";
import { getStoredNotes, saveStoredNotes } from "../services/noteStorage";
import { Note } from "../types/note";
import { formatNoteDate } from "../utils/noteUtils";

export default function NoteDetailScreen() {
  const { noteId } = useLocalSearchParams<{ noteId?: string }>();
  const [note, setNote] = useState<Note | null>(null);

  const loadNote = useCallback(async () => {
    try {
      const notes = await getStoredNotes();

      const foundNote = notes.find(
        (currentNote) => String(currentNote.id) === String(noteId),
      );

      if (!foundNote) {
        Alert.alert("Hata", "Not bulunamadı.");
        router.back();
        return;
      }

      setNote(foundNote);
    } catch {
      Alert.alert("Hata", "Not bilgileri yüklenirken bir sorun oluştu.");
    }
  }, [noteId]);

  useFocusEffect(
    useCallback(() => {
      loadNote();
    }, [loadNote]),
  );

  const goToEdit = () => {
    if (!note) return;

    router.push({
      pathname: "/add-note",
      params: {
        noteId: String(note.id),
      },
    });
  };

  const toggleChecklistItem = async (itemId: number) => {
    if (!note || !note.checklistItems) return;

    const nextChecklistItems = note.checklistItems.map((item) =>
      item.id === itemId
        ? {
            ...item,
            isCompleted: !item.isCompleted,
          }
        : item,
    );

    const nextIsCompleted =
      nextChecklistItems.length > 0 &&
      nextChecklistItems.every((item) => item.isCompleted);

    const updatedNote: Note = {
      ...note,
      checklistItems: nextChecklistItems,
      isCompleted: nextIsCompleted,
    };

    setNote(updatedNote);

    try {
      const notes = await getStoredNotes();

      const updatedNotes = notes.map((currentNote) =>
        String(currentNote.id) === String(note.id) ? updatedNote : currentNote,
      );

      await saveStoredNotes(updatedNotes);
    } catch {
      Alert.alert("Hata", "Liste maddesi güncellenirken bir sorun oluştu.");
      loadNote();
    }
  };

  const isChecklistNote =
    note?.contentType === "checklist" &&
    !!note.checklistItems &&
    note.checklistItems.length > 0;

  const completedChecklistCount =
    note?.checklistItems?.filter((item) => item.isCompleted).length || 0;

  const totalChecklistCount = note?.checklistItems?.length || 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <AppPageHeader
          title="Not Detayı"
          description="Notun içeriğini buradan görüntüleyebilirsin."
        />

        {note ? (
          <>
            <View style={styles.summaryCard}>
              <View style={styles.summaryTop}>
                <View style={styles.summaryIcon}>
                  <Ionicons
                    name={
                      isChecklistNote
                        ? "checkbox-outline"
                        : "document-text-outline"
                    }
                    size={24}
                    color={colors.purpleLight}
                  />
                </View>

                <View style={styles.summaryContent}>
                  <Text style={styles.summaryLabel}>
                    {isChecklistNote ? "Liste Notu" : "Açıklama Notu"}
                  </Text>

                  <Text style={styles.summaryTitle}>{note.title}</Text>
                </View>
              </View>

              <View style={styles.badgeRow}>
                <View style={styles.dateBadge}>
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={colors.purpleLight}
                  />

                  <Text style={styles.dateBadgeText}>
                    {formatNoteDate(note.date)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    note.isCompleted
                      ? styles.completedBadge
                      : styles.waitingBadge,
                  ]}
                >
                  <Ionicons
                    name={
                      note.isCompleted ? "checkmark-circle" : "time-outline"
                    }
                    size={15}
                    color={
                      note.isCompleted ? colors.income : colors.purpleLight
                    }
                  />

                  <Text
                    style={[
                      styles.statusBadgeText,
                      note.isCompleted
                        ? styles.completedBadgeText
                        : styles.waitingBadgeText,
                    ]}
                  >
                    {note.isCompleted ? "Tamamlandı" : "Devam Ediyor"}
                  </Text>
                </View>
              </View>

              {isChecklistNote ? (
                <View style={styles.progressBox}>
                  <View style={styles.progressTextRow}>
                    <Text style={styles.progressLabel}>Liste ilerlemesi</Text>

                    <Text style={styles.progressValue}>
                      {completedChecklistCount}/{totalChecklistCount}
                    </Text>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width:
                            totalChecklistCount > 0
                              ? `${Math.round(
                                  (completedChecklistCount /
                                    totalChecklistCount) *
                                    100,
                                )}%`
                              : "0%",
                        },
                      ]}
                    />
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.contentCard}>
              <View style={styles.contentHeader}>
                <Text style={styles.contentTitle}>
                  {isChecklistNote ? "Liste Maddeleri" : "Not Açıklaması"}
                </Text>

                {isChecklistNote ? (
                  <Text style={styles.contentHint}>Tiklemek için dokun</Text>
                ) : null}
              </View>

              {isChecklistNote ? (
                <View style={styles.checklistWrapper}>
                  {note.checklistItems!.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.85}
                      onPress={() => toggleChecklistItem(item.id)}
                      style={[
                        styles.checklistRow,
                        item.isCompleted && styles.checklistRowCompleted,
                      ]}
                    >
                      <View
                        style={[
                          styles.checklistCheckbox,
                          item.isCompleted && styles.checklistCheckboxCompleted,
                        ]}
                      >
                        {item.isCompleted ? (
                          <Ionicons
                            name="checkmark"
                            size={15}
                            color={colors.white}
                          />
                        ) : null}
                      </View>

                      <Text
                        style={[
                          styles.checklistText,
                          item.isCompleted && styles.checklistTextCompleted,
                        ]}
                      >
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : note.description ? (
                <Text style={styles.noteDescription}>{note.description}</Text>
              ) : (
                <Text style={styles.emptyDescription}>
                  Bu notta açıklama bulunmuyor.
                </Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={goToEdit}
              style={styles.editActionButton}
            >
              <View style={styles.editActionIcon}>
                <Ionicons
                  name="create-outline"
                  size={19}
                  color={colors.purpleLight}
                />
              </View>

              <Text style={styles.editActionText}>Notu Düzenle</Text>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.mutedLight}
              />
            </TouchableOpacity>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },

  summaryCard: {
    marginTop: 24,
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

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 52,
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  summaryContent: {
    flex: 1,
    minWidth: 0,
  },

  summaryLabel: {
    color: colors.purpleLight,
    fontSize: 11,
    fontWeight: "900",
    marginBottom: 5,
  },

  summaryTitle: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: -0.3,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 18,
  },

  dateBadge: {
    height: 31,
    paddingHorizontal: 11,
    borderRadius: 999,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dateBadgeText: {
    color: colors.purpleLight,
    fontSize: 11,
    fontWeight: "900",
  },

  statusBadge: {
    height: 31,
    paddingHorizontal: 11,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  completedBadge: {
    backgroundColor: colors.incomeSoft,
    borderColor: colors.incomeBorder,
  },

  waitingBadge: {
    backgroundColor: colors.purpleSoft,
    borderColor: colors.purpleBorder,
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: "900",
  },

  completedBadgeText: {
    color: colors.income,
  },

  waitingBadgeText: {
    color: colors.purpleLight,
  },

  progressBox: {
    marginTop: 18,
    padding: 13,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  progressTextRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  progressLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },

  progressValue: {
    color: colors.purpleLight,
    fontSize: 12,
    fontWeight: "900",
  },

  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.panel,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.purple,
  },

  contentCard: {
    marginTop: 18,
    padding: 18,
    borderRadius: 30,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  contentHeader: {
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  contentTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },

  contentHint: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },

  noteDescription: {
    color: colors.mutedLight,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "600",
  },

  emptyDescription: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },

  checklistWrapper: {
    gap: 9,
  },

  checklistRow: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  checklistRowCompleted: {
    backgroundColor: colors.incomeSoft,
    borderColor: colors.incomeBorder,
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

  checklistCheckboxCompleted: {
    backgroundColor: colors.income,
    borderColor: colors.incomeBorder,
  },

  checklistText: {
    flex: 1,
    color: colors.mutedLight,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  },

  checklistTextCompleted: {
    color: colors.muted,
    textDecorationLine: "line-through",
  },

  editActionButton: {
    marginTop: 18,
    minHeight: 58,
    paddingHorizontal: 15,
    borderRadius: 22,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.purple,
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  editActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  editActionText: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },
});
