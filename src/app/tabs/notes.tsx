import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NoteCard from "../../components/notes/NoteCard";
import NoteDateGroup from "../../components/notes/NoteDateGroup";
import NoteEmptyState from "../../components/notes/NoteEmptyState";
import NoteProgressCard from "../../components/notes/NoteProgressCard";
import NotesHeader from "../../components/notes/NotesHeader";
import AppIconButton from "../../components/ui/AppIconButton";
import { colors } from "../../constants/theme";
import { getStoredNotes, saveStoredNotes } from "../../services/noteStorage";
import { Note } from "../../types/note";
import {
  getCompletedCount,
  getTodayKey,
  groupNotesByDate,
} from "../../utils/noteUtils";

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        try {
          const storedNotes = await getStoredNotes();
          setNotes(storedNotes);
        } catch {
          Alert.alert("Hata", "Notlar yüklenirken bir sorun oluştu.");
        }
      };

      loadNotes();
    }, []),
  );

  const todayNotes = useMemo(() => {
    const today = getTodayKey();

    return notes
      .filter((note) => note.date === today)
      .sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }, [notes]);

  const futureNotes = useMemo(() => {
    const today = getTodayKey();

    return notes.filter((note) => note.date > today);
  }, [notes]);

  const futureNoteGroups = useMemo(() => {
    return groupNotesByDate(futureNotes);
  }, [futureNotes]);

  const completedTodayCount = useMemo(() => {
    return getCompletedCount(todayNotes);
  }, [todayNotes]);

  const progressPercent = useMemo(() => {
    if (todayNotes.length === 0) return 0;

    return Math.round((completedTodayCount / todayNotes.length) * 100);
  }, [completedTodayCount, todayNotes.length]);

  const toggleFutureGroup = (date: string) => {
    setExpandedGroups((currentGroups) => ({
      ...currentGroups,
      [date]: !currentGroups[date],
    }));
  };

  const toggleNote = async (noteId: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isCompleted: !note.isCompleted } : note,
    );

    setNotes(updatedNotes);

    try {
      await saveStoredNotes(updatedNotes);
    } catch {
      Alert.alert("Hata", "Not güncellenirken bir sorun oluştu.");
    }
  };

  const deleteNote = (noteId: number) => {
    Alert.alert("Notu Sil", "Bu notu silmek istiyor musun?", [
      {
        text: "Vazgeç",
        style: "cancel",
      },
      {
        text: "Sil",
        style: "destructive",
        onPress: async () => {
          const updatedNotes = notes.filter((note) => note.id !== noteId);
          setNotes(updatedNotes);

          try {
            await saveStoredNotes(updatedNotes);
          } catch {
            Alert.alert("Hata", "Not silinirken bir sorun oluştu.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.screen}>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          <NotesHeader onArchivePress={() => router.push("/archive-notes")} />

          <NoteProgressCard
            todayCount={todayNotes.length}
            futureCount={futureNotes.length}
            completedTodayCount={completedTodayCount}
            progressPercent={progressPercent}
          />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Günün Notları</Text>
              <Text style={styles.sectionCount}>{todayNotes.length}</Text>
            </View>

            {todayNotes.length > 0 ? (
              todayNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  type="today"
                  onToggle={toggleNote}
                  onDelete={deleteNote}
                />
              ))
            ) : (
              <NoteEmptyState
                title="Bugün için not yok"
                description="Yeni bir yapılacak ekleyerek günü planlamaya başlayabilirsin."
              />
            )}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Planlanan Notlar</Text>
              <Text style={styles.sectionCount}>{futureNotes.length}</Text>
            </View>

            {futureNoteGroups.length > 0 ? (
              futureNoteGroups.map((group) => (
                <NoteDateGroup
                  key={group.date}
                  group={group}
                  isExpanded={!!expandedGroups[group.date]}
                  onToggleGroup={toggleFutureGroup}
                  onToggleNote={toggleNote}
                  onDeleteNote={deleteNote}
                />
              ))
            ) : (
              <NoteEmptyState
                title="Planlanmış not yok"
                description="İleri tarihli bir iş eklediğinde tarihine göre burada görünecek."
              />
            )}
          </View>
        </ScrollView>

        <AppIconButton
          icon="create-outline"
          onPress={() => router.push("/add-note")}
          size={58}
          iconSize={27}
          iconColor={colors.purpleLight}
          backgroundColor={colors.purpleSoft}
          borderColor={colors.purpleBorder}
          style={styles.floatingAddButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    position: "relative",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 26,
  },
  sectionHeader: {
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
  },
  sectionCount: {
    minWidth: 32,
    height: 28,
    borderRadius: 999,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    color: colors.mutedLight,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 12,
    fontWeight: "900",
  },
  floatingAddButton: {
    position: "absolute",
    right: 22,
    bottom: 24,
    borderRadius: 22,
    shadowColor: colors.purple,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
});
