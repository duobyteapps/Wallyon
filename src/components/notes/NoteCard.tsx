import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";
import { Note } from "../../types/note";
import { getNoteBadgeText } from "../../utils/noteUtils";

type NoteCardProps = {
  note: Note;
  type: "today" | "future";
  onToggle: (noteId: number) => void;
  onDelete: (noteId: number) => void;
};

export default function NoteCard({
  note,
  type,
  onToggle,
  onDelete,
}: NoteCardProps) {
  const isFuture = type === "future";

  return (
    <TouchableOpacity
      style={[styles.noteCard, note.isCompleted && styles.noteCardCompleted]}
      activeOpacity={0.85}
      onPress={() => onToggle(note.id)}
    >
      <View style={styles.noteLeft}>
        <View
          style={[
            styles.checkBox,
            note.isCompleted && styles.checkBoxCompleted,
          ]}
        >
          {note.isCompleted ? (
            <Ionicons name="checkmark" size={17} color={colors.white} />
          ) : null}
        </View>

        <View style={styles.line} />
      </View>

      <View style={styles.noteContent}>
        <View style={styles.noteHeader}>
          <View
            style={[
              styles.statusBadge,
              isFuture ? styles.futureBadge : styles.todayBadge,
            ]}
          >
            <Ionicons
              name={isFuture ? "time-outline" : "sunny-outline"}
              size={12}
              color={isFuture ? colors.purpleLight : colors.income}
            />

            <Text
              style={[
                styles.statusBadgeText,
                isFuture ? styles.futureBadgeText : styles.todayBadgeText,
              ]}
            >
              {getNoteBadgeText(note.date)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.8}
            onPress={() => onDelete(note.id)}
          >
            <Ionicons name="trash-outline" size={17} color={colors.expense} />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.noteTitle,
            note.isCompleted && styles.noteTitleCompleted,
          ]}
          numberOfLines={2}
        >
          {note.title}
        </Text>

        {note.description ? (
          <Text style={styles.noteDescription} numberOfLines={2}>
            {note.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    marginBottom: 13,
    padding: 15,
    borderRadius: 28,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    flexDirection: "row",
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOpacity: 0.11,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 4,
  },
  noteCardCompleted: {
    opacity: 0.68,
  },
  noteLeft: {
    width: 34,
    alignItems: "center",
    marginRight: 12,
  },
  checkBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBoxCompleted: {
    backgroundColor: colors.income,
    borderColor: colors.incomeBorder,
  },
  line: {
    flex: 1,
    width: 1,
    marginTop: 8,
    backgroundColor: colors.panelBorder,
  },
  noteContent: {
    flex: 1,
  },
  noteHeader: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    height: 27,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
  },
  todayBadge: {
    backgroundColor: colors.incomeSoft,
    borderWidth: 1,
    borderColor: colors.incomeBorder,
  },
  futureBadge: {
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  statusBadgeText: {
    marginLeft: 5,
    fontSize: 10,
    fontWeight: "900",
  },
  todayBadgeText: {
    color: colors.income,
  },
  futureBadgeText: {
    color: colors.purpleLight,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: colors.expenseSoft,
    borderWidth: 1,
    borderColor: colors.expenseBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  noteTitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "900",
  },
  noteTitleCompleted: {
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  noteDescription: {
    marginTop: 7,
    color: colors.mutedLight,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
});
