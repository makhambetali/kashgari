export const categories = [
  { name: 'Food & Dining', icon: '🍔', color: '#ff7675' }, 
  { name: 'Transportation', icon: '🚗', color: '#74b9ff' }, 
  { name: 'Education', icon: '📚', color: '#55efc4' },  
  { name: 'Shopping', icon: '🛍️', color: '#fdcb6e' },  
  { name: 'Entertainment', icon: '🎬', color: '#a29bfe' }, 
  { name: 'Other', icon: '📎', color: '#dfe6e9' },     
];

export const getCategoryStyle = (categoryName: string) => {
  return categories.find(cat => cat.name === categoryName) || { color: '#dfe6e9', icon: '📎' };
};