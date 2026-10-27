import React from 'react';
import { Movie } from '../types/cinema';
import { Star, Clock, Ticket, Info, Play } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onBook: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  onWatchTrailer?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onBook,
  onViewDetails,
  onWatchTrailer
}) => {
  return (
    <div className="group relative bg-[#0d0f17] rounded-xl overflow-hidden border border-slate-800/80 hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Elegant fallback gradient with cinema placeholder
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-transparent to-black/30" />

        {/* Age Rating Tag & Status Tag */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 text-[11px] font-extrabold rounded bg-black/70 backdrop-blur-md border border-orange-500/40 text-orange-400">
            {movie.ageRating}
          </span>
          {movie.status === 'coming_soon' && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500 text-black">
              SẮP CHIẾU
            </span>
          )}
        </div>

        {/* Rating Tag */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-slate-700 text-amber-400 text-xs font-bold z-10">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span>{movie.rating}</span>
        </div>

        {/* Hover Quick Overlay Action */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-4 z-20">
          <button
            onClick={() => onBook(movie)}
            className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs rounded-lg shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <Ticket className="w-4 h-4 stroke-[2.5]" />
            <span>ĐẶT VÉ NGAY</span>
          </button>

          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => onViewDetails(movie)}
              className="flex-1 py-2 px-3 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Chi tiết</span>
            </button>

            {movie.trailerUrl && onWatchTrailer && (
              <button
                onClick={() => onWatchTrailer(movie)}
                className="py-2 px-3 bg-slate-900/90 hover:bg-slate-800 text-orange-400 font-semibold text-xs rounded-lg border border-slate-700 flex items-center justify-center transition-colors"
                title="Trailer"
              >
                <Play className="w-3.5 h-3.5 fill-orange-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Information Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata line: Duration & Genre */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-orange-400" />
              {movie.duration} phút
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{movie.genre.slice(0, 2).join(', ')}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(movie)}
            className="font-bold text-sm text-slate-100 hover:text-orange-400 transition-colors line-clamp-1 font-display cursor-pointer"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {movie.originalTitle && (
            <p className="text-[11px] text-slate-500 italic truncate mt-0.5">
              {movie.originalTitle}
            </p>
          )}
        </div>

        {/* Footer info: Formats */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            {(movie.formats || ['2D Phụ đề']).slice(0, 2).map((fmt, i) => (
              <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[#161926] text-slate-300 font-semibold border border-slate-800">
                {fmt}
              </span>
            ))}
          </div>

          <button
            onClick={() => onBook(movie)}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 group/btn"
          >
            <span>Đặt vé</span>
            <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>
      </div>

    </div>
  );
};
