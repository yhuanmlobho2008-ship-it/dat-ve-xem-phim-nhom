import { CustomerAccount, BookingOrder } from '../types/cinema';
import { INITIAL_CONCESSIONS } from './mockConcessions';

export const INITIAL_CUSTOMERS: CustomerAccount[] = [
  {
    id: 'cust-01',
    name: 'Nguyễn Văn Minh',
    email: 'minh.nguyen92@gmail.com',
    phone: '0912 345 678',
    tier: 'Kim Cương',
    totalPoints: 2450,
    totalSpent: 4850000,
    ordersCount: 16,
    joinedDate: '2023-01-15'
  },
  {
    id: 'cust-02',
    name: 'Trần Thị Thu Hà',
    email: 'thuha.tran@outlook.com',
    phone: '0988 765 432',
    tier: 'Vàng',
    totalPoints: 1280,
    totalSpent: 2650000,
    ordersCount: 9,
    joinedDate: '2023-05-20'
  },
  {
    id: 'cust-03',
    name: 'Lê Hoàng Long',
    email: 'long.lehoang@yahoo.com',
    phone: '0903 112 233',
    tier: 'Vàng',
    totalPoints: 950,
    totalSpent: 1980000,
    ordersCount: 7,
    joinedDate: '2023-09-10'
  },
  {
    id: 'cust-04',
    name: 'Phạm Quỳnh Nga',
    email: 'nga.phamquynh@gmail.com',
    phone: '0977 889 900',
    tier: 'Bạc',
    totalPoints: 420,
    totalSpent: 870000,
    ordersCount: 3,
    joinedDate: '2024-02-14'
  },
  {
    id: 'cust-05',
    name: 'Đặng Tuấn Anh',
    email: 'tuananh.dang@fpt.edu.vn',
    phone: '0934 567 890',
    tier: 'Bạc',
    totalPoints: 290,
    totalSpent: 590000,
    ordersCount: 2,
    joinedDate: '2024-03-01'
  }
];

export const INITIAL_BOOKINGS: BookingOrder[] = [
  {
    id: 'order-01',
    bookingCode: 'CINE-849201',
    movieId: 'mov-01',
    movieTitle: 'Dune: Hành Tinh Cát - Phần 2',
    moviePoster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    cinemaId: 'cin-01',
    cinemaName: 'CineGlow Landmark 81 IMAX',
    cinemaAddress: 'Tầng B1, Vincom Center Landmark 81, 720A Điện Biên Phủ, P. 22, Bình Thạnh',
    showtimeId: 'st-01',
    room: 'Phòng 01 - IMAX Laser',
    format: 'IMAX 2D',
    date: new Date().toISOString().split('T')[0],
    time: '14:15',
    seats: ['D05', 'D06'],
    seatDetails: [
      { id: 'D05', type: 'vip', price: 160000 },
      { id: 'D06', type: 'vip', price: 160000 }
    ],
    concessions: [
      { item: INITIAL_CONCESSIONS[1], quantity: 1 } // Combo Couple
    ],
    totalAmount: 455000,
    customerName: 'Nguyễn Văn Minh',
    customerPhone: '0912 345 678',
    customerEmail: 'minh.nguyen92@gmail.com',
    paymentMethod: 'momo',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'confirmed'
  },
  {
    id: 'order-02',
    bookingCode: 'CINE-739182',
    movieId: 'mov-03',
    movieTitle: 'Deadpool & Wolverine',
    moviePoster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    cinemaId: 'cin-01',
    cinemaName: 'CineGlow Landmark 81 IMAX',
    cinemaAddress: 'Tầng B1, Vincom Center Landmark 81, 720A Điện Biên Phủ, P. 22, Bình Thạnh',
    showtimeId: 'st-11',
    room: 'Phòng 04 - 3D RealD',
    format: '3D Phụ đề',
    date: new Date().toISOString().split('T')[0],
    time: '17:15',
    seats: ['E06', 'E07'],
    seatDetails: [
      { id: 'E06', type: 'vip', price: 140000 },
      { id: 'E07', type: 'vip', price: 140000 }
    ],
    concessions: [
      { item: INITIAL_CONCESSIONS[0], quantity: 1 } // Combo Solo
    ],
    totalAmount: 365000,
    customerName: 'Trần Thị Thu Hà',
    customerPhone: '0988 765 432',
    customerEmail: 'thuha.tran@outlook.com',
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'confirmed'
  },
  {
    id: 'order-03',
    bookingCode: 'CINE-628491',
    movieId: 'mov-08',
    movieTitle: 'Mai',
    moviePoster: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    cinemaId: 'cin-01',
    cinemaName: 'CineGlow Landmark 81 IMAX',
    cinemaAddress: 'Tầng B1, Vincom Center Landmark 81, 720A Điện Biên Phủ, P. 22, Bình Thạnh',
    showtimeId: 'st-21',
    room: 'Phòng 04 - VIP Lounge',
    format: '2D Phụ đề',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    seats: ['G04', 'G05'],
    seatDetails: [
      { id: 'G04', type: 'couple', price: 240000 }
    ],
    concessions: [
      { item: INITIAL_CONCESSIONS[2], quantity: 1 }
    ],
    totalAmount: 425000,
    customerName: 'Lê Hoàng Long',
    customerPhone: '0903 112 233',
    customerEmail: 'long.lehoang@yahoo.com',
    paymentMethod: 'vnpay',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'confirmed'
  }
];
