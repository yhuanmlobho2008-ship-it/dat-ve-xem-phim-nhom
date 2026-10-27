import React, { useState, useMemo } from 'react';
import { Movie, Cinema, Showtime } from '../types/cinema';
import { getFormattedDate, getDisplayDateLabel } from '../data/initialShowtimes';
import { Ticket, Film, MapPin, Calendar, Clock } from 'lucide-react';

interface QuickBookingBarProps {
  movies: Movie[];
  cinemas: Cinema[];
  showtimes: Showtime[];
  onStartBooking: (movie: Movie, cinema: Cinema, showtime: Showtime) => void;
}

export const QuickBookingBar: React.FC<QuickBookingBarProps> = ({
  movies,
  cinemas,
  showtimes,
  onStartBooking
}) => {
  const [selectedMovieId, setSelectedMovieId] = useState<string>('');
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(0));
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<string>('');

  // Available dates (Today, Tomorrow, Day after)
  const availableDates = useMemo(() => {
    return [getFormattedDate(0), getFormattedDate(1), getFormattedDate(2)];
  }, []);

  // Filter available cinemas if movie selected
  const availableCinemas = useMemo(() => {
    if (!selectedMovieId) return cinemas;
    const movieShowtimes = showtimes.filter((st) => st.movieId === selectedMovieId);
    const cinemaIds = new Set(movieShowtimes.map((st) => st.cinemaId));
    const matched = cinemas.filter((c) => cinemaIds.has(c.id));
    return matched.length > 0 ? matched : cinemas;
  }, [selectedMovieId, cinemas, showtimes]);

  // Filter available showtimes for Movie + Cinema + Date
  const availableShowtimes = useMemo(() => {
    if (!selectedMovieId || !selectedCinemaId || !selectedDate) return [];
    return showtimes.filter(
      (st) =>
        st.movieId === selectedMovieId &&
        st.cinemaId === selectedCinemaId &&
        st.date === selectedDate
    );
  }, [selectedMovieId, selectedCinemaId, selectedDate, showtimes]);

  const handleBookNow = () => {
    if (!selectedMovieId) {
      alert('Vui lòng chọn phim!');
      return;
    }
    const movie = movies.find((m) => m.id === selectedMovieId);
    if (!movie) return;

    // If showtime selected directly
    if (selectedShowtimeId) {
      const showtime = showtimes.find((st) => st.id === selectedShowtimeId);
      const cinema = cinemas.find((c) => c.id === showtime?.cinemaId);
      if (showtime && cinema) {
        onStartBooking(movie, cinema, showtime);
        return;
      }
    }

    // If cinema selected and there's a showtime
    if (selectedCinemaId && availableShowtimes.length > 0) {
      const cinema = cinemas.find((c) => c.id === selectedCinemaId);
      if (cinema) {
        onStartBooking(movie, cinema, availableShowtimes[0]);
        return;
      }
    }

    // Default fallback: open booking modal with movie to pick showtime
    const fallbackCinema = cinemas[0];
    const fallbackShowtime = showtimes.find((st) => st.movieId === movie.id) || {
      id: `custom-st-${movie.id}`,
      movieId: movie.id,
      cinemaId: fallbackCinema.id,
      room: 'Phòng 01 - Cinema Laser',
      format: '2D Phụ đề',
      date: selectedDate,
      time: '19:00',
      priceStandard: 90000,
      priceVip: 120000,
      priceCouple: 240000,
      occupiedSeats: ['D05', 'D06']
    };
    onStartBooking(movie, fallbackCinema, fallbackShowtime);
  };

  return (
    <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 mb-8">
      <div className="bg-[#10131d]/95 backdrop-blur-md border border-orange-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/80 glow-orange-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-center">
          
          {/* Step 1: Chọn Phim */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-orange-400" />
              1. Chọn Phim
            </label>
            <select
              value={selectedMovieId}
              onChange={(e) => {
                setSelectedMovieId(e.target.value);
                setSelectedShowtimeId('');
              }}
              className="w-full bg-[#181c2b] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer truncate"
            >
              <option value="">-- Tất cả phim ({movies.length}) --</option>
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.ageRating})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Chọn Rạp */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              2. Chọn Rạp Chiếu
            </label>
            <select
              value={selectedCinemaId}
              onChange={(e) => {
                setSelectedCinemaId(e.target.value);
                setSelectedShowtimeId('');
              }}
              className="w-full bg-[#181c2b] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer truncate"
            >
              <option value="">-- Chọn rạp xem --</option>
              {availableCinemas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Chọn Ngày */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              3. Chọn Ngày
            </label>
            <select
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedShowtimeId('');
              }}
              className="w-full bg-[#181c2b] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer truncate"
            >
              {availableDates.map((d) => (
                <option key={d} value={d}>
                  {getDisplayDateLabel(d)} ({d.split('-').slice(1).reverse().join('/')})
                </option>
              ))}
            </select>
          </div>

          {/* Step 4: Chọn Suất */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              4. Suất Chiếu
            </label>
            <select
              value={selectedShowtimeId}
              onChange={(e) => setSelectedShowtimeId(e.target.value)}
              disabled={availableShowtimes.length === 0}
              className={`w-full bg-[#181c2b] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors cursor-pointer truncate ${
                availableShowtimes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <option value="">
                {availableShowtimes.length === 0
                  ? 'Chưa có suất phù hợp'
                  : `-- Chọn giờ (${availableShowtimes.length}) --`}
              </option>
              {availableShowtimes.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.time} - {st.format} ({st.room})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Action CTA */}
          <div className="flex items-end pt-1 sm:pt-0">
            <button
              onClick={handleBookNow}
              className="w-full h-[42px] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-95"
            >
              <Ticket className="w-4 h-4 stroke-[2.5]" />
              <span>MUA VÉ NHANH</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
