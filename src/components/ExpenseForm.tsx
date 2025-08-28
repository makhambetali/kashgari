import React, { useState, useEffect } from 'react';
import type { Expense } from '../types/expense';
import { categories } from '../utils/categoryStyles';
import CurrencyInput from 'react-currency-input-field';
import './ExpenseForm.css';

interface ExpenseFormProps {
  expenseToEdit?: Expense | null;
  onSave: (expenseData: Omit<Expense, 'id' | 'date' | 'geolocation'>, originalExpense?: Expense) => void;
  onCancel?: () => void;
}

export const ExpenseForm = ({ expenseToEdit, onSave, onCancel }: ExpenseFormProps) => {
  const [amount, setAmount] = useState<string | undefined>('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isEditMode = !!expenseToEdit;


  useEffect(() => {
    if (isEditMode && expenseToEdit) {
      setAmount(String(expenseToEdit.amount));
      setNote(expenseToEdit.note);
      setCategory(expenseToEdit.category);
    }
  }, [expenseToEdit, isEditMode]);

  const handleAmountChange = (value: string | undefined) => {
    if (!value) {
      setAmount(value);
      return;
    }

    setAmount(value)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) === 0) {
      setMessage('Please enter a valid amount.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsProcessing(true);
    
    const expenseData = {
        amount: parseFloat(amount),
        note,
        category,
    };
    
    onSave(expenseData, expenseToEdit || undefined);

    if (!isEditMode) {
      setAmount('');
      setNote('');
      setCategory(categories[0].name);
    }
  };

  return (
    <div className="expense-form-container">
      <h1>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h1>
      <form onSubmit={handleSubmit} className="expense-form-content">
        <div className="amount-input-wrapper">
          <CurrencyInput
            id="amount-input"
            name="amount"
            placeholder="0.00"
            prefix="$"
            decimalsLimit={2}
            value={amount}
            onValueChange={handleAmountChange} 
            className="amount-input"
            autoComplete="off"
            maxLength={6} // max length: 999 999
          />
        </div>

        <div className="category-selector">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.name}
              className={`category-btn ${category === cat.name ? 'active' : ''}`}
              onClick={() => setCategory(cat.name)}
            >
              <span className="category-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
        
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was this for?"
          required
          className="note-input"
        />
        
        <div className="form-actions">
          {onCancel && <button type="button" onClick={onCancel} className="btn-cancel">Cancel</button>}
          <button type="submit" className="save-btn" disabled={isProcessing}>
            {isProcessing ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Save Expense')}
          </button>
        </div>
      </form>
      {message && <p className="status-message">{message}</p>}
    </div>
  );
};