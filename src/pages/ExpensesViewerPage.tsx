import { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Expense } from '../types/expense';
import { format, startOfDay, subDays, addDays, isToday } from 'date-fns';
import { ExpenseMap } from '../components/ExpenseMap.tsx';
import { EditExpenseModal } from '../components/EditExpenseModal.tsx';
import { getCategoryStyle, categories as allCategories } from '../utils/categoryStyles';
import './ExpensesViewerPage.css';

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
  const [allExpenses, setAllExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [activeExpenseId, setActiveExpenseId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const expensesByDay = useMemo(() => groupExpensesByDay(allExpenses), [allExpenses]);

  const selectedDateKey = format(currentDate, 'yyyy-MM-dd');
  const selectedExpenses = expensesByDay[selectedDateKey] || [];

  const dailyTotal = selectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handlePrevDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => {
    if (!isToday(currentDate)) {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleDelete = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setAllExpenses(allExpenses.filter(exp => exp.id !== expenseId));
      if (activeExpenseId === expenseId) {
        setActiveExpenseId(null);
      }
    }
  };
  
  const handleUpdate = (updatedExpense: Expense) => {
    setAllExpenses(allExpenses.map(exp => exp.id === updatedExpense.id ? updatedExpense : exp));
    setEditingExpense(null);
  };
  
  const getDateDisplayName = () => {
    if (isToday(currentDate)) return 'Today';
    return format(currentDate, 'eeee, MMMM d, yyyy');
  };

  return (
    <>
      <div className="viewer-container">
        <div className="sidebar">
          <div className="sidebar-header">
            <h3>Expense Tracker</h3>
            <p>Daily expense overview</p>
          </div>
          <div className="date-navigation">
            <button onClick={handlePrevDay}>‹</button>
            <span>{format(currentDate, 'E, MMM d')}</span>
            <button onClick={handleNextDay} disabled={isToday(currentDate)}>›</button>
          </div>
          <div className="daily-summary">
            <div>
              <p>Daily Total</p>
              <h3>₸ {dailyTotal.toFixed(2)}</h3>
            </div>

            <div>
              <p>Transactions</p>
              <h3>{selectedExpenses.length}</h3>
            </div>
          </div>
          <div className="expense-list">
            {selectedExpenses.length > 0 ? (
              selectedExpenses.map(expense => {
                const categoryStyle = getCategoryStyle(expense.category);
                return (
                  <div key={expense.id} className={`expense-item ${expense.id === activeExpenseId ? 'active' : ''}`} onClick={() => setActiveExpenseId(expense.id)}>
                    <div className="item-dot" style={{ backgroundColor: categoryStyle.color }}></div>
                    <div className="item-content">
                      <div className="item-row-1">
                        <span className="item-amount">₸ {expense.amount.toFixed(2)}</span>
                        <span className="item-category" style={{ backgroundColor: `${categoryStyle.color}33`, color: categoryStyle.color }}>
                          {expense.category}
                        </span>
                      </div>
                      <div className="item-row-2">
                        <p className="item-note">{expense.note}</p>
                      </div>
                      <div className="item-row-3">
                        <span className="item-detail-tag">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {format(new Date(expense.date), 'HH:mm')}
                        </span>
                        {expense.locationName && (
                          <span className="item-detail-tag">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            {expense.locationName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="expense-item-actions">
                      <button onClick={(e) => { e.stopPropagation(); setEditingExpense(expense); }}>✏️</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(expense.id); }}>🗑️</button>
                    </div>
                  </div>
                );
              })
            ) : ( <p className="no-expenses">No expenses for this day.</p> )}
          </div>
        </div>
        
        <div className="map-area">
          <ExpenseMap expenses={selectedExpenses} activeExpenseId={activeExpenseId} />
          
          <div className="map-summary-card">
            <h3>{getDateDisplayName()}</h3>
            <div className="summary-details">
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 20v-4h-2v4h-2v-2h-2v2H9v-4H7v4H5v-6h14v6h-2Zm0 0H7"/></svg> ₸ {dailyTotal.toFixed(2)}</span>
              <span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 12h4m-4 6h10"/></svg> {selectedExpenses.length} expenses</span>
            </div>
          </div>
          
          <div className="map-categories-legend">
            <h4>Categories</h4>
            <div className="categories-grid">
              {allCategories.map(cat => (
                <div key={cat.name} className="category-legend-item">
                  <span className="category-dot" style={{ backgroundColor: cat.color }}></span>
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <EditExpenseModal expense={editingExpense} onUpdate={handleUpdate} onClose={() => setEditingExpense(null)} />
    </>
  );
};