import React from 'react';
import { BookingOrder } from '../types/cinema';
import { formatVND } from '../utils/storage';
import { X, Ticket, QrCode, Calendar, Clock, MapPin, Download, Trash2, Film } from 'lucide-react';

interface MyTicketsModalProps {
  bookings: BookingOrder[];
  onClose: () => void;
  onCancelTicket: (orderId: string) => void;
  onBookNow: () => void;
}

export const MyTicketsModal: React.FC<MyTicketsModalProps> = ({
  bookings,
  onClose,
  onCancelTicket,
  onBookNow
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-[#0b0e17] border border-orange-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-black text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#10131e] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-black flex items-center justify-center font-bold">
              <Ticket className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-display">
                Vé Xem Phim Của Tôi
              </h2>
              <p className="text-xs text-slate-400">
                Quản lý danh sách các vé rạp đã đặt ({bookings.length} vé)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#181c2b] hover:bg-orange-500 hover:text-black text-slate-400 border border-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="py-16 text-center">
              <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">Chưa có vé xem phim nào</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                Bạn chưa đặt vé nào trên CineGlow. Hãy chọn ngay một bộ phim bom tấn và tận hưởng trải nghiệm điện ảnh tuyệt vời!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onBookNow();
                }}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                Đặt Vé Ngay
              </button>
            </div>
          ) : (
            bookings.map((order) => (
              <div
                key={order.id}
                className="bg-[#121522] border border-slate-800 hover:border-orange-500/40 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                {/* Order Top Ribbon */}
                <div className="px-4 py-2 bg-[#171b2c] border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-orange-400">
                      MÃ VÉ: {order.bookingCode}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {order.status === 'confirmed' ? 'ĐÃ XÁC NHẬN' : 'ĐÃ HỦY VÉ'}
                  </span>
                </div>

                {/* Ticket Details */}
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={order.moviePoster}
                      alt={order.movieTitle}
                      referrerPolicy="no-referrer"
                      className="w-16 h-22 rounded-lg object-cover border border-slate-700 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80';
                      }}
                    />

                    <div>
                      <h4 className="text-sm font-extrabold text-white font-display line-clamp-1">
                        {order.movieTitle}
                      </h4>
                      <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                        <span className="truncate">{order.cinemaName}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                        <span className="flex items-center gap-1 font-semibold text-slate-200">
                          <Calendar className="w-3.5 h-3.5 text-orange-400" />
                          {order.date}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-orange-400">
                          <Clock className="w-3.5 h-3.5" />
                          {order.time}
                        </span>
                        <span className="text-slate-300">
                          {order.room} ({order.format})
                        </span>
                      </div>

                      <div className="mt-2 text-xs">
                        <span className="text-slate-400">Ghế: </span>
                        <span className="font-mono font-extrabold text-orange-400">
                          {order.seats.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side summary & action */}
                  <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800 gap-2 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block">Tổng thanh toán:</span>
                      <span className="text-sm sm:text-base font-extrabold text-orange-400 font-mono">
                        {formatVND(order.totalAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="p-2 rounded-lg bg-[#1a1f30] hover:bg-[#252c44] text-slate-200 border border-slate-700 text-xs transition-colors"
                        title="In vé"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn hủy mã vé ${order.bookingCode}?`)) {
                              onCancelTicket(order.id);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Hủy vé"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hủy vé</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
