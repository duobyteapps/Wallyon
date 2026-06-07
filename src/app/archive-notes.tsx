import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ArchiveHeader from "../components/archive/ArchiveHeader";
import ArchiveSummaryCard from "../components/archive/ArchiveSummaryCard";
import NoteDateGroup from "../components/notes/NoteDateGroup";
import NoteEmptyState from "../components/notes/NoteEmptyState";
import { colors } from "../constants/theme";
import { getStoredNotes, saveStoredNotes } from "../services/noteStorage";
import { Note } from "../types/note";
import {
    getArchiveMonthlyData,
    getArchivedNotes,
    getFilteredArchivedNotes,
} from "../utils/archiveNoteHelpers";
import { groupNotesByDate } from "../utils/noteUtils";

export default function ArchiveNotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);
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
          Alert.alert("Hata", "Arşiv notları yüklenirken bir sorun oluştu.");
        }
      };

      loadNotes();
    }, []),
  );

  const archivedNotes = useMemo(() => {
    return getArchivedNotes(notes);
  }, [notes]);

  const archiveMonthlyData = useMemo(() => {
    return getArchiveMonthlyData(archivedNotes);
  }, [archivedNotes]);

  const filteredArchivedNotes = useMemo(() => {
    return getFilteredArchivedNotes(archivedNotes, selectedMonthKey);
  }, [archivedNotes, selectedMonthKey]);

  const archiveNoteGroups = useMemo(() => {
    return groupNotesByDate(filteredArchivedNotes).sort((a, b) =>
      b.date.localeCompare(a.date),
    );
  }, [filteredArchivedNotes]);

  const handleSelectMonth = (monthKey: string) => {
    setSelectedMonthKey(monthKey);
    setExpandedGroups({});
  };

  const handleClearFilter = () => {
    setSelectedMonthKey(null);
    setExpandedGroups({});
  };

  const toggleArchiveGroup = (date: string) => {
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
    Alert.alert("Notu Sil", "Bu arşiv notunu silmek istiyor musun?", [
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
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <ArchiveHeader />

        <ArchiveSummaryCard
          monthlyData={archiveMonthlyData}
          selectedMonthKey={selectedMonthKey}
          filteredNoteCount={filteredArchivedNotes.length}
          onSelectMonth={handleSelectMonth}
          onClearFilter={handleClearFilter}
        />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Geçmiş Notlar</Text>

            <Text style={styles.sectionCount}>
              {filteredArchivedNotes.length}
            </Text>
          </View>

          {archiveNoteGroups.length > 0 ? (
            archiveNoteGroups.map((group) => (
              <NoteDateGroup
                key={group.date}
                group={group}
                isExpanded={!!expandedGroups[group.date]}
                onToggleGroup={toggleArchiveGroup}
                onToggleNote={toggleNote}
                onDeleteNote={deleteNote}
              />
            ))
          ) : (
            <NoteEmptyState
              title={
                selectedMonthKey
                  ? "Bu ayda arşivlenmiş not yok"
                  : "Arşivlenmiş not yok"
              }
              description={
                selectedMonthKey
                  ? "Seçtiğin ay için geçmiş not bulunamadı."
                  : "Tarihi geçen notlar otomatik olarak arşivde görünecek."
              }
            />
          )}
        </View>
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
});
