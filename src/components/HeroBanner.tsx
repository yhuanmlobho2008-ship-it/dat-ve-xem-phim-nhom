import React, { useState, useEffect } from 'react';
import { Movie } from '../types/cinema';
import { Play, Ticket, Star, Clock, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface HeroBannerProps {
  movies: Movie[];
  onBookMovie: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movies,
  onBookMovie,
  onViewDetails,
  onWatchTrailer
}) => {
  // Highlight top 4 movies
  const featured = movies.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto rotate banner every 7 seconds
  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) return null;
  const currentMovie = featured[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[600px] lg:h-[660px] overflow-hidden bg-black select-none border-b border-orange-500/20">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={currentMovie.backdropUrl || currentMovie.posterUrl}
          alt={currentMovie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.45] transition-all duration-1000 transform scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = currentMovie.posterUrl;
          }}
        />
        {/* Cinematic Scrims: Dark Vignette & Orange Bottom/Side Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-[#07080c]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080c] via-[#07080c]/80 to-transparent w-full md:w-3/4" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl pt-10 sm:pt-0">
          
          {/* Metadata Row: Clean Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-orange-400 font-semibold mb-3 tracking-wide uppercase">
            <span className="px-2 py-0.5 rounded bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold">
              {currentMovie.ageRating}
            </span>
            <span>{currentMovie.genre.slice(0, 2).join(' · ')}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              {currentMovie.duration} phút
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              {currentMovie.rating}/10
            </span>
          </div>

          {/* Movie Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-display leading-[1.1] mb-2 text-balance drop-shadow-md">
            {currentMovie.title}
          </h1>

          {currentMovie.originalTitle && (
            <p className="text-sm sm:text-base text-slate-400 font-medium mb-4 italic">
              {currentMovie.originalTitle}
            </p>
          )}

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 mb-6 max-w-xl font-normal leading-relaxed">
            {currentMovie.description}
          </p>

          {/* Formats Badges */}
          {currentMovie.formats && currentMovie.formats.length > 0 && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs text-slate-400">Định dạng:</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-300">
                {currentMovie.formats.map((fmt, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => onBookMovie(currentMovie)}
              className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            >
              <Ticket className="w-4 h-4 stroke-[2.5]" />
              <span>ĐẶT VÉ NGAY</span>
            </button>

            {currentMovie.trailerUrl && (
              <button
                onClick={() => onWatchTrailer(currentMovie)}
                className="flex items-center gap-2 px-5 py-3 bg-[#131622]/90 hover:bg-[#1c2030] text-slate-200 hover:text-white font-bold text-sm rounded-xl border border-slate-700 hover:border-orange-500/50 transition-all duration-200 cursor-pointer"
              >
                <Play className="w-4 h-4 text-orange-500 fill-orange-500" />
                <span>Trailer</span>
              </button>
            )}

            <button
              onClick={() => onViewDetails(currentMovie)}
              className="p-3 bg-[#131622]/90 hover:bg-[#1c2030] text-slate-300 hover:text-orange-400 rounded-xl border border-slate-700 transition-colors"
              title="Xem thông tin chi tiết"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-orange-500 hover:text-black text-slate-300 border border-slate-700/60 flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10"
        aria-label="Previous movie"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-orange-500 hover:text-black text-slate-300 border border-slate-700/60 flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10"
        aria-label="Next movie"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 right-6 sm:right-12 flex items-center gap-2 z-10">
        {featured.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-8 bg-orange-500 shadow-md shadow-orange-500/50'
                : 'w-2 bg-slate-600 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
