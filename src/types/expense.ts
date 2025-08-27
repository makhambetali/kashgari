export interface Expense {
  id: string;
  amount: number;
  note: string;
  category: string;
  date: string; // ISO
  geolocation: {
    latitude: number;
    longitude: number;
  };
}