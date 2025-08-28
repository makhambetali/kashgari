import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Expense } from '../types/expense';
import { ExpenseForm } from '../components/ExpenseForm';

export const AddExpensePage = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);

  const handleSaveNewExpense = (expenseData: Omit<Expense, 'id' | 'date' | 'geolocation'>) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newExpense: Expense = {
          ...expenseData,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          geolocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        };
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
        alert('✅ Expense added successfully!');
      },
      (error) => {
        alert(`❌ Geolocation error: ${error.message}`);
      }
    );
  };

  return <ExpenseForm onSave={handleSaveNewExpense} />;
};