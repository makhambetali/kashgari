export interface Expense {
  id: string;
  amount: number;
  note: string;
  category: string;
  date: string;
  locationName: string;
  geolocation: {
    latitude: number;
    longitude: number;
  };
}