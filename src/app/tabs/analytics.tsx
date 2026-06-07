import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AnalyticsHeader from "../../components/analytics/AnalyticsHeader";
import MonthlySummaryCard from "../../components/analytics/MonthlySummaryCard";
import MonthlyTransactionDetails from "../../components/analytics/MonthlyTransactionDetails";
import { colors } from "../../constants/theme";
import { Transaction } from "../../types/transaction";
import { getMonthlyAnalyticsData } from "../../utils/analyticsHelpers";

const TRANSACTIONS_STORAGE_KEY = "WALLYON_TRANSACTIONS";

export default function AnalyticsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadTransactions = async () => {
        try {
          const storedTransactions = await AsyncStorage.getItem(
            TRANSACTIONS_STORAGE_KEY,
          );

          if (!storedTransactions) {
            setTransactions([]);
            return;
          }

          const parsedTransactions = JSON.parse(storedTransactions);

          if (Array.isArray(parsedTransactions)) {
            setTransactions(parsedTransactions as Transaction[]);
            return;
          }

          setTransactions([]);
        } catch (error) {
          console.log("Analytics transactions could not be loaded:", error);
          setTransactions([]);
        }
      };

      loadTransactions();
    }, []),
  );

  const monthlyData = useMemo(() => {
    return getMonthlyAnalyticsData(transactions);
  }, [transactions]);

  useEffect(() => {
    if (monthlyData.length === 0) {
      setSelectedMonthKey(null);
      return;
    }

    const selectedMonthStillExists = monthlyData.some(
      (item) => item.monthKey === selectedMonthKey,
    );

    if (!selectedMonthKey || !selectedMonthStillExists) {
      setSelectedMonthKey(monthlyData[0].monthKey);
    }
  }, [monthlyData, selectedMonthKey]);

  const selectedMonthData = useMemo(() => {
    if (!selectedMonthKey) return null;

    return (
      monthlyData.find((item) => item.monthKey === selectedMonthKey) || null
    );
  }, [monthlyData, selectedMonthKey]);

  const handleSelectMonth = (monthKey: string) => {
    setSelectedMonthKey(monthKey);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <AnalyticsHeader />

        <MonthlySummaryCard
          monthlyData={monthlyData}
          selectedMonthKey={selectedMonthKey}
          onSelectMonth={handleSelectMonth}
        />

        <MonthlyTransactionDetails selectedMonthData={selectedMonthData} />
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
    paddingBottom: 20,
  },
});
