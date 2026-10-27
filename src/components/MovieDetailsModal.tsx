import React, { useState, useMemo } from 'react';
import { Movie, Cinema, Showtime } from '../types/cinema';
import { getFormattedDate, getDisplayDateLabel } from '../data/initialShowtimes';
import { X, Star, Clock, Calendar, Film, Play, Ticket, MapPin } from 'lucide-react';

interface MovieDetailsModalProps {
  movie: Movie | null;
  cinemas: Cinema[];
  showtimes: Showtime[];
  onClose: () => void;
  onSelectShowtime: (movie: Movie, cinema: Cinema, showtime: Showtime) => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  cinemas,
  showtimes,
  onClose,
  onSelectShowtime
}) => {
  if (!movie) return null;

  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate(0));
  const [isPlayingTrailer, setIsPlayingTrailer] = useState<boolean>(false);

  // Available dates
  const availableDates = [getFormattedDate(0), getFormattedDate(1), getFormattedDate(2)];

  // Group showtimes for this movie by Cinema for the selected date
  const cinemaShowtimes = useMemo(() => {
    const movieSts = showtimes.filter(
      (st) => st.movieId === movie.id && st.date === selectedDate
    );

    return cinemas
      .map((cinema) => {
        const sts = movieSts.filter((st) => st.cinemaId === cinema.id);
        return { cinema, showtimes: sts };
      })
      .filter((group) => group.showtimes.length > 0);
  }, [movie.id, cinemas, showtimes, selectedDate]);

  // Extract YouTube video ID
  const getEmbedUrl = (url?: string) => {
    if (!url) return '';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-[#0e111a] border border-orange-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-black text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-orange-500 hover:text-black text-slate-300 border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-7 space-y-6">
          
          {/* Header Banner / Video */}
          {isPlayingTrailer && movie.trailerUrl ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-orange-500/30">
              <iframe
                src={getEmbedUrl(movie.trailerUrl)}
                title={movie.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-slate-800">
              <img
                src={movie.backdropUrl || movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-[0.5]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e111a] via-[#0e111a]/40 to-transparent" />

              {movie.trailerUrl && (
                <button
                  onClick={() => setIsPlayingTrailer(true)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600 text-black flex items-center justify-center shadow-xl shadow-orange-500/40 hover:scale-110 transition-all cursor-pointer z-10"
                >
                  <Play className="w-7 h-7 fill-black ml-1" />
                </button>
              )}

              <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-24 sm:w-28 rounded-lg shadow-xl border border-slate-700 object-cover aspect-[3/4]"
                />
                <div className="flex-1">
                  <span className="px-2 py-0.5 rounded bg-orange-500 text-black text-xs font-black">
                    {movie.ageRating}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-1">
                    {movie.title}
                  </h2>
                  {movie.originalTitle && (
                    <p className="text-xs text-slate-400 italic">{movie.originalTitle}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Details & Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Synopsis & Cast */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1.5">
                  Nội dung phim
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {movie.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <span className="text-slate-400 block mb-0.5">Đạo diễn</span>
                  <span className="font-semibold text-slate-200">{movie.director}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Thời lượng</span>
                  <span className="font-semibold text-slate-200">{movie.duration} phút</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Ngôn ngữ</span>
                  <span className="font-semibold text-slate-200">{movie.language || 'Tiếng Anh - Phụ đề'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Khởi chiếu</span>
                  <span className="font-semibold text-slate-200">{movie.releaseDate}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Diễn viên chính</span>
                <p className="text-xs font-semibold text-slate-200">
                  {movie.cast.join(', ')}
                </p>
              </div>
            </div>

            {/* Right 1 Col: Score & Tags */}
            <div className="bg-[#141724] border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400">Đánh giá</span>
                <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-lg">
                  <Star className="w-5 h-5 fill-amber-400" />
                  <span>{movie.rating}</span>
                  <span className="text-xs text-slate-500 font-normal">/10</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1.5">Thể loại</span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.genre.map((g, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded bg-[#1c2032] text-orange-400 font-medium border border-orange-500/20">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1.5">Định dạng chiếu</span>
                <div className="flex flex-wrap gap-1.5">
                  {(movie.formats || ['2D Phụ đề']).map((f, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Showtimes Selection Section */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                Lịch chiếu rạp & Suất khả dụng
              </h3>

              {/* Date Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#141724] rounded-lg border border-slate-800">
                {availableDates.map((date) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      selectedDate === date
                        ? 'bg-orange-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {getDisplayDateLabel(date)}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Cinema Showtimes */}
            {cinemaShowtimes.length === 0 ? (
              <div className="bg-[#141724] border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
                Chưa có suất chiếu mở bán cho ngày này. Vui lòng chọn ngày khác hoặc rạp khác.
              </div>
            ) : (
              <div className="space-y-4">
                {cinemaShowtimes.map(({ cinema, showtimes: sts }) => (
                  <div key={cinema.id} className="bg-[#141724] border border-slate-800 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          {cinema.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{cinema.address}</p>
                      </div>
                      <span className="text-[11px] font-bold text-orange-400 shrink-0">
                        {cinema.city}
                      </span>
                    </div>

                    {/* Time slots buttons */}
                    <div className="flex flex-wrap gap-2.5">
                      {sts.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => {
                            onSelectShowtime(movie, cinema, st);
                          }}
                          className="px-3.5 py-2 rounded-lg bg-[#1f2438] hover:bg-orange-500 hover:text-black border border-slate-700 hover:border-orange-400 transition-all text-left group cursor-pointer"
                        >
                          <div className="text-xs font-black text-white group-hover:text-black flex items-center gap-1">
                            {st.time}
                          </div>
                          <div className="text-[10px] text-orange-400 group-hover:text-black/80 font-bold">
                            {st.format}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
