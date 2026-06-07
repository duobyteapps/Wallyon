import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";
import { Note } from "../../types/note";
import { NoteGroup, formatNoteDate } from "../../utils/noteUtils";
import NoteCard from "./NoteCard";

type NoteDateGroupProps = {
  group: NoteGroup;
  isExpanded: boolean;
  onToggleGroup: (date: string) => void;
  onToggleNote: (noteId: number) => void;
  onDeleteNote: (noteId: number) => void;
};

export default function NoteDateGroup({
  group,
  isExpanded,
  onToggleGroup,
  onToggleNote,
  onDeleteNote,
}: NoteDateGroupProps) {
  return (
    <View style={styles.dateGroup}>
      <TouchableOpacity
        style={[
          styles.dateGroupHeader,
          isExpanded && styles.dateGroupHeaderActive,
        ]}
        activeOpacity={0.85}
        onPress={() => onToggleGroup(group.date)}
      >
        <View style={styles.dateGroupIcon}>
          <Ionicons name="calendar-outline" size={15} color={colors.purple} />
        </View>

        <View style={styles.dateGroupTextWrapper}>
          <Text style={styles.dateGroupTitle}>
            {formatNoteDate(group.date)}
          </Text>
          <Text style={styles.dateGroupDescription}>
            {group.notes.length} not planlandı
          </Text>
        </View>

        <View style={styles.dateGroupRight}>
          <Text style={styles.dateGroupCount}>{group.notes.length}</Text>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.muted}
          />
        </View>
      </TouchableOpacity>

      {isExpanded ? (
        <View style={styles.dateGroupContent}>
          {group.notes.map((note: Note) => (
            <NoteCard
              key={note.id}
              note={note}
              type="future"
              onToggle={onToggleNote}
              onDelete={onDeleteNote}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dateGroup: {
    marginBottom: 13,
  },
  dateGroupHeader: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "center",
  },
  dateGroupHeaderActive: {
    borderColor: colors.purpleBorder,
    backgroundColor: colors.purpleSoft,
  },
  dateGroupIcon: {
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  dateGroupTextWrapper: {
    flex: 1,
  },
  dateGroupTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
  dateGroupDescription: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  dateGroupRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateGroupCount: {
    minWidth: 26,
    height: 24,
    borderRadius: 999,
    backgroundColor: colors.background,
    color: colors.mutedLight,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 11,
    fontWeight: "900",
  },
  dateGroupContent: {
    marginTop: 10,
  },
});
