export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl?: string;
  genre: string[];
  duration: number; // in minutes
  rating: number; // 0 - 10
  ageRating: 'P' | 'T13' | 'T16' | 'T18' | 'K';
  description: string;
  releaseDate: string; // YYYY-MM-DD
  status: 'now_showing' | 'coming_soon';
  director: string;
  cast: string[];
  trailerUrl?: string;
  language?: string;
  formats?: string[];
}

export interface Cinema {
  id: string;
  name: string;
  brand: 'CineGlow' | 'CGV' | 'Lotte' | 'Galaxy';
  city: 'TP. Hồ Chí Minh' | 'Hà Nội' | 'Đà Nẵng';
  address: string;
}

export type SeatType = 'standard' | 'vip' | 'couple';
export type SeatState = 'available' | 'selected' | 'occupied';

export interface Seat {
  id: string; // e.g. "E06"
  row: string; // "A" - "H"
  number: number;
  type: SeatType;
  price: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  cinemaId: string;
  room: string;
  format: '2D Phụ đề' | '2D Lồng tiếng' | '3D Phụ đề' | 'IMAX 2D' | '4DX';
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  priceStandard: number;
  priceVip: number;
  priceCouple: number;
  occupiedSeats: string[]; // List of seat IDs already booked
}

export interface ConcessionItem {
  id: string;
  name: string;
  category: 'combo' | 'popcorn' | 'drink';
  price: number;
  description: string;
  imageUrl: string;
}

export interface BookingOrder {
  id: string;
  bookingCode: string; // e.g. CINE-738921
  movieId: string;
  movieTitle: string;
  moviePoster: string;
  cinemaId: string;
  cinemaName: string;
  cinemaAddress: string;
  showtimeId: string;
  room: string;
  format: string;
  date: string;
  time: string;
  seats: string[];
  seatDetails: {
    id: string;
    type: SeatType;
    price: number;
  }[];
  concessions: {
    item: ConcessionItem;
    quantity: number;
  }[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  paymentMethod: 'momo' | 'vnpay' | 'card' | 'counter';
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Bạc' | 'Vàng' | 'Kim Cương';
  totalPoints: number;
  totalSpent: number;
  ordersCount: number;
  joinedDate: string;
}
