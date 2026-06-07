import AsyncStorage from "@react-native-async-storage/async-storage";

import { STORAGE_KEYS } from "../constants/storageKeys";

export const getStoredUserName = async () => {
  return await AsyncStorage.getItem(STORAGE_KEYS.userName);
};

export const saveStoredUserName = async (name: string) => {
  await AsyncStorage.setItem(STORAGE_KEYS.userName, name);
};

export const removeStoredUserName = async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.userName);
};

export const deleteProfileStorage = async () => {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.userName,
    STORAGE_KEYS.transactions,
    STORAGE_KEYS.notes,
    STORAGE_KEYS.incomeFields,
    STORAGE_KEYS.expenseFields,
    STORAGE_KEYS.investmentFields,
  ]);
};
