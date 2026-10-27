import React, { useState, useMemo } from 'react';
import { Movie, Cinema, Showtime, BookingOrder, CustomerAccount } from '../types/cinema';
import { formatVND } from '../utils/storage';
import { 
  Plus, Edit, Trash2, Search, Filter, ShieldCheck, Film, Users, 
  Calendar, DollarSign, Ticket, Clock, Star, CheckCircle2, XCircle, 
  Eye, RefreshCw, X
} from 'lucide-react';

interface AdminDashboardProps {
  movies: Movie[];
  cinemas: Cinema[];
  showtimes: Showtime[];
  bookings: BookingOrder[];
  customers: CustomerAccount[];
  onAddMovie: (movie: Movie) => void;
  onUpdateMovie: (movie: Movie) => void;
  onDeleteMovie: (movieId: string) => void;
  onAddShowtime: (showtime: Showtime) => void;
  onDeleteShowtime: (showtimeId: string) => void;
  onCancelBooking: (bookingId: string) => void;
  onResetDefaults: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  movies,
  cinemas,
  showtimes,
  bookings,
  customers,
  onAddMovie,
  onUpdateMovie,
  onDeleteMovie,
  onAddShowtime,
  onDeleteShowtime,
  onCancelBooking,
  onResetDefaults,
  onExitAdmin
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'movies' | 'bookings_customers' | 'showtimes'>('movies');
  const [movieSearch, setMovieSearch] = useState('');
  const [movieStatusFilter, setMovieStatusFilter] = useState<'all' | 'now_showing' | 'coming_soon'>('all');

  // Movie Modal state (Add or Edit)
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Showtime Modal state
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);

  // Form states for Movie Add/Edit
  const [movieForm, setMovieForm] = useState<Partial<Movie>>({
    title: '',
    originalTitle: '',
    posterUrl: '',
    backdropUrl: '',
    genre: ['Hành động'],
    duration: 120,
    rating: 8.5,
    ageRating: 'T16',
    description: '',
    releaseDate: new Date().toISOString().split('T')[0],
    status: 'now_showing',
    director: '',
    cast: [],
    trailerUrl: '',
    language: 'Tiếng Anh - Phụ đề Tiếng Việt',
    formats: ['2D Phụ đề']
  });

  // Form states for Showtime Add
  const [showtimeForm, setShowtimeForm] = useState({
    movieId: movies[0]?.id || '',
    cinemaId: cinemas[0]?.id || '',
    room: 'Phòng 01 - Laser',
    format: '2D Phụ đề' as any,
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    priceStandard: 90000,
    priceVip: 120000,
    priceCouple: 240000
  });

  // Calculate Metrics
  const metrics = useMemo(() => {
    const totalRevenue = bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalTicketsSold = bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.seats.length, 0);

    return {
      totalRevenue,
      totalTicketsSold,
      totalOrders: bookings.length,
      totalMovies: movies.length,
      totalCustomers: customers.length
    };
  }, [bookings, movies, customers]);

  // Filtered movies
  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const matchStatus = movieStatusFilter === 'all' || m.status === movieStatusFilter;
      const matchSearch =
        m.title.toLowerCase().includes(movieSearch.toLowerCase()) ||
        (m.originalTitle && m.originalTitle.toLowerCase().includes(movieSearch.toLowerCase())) ||
        m.director.toLowerCase().includes(movieSearch.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [movies, movieStatusFilter, movieSearch]);

  // Open Add Movie Modal
  const handleOpenAddMovie = () => {
    setEditingMovie(null);
    setMovieForm({
      id: `mov-${Date.now()}`,
      title: '',
      originalTitle: '',
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      genre: ['Hành động', 'Kỳ ảo'],
      duration: 125,
      rating: 8.5,
      ageRating: 'T16',
      description: '',
      releaseDate: new Date().toISOString().split('T')[0],
      status: 'now_showing',
      director: '',
      cast: ['Diễn viên chính 1', 'Diễn viên chính 2'],
      trailerUrl: '',
      language: 'Tiếng Anh - Phụ đề Tiếng Việt',
      formats: ['2D Phụ đề', 'IMAX 2D']
    });
    setIsMovieModalOpen(true);
  };

  // Open Edit Movie Modal
  const handleOpenEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setMovieForm({ ...movie });
    setIsMovieModalOpen(true);
  };

  // Save Movie (Add or Edit)
  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieForm.title || !movieForm.posterUrl) {
      alert('Vui lòng điền đầy đủ tên phim và đường dẫn poster.');
      return;
    }

    const movieToSave: Movie = {
      id: editingMovie ? editingMovie.id : `mov-${Date.now()}`,
      title: movieForm.title || '',
      originalTitle: movieForm.originalTitle || '',
      posterUrl: movieForm.posterUrl || '',
      backdropUrl: movieForm.backdropUrl || movieForm.posterUrl,
      genre: Array.isArray(movieForm.genre) ? movieForm.genre : [(movieForm.genre as any) || 'Hành động'],
      duration: Number(movieForm.duration) || 120,
      rating: Number(movieForm.rating) || 8.0,
      ageRating: (movieForm.ageRating as any) || 'T16',
      description: movieForm.description || '',
      releaseDate: movieForm.releaseDate || new Date().toISOString().split('T')[0],
      status: (movieForm.status as any) || 'now_showing',
      director: movieForm.director || 'Chưa cập nhật',
      cast: Array.isArray(movieForm.cast) ? movieForm.cast : [(movieForm.cast as any) || ''],
      trailerUrl: movieForm.trailerUrl || '',
      language: movieForm.language || 'Tiếng Anh - Phụ đề Tiếng Việt',
      formats: movieForm.formats || ['2D Phụ đề']
    };

    if (editingMovie) {
      onUpdateMovie(movieToSave);
    } else {
      onAddMovie(movieToSave);
    }

    setIsMovieModalOpen(false);
  };

  // Save Showtime
  const handleSaveShowtime = (e: React.FormEvent) => {
    e.preventDefault();
    const newSt: Showtime = {
      id: `st-${Date.now()}`,
      movieId: showtimeForm.movieId,
      cinemaId: showtimeForm.cinemaId,
      room: showtimeForm.room,
      format: showtimeForm.format,
      date: showtimeForm.date,
      time: showtimeForm.time,
      priceStandard: Number(showtimeForm.priceStandard),
      priceVip: Number(showtimeForm.priceVip),
      priceCouple: Number(showtimeForm.priceCouple),
      occupiedSeats: []
    };

    onAddShowtime(newSt);
    setIsShowtimeModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-[#10131f] border border-orange-500/30 rounded-2xl shadow-xl glow-orange-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-lg">
            <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white font-display">
                HỆ THỐNG QUẢN TRỊ RẠP CINEGLOW
              </h1>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-bold">
                ADMIN PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Quản lý danh sách phim, lịch chiếu, khách hàng và doanh thu đặt vé thời gian thực.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu (20 phim gốc, lịch chiếu và khách hàng)?')) {
                onResetDefaults();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-[#171b2b] hover:bg-[#20263c] text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Khôi phục dữ liệu mẫu gốc"
          >
            <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Khôi Phục Mẫu</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black text-xs font-extrabold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            Về Trang Khách Hàng
          </button>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#111420] border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
            <span>Tổng Doanh Thu</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {formatVND(metrics.totalRevenue)}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            Giao dịch hoàn tất
          </div>
        </div>

        <div className="p-4 bg-[#111420] border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
            <span>Tổng Vé Đã Bán</span>
            <Ticket className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-orange-400 font-mono">
            {metrics.totalTicketsSold} <span className="text-sm font-normal text-slate-400">vé</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Trên tổng {metrics.totalOrders} đơn đặt
          </div>
        </div>

        <div className="p-4 bg-[#111420] border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
            <span>Kho Phim Rạp</span>
            <Film className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {metrics.totalMovies} <span className="text-sm font-normal text-slate-400">bộ phim</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {movies.filter((m) => m.status === 'now_showing').length} đang chiếu · {movies.filter((m) => m.status === 'coming_soon').length} sắp chiếu
          </div>
        </div>

        <div className="p-4 bg-[#111420] border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 mb-1 text-xs">
            <span>Khách Hàng Thành Viên</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono">
            {metrics.totalCustomers} <span className="text-sm font-normal text-slate-400">tài khoản</span>
          </div>
          <div className="text-[11px] text-sky-400 font-semibold mt-1">
            Hạng Kim Cương / Vàng / Bạc
          </div>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#111420] rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveAdminTab('movies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'movies'
              ? 'bg-orange-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Quản Lý Phim ({movies.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('bookings_customers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'bookings_customers'
              ? 'bg-orange-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Khách Hàng & Đơn Đặt Vé ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('showtimes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeAdminTab === 'showtimes'
              ? 'bg-orange-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Lịch Chiếu & Suất Rạp ({showtimes.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: QUẢN LÝ PHIM ================= */}
      {activeAdminTab === 'movies' && (
        <div className="space-y-4">
          
          {/* Controls: Search, Filter, Add Movie */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111420] p-4 rounded-xl border border-slate-800">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Tìm phim, đạo diễn..."
                  value={movieSearch}
                  onChange={(e) => setMovieSearch(e.target.value)}
                  className="w-full bg-[#181c2c] border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <select
                value={movieStatusFilter}
                onChange={(e) => setMovieStatusFilter(e.target.value as any)}
                className="bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="now_showing">Đang chiếu</option>
                <option value="coming_soon">Sắp chiếu</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddMovie}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black text-xs font-extrabold rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm Phim Mới</span>
            </button>
          </div>

          {/* Movies Table */}
          <div className="bg-[#111420] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#171b2c] text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Poster & Phim</th>
                    <th className="py-3 px-4">Thể Loại</th>
                    <th className="py-3 px-4">Thời Lượng</th>
                    <th className="py-3 px-4">Đánh Giá</th>
                    <th className="py-3 px-4">Độ Tuổi</th>
                    <th className="py-3 px-4">Trạng Thái</th>
                    <th className="py-3 px-4">Khởi Chiếu</th>
                    <th className="py-3 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredMovies.map((movie) => (
                    <tr key={movie.id} className="hover:bg-[#151928] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-14 rounded object-cover border border-slate-700 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div>
                            <div className="font-bold text-white text-xs">{movie.title}</div>
                            {movie.originalTitle && (
                              <div className="text-[11px] text-slate-500 italic">{movie.originalTitle}</div>
                            )}
                            <div className="text-[10px] text-slate-400 mt-0.5">ĐD: {movie.director}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {movie.genre.slice(0, 2).map((g, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1c2134] text-slate-300">
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-medium">
                        {movie.duration} phút
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{movie.rating}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-[10px]">
                          {movie.ageRating}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => {
                            const newStatus = movie.status === 'now_showing' ? 'coming_soon' : 'now_showing';
                            onUpdateMovie({ ...movie, status: newStatus });
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            movie.status === 'now_showing'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                          }`}
                          title="Nhấp để đổi trạng thái"
                        >
                          {movie.status === 'now_showing' ? 'Đang chiếu' : 'Sắp chiếu'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {movie.releaseDate}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditMovie(movie)}
                            className="p-1.5 rounded-lg bg-[#1c2134] hover:bg-orange-500 hover:text-black text-slate-300 transition-colors"
                            title="Sửa phim"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc muốn xóa bộ phim "${movie.title}"?`)) {
                                onDeleteMovie(movie.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#1c2134] hover:bg-red-500 hover:text-white text-red-400 transition-colors"
                            title="Xóa phim"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: KHÁCH HÀNG & ĐƠN ĐẶT VÉ ================= */}
      {activeAdminTab === 'bookings_customers' && (
        <div className="space-y-8">
          
          {/* Sub-section A: Real-time Customer Bookings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-orange-400" />
                Danh Sách Đơn Đặt Vé Khách Hàng ({bookings.length})
              </h3>
            </div>

            <div className="bg-[#111420] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#171b2c] text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Mã Vé</th>
                      <th className="py-3 px-4">Khách Hàng</th>
                      <th className="py-3 px-4">Phim & Rạp</th>
                      <th className="py-3 px-4">Suất & Ngày</th>
                      <th className="py-3 px-4">Ghế Đã Đặt</th>
                      <th className="py-3 px-4">Tổng Tiền</th>
                      <th className="py-3 px-4">Thanh Toán</th>
                      <th className="py-3 px-4">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Hành Động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-[#151928] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-orange-400">
                          {b.bookingCode}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{b.customerName}</div>
                          <div className="text-[11px] text-slate-400">{b.customerPhone}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{b.customerEmail}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-white truncate max-w-[160px]">{b.movieTitle}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-[160px]">{b.cinemaName}</div>
                          <div className="text-[10px] text-orange-400">{b.room} · {b.format}</div>
                        </td>

                        <td className="py-3 px-4 font-mono">
                          <div className="font-bold text-slate-200">{b.time}</div>
                          <div className="text-[11px] text-slate-400">{b.date}</div>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold text-orange-400">
                          {b.seats.join(', ')}
                        </td>

                        <td className="py-3 px-4 font-mono font-extrabold text-white">
                          {formatVND(b.totalAmount)}
                        </td>

                        <td className="py-3 px-4 uppercase text-[10px] font-bold text-slate-300">
                          {b.paymentMethod}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-red-500/20 text-red-400 border border-red-500/40'
                            }`}
                          >
                            {b.status === 'confirmed' ? 'ĐÃ XÁC NHẬN' : 'ĐÃ HỦY'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => {
                                if (confirm(`Hủy mã vé ${b.bookingCode} của khách ${b.customerName}?`)) {
                                  onCancelBooking(b.id);
                                }
                              }}
                              className="px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold transition-colors"
                            >
                              Hủy vé
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sub-section B: Mock Registered Customer Accounts */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                Danh Sách Tài Khoản Khách Hàng Giả Định ({customers.length})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {customers.map((c) => (
                <div key={c.id} className="p-4 bg-[#111420] border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-orange-400 text-sm">
                        {c.name.split(' ').slice(-1)[0][0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">{c.name}</h4>
                        <p className="text-[11px] text-slate-400">{c.phone}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        c.tier === 'Kim Cương'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : c.tier === 'Vàng'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-700/40 text-slate-300 border border-slate-600'
                      }`}
                    >
                      {c.tier}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Điểm thưởng</span>
                      <span className="font-mono font-bold text-orange-400">{c.totalPoints}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Số vé đã mua</span>
                      <span className="font-mono font-bold text-white">{c.ordersCount} vé</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tổng chi tiêu</span>
                      <span className="font-mono font-bold text-slate-200">{formatVND(c.totalSpent)}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 pt-1">
                    Email: {c.email} · Tham gia: {c.joinedDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 3: QUẢN LÝ LỊCH CHIẾU ================= */}
      {activeAdminTab === 'showtimes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#111420] p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Lịch Chiếu Phim Tại Các Rạp</h3>
              <p className="text-xs text-slate-400">Xem và bổ sung các suất chiếu mới cho các rạp CineGlow</p>
            </div>

            <button
              onClick={() => setIsShowtimeModalOpen(true)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black text-xs font-extrabold rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm Suất Chiếu Mới</span>
            </button>
          </div>

          <div className="bg-[#111420] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#171b2c] text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tên Phim</th>
                    <th className="py-3 px-4">Rạp Chiếu</th>
                    <th className="py-3 px-4">Phòng & Định Dạng</th>
                    <th className="py-3 px-4">Ngày Chiếu</th>
                    <th className="py-3 px-4">Giờ Chiếu</th>
                    <th className="py-3 px-4">Giá Vé (Thường/VIP)</th>
                    <th className="py-3 px-4">Ghế Đã Bán</th>
                    <th className="py-3 px-4 text-right">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {showtimes.map((st) => {
                    const m = movies.find((mov) => mov.id === st.movieId);
                    const c = cinemas.find((cin) => cin.id === st.cinemaId);

                    return (
                      <tr key={st.id} className="hover:bg-[#151928] transition-colors">
                        <td className="py-3 px-4 font-bold text-white">
                          {m?.title || st.movieId}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {c?.name || st.cinemaId}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-200">{st.room}</span>
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold">
                            {st.format}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{st.date}</td>
                        <td className="py-3 px-4 font-mono font-bold text-orange-400">{st.time}</td>
                        <td className="py-3 px-4 font-mono">
                          {formatVND(st.priceStandard)} / {formatVND(st.priceVip)}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">
                          {st.occupiedSeats.length > 0 ? (
                            <span className="text-amber-400 font-bold">
                              {st.occupiedSeats.length} ghế ({st.occupiedSeats.slice(0, 3).join(', ')}...)
                            </span>
                          ) : (
                            <span className="text-slate-500">Chưa bán</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm('Xóa suất chiếu này?')) {
                                onDeleteShowtime(st.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#1c2134] hover:bg-red-500 hover:text-white text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM / SỬA PHIM ================= */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-2xl bg-[#0e111a] border border-orange-500/40 rounded-2xl overflow-hidden shadow-2xl text-slate-100 max-h-[90vh] flex flex-col">
            
            <div className="px-5 py-4 bg-[#141724] border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-white font-display">
                {editingMovie ? `Chỉnh sửa phim: ${editingMovie.title}` : 'Thêm Phim Mới Vào Rạp'}
              </h3>
              <button
                onClick={() => setIsMovieModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-black text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="p-5 overflow-y-auto space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tên Phim (Tiếng Việt) *</label>
                  <input
                    type="text"
                    required
                    value={movieForm.title || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tên Gốc (Original Title)</label>
                  <input
                    type="text"
                    value={movieForm.originalTitle || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, originalTitle: e.target.value })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Link Ảnh Poster (Unsplash URL) *</label>
                  <input
                    type="url"
                    required
                    value={movieForm.posterUrl || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Link Ảnh Backdrop (Ngang)</label>
                  <input
                    type="url"
                    value={movieForm.backdropUrl || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, backdropUrl: e.target.value })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Thời Lượng (Phút)</label>
                  <input
                    type="number"
                    min="30"
                    max="300"
                    value={movieForm.duration || 120}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: Number(e.target.value) })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Đánh Giá (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={movieForm.rating || 8.0}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: Number(e.target.value) })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Độ Tuổi</label>
                  <select
                    value={movieForm.ageRating || 'T16'}
                    onChange={(e) => setMovieForm({ ...movieForm, ageRating: e.target.value as any })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="P">P (Phổ biến)</option>
                    <option value="K">K (Dưới 13 kèm phụ huynh)</option>
                    <option value="T13">T13 (Từ 13 tuổi)</option>
                    <option value="T16">T16 (Từ 16 tuổi)</option>
                    <option value="T18">T18 (Từ 18 tuổi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Trạng Thái Chiếu</label>
                  <select
                    value={movieForm.status || 'now_showing'}
                    onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value as any })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="now_showing">Đang Chiếu (Now Showing)</option>
                    <option value="coming_soon">Sắp Chiếu (Coming Soon)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ngày Khởi Chiếu</label>
                  <input
                    type="date"
                    value={movieForm.releaseDate || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Thể Loại (Cách nhau bằng dấu phẩy)</label>
                <input
                  type="text"
                  placeholder="Hành động, Phiêu lưu, Viễn tưởng"
                  value={Array.isArray(movieForm.genre) ? movieForm.genre.join(', ') : movieForm.genre}
                  onChange={(e) =>
                    setMovieForm({
                      ...movieForm,
                      genre: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })
                  }
                  className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Đạo Diễn</label>
                  <input
                    type="text"
                    value={movieForm.director || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Diễn Viên Chính (Cách nhau bởi dấu phẩy)</label>
                  <input
                    type="text"
                    value={Array.isArray(movieForm.cast) ? movieForm.cast.join(', ') : movieForm.cast}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        cast: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      })
                    }
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Trailer YouTube URL</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={movieForm.trailerUrl || ''}
                  onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                  className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mô Tả Ngắn Tóm Tắt Phim</label>
                <textarea
                  rows={3}
                  required
                  value={movieForm.description || ''}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold shadow-md shadow-orange-500/20"
                >
                  Lưu Thông Tin Phim
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM SUẤT CHIẾU ================= */}
      {isShowtimeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-md bg-[#0e111a] border border-orange-500/40 rounded-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col">
            
            <div className="px-5 py-4 bg-[#141724] border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-white font-display">
                Thêm Suất Chiếu Mới
              </h3>
              <button
                onClick={() => setIsShowtimeModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-black text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShowtime} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Chọn Phim</label>
                <select
                  value={showtimeForm.movieId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, movieId: e.target.value })}
                  className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Chọn Rạp Chiếu</label>
                <select
                  value={showtimeForm.cinemaId}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, cinemaId: e.target.value })}
                  className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phòng Chiếu</label>
                  <input
                    type="text"
                    required
                    value={showtimeForm.room}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, room: e.target.value })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Định Dạng</label>
                  <select
                    value={showtimeForm.format}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, format: e.target.value as any })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="2D Phụ đề">2D Phụ đề</option>
                    <option value="2D Lồng tiếng">2D Lồng tiếng</option>
                    <option value="3D Phụ đề">3D Phụ đề</option>
                    <option value="IMAX 2D">IMAX 2D</option>
                    <option value="4DX">4DX</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ngày Chiếu</label>
                  <input
                    type="date"
                    required
                    value={showtimeForm.date}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, date: e.target.value })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Giờ Chiếu</label>
                  <input
                    type="time"
                    required
                    value={showtimeForm.time}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, time: e.target.value })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ghế Thường</label>
                  <input
                    type="number"
                    value={showtimeForm.priceStandard}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, priceStandard: Number(e.target.value) })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-2 py-2 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ghế VIP</label>
                  <input
                    type="number"
                    value={showtimeForm.priceVip}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, priceVip: Number(e.target.value) })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-2 py-2 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ghế Đôi</label>
                  <input
                    type="number"
                    value={showtimeForm.priceCouple}
                    onChange={(e) => setShowtimeForm({ ...showtimeForm, priceCouple: Number(e.target.value) })}
                    className="w-full bg-[#181c2c] border border-slate-700 rounded-lg px-2 py-2 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsShowtimeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-extrabold shadow-md shadow-orange-500/20"
                >
                  Tạo Suất Chiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
