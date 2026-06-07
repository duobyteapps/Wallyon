import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { Note } from "../types/note";

export const getStoredNotes = async (): Promise<Note[]> => {
  const storedNotes = await AsyncStorage.getItem(STORAGE_KEYS.notes);

  if (!storedNotes) return [];

  const parsedNotes = JSON.parse(storedNotes);

  if (!Array.isArray(parsedNotes)) return [];

  return parsedNotes;
};

export const saveStoredNotes = async (notes: Note[]) => {
  await AsyncStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes));
};
