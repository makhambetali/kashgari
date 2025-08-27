import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'leaflet/dist/leaflet.css'; 

import App from './App.tsx';
import { AddExpensePage } from './pages/AddExpensePage';
import { ExpensesViewerPage } from './pages/ExpensesViewerPage.tsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <AddExpensePage />,
      },
      {
        path: "expenses",
        element: <ExpensesViewerPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);