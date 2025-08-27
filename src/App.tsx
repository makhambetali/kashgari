import { NavLink, Outlet } from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="app-container">
      <nav className="main-nav">
        <NavLink to="/">Add Expense</NavLink>
        <NavLink to="/expenses">View Expenses</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;