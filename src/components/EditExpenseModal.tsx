import React from 'react';
import type { Expense } from '../types/expense';
import { ExpenseForm } from './ExpenseForm';
import './EditExpenseModal.css';

interface EditExpenseModalProps {
  expense: Expense | null;
  onUpdate: (updatedExpense: Expense) => void;
  onClose: () => void;
}

export const EditExpenseModal = ({ expense, onUpdate, onClose }: EditExpenseModalProps) => {
  if (!expense) return null;

  const handleSaveChanges = (expenseData: Omit<Expense, 'id' | 'date' | 'geolocation'>, originalExpense?: Expense) => {
    if (originalExpense) {
      const updatedExpense: Expense = {
        ...originalExpense, 
        ...expenseData,   
      };
      onUpdate(updatedExpense);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <ExpenseForm 
          expenseToEdit={expense} 
          onSave={handleSaveChanges} 
          onCancel={onClose} 
        />
      </div>
    </div>
  );
};