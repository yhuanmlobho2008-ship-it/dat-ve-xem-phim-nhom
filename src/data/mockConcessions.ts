import { ConcessionItem } from '../types/cinema';

export const INITIAL_CONCESSIONS: ConcessionItem[] = [
  {
    id: 'con-01',
    name: 'Combo Solo Đậm Vị',
    category: 'combo',
    price: 85000,
    description: '1 Bắp ngọt lớn (64oz) + 1 Nước ngọt có ga (32oz)',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'con-02',
    name: 'Combo Couple Cinema',
    category: 'combo',
    price: 135000,
    description: '1 Bắp phô mai đặc biệt (64oz) + 2 Nước ngọt có ga (32oz)',
    imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'con-03',
    name: 'Combo VIP CineGlow Gold',
    category: 'combo',
    price: 185000,
    description: '1 Bắp Caramel cao cấp + 2 Nước ngọt + 1 Khoai tây chiên giòn',
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'con-04',
    name: 'Bắp Rang Bơ Truyền Thống',
    category: 'popcorn',
    price: 55000,
    description: 'Bắp rang bơ thơm lừng, giòn tan nóng hổi',
    imageUrl: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'con-05',
    name: 'Nước Ngọt Coca-Cola Lạnh (L)',
    category: 'drink',
    price: 35000,
    description: 'Cốc lớn 32oz ướp lạnh sảng khoái',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80'
  }
];
