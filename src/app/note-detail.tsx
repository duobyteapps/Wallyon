import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppIconButton from "../components/ui/AppIconButton";
import { colors } from "../constants/theme";
import { getStoredNotes } from "../services/noteStorage";
import { Note } from "../types/note";
import { formatNoteDate } from "../utils/noteUtils";

export default function NoteDetailScreen() {
  const params = useLocalSearchParams<{ noteId?: string }>();

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const noteId = useMemo(() => {
    if (!params.noteId) return null;

    const parsedId = Number(params.noteId);
    return Number.isNaN(parsedId) ? null : parsedId;
  }, [params.noteId]);

  useFocusEffect(
    useCallback(() => {
      const loadNote = async () => {
        if (!noteId) {
          setNote(null);
          setIsLoading(false);
          return;
        }

        try {
          setIsLoading(true);

          const storedNotes = await getStoredNotes();

          const selectedNote = storedNotes.find(
            (storedNote) => Number(storedNote.id) === noteId,
          );

          setNote(selectedNote ?? null);
        } catch {
          Alert.alert("Hata", "Not detayı yüklenirken bir sorun oluştu.");
        } finally {
          setIsLoading(false);
        }
      };

      loadNote();
    }, [noteId]),
  );

  const isChecklistNote =
    note?.contentType === "checklist" &&
    !!note.checklistItems &&
    note.checklistItems.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
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

          <View style={styles.headerTextWrapper}>
            <Text style={styles.title}>Not Detayı</Text>
            <Text style={styles.description}>
              Not içeriğini buradan görüntüleyebilirsin.
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.emptyCard}>
            <Ionicons name="hourglass-outline" size={34} color={colors.muted} />
            <Text style={styles.emptyTitle}>Not yükleniyor</Text>
            <Text style={styles.emptyText}>Not bilgileri hazırlanıyor.</Text>
          </View>
        ) : !note ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="document-text-outline"
              size={38}
              color={colors.muted}
            />
            <Text style={styles.emptyTitle}>Not bulunamadı</Text>
            <Text style={styles.emptyText}>
              Bu not silinmiş olabilir veya geçersiz bir not açılmış olabilir.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statusCard}>
              <View style={styles.statusIcon}>
                <Ionicons
                  name={note.isCompleted ? "checkmark-done" : "time-outline"}
                  size={23}
                  color={note.isCompleted ? colors.income : colors.purpleLight}
                />
              </View>

              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>
                  {note.isCompleted ? "Tamamlandı" : "Devam Ediyor"}
                </Text>

                <Text style={styles.statusDate}>
                  {formatNoteDate(note.date)}
                </Text>
              </View>
            </View>

            <View style={styles.detailCard}>
              <View style={styles.noteHeader}>
                <View style={styles.noteIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={23}
                    color={colors.purpleLight}
                  />
                </View>

                <View style={styles.noteTitleWrapper}>
                  <Text style={styles.label}>Not Başlığı</Text>
                  <Text style={styles.noteTitle}>{note.title}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {isChecklistNote ? (
                <View>
                  <Text style={styles.sectionTitle}>Kontrol Listesi</Text>

                  {note.checklistItems!.map((item) => (
                    <View key={item.id} style={styles.checklistItem}>
                      <View
                        style={[
                          styles.checklistBox,
                          item.isCompleted && styles.checklistBoxCompleted,
                        ]}
                      >
                        {item.isCompleted ? (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={colors.background}
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
                    </View>
                  ))}
                </View>
              ) : (
                <View>
                  <Text style={styles.sectionTitle}>Açıklama</Text>

                  <Text style={styles.noteDescription}>
                    {note.description?.trim()
                      ? note.description
                      : "Bu not için açıklama eklenmemiş."}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.infoCard}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={colors.purpleLight}
              />

              <Text style={styles.infoText}>
                Bu ekran sadece görüntüleme içindir. Notu değiştirmek için kalem
                ikonunu kullanabilirsin.
              </Text>
            </View>
          </>
        )}
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
  header: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  headerTextWrapper: {
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  description: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  statusCard: {
    marginTop: 26,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 26,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    width: 46,
    height: 46,
    borderRadius: 17,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "900",
  },
  statusDate: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  detailCard: {
    marginTop: 18,
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
  noteHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  noteIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  noteTitleWrapper: {
    flex: 1,
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
  },
  noteTitle: {
    marginTop: 5,
    color: colors.white,
    fontSize: 22,
    lineHeight: 29,
    fontWeight: "900",
    letterSpacing: -0.4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.panelBorder,
    marginVertical: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
  noteDescription: {
    color: colors.mutedLight,
    fontSize: 14,
    lineHeight: 23,
    fontWeight: "600",
  },
  checklistItem: {
    marginTop: 9,
    paddingHorizontal: 13,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
  },
  checklistBox: {
    width: 25,
    height: 25,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checklistBoxCompleted: {
    backgroundColor: colors.income,
    borderColor: colors.incomeBorder,
  },
  checklistText: {
    flex: 1,
    color: colors.mutedLight,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
  checklistTextCompleted: {
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  infoCard: {
    marginTop: 18,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 24,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: colors.mutedLight,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "600",
  },
  emptyCard: {
    marginTop: 34,
    padding: 22,
    borderRadius: 30,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 12,
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
  },
  emptyText: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
