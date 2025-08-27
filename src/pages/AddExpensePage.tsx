import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Expense } from '../types/expense';
import CurrencyInput from 'react-currency-input-field';
import './AddExpensePage.css';


const categories = [
  { name: 'Food & Dining', icon: '🍔' },
  { name: 'Transportation', icon: '🚗' },
  { name: 'Education', icon: '📚' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Other', icon: '📎' },
];

export const AddExpensePage = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [amount, setAmount] = useState<string | undefined>('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) === 0) {
      setMessage('Please enter a valid amount.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsSaving(true);
    setMessage('Getting location...');

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(

      (position) => {
        const newExpense: Expense = {
          id: crypto.randomUUID(),
          amount: parseFloat(amount),
          note,
          category,
          date: new Date().toISOString(),
          geolocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        };

        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
        
        setAmount('');
        setNote('');
        setCategory(categories[0].name);
        setMessage('✅ Expense added successfully!');
        setTimeout(() => setMessage(''), 3000);
        setIsSaving(false);
      },

      (error) => {
        console.error("Geolocation error:", error);
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
        setMessage(errorMessage);
        setTimeout(() => setMessage(''), 5000);
        setIsSaving(false);
      },

      options
    );
  };

  return (
    <div className="add-expense-container">
      <h1>Add New Expense</h1>
      <form onSubmit={handleSubmit} className="expense-form">
        
        <div className="amount-input-wrapper">
          <CurrencyInput
            id="amount-input"
            name="amount"
            placeholder="0.00"
            prefix="$"
            decimalsLimit={2}
            value={amount}
            onValueChange={(value) => setAmount(value)}
            className="amount-input"
            autoComplete="off"
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
        
        <button type="submit" className="save-btn" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Expense'}
        </button>
      </form>
      {message && <p className="status-message">{message}</p>}
    </div>
  );
};