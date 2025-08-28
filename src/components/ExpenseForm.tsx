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

async function fetchLocationName(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    if (data.address) {
      const addr = data.address;
      const location = addr.university || addr.college || addr.amenity || addr.shop || addr.tourism || addr.building || addr.road;
      if (location) {
        return location;
      }
    }
    
    return data.display_name ? data.display_name.split(',')[0] : 'Unknown Location';
  } catch (error) {
    console.error('Failed to fetch location name:', error);
    return 'Could not fetch location';
  }
}

export const ExpenseForm = ({ expenseToEdit, onSave, onCancel }: ExpenseFormProps) => {
  const [amount, setAmount] = useState<string | undefined>('');
  const [note, setNote] = useState('');
  const [locationName, setLocationName] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isEditMode = !!expenseToEdit;

  useEffect(() => {
    if (isEditMode && expenseToEdit) {
      setAmount(String(expenseToEdit.amount));
      setNote(expenseToEdit.note);
      setCategory(expenseToEdit.category);
      setLocationName(expenseToEdit.locationName || '');
    }
  }, [expenseToEdit, isEditMode]);

  const handleAmountChange = (value: string | undefined) => {
    setAmount(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) === 0) {
      setMessage('Please enter a valid amount.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsProcessing(true);

    if (isEditMode) {
      const expenseData = { amount: parseFloat(amount), note, category, locationName };
      onSave(expenseData, expenseToEdit || undefined);
    } else {
      setMessage('Getting coordinates...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setMessage('Determining location name...');
          const { latitude, longitude } = position.coords;

          const fetchedLocationName = await fetchLocationName(latitude, longitude);

          const expenseData = {
            amount: parseFloat(amount),
            note,
            category,
            locationName: fetchedLocationName,
          };
          onSave(expenseData);
          
          setAmount('');
          setNote('');
          setLocationName('');
          setCategory(categories[0].name);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = '❌ Geolocation error. Expense not saved.';
          setMessage(errorMessage);
          setTimeout(() => setMessage(''), 5000);
          setIsProcessing(false);
        }
      );
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
            placeholder="₸ 0.00"
            prefix="₸"
            decimalsLimit={2}
            value={amount}
            onValueChange={handleAmountChange}
            className="amount-input"
            autoComplete="off"
            maxLength={6}
          />
        </div>
        <div className="category-selector">
          {categories.map((cat) => (
            <button type="button" key={cat.name} className={`category-btn ${category === cat.name ? 'active' : ''}`} onClick={() => setCategory(cat.name)}>
              <span className="category-icon">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What was this for?" required className="note-input" />
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