import { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Expense } from '../types/expense';
import { format, startOfDay, subDays, addDays } from 'date-fns';
import { ExpenseMap } from '../components/ExpenseMap.tsx';
import './ExpensesViewerPage.css';
import { getCategoryStyle } from '../utils/categoryStyles';
const groupExpensesByDay = (expenses: Expense[]) => {
  return expenses.reduce((acc, expense) => {
    const dateKey = format(new Date(expense.date), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);
};

export const ExpensesViewerPage = () => {
  const [allExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [activeExpenseId, setActiveExpenseId] = useState<string | null>(null);

  const expensesByDay = useMemo(() => groupExpensesByDay(allExpenses), [allExpenses]);

  const selectedDateKey = format(currentDate, 'yyyy-MM-dd');
  const selectedExpenses = expensesByDay[selectedDateKey] || [];

  const dailyTotal = selectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handlePrevDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  return (
    <div className="viewer-container">
      <div className="sidebar">
        <div className="date-navigation">
          <button onClick={handlePrevDay}>&lt;</button>
          <span>{format(currentDate, 'E, MMM d')}</span>
          <button onClick={handleNextDay}>&gt;</button>
        </div>

        <div className="daily-summary">
          <div>
            <p>Daily Total</p>
            <h3>${dailyTotal.toFixed(2)}</h3>
          </div>
          <div>
            <p>Transactions</p>
            <h3>{selectedExpenses.length}</h3>
          </div>
        </div>

        <div className="expense-list">
          {selectedExpenses.map(expense => {
  const categoryStyle = getCategoryStyle(expense.category); 
  return (
    <div
      key={expense.id}
      className={`expense-item ${expense.id === activeExpenseId ? 'active' : ''}`}
      onClick={() => setActiveExpenseId(expense.id)}
    >
      <div className="item-main">
        <span className="item-amount">${expense.amount.toFixed(2)}</span>
        <span 
          className="item-category"
          style={{ backgroundColor: categoryStyle.color, color: '#111' }} // Apply color
        >
          {expense.category}
        </span>
      </div>
      <div className="item-details">
        <p className="item-note">{expense.note}</p>
        <p className="item-time">{format(new Date(expense.date), 'HH:mm')}</p>
      </div>
    </div>
  );
})}
        </div>
      </div>
      <div className="map-container">
        <ExpenseMap expenses={selectedExpenses} activeExpenseId={activeExpenseId} />
      </div>
    </div>
  );
};