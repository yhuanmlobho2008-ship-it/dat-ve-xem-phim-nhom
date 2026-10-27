import { Movie, Showtime, BookingOrder, CustomerAccount } from '../types/cinema';
import { INITIAL_MOVIES } from '../data/mockMovies';
import { generateInitialShowtimes } from '../data/initialShowtimes';
import { INITIAL_CUSTOMERS, INITIAL_BOOKINGS } from '../data/mockCustomers';

const KEYS = {
  MOVIES: 'cineglow_movies_v1',
  SHOWTIMES: 'cineglow_showtimes_v1',
  BOOKINGS: 'cineglow_bookings_v1',
  CUSTOMERS: 'cineglow_customers_v1'
};

export const getStoredMovies = (): Movie[] => {
  try {
    const raw = localStorage.getItem(KEYS.MOVIES);
    if (!raw) {
      localStorage.setItem(KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
      return INITIAL_MOVIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOVIES;
  }
};

export const saveStoredMovies = (movies: Movie[]): void => {
  try {
    localStorage.setItem(KEYS.MOVIES, JSON.stringify(movies));
  } catch (e) {
    console.error('Failed to save movies to local storage', e);
  }
};

export const getStoredShowtimes = (): Showtime[] => {
  try {
    const raw = localStorage.getItem(KEYS.SHOWTIMES);
    if (!raw) {
      const initial = generateInitialShowtimes();
      localStorage.setItem(KEYS.SHOWTIMES, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return generateInitialShowtimes();
  }
};

export const saveStoredShowtimes = (showtimes: Showtime[]): void => {
  try {
    localStorage.setItem(KEYS.SHOWTIMES, JSON.stringify(showtimes));
  } catch (e) {
    console.error('Failed to save showtimes to local storage', e);
  }
};

export const getStoredBookings = (): BookingOrder[] => {
  try {
    const raw = localStorage.getItem(KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
};

export const saveStoredBookings = (bookings: BookingOrder[]): void => {
  try {
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {
    console.error('Failed to save bookings to local storage', e);
  }
};

export const getStoredCustomers = (): CustomerAccount[] => {
  try {
    const raw = localStorage.getItem(KEYS.CUSTOMERS);
    if (!raw) {
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CUSTOMERS;
  }
};

export const saveStoredCustomers = (customers: CustomerAccount[]): void => {
  try {
    localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers));
  } catch (e) {
    console.error('Failed to save customers to local storage', e);
  }
};

export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateBookingCode = (): string => {
  const chars = '0123456789';
  let num = '';
  for (let i = 0; i < 6; i++) {
    num += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CINE-${num}`;
};
