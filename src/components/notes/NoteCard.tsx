import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "../../constants/theme";
import { Note } from "../../types/note";
import { getNoteBadgeText } from "../../utils/noteUtils";

type NoteCardProps = {
  note: Note;
  type: "today" | "future";
  onToggle: (noteId: number) => void;
  onEdit: (noteId: number) => void;
  onDelete: (noteId: number) => void;
  onToggleChecklistItem: (noteId: number, itemId: number) => void;
};

function getManualLinePreview(description: string) {
  const manualLines = description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (manualLines.length <= 2) {
    return description;
  }

  return `${manualLines.slice(0, 2).join("\n")}\n...`;
}

export default function NoteCard({
  note,
  type,
  onToggle,
  onEdit,
  onDelete,
  onToggleChecklistItem,
}: NoteCardProps) {
  const isFuture = type === "future";
  const [descriptionPreview, setDescriptionPreview] = useState(
    note.description || "",
  );

  const isChecklistNote =
    note.contentType === "checklist" &&
    !!note.checklistItems &&
    note.checklistItems.length > 0;

  const visibleChecklistItems = isChecklistNote
    ? note.checklistItems!.slice(0, 3)
    : [];

  const hiddenChecklistItemCount = isChecklistNote
    ? note.checklistItems!.length - visibleChecklistItems.length
    : 0;

  useEffect(() => {
    setDescriptionPreview(note.description || "");
  }, [note.description]);

  const handleDescriptionLayout = (event: any) => {
    if (!note.description) return;

    const lines = event.nativeEvent.lines;

    if (lines.length <= 2) {
      return;
    }

    const firstTwoLines = lines
      .slice(0, 2)
      .map((line: { text: string }) => line.text.trim())
      .filter(Boolean);

    const nextPreview = `${firstTwoLines.join("\n")}\n...`;

    if (nextPreview !== descriptionPreview) {
      setDescriptionPreview(nextPreview);
    }
  };

  const visibleDescription = note.description
    ? getManualLinePreview(descriptionPreview)
    : "";

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

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.8}
              onPress={(event) => {
                event.stopPropagation();
                onEdit(note.id);
              }}
            >
              <Ionicons
                name="create-outline"
                size={17}
                color={colors.purpleLight}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.8}
              onPress={(event) => {
                event.stopPropagation();
                onDelete(note.id);
              }}
            >
              <Ionicons name="trash-outline" size={17} color={colors.expense} />
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={[
            styles.noteTitle,
            note.isCompleted && styles.noteTitleCompleted,
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {note.title}
        </Text>

        {isChecklistNote ? (
          <View style={styles.checklistPreview}>
            {visibleChecklistItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistPreviewRow}
                activeOpacity={0.8}
                onPress={(event) => {
                  event.stopPropagation();
                  onToggleChecklistItem(note.id, item.id);
                }}
              >
                <View
                  style={[
                    styles.checklistPreviewBox,
                    item.isCompleted && styles.checklistPreviewBoxCompleted,
                  ]}
                >
                  {item.isCompleted ? (
                    <Ionicons name="checkmark" size={12} color={colors.white} />
                  ) : null}
                </View>

                <Text
                  style={[
                    styles.checklistPreviewText,
                    item.isCompleted && styles.checklistPreviewTextCompleted,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.text}
                </Text>
              </TouchableOpacity>
            ))}

            {hiddenChecklistItemCount > 0 ? (
              <Text style={styles.checklistMoreText}>
                +{hiddenChecklistItemCount} madde daha
              </Text>
            ) : null}
          </View>
        ) : note.description ? (
          <Text
            style={styles.noteDescription}
            onTextLayout={handleDescriptionLayout}
          >
            {visibleDescription}
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
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editButton: {
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    alignItems: "center",
    justifyContent: "center",
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
  checklistPreview: {
    marginTop: 7,
  },
  checklistPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  checklistPreviewBox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    backgroundColor: colors.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checklistPreviewBoxCompleted: {
    backgroundColor: colors.income,
    borderColor: colors.incomeBorder,
  },
  checklistPreviewText: {
    flex: 1,
    color: colors.mutedLight,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  checklistPreviewTextCompleted: {
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  checklistMoreText: {
    marginTop: 6,
    marginLeft: 30,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "700",
  },
});
