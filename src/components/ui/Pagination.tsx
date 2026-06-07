import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors } from "../../constants/theme";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  if (totalPages <= 1) {
    return null;
  }

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const getVisiblePages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const visiblePages = getVisiblePages();

  const handlePreviousPage = () => {
    if (isFirstPage) return;

    onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (isLastPage) return;

    onPageChange(currentPage + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageInfoText}>
        Sayfa <Text style={styles.pageInfoCurrent}>{currentPage}</Text> /{" "}
        {totalPages}
      </Text>

      <View style={styles.paginationRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isFirstPage}
          onPress={handlePreviousPage}
          style={[styles.arrowButton, isFirstPage && styles.disabledButton]}
        >
          <Ionicons
            name="chevron-back"
            size={16}
            color={isFirstPage ? colors.label : colors.white}
          />
        </TouchableOpacity>

        {visiblePages.map((page) => {
          const isActive = page === currentPage;

          return (
            <TouchableOpacity
              key={page}
              activeOpacity={0.85}
              onPress={() => onPageChange(page)}
              style={[styles.pageButton, isActive && styles.activePageButton]}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  isActive && styles.activePageButtonText,
                ]}
              >
                {page}
              </Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isLastPage}
          onPress={handleNextPage}
          style={[styles.arrowButton, isLastPage && styles.disabledButton]}
        >
          <Ionicons
            name="chevron-forward"
            size={16}
            color={isLastPage ? colors.label : colors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: "center",
    gap: 12,
  },

  pageInfoText: {
    color: colors.label,
    fontSize: 13,
    fontWeight: "700",
  },

  pageInfoCurrent: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },

  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexWrap: "wrap",
  },

  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.4,
  },

  pageButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: "rgba(15, 23, 42, 0.72)",
    alignItems: "center",
    justifyContent: "center",
  },

  activePageButton: {
    borderColor: colors.purple,
    backgroundColor: colors.purple,
  },

  pageButtonText: {
    color: colors.label,
    fontSize: 14,
    fontWeight: "900",
  },

  activePageButtonText: {
    color: colors.white,
  },
});
