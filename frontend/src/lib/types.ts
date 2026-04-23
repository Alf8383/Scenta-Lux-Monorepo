export interface Perfume {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  category: 'Para Él' | 'Para Ella' | 'Unisex';
  notes: string[];
}

export interface CartItem {
  id: string;
  quantity: number;
}
