import React from 'react';
import { Movie } from '../types/cinema';
import { X, Play } from 'lucide-react';

interface TrailerModalProps {
  movie: Movie | null;
  onClose: () => void;
  onBookNow: (movie: Movie) => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  movie,
  onClose,
  onBookNow
}) => {
  if (!movie || !movie.trailerUrl) return null;

  // Extract YouTube embed URL
  const getEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : '';
  };

  const embedUrl = getEmbedUrl(movie.trailerUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-[#0d0f18] border border-orange-500/40 rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10 text-slate-100 flex flex-col glow-orange">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#121524] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-bold text-sm text-white font-display">
              Trailer Chính Thức: {movie.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-black text-slate-400 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`Trailer ${movie.title}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-sm text-slate-400 mb-3">
                Trailer sẵn sàng xem trực tiếp trên YouTube:
              </p>
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-orange-500 text-black font-bold text-xs rounded-lg"
              >
                Mở Trailer trên YouTube ↗
              </a>
            </div>
          )}
        </div>

        {/* Footer with Book CTA */}
        <div className="p-4 bg-[#121524] border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {movie.duration} phút · {movie.genre.join(', ')} · Đánh giá: {movie.rating}/10
          </div>

          <button
            onClick={() => {
              onClose();
              onBookNow(movie);
            }}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-black text-xs font-extrabold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            Đặt Vé Phim Này
          </button>
        </div>

      </div>
    </div>
  );
};
