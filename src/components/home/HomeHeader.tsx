import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../constants/theme";
import { Note } from "../../types/note";

type HomeHeaderProps = {
  name?: string;
  dueNotes?: Note[];
  onOpenNotesPress?: () => void;
  onReadDueNotifications?: (noteIds: number[]) => void;
};

const getTodayKey = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getNotificationTitle = (note: Note) => {
  const today = getTodayKey();

  if (note.date === today) {
    return "Bugün için bir notunuz var";
  }

  return "Planladığınız bir notun günü geldi";
};

export default function HomeHeader({
  name,
  dueNotes = [],
  onOpenNotesPress,
  onReadDueNotifications,
}: HomeHeaderProps) {
  const hasDueNotes = dueNotes.length > 0;
  const badgeText = dueNotes.length > 9 ? "9+" : String(dueNotes.length);

  const [isNotificationVisible, setIsNotificationVisible] =
    React.useState(false);

  const [visibleNotificationNotes, setVisibleNotificationNotes] =
    React.useState<Note[]>([]);

  const hasVisibleNotifications = visibleNotificationNotes.length > 0;

  const openNotifications = () => {
    setVisibleNotificationNotes(dueNotes);
    setIsNotificationVisible(true);

    if (dueNotes.length > 0) {
      onReadDueNotifications?.(dueNotes.map((note) => note.id));
    }
  };

  const closeNotifications = () => {
    setIsNotificationVisible(false);
  };

  const goToNotes = () => {
    closeNotifications();
    onOpenNotesPress?.();
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerTextArea}>
        <Text style={styles.helloText} numberOfLines={1}>
          Merhaba,
        </Text>

        <Text style={styles.welcomeText} numberOfLines={1} ellipsizeMode="tail">
          {name ? `${name}` : ""}
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.notificationButton}
        onPress={openNotifications}
      >
        <Ionicons name="notifications-outline" size={24} color={colors.white} />

        {hasDueNotes && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{badgeText}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={isNotificationVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeNotifications}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeNotifications}>
          <Pressable style={styles.notificationPanel}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Bildirimler</Text>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.closeButton}
                onPress={closeNotifications}
              >
                <Ionicons name="close" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>

            {hasVisibleNotifications ? (
              <View style={styles.notificationList}>
                {visibleNotificationNotes.map((note) => (
                  <TouchableOpacity
                    key={note.id}
                    activeOpacity={0.85}
                    style={styles.notificationItem}
                    onPress={goToNotes}
                  >
                    <View style={styles.notificationIconBox}>
                      <Ionicons
                        name="document-text-outline"
                        size={20}
                        color={colors.purpleLight}
                      />
                    </View>

                    <View style={styles.notificationTextArea}>
                      <Text style={styles.notificationTitle}>
                        {getNotificationTitle(note)}
                      </Text>

                      <Text
                        style={styles.notificationDescription}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {note.title}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={colors.mutedLight}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyNotificationBox}>
                <Ionicons
                  name="notifications-off-outline"
                  size={28}
                  color={colors.mutedLight}
                />

                <Text style={styles.emptyTitle}>Bildirim yok</Text>

                <Text style={styles.emptyDescription}>
                  Günü gelen planlı notlar burada görünecek.
                </Text>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  headerTextArea: {
    flex: 1,
    minWidth: 0,
  },

  helloText: {
    color: colors.mutedLight,
    fontSize: 18,
    fontWeight: "500",
  },

  welcomeText: {
    marginTop: 4,
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    flexShrink: 1,
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: colors.panel,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.3)",
    flexShrink: 0,
  },

  notificationBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.expense,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },

  notificationBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
    paddingHorizontal: 20,
    paddingTop: 76,
    alignItems: "flex-end",
  },

  notificationPanel: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    backgroundColor: "#030817",
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 16,
  },

  panelHeader: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  panelTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: "900",
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: colors.panel,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.panelBorder,
  },

  notificationList: {
    gap: 10,
  },

  notificationItem: {
    minHeight: 76,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  notificationIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(139, 92, 246, 0.16)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  notificationTextArea: {
    flex: 1,
    minWidth: 0,
  },

  notificationTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
  },

  notificationDescription: {
    marginTop: 4,
    color: colors.mutedLight,
    fontSize: 12,
    fontWeight: "600",
  },

  emptyNotificationBox: {
    minHeight: 150,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  emptyTitle: {
    marginTop: 10,
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  emptyDescription: {
    marginTop: 6,
    color: colors.mutedLight,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 18,
  },
});
