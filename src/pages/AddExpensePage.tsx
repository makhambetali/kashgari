import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Expense } from '../types/expense';
import { ExpenseForm } from '../components/ExpenseForm';

export const AddExpensePage = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);

  const handleSaveNewExpense = (expenseData: Omit<Expense, 'id' | 'date' | 'geolocation'>) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    
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
        let errorMessage = '❌ Unknown error. Please try again.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '❌ Geolocation access denied. Please check browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '❌ Location information is unavailable. Please check your network.';
            break;
          case error.TIMEOUT:
            errorMessage = '❌ Geolocation request timed out. Please try again.';
            break;
        }
        alert(errorMessage);
      },
      options
    );
  };

  return <ExpenseForm onSave={handleSaveNewExpense} />;
};