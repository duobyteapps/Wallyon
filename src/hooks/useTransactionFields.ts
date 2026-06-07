import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { STORAGE_KEYS } from "../constants/storageKeys";
import { defaultExpenseFields } from "../data/expenseFields";
import { defaultIncomeFields } from "../data/incomeFields";
import { defaultInvestmentFields } from "../data/investmentFields";

const parseStoredFields = (
  storedFields: string | null,
  defaultFields: string[],
) => {
  if (!storedFields) return defaultFields;

  try {
    const parsedFields = JSON.parse(storedFields);

    if (!Array.isArray(parsedFields)) {
      return defaultFields;
    }

    const validFields = parsedFields.filter(
      (field) => typeof field === "string" && field.trim().length > 0,
    );

    return validFields.length > 0 ? validFields : defaultFields;
  } catch {
    return defaultFields;
  }
};

const addUniqueField = (fields: string[], fieldName: string) => {
  const trimmedFieldName = fieldName.trim();

  const isAlreadyExists = fields.some(
    (field) => field.toLowerCase() === trimmedFieldName.toLowerCase(),
  );

  if (isAlreadyExists) {
    return fields;
  }

  return [...fields, trimmedFieldName];
};

const deleteField = (fields: string[], fieldName: string) => {
  return fields.filter((field) => field !== fieldName);
};

export const useTransactionFields = () => {
  const [isFieldsStorageLoaded, setIsFieldsStorageLoaded] = useState(false);

  const [incomeFields, setIncomeFields] = useState(defaultIncomeFields);
  const [expenseFields, setExpenseFields] = useState(defaultExpenseFields);
  const [investmentFields, setInvestmentFields] = useState(
    defaultInvestmentFields,
  );

  useEffect(() => {
    const loadFields = async () => {
      try {
        const [
          storedIncomeFields,
          storedExpenseFields,
          storedInvestmentFields,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.incomeFields),
          AsyncStorage.getItem(STORAGE_KEYS.expenseFields),
          AsyncStorage.getItem(STORAGE_KEYS.investmentFields),
        ]);

        setIncomeFields(
          parseStoredFields(storedIncomeFields, defaultIncomeFields),
        );

        setExpenseFields(
          parseStoredFields(storedExpenseFields, defaultExpenseFields),
        );

        setInvestmentFields(
          parseStoredFields(storedInvestmentFields, defaultInvestmentFields),
        );
      } catch (error) {
        console.log("Transaction fields could not be loaded:", error);

        setIncomeFields(defaultIncomeFields);
        setExpenseFields(defaultExpenseFields);
        setInvestmentFields(defaultInvestmentFields);
      } finally {
        setIsFieldsStorageLoaded(true);
      }
    };

    loadFields();
  }, []);

  useEffect(() => {
    if (!isFieldsStorageLoaded) return;

    const saveFields = async () => {
      try {
        await Promise.all([
          AsyncStorage.setItem(
            STORAGE_KEYS.incomeFields,
            JSON.stringify(incomeFields),
          ),
          AsyncStorage.setItem(
            STORAGE_KEYS.expenseFields,
            JSON.stringify(expenseFields),
          ),
          AsyncStorage.setItem(
            STORAGE_KEYS.investmentFields,
            JSON.stringify(investmentFields),
          ),
        ]);
      } catch (error) {
        console.log("Transaction fields could not be saved:", error);
      }
    };

    saveFields();
  }, [incomeFields, expenseFields, investmentFields, isFieldsStorageLoaded]);

  const handleAddIncomeField = (fieldName: string) => {
    setIncomeFields((currentFields) =>
      addUniqueField(currentFields, fieldName),
    );
  };

  const handleDeleteIncomeField = (fieldName: string) => {
    setIncomeFields((currentFields) => deleteField(currentFields, fieldName));
  };

  const handleAddExpenseField = (fieldName: string) => {
    setExpenseFields((currentFields) =>
      addUniqueField(currentFields, fieldName),
    );
  };

  const handleDeleteExpenseField = (fieldName: string) => {
    setExpenseFields((currentFields) => deleteField(currentFields, fieldName));
  };

  const handleAddInvestmentField = (fieldName: string) => {
    setInvestmentFields((currentFields) =>
      addUniqueField(currentFields, fieldName),
    );
  };

  const handleDeleteInvestmentField = (fieldName: string) => {
    setInvestmentFields((currentFields) =>
      deleteField(currentFields, fieldName),
    );
  };

  return {
    incomeFields,
    expenseFields,
    investmentFields,
    handleAddIncomeField,
    handleDeleteIncomeField,
    handleAddExpenseField,
    handleDeleteExpenseField,
    handleAddInvestmentField,
    handleDeleteInvestmentField,
  };
};
