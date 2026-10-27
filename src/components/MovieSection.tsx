import React, { useState, useMemo } from 'react';
import { Movie } from '../types/cinema';
import { MovieCard } from './MovieCard';
import { Filter, Sparkles, Film } from 'lucide-react';

interface MovieSectionProps {
  movies: Movie[];
  activeTab: 'now_showing' | 'coming_soon';
  setActiveTab: (tab: 'now_showing' | 'coming_soon') => void;
  onBookMovie: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  onWatchTrailer: (movie: Movie) => void;
  externalSearchQuery?: string;
}

export const MovieSection: React.FC<MovieSectionProps> = ({
  movies,
  activeTab,
  setActiveTab,
  onBookMovie,
  onViewDetails,
  onWatchTrailer,
  externalSearchQuery = ''
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'duration'>('rating');

  // Extract all unique genres
  const genres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => m.genre.forEach((g) => set.add(g)));
    return ['all', ...Array.from(set)];
  }, [movies]);

  // Filter movies
  const filteredMovies = useMemo(() => {
    return movies
      .filter((movie) => {
        // Status filter
        if (movie.status !== activeTab) return false;

        // Genre filter
        if (selectedGenre !== 'all' && !movie.genre.includes(selectedGenre)) {
          return false;
        }

        // Format filter
        if (selectedFormat !== 'all') {
          if (!movie.formats || !movie.formats.includes(selectedFormat)) {
            return false;
          }
        }

        // Search query
        if (externalSearchQuery.trim()) {
          const query = externalSearchQuery.toLowerCase();
          const matchTitle = movie.title.toLowerCase().includes(query);
          const matchOrig = movie.originalTitle?.toLowerCase().includes(query);
          const matchDirector = movie.director.toLowerCase().includes(query);
          const matchCast = movie.cast.some((c) => c.toLowerCase().includes(query));
          if (!matchTitle && !matchOrig && !matchDirector && !matchCast) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'duration') return b.duration - a.duration;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [movies, activeTab, selectedGenre, selectedFormat, sortBy, externalSearchQuery]);

  const nowShowingCount = movies.filter((m) => m.status === 'now_showing').length;
  const comingSoonCount = movies.filter((m) => m.status === 'coming_soon').length;

  return (
    <section id="movies-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-800/80">
        
        {/* Status Switcher (Interactive Segmented Control) */}
        <div className="flex items-center gap-2 p-1 bg-[#11131c] rounded-xl border border-slate-800/80 w-fit">
          <button
            onClick={() => setActiveTab('now_showing')}
            className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'now_showing'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PHIM ĐANG CHIẾU ({nowShowingCount})
          </button>

          <button
            onClick={() => setActiveTab('coming_soon')}
            className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeTab === 'coming_soon'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PHIM SẮP CHIẾU ({comingSoonCount})
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#131622] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
          >
            <option value="rating">Đánh giá cao nhất</option>
            <option value="title">Tên phim A-Z</option>
            <option value="duration">Thời lượng dài nhất</option>
          </select>
        </div>
      </div>

      {/* Filter Bar: Genres & Formats */}
      <div className="mb-8 space-y-3">
        {/* Genre buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5 shrink-0 pr-2">
            <Filter className="w-3.5 h-3.5 text-orange-400" />
            Thể loại:
          </span>

          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                selectedGenre === g
                  ? 'bg-orange-500/20 border-orange-500 text-orange-400 font-bold'
                  : 'bg-[#121520] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {g === 'all' ? 'Tất cả thể loại' : g}
            </button>
          ))}
        </div>

        {/* Format buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5 shrink-0 pr-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            Định dạng:
          </span>

          {['all', 'IMAX 2D', '3D Phụ đề', '2D Phụ đề', '4DX'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-150 cursor-pointer border ${
                selectedFormat === fmt
                  ? 'bg-orange-500/20 border-orange-500 text-orange-400 font-bold'
                  : 'bg-[#121520] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {fmt === 'all' ? 'Tất cả định dạng' : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Grid */}
      {filteredMovies.length === 0 ? (
        <div className="bg-[#10131d] border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto">
          <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">Không tìm thấy bộ phim phù hợp</h3>
          <p className="text-xs text-slate-400 mb-5">
            Hãy thử thay đổi thể loại, định dạng hoặc từ khóa tìm kiếm của bạn.
          </p>
          <button
            onClick={() => {
              setSelectedGenre('all');
              setSelectedFormat('all');
            }}
            className="px-4 py-2 bg-orange-500 text-black text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onBook={onBookMovie}
              onViewDetails={onViewDetails}
              onWatchTrailer={onWatchTrailer}
            />
          ))}
        </div>
      )}

    </section>
  );
};
