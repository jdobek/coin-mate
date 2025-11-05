import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type EntryType = 'expense' | 'income';

export interface Entry {
  id: string;
  type: EntryType;
  amount: number;
  currency: string;
  description: string;
  date: string; // ISO date string
}

interface ExpensesContextType {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, 'id' | 'date'>) => void;
  isLoading: boolean;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

const STORAGE_KEY = '@coin_mate_entries';

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load entries from AsyncStorage on mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Save entries to AsyncStorage whenever entries change
  useEffect(() => {
    if (!isLoading) {
      saveEntries();
    }
  }, [entries, isLoading]);

  const loadEntries = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEntries(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntries = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries:', error);
    }
  };

  const addEntry = (entry: Omit<Entry, 'id' | 'date'>) => {
    const newEntry: Entry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  };

  return (
    <ExpensesContext.Provider value={{ entries, addEntry, isLoading }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}

