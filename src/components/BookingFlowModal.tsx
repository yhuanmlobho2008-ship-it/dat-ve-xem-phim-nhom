import React, { useState, useMemo } from 'react';
import { Movie, Cinema, Showtime, Seat, ConcessionItem, BookingOrder } from '../types/cinema';
import { INITIAL_CONCESSIONS } from '../data/mockConcessions';
import { generateSeatsForShowtime } from '../utils/seatMap';
import { formatVND, generateBookingCode } from '../utils/storage';
import { getFormattedDate, getDisplayDateLabel } from '../data/initialShowtimes';
import { X, Ticket, ChevronRight, User, Phone, Mail, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingFlowModalProps {
  movie: Movie;
  initialCinema?: Cinema;
  initialShowtime?: Showtime;
  cinemas: Cinema[];
  allShowtimes: Showtime[];
  onClose: () => void;
  onSuccess: (order: BookingOrder) => void;
  onUpdateShowtimeOccupiedSeats: (showtimeId: string, newlyBookedSeats: string[]) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  movie,
  initialCinema,
  initialShowtime,
  cinemas,
  allShowtimes,
  onClose,
  onSuccess,
  onUpdateShowtimeOccupiedSeats
}) => {
  // Step navigation: 1: 'select_showtime', 2: 'select_seats', 3: 'concessions', 4: 'checkout'
  const [currentStep, setCurrentStep] = useState<'showtime' | 'seats' | 'concessions' | 'checkout'>(
    initialShowtime ? 'seats' : 'showtime'
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    initialShowtime ? initialShowtime.date : getFormattedDate(0)
  );
  const [selectedCinema, setSelectedCinema] = useState<Cinema | undefined>(
    initialCinema || cinemas[0]
  );
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | undefined>(
    initialShowtime
  );

  // Selected Seats state
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Concessions state: { [itemId: string]: number }
  const [concessionsCart, setConcessionsCart] = useState<{ [id: string]: number }>({});

  // Customer info form state
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'vnpay' | 'card' | 'counter'>('momo');
  const [formError, setFormError] = useState<string>('');

  const availableDates = [getFormattedDate(0), getFormattedDate(1), getFormattedDate(2)];

  // Filter showtimes for chosen date & cinema
  const availableShowtimes = useMemo(() => {
    if (!selectedCinema) return [];
    return allShowtimes.filter(
      (st) =>
        st.movieId === movie.id &&
        st.cinemaId === selectedCinema.id &&
        st.date === selectedDate
    );
  }, [allShowtimes, movie.id, selectedCinema, selectedDate]);

  // Generate seat map when showtime changes
  const seatRows = useMemo(() => {
    if (!selectedShowtime) return [];
    return generateSeatsForShowtime(selectedShowtime);
  }, [selectedShowtime]);

  // Handle seat click
  const handleToggleSeat = (seat: Seat) => {
    if (!selectedShowtime) return;
    const isOccupied = selectedShowtime.occupiedSeats.includes(seat.id);
    if (isOccupied) return;

    const isAlreadySelected = selectedSeats.some((s) => s.id === seat.id);

    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Bạn chỉ có thể đặt tối đa 8 ghế trong một giao dịch.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Concession quantity handlers
  const handleUpdateConcession = (itemId: string, delta: number) => {
    const currentQty = concessionsCart[itemId] || 0;
    const newQty = Math.max(0, currentQty + delta);
    setConcessionsCart({
      ...concessionsCart,
      [itemId]: newQty
    });
  };

  // Total pricing calculations
  const seatTotal = useMemo(() => {
    return selectedSeats.reduce((acc, seat) => acc + seat.price, 0);
  }, [selectedSeats]);

  const concessionsTotal = useMemo(() => {
    return Object.entries(concessionsCart).reduce((acc, [itemId, qty]) => {
      const item = INITIAL_CONCESSIONS.find((c) => c.id === itemId);
      return acc + (item ? item.price * qty : 0);
    }, 0);
  }, [concessionsCart]);

  const grandTotal = seatTotal + concessionsTotal;

  // Handle Complete Booking
  const handleCompleteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (selectedSeats.length === 0) {
      setFormError('Vui lòng chọn ít nhất 1 ghế ngồi.');
      setCurrentStep('seats');
      return;
    }

    if (!customerName.trim()) {
      setFormError('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    if (!customerPhone.trim() || customerPhone.length < 9) {
      setFormError('Vui lòng nhập số điện thoại hợp lệ để nhận vé.');
      return;
    }

    if (!selectedShowtime || !selectedCinema) {
      setFormError('Thông tin suất chiếu không hợp lệ.');
      return;
    }

    // Prepare booked concessions list
    const bookedConcessions = Object.entries(concessionsCart)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => {
        const item = INITIAL_CONCESSIONS.find((c) => c.id === itemId)!;
        return { item, quantity: qty };
      });

    const bookingCode = generateBookingCode();
    const newOrder: BookingOrder = {
      id: `order-${Date.now()}`,
      bookingCode,
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.posterUrl,
      cinemaId: selectedCinema.id,
      cinemaName: selectedCinema.name,
      cinemaAddress: selectedCinema.address,
      showtimeId: selectedShowtime.id,
      room: selectedShowtime.room,
      format: selectedShowtime.format,
      date: selectedShowtime.date,
      time: selectedShowtime.time,
      seats: selectedSeats.map((s) => s.id),
      seatDetails: selectedSeats.map((s) => ({
        id: s.id,
        type: s.type,
        price: s.price
      })),
      concessions: bookedConcessions,
      totalAmount: grandTotal,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || `${customerPhone.trim()}@cineglow.vn`,
      paymentMethod,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    // Update showtime occupied seats
    onUpdateShowtimeOccupiedSeats(selectedShowtime.id, selectedSeats.map((s) => s.id));

    // Confetti celebration effect!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b00', '#f97316', '#fbbf24', '#ffffff']
      });
    } catch {
      // ignore if confetti fails
    }

    // Call parent handler
    onSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-[#0b0d14] border border-orange-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10 text-slate-100 max-h-[96vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-[#10131d] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-black flex items-center justify-center font-bold">
              <Ticket className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display line-clamp-1">
                Đặt vé: {movie.title}
              </h2>
              <p className="text-xs text-slate-400">
                {selectedCinema?.name} · {selectedShowtime ? `${selectedShowtime.time} (${selectedShowtime.format})` : 'Chọn suất'}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#181c2b] hover:bg-orange-500 hover:text-black text-slate-400 border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Tabs */}
        <div className="px-5 py-2.5 bg-[#0e1018] border-b border-slate-800/80 flex items-center justify-between overflow-x-auto text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => setCurrentStep('showtime')}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentStep === 'showtime'
                  ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40'
                  : 'hover:text-slate-200'
              }`}
            >
              <span>1. Suất Chiếu</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            <button
              onClick={() => {
                if (selectedShowtime) setCurrentStep('seats');
              }}
              disabled={!selectedShowtime}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentStep === 'seats'
                  ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40'
                  : 'hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <span>2. Chọn Ghế {selectedSeats.length > 0 && `(${selectedSeats.length})`}</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            <button
              onClick={() => {
                if (selectedSeats.length > 0) setCurrentStep('concessions');
              }}
              disabled={selectedSeats.length === 0}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentStep === 'concessions'
                  ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40'
                  : 'hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <span>3. Bắp Nước</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            <button
              onClick={() => {
                if (selectedSeats.length > 0) setCurrentStep('checkout');
              }}
              disabled={selectedSeats.length === 0}
              className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
                currentStep === 'checkout'
                  ? 'bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40'
                  : 'hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              <span>4. Xác Nhận Vé</span>
            </button>
          </div>

          {/* Running Subtotal in Step Bar */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-400">Tạm tính:</span>
            <span className="text-sm font-extrabold text-orange-400 font-mono">
              {formatVND(grandTotal)}
            </span>
          </div>
        </div>

        {/* Modal Main Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* STEP 1: CHỌN SUẤT CHIẾU & RẠP */}
          {currentStep === 'showtime' && (
            <div className="space-y-6">
              
              {/* Cinema Selector */}
              <div>
                <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                  1. Chọn Rạp Chiếu Phim
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {cinemas.map((cinema) => (
                    <button
                      key={cinema.id}
                      onClick={() => {
                        setSelectedCinema(cinema);
                        setSelectedShowtime(undefined);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedCinema?.id === cinema.id
                          ? 'bg-orange-500/15 border-orange-500 text-white shadow-md shadow-orange-500/10'
                          : 'bg-[#121520] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs sm:text-sm text-white">{cinema.name}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{cinema.address}</div>
                      <div className="text-[10px] text-orange-400 font-semibold mt-1">{cinema.city}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                  2. Chọn Ngày Chiếu
                </label>
                <div className="flex items-center gap-2">
                  {availableDates.map((date) => (
                    <button
                      key={date}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedShowtime(undefined);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        selectedDate === date
                          ? 'bg-orange-500 text-black border-orange-400 shadow-md shadow-orange-500/20'
                          : 'bg-[#121520] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {getDisplayDateLabel(date)} ({date.split('-').slice(1).reverse().join('/')})
                    </button>
                  ))}
                </div>
              </div>

              {/* Showtimes List */}
              <div>
                <label className="block text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
                  3. Chọn Giờ Chiếu
                </label>

                {availableShowtimes.length === 0 ? (
                  <div className="p-8 text-center bg-[#121520] rounded-xl border border-slate-800 text-xs text-slate-400">
                    Không có suất chiếu phù hợp cho rạp và ngày đã chọn. Vui lòng chọn ngày khác hoặc rạp khác.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {availableShowtimes.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          setSelectedShowtime(st);
                          setCurrentStep('seats');
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer group ${
                          selectedShowtime?.id === st.id
                            ? 'bg-orange-500 text-black border-orange-400'
                            : 'bg-[#131724] border-slate-800 text-slate-200 hover:border-orange-500/60'
                        }`}
                      >
                        <div className="text-base font-black group-hover:text-orange-400">{st.time}</div>
                        <div className="text-xs font-bold text-orange-400 group-hover:text-white mt-0.5">
                          {st.format}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{st.room}</div>
                        <div className="text-[11px] font-mono text-slate-300 mt-1 font-semibold">
                          Từ {formatVND(st.priceStandard)}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* STEP 2: CHỌN GHẾ NGỒI TRỰC QUAN (SEAT MAP) */}
          {currentStep === 'seats' && selectedShowtime && (
            <div className="space-y-6">
              
              {/* Screening Hall Info Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111420] border border-slate-800 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400">Phòng chiếu: </span>
                  <span className="font-bold text-white">{selectedShowtime.room}</span>
                  <span className="mx-2 text-slate-600">·</span>
                  <span className="text-slate-400">Định dạng: </span>
                  <span className="font-bold text-orange-400">{selectedShowtime.format}</span>
                </div>
                <div>
                  <span className="text-slate-400">Suất: </span>
                  <span className="font-bold text-white">{selectedShowtime.time} ({selectedShowtime.date})</span>
                </div>
              </div>

              {/* Cinema Screen Curve Component */}
              <div className="py-2 text-center">
                <div className="w-3/4 sm:w-2/3 h-8 mx-auto cinema-screen flex items-center justify-center">
                  <span className="text-[11px] font-extrabold tracking-widest text-orange-300 uppercase glow-orange-text">
                    MÀN HÌNH CHIẾU / SCREEN
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Mắt nhìn hướng về màn hình</div>
              </div>

              {/* Visual Seat Grid */}
              <div className="overflow-x-auto pb-4">
                <div className="min-w-[580px] max-w-2xl mx-auto space-y-2">
                  {seatRows.map((rowObj) => (
                    <div key={rowObj.row} className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {/* Row Label Left */}
                      <span className="w-5 text-center text-xs font-bold text-slate-500 font-mono">
                        {rowObj.row}
                      </span>

                      {/* Seats in this row */}
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {rowObj.seats.map((seat, colIdx) => {
                          const isOccupied = selectedShowtime.occupiedSeats.includes(seat.id);
                          const isSelected = selectedSeats.some((s) => s.id === seat.id);

                          // Insert aisle space in the middle (after column 5)
                          const hasAisle = colIdx === 4;

                          let seatClasses = '';
                          if (isOccupied) {
                            seatClasses = 'bg-[#1b1e2a] text-slate-600 border border-slate-800/80 cursor-not-allowed opacity-50';
                          } else if (isSelected) {
                            seatClasses = 'bg-orange-500 text-black font-extrabold border-orange-400 glow-orange-sm scale-110 shadow-lg';
                          } else if (seat.type === 'vip') {
                            seatClasses = 'bg-[#1c2133] hover:bg-orange-500/40 text-amber-300 border border-amber-500/40 hover:border-orange-500';
                          } else if (seat.type === 'couple') {
                            seatClasses = 'bg-[#291724] hover:bg-pink-600/50 text-pink-300 border border-pink-500/40 hover:border-pink-500';
                          } else {
                            seatClasses = 'bg-[#141724] hover:bg-orange-500/30 text-slate-300 border border-slate-700 hover:border-orange-500/60';
                          }

                          return (
                            <React.Fragment key={seat.id}>
                              <button
                                onClick={() => handleToggleSeat(seat)}
                                disabled={isOccupied}
                                title={`${seat.id} - ${seat.type.toUpperCase()} (${formatVND(seat.price)})`}
                                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-md text-[10px] sm:text-[11px] font-mono flex items-center justify-center transition-all duration-150 cursor-pointer ${seatClasses}`}
                              >
                                {isOccupied ? '✕' : seat.id.slice(1)}
                              </button>
                              {hasAisle && <div className="w-4 sm:w-6" />}
                            </React.Fragment>
                          );
                        })}
                      </div>

                      {/* Row Label Right */}
                      <span className="w-5 text-center text-xs font-bold text-slate-500 font-mono">
                        {rowObj.row}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seat Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#141724] border border-slate-700" />
                  <span>Ghế Thường ({formatVND(selectedShowtime.priceStandard)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#1c2133] border border-amber-500/50" />
                  <span className="text-amber-300">Ghế VIP ({formatVND(selectedShowtime.priceVip)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#291724] border border-pink-500/50" />
                  <span className="text-pink-300">Ghế Đôi ({formatVND(selectedShowtime.priceCouple)})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-orange-500 border border-orange-400 glow-orange-sm" />
                  <span className="text-orange-400 font-bold">Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#1b1e2a] border border-slate-800 opacity-50 flex items-center justify-center text-[9px] text-slate-500 font-bold">
                    ✕
                  </div>
                  <span>Đã bán</span>
                </div>
              </div>

              {/* Selected Seats Real-time strip */}
              <div className="p-4 bg-[#111420] border border-orange-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-400">Ghế bạn đã chọn:</div>
                  <div className="text-sm font-bold text-white flex flex-wrap gap-1.5 mt-1">
                    {selectedSeats.length === 0 ? (
                      <span className="text-slate-500 italic text-xs font-normal">Chưa chọn ghế nào. Nhấp vào ghế trên sơ đồ để chọn.</span>
                    ) : (
                      selectedSeats.map((s) => (
                        <span key={s.id} className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 text-xs font-mono font-bold">
                          {s.id} ({s.type})
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Tiền vé ({selectedSeats.length} ghế):</div>
                    <div className="text-base font-extrabold text-orange-400 font-mono">
                      {formatVND(seatTotal)}
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep('concessions')}
                    disabled={selectedSeats.length === 0}
                    className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Tiếp tục →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: CHỌN BẮP NƯỚC (CONCESSIONS) */}
          {currentStep === 'concessions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  Combo Bắp Rang Bơ & Nước Ngọt Siêu Tiết Kiệm
                </h3>
                <p className="text-xs text-slate-400">
                  Thưởng thức trọn vẹn bộ phim cùng các combo bắp nước hảo hạng của rạp CineGlow.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_CONCESSIONS.map((item) => {
                  const qty = concessionsCart[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-3.5 bg-[#121522] border border-slate-800 rounded-xl flex items-center gap-3.5 hover:border-slate-700 transition-colors"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{item.description}</p>
                        <div className="text-xs font-extrabold text-orange-400 font-mono mt-1">
                          {formatVND(item.price)}
                        </div>
                      </div>

                      {/* Stepper controls */}
                      <div className="flex items-center gap-2 bg-[#1b2032] border border-slate-700 rounded-lg p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleUpdateConcession(item.id, -1)}
                          disabled={qty === 0}
                          className="w-7 h-7 rounded bg-[#242b44] hover:bg-orange-500 hover:text-black text-slate-200 flex items-center justify-center font-bold text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          -
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-white font-mono">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateConcession(item.id, 1)}
                          className="w-7 h-7 rounded bg-[#242b44] hover:bg-orange-500 hover:text-black text-slate-200 flex items-center justify-center font-bold text-sm transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Navigation */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('seats')}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:text-white border border-slate-800"
                >
                  ← Quay lại chọn ghế
                </button>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Tổng cộng:</div>
                    <div className="text-base font-extrabold text-orange-400 font-mono">
                      {formatVND(grandTotal)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep('checkout')}
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    Tiến hành Xác nhận →
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 4: GIỎ HÀNG / XÁC NHẬN VÉ & THÔNG TIN KHÁCH HÀNG */}
          {currentStep === 'checkout' && selectedShowtime && selectedCinema && (
            <form onSubmit={handleCompleteBooking} className="space-y-6">
              
              {formError && (
                <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left 7 Cols: Customer Information & Payment Method */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="bg-[#111420] border border-slate-800 rounded-xl p-4 sm:p-5">
                    <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <User className="w-4 h-4 text-orange-400" />
                      Thông Tin Nhận Vé
                    </h3>

                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs text-slate-300 font-semibold mb-1">
                          Họ và tên khách hàng *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: Nguyễn Văn Minh"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full bg-[#171b2b] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs text-slate-300 font-semibold mb-1">
                            Số điện thoại *
                          </label>
                          <div className="relative">
                            <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                              type="tel"
                              required
                              placeholder="0912 345 678"
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              className="w-full bg-[#171b2b] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-semibold mb-1">
                            Email nhận vé điện tử
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                              type="email"
                              placeholder="example@gmail.com"
                              value={customerEmail}
                              onChange={(e) => setCustomerEmail(e.target.value)}
                              className="w-full bg-[#171b2b] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector (Simplified mock simulation) */}
                  <div className="bg-[#111420] border border-slate-800 rounded-xl p-4 sm:p-5">
                    <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-orange-400" />
                      Phương Thức Thanh Toán (Giả Lập)
                    </h3>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'momo', label: 'Ví MoMo', desc: 'Xác nhận tức thì qua app' },
                        { id: 'vnpay', label: 'VNPAY QR', desc: 'Quét mã ngân hàng' },
                        { id: 'card', label: 'Thẻ Quốc Tế / ATM', desc: 'Visa, Master, Napas' },
                        { id: 'counter', label: 'Thanh Toán Tại Quầy', desc: 'Nhận vé tại rạp' }
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-colors ${
                            paymentMethod === item.id
                              ? 'bg-orange-500/15 border-orange-500 text-white'
                              : 'bg-[#151927] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs">{item.label}</span>
                            <input
                              type="radio"
                              name="payment"
                              checked={paymentMethod === item.id}
                              onChange={() => setPaymentMethod(item.id as any)}
                              className="accent-orange-500"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1">{item.desc}</span>
                        </label>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-400 italic mt-3">
                      * Hệ thống không yêu cầu thanh toán online thật. Nhấp vào nút hoàn tất bên dưới để nhận ngay mã vé giả lập hợp lệ.
                    </p>
                  </div>
                </div>

                {/* Right 5 Cols: Detailed Order Summary Card */}
                <div className="lg:col-span-5">
                  <div className="bg-[#131724] border border-orange-500/40 rounded-2xl p-5 space-y-4 shadow-xl glow-orange-sm">
                    <div className="flex items-start gap-3 pb-3 border-b border-slate-800">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        referrerPolicy="no-referrer"
                        className="w-16 h-24 rounded-lg object-cover border border-slate-700 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500 text-black font-extrabold">
                          {movie.ageRating}
                        </span>
                        <h4 className="font-bold text-sm text-white line-clamp-1 mt-1 font-display">
                          {movie.title}
                        </h4>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {selectedCinema.name}
                        </div>
                        <div className="text-[11px] text-orange-400 font-semibold mt-0.5">
                          {selectedShowtime.room} · {selectedShowtime.format}
                        </div>
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2 text-xs text-slate-300 border-b border-slate-800 pb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Suất chiếu:</span>
                        <span className="font-semibold text-white">
                          {selectedShowtime.time} - {selectedShowtime.date}
                        </span>
                      </div>

                      <div className="flex items-start justify-between">
                        <span className="text-slate-400">Ghế ({selectedSeats.length}):</span>
                        <span className="font-bold text-orange-400 font-mono text-right">
                          {selectedSeats.map((s) => s.id).join(', ')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Tiền vé:</span>
                        <span className="font-mono text-slate-200">{formatVND(seatTotal)}</span>
                      </div>

                      {/* Concessions list if any */}
                      {Object.entries(concessionsCart).some(([_, q]) => q > 0) && (
                        <div className="pt-2 mt-2 border-t border-slate-800/80">
                          <div className="text-[11px] text-slate-400 mb-1">Bắp & Nước:</div>
                          {Object.entries(concessionsCart)
                            .filter(([_, q]) => q > 0)
                            .map(([itemId, q]) => {
                              const item = INITIAL_CONCESSIONS.find((c) => c.id === itemId);
                              if (!item) return null;
                              return (
                                <div key={itemId} className="flex justify-between text-[11px] text-slate-300">
                                  <span>{item.name} x{q}</span>
                                  <span className="font-mono">{formatVND(item.price * q)}</span>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-bold text-white">Tổng thanh toán:</span>
                      <span className="text-xl font-black text-orange-400 font-mono">
                        {formatVND(grandTotal)}
                      </span>
                    </div>

                    {/* Complete Booking CTA Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <Ticket className="w-5 h-5 stroke-[2.5]" />
                      <span>HOÀN TẤT ĐẶT VÉ</span>
                    </button>
                  </div>
                </div>

              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
