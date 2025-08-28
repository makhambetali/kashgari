import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { type LatLngTuple } from 'leaflet';
import type { Expense } from '../types/expense';
import { getCategoryStyle } from '../utils/categoryStyles';
import './ExpenseMap.css';

const createCustomIcon = (expense: Expense) => {
  const style = getCategoryStyle(expense.category);
  const amount = expense.amount.toFixed(0);

  return L.divIcon({
    html: `
      <div class="custom-marker" style="background-color: ${style.color};">
        <span class="marker-price">₸${amount}</span>
        <div class="marker-icon">${style.icon}</div>
      </div>
    `,
    className: '',
    iconSize: [60, 40],
    iconAnchor: [30, 40],
  });
};

const MapController = ({ activeExpenseId, expenses }: { activeExpenseId: string | null; expenses: Expense[] }) => {
  const map = useMap();

  useEffect(() => {
    if (activeExpenseId) {
      const activeExpense = expenses.find(e => e.id === activeExpenseId);
      if (activeExpense) {
        const { latitude, longitude } = activeExpense.geolocation;
        map.flyTo([latitude, longitude], 15);

        L.popup()
          .setLatLng([latitude, longitude])
          .setContent(`<b>₸${activeExpense.amount.toFixed(2)}</b> - ${activeExpense.category}<br />${activeExpense.note}`)
          .openOn(map);
      }
    }
  }, [activeExpenseId, expenses, map]);

  return null;
};

export const ExpenseMap = ({ expenses, activeExpenseId }: { expenses: Expense[], activeExpenseId: string | null }) => {
  const centerPosition: LatLngTuple = expenses.length > 0 
    ? [expenses[0].geolocation.latitude, expenses[0].geolocation.longitude]
    : [42.3601, -71.0589];

  return (
    <MapContainer center={centerPosition} zoom={14} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {expenses.map(expense => (
        <Marker 
          key={expense.id} 
          position={[expense.geolocation.latitude, expense.geolocation.longitude]}
          icon={createCustomIcon(expense)}
        >
          <Popup>
            <b>₸ {expense.amount.toFixed(2)}</b> - {expense.category}<br />
            {expense.note}
          </Popup>
        </Marker>
      ))}
      <MapController activeExpenseId={activeExpenseId} expenses={expenses} />
    </MapContainer>
  );
};