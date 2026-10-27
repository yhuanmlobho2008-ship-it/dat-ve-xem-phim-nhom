import React, { useState, useEffect } from 'react';
import { Movie, Cinema, Showtime, BookingOrder, CustomerAccount } from './types/cinema';
import { INITIAL_CINEMAS } from './data/mockCinemas';
import { 
  getStoredMovies, saveStoredMovies, 
  getStoredShowtimes, saveStoredShowtimes, 
  getStoredBookings, saveStoredBookings, 
  getStoredCustomers, saveStoredCustomers 
} from './utils/storage';
import { INITIAL_MOVIES } from './data/mockMovies';
import { generateInitialShowtimes } from './data/initialShowtimes';
import { INITIAL_CUSTOMERS, INITIAL_BOOKINGS } from './data/mockCustomers';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { QuickBookingBar } from './components/QuickBookingBar';
import { MovieSection } from './components/MovieSection';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { BookingFlowModal } from './components/BookingFlowModal';
import { BookingSuccessModal } from './components/BookingSuccessModal';
import { MyTicketsModal } from './components/MyTicketsModal';
import { TrailerModal } from './components/TrailerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export default function App() {
  // Main data states with local persistence
  const [movies, setMovies] = useState<Movie[]>(() => getStoredMovies());
  const [cinemas] = useState<Cinema[]>(INITIAL_CINEMAS);
  const [showtimes, setShowtimes] = useState<Showtime[]>(() => getStoredShowtimes());
  const [bookings, setBookings] = useState<BookingOrder[]>(() => getStoredBookings());
  const [customers, setCustomers] = useState<CustomerAccount[]>(() => getStoredCustomers());

  // Navigation tab: 'home' | 'now_showing' | 'coming_soon' | 'admin'
  const [currentTab, setCurrentTab] = useState<'home' | 'now_showing' | 'coming_soon' | 'admin'>('home');
  const [movieStatusFilter, setMovieStatusFilter] = useState<'now_showing' | 'coming_soon'>('now_showing');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Modals
  const [bookingState, setBookingState] = useState<{
    movie: Movie;
    cinema?: Cinema;
    showtime?: Showtime;
  } | null>(null);

  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [successOrder, setSuccessOrder] = useState<BookingOrder | null>(null);
  const [isMyTicketsOpen, setIsMyTicketsOpen] = useState(false);

  // Sync state changes with LocalStorage
  useEffect(() => {
    saveStoredMovies(movies);
  }, [movies]);

  useEffect(() => {
    saveStoredShowtimes(showtimes);
  }, [showtimes]);

  useEffect(() => {
    saveStoredBookings(bookings);
  }, [bookings]);

  useEffect(() => {
    saveStoredCustomers(customers);
  }, [customers]);

  // When tab is selected from Navbar
  const handleSelectTab = (tab: 'home' | 'now_showing' | 'coming_soon' | 'admin') => {
    setCurrentTab(tab);
    if (tab === 'now_showing' || tab === 'coming_soon') {
      setMovieStatusFilter(tab);
    }
  };

  // Open booking flow for movie
  const handleStartBooking = (movie: Movie, cinema?: Cinema, showtime?: Showtime) => {
    setDetailsMovie(null);
    setTrailerMovie(null);
    setBookingState({
      movie,
      cinema,
      showtime
    });
  };

  // Update showtime occupied seats after booking
  const handleUpdateShowtimeOccupiedSeats = (showtimeId: string, newlyBookedSeats: string[]) => {
    setShowtimes((prev) =>
      prev.map((st) => {
        if (st.id === showtimeId) {
          const currentOccupied = new Set(st.occupiedSeats);
          newlyBookedSeats.forEach((seat) => currentOccupied.add(seat));
          return {
            ...st,
            occupiedSeats: Array.from(currentOccupied)
          };
        }
        return st;
      })
    );
  };

  // Successful booking handler
  const handleBookingSuccess = (newOrder: BookingOrder) => {
    setBookingState(null);
    setBookings((prev) => [newOrder, ...prev]);

    // Update or add customer account record
    setCustomers((prev) => {
      const existing = prev.find(
        (c) => c.phone === newOrder.customerPhone || c.email === newOrder.customerEmail
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalSpent: c.totalSpent + newOrder.totalAmount,
                totalPoints: c.totalPoints + Math.floor(newOrder.totalAmount / 10000),
                ordersCount: c.ordersCount + 1,
                name: newOrder.customerName || c.name
              }
            : c
        );
      } else {
        const newCust: CustomerAccount = {
          id: `cust-${Date.now()}`,
          name: newOrder.customerName,
          email: newOrder.customerEmail,
          phone: newOrder.customerPhone,
          tier: 'Bạc',
          totalPoints: Math.floor(newOrder.totalAmount / 10000),
          totalSpent: newOrder.totalAmount,
          ordersCount: 1,
          joinedDate: new Date().toISOString().split('T')[0]
        };
        return [newCust, ...prev];
      }
    });

    // Open ticket confirmation pass
    setSuccessOrder(newOrder);
  };

  // Cancel booking
  const handleCancelBooking = (bookingId: string) => {
    const orderToCancel = bookings.find((b) => b.id === bookingId);
    if (!orderToCancel) return;

    // Update booking status
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    // Free occupied seats in showtime
    setShowtimes((prev) =>
      prev.map((st) => {
        if (st.id === orderToCancel.showtimeId) {
          return {
            ...st,
            occupiedSeats: st.occupiedSeats.filter((s) => !orderToCancel.seats.includes(s))
          };
        }
        return st;
      })
    );
  };

  // Admin Movie Actions
  const handleAddMovie = (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
  };

  const handleUpdateMovie = (updatedMovie: Movie) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
    );
  };

  const handleDeleteMovie = (movieId: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    // Also remove related showtimes
    setShowtimes((prev) => prev.filter((st) => st.movieId !== movieId));
  };

  // Admin Showtime Actions
  const handleAddShowtime = (newShowtime: Showtime) => {
    setShowtimes((prev) => [newShowtime, ...prev]);
  };

  const handleDeleteShowtime = (showtimeId: string) => {
    setShowtimes((prev) => prev.filter((st) => st.id !== showtimeId));
  };

  // Admin Reset to initial defaults
  const handleResetDefaults = () => {
    localStorage.clear();
    setMovies(INITIAL_MOVIES);
    setShowtimes(generateInitialShowtimes());
    setBookings(INITIAL_BOOKINGS);
    setCustomers(INITIAL_CUSTOMERS);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      
      {/* Global Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleSelectTab}
        onOpenMyTickets={() => setIsMyTicketsOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        bookedCount={bookings.filter((b) => b.status === 'confirmed').length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'admin' ? (
          /* ============= ADMIN DASHBOARD VIEW ============= */
          <AdminDashboard
            movies={movies}
            cinemas={cinemas}
            showtimes={showtimes}
            bookings={bookings}
            customers={customers}
            onAddMovie={handleAddMovie}
            onUpdateMovie={handleUpdateMovie}
            onDeleteMovie={handleDeleteMovie}
            onAddShowtime={handleAddShowtime}
            onDeleteShowtime={handleDeleteShowtime}
            onCancelBooking={handleCancelBooking}
            onResetDefaults={handleResetDefaults}
            onExitAdmin={() => setCurrentTab('home')}
          />
        ) : (
          /* ============= CUSTOMER STOREFRONT VIEW ============= */
          <>
            {/* Hero Banner Showcase (Blockbuster Carousel) */}
            <HeroBanner
              movies={movies}
              onBookMovie={(movie) => handleStartBooking(movie)}
              onViewDetails={(movie) => setDetailsMovie(movie)}
              onWatchTrailer={(movie) => setTrailerMovie(movie)}
            />

            {/* Quick 4-Step Booking Bar */}
            <QuickBookingBar
              movies={movies.filter((m) => m.status === 'now_showing')}
              cinemas={cinemas}
              showtimes={showtimes}
              onStartBooking={(movie, cinema, showtime) =>
                handleStartBooking(movie, cinema, showtime)
              }
            />

            {/* Movie Catalog Section with Filters & Tabs */}
            <MovieSection
              movies={movies}
              activeTab={movieStatusFilter}
              setActiveTab={(tab) => setMovieStatusFilter(tab)}
              onBookMovie={(movie) => handleStartBooking(movie)}
              onViewDetails={(movie) => setDetailsMovie(movie)}
              onWatchTrailer={(movie) => setTrailerMovie(movie)}
              externalSearchQuery={searchQuery}
            />
          </>
        )}
      </main>

      {/* Global Footer */}
      <Footer
        onOpenMyTickets={() => setIsMyTicketsOpen(true)}
        onOpenAdmin={() => setCurrentTab('admin')}
      />

      {/* ================= MODALS ================= */}

      {/* 1. Movie Details Modal */}
      {detailsMovie && (
        <MovieDetailsModal
          movie={detailsMovie}
          cinemas={cinemas}
          showtimes={showtimes}
          onClose={() => setDetailsMovie(null)}
          onSelectShowtime={(movie, cinema, showtime) => {
            handleStartBooking(movie, cinema, showtime);
          }}
        />
      )}

      {/* 2. Interactive Booking Flow Modal (Showtime -> Seat Map -> Concessions -> Checkout) */}
      {bookingState && (
        <BookingFlowModal
          movie={bookingState.movie}
          initialCinema={bookingState.cinema}
          initialShowtime={bookingState.showtime}
          cinemas={cinemas}
          allShowtimes={showtimes}
          onClose={() => setBookingState(null)}
          onSuccess={handleBookingSuccess}
          onUpdateShowtimeOccupiedSeats={handleUpdateShowtimeOccupiedSeats}
        />
      )}

      {/* 3. Booking Success Modal (Digital Movie Ticket Pass with fake code & QR) */}
      {successOrder && (
        <BookingSuccessModal
          order={successOrder}
          onClose={() => setSuccessOrder(null)}
          onViewMyTickets={() => setIsMyTicketsOpen(true)}
        />
      )}

      {/* 4. My Booked Tickets Modal */}
      {isMyTicketsOpen && (
        <MyTicketsModal
          bookings={bookings}
          onClose={() => setIsMyTicketsOpen(false)}
          onCancelTicket={handleCancelBooking}
          onBookNow={() => {
            const el = document.getElementById('movies-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      {/* 5. Trailer Modal */}
      {trailerMovie && (
        <TrailerModal
          movie={trailerMovie}
          onClose={() => setTrailerMovie(null)}
          onBookNow={(movie) => handleStartBooking(movie)}
        />
      )}

    </div>
  );
}
