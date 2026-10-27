import React from 'react';
import { BookingOrder } from '../types/cinema';
import { formatVND } from '../utils/storage';
import { CheckCircle2, Ticket, QrCode, Download, X, Film, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

interface BookingSuccessModalProps {
  order: BookingOrder | null;
  onClose: () => void;
  onViewMyTickets: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  order,
  onClose,
  onViewMyTickets
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative w-full max-w-lg bg-[#0e111a] border border-orange-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-orange-500/20 text-slate-100 flex flex-col glow-orange">
        
        {/* Top Header */}
        <div className="relative p-6 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-black text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-black flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="w-14 h-14 mx-auto mb-2 rounded-2xl bg-black text-orange-400 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight uppercase">
            ĐẶT VÉ THÀNH CÔNG!
          </h2>
          <p className="text-xs font-semibold text-black/80 mt-0.5">
            Mã vé đã được ghi nhận vào hệ thống CineGlow
          </p>

          {/* Booking Code Tag */}
          <div className="inline-block mt-3 px-4 py-1.5 bg-black rounded-full text-orange-400 font-mono font-black text-sm tracking-wider shadow-md">
            MÃ VÉ: {order.bookingCode}
          </div>
        </div>

        {/* Ticket Perforated Divider Styling */}
        <div className="relative h-4 bg-[#0e111a] flex items-center justify-between">
          <div className="w-4 h-8 rounded-r-full bg-black -mt-2 -ml-2" />
          <div className="w-full border-b-2 border-dashed border-slate-700 mx-2" />
          <div className="w-4 h-8 rounded-l-full bg-black -mt-2 -mr-2" />
        </div>

        {/* Digital Ticket Body */}
        <div className="p-6 space-y-5">
          
          {/* Movie Details Strip */}
          <div className="flex items-start gap-4">
            <img
              src={order.moviePoster}
              alt={order.movieTitle}
              referrerPolicy="no-referrer"
              className="w-18 h-26 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80';
              }}
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40">
                {order.format}
              </span>
              <h3 className="text-base font-extrabold text-white font-display line-clamp-2 mt-1">
                {order.movieTitle}
              </h3>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">{order.cinemaName}</span>
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {order.cinemaAddress}
              </p>
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-[#141724] border border-slate-800 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-orange-400" /> Ngày chiếu
              </span>
              <span className="font-bold text-white mt-0.5 block">{order.date}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-400" /> Suất chiếu
              </span>
              <span className="font-bold text-orange-400 mt-0.5 block">{order.time}</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Film className="w-3 h-3 text-orange-400" /> Phòng chiếu
              </span>
              <span className="font-bold text-white mt-0.5 block truncate">{order.room}</span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-slate-400 block text-[11px] flex items-center gap-1">
                <Ticket className="w-3 h-3 text-orange-400" /> Số ghế ({order.seats.length})
              </span>
              <span className="font-extrabold text-orange-400 font-mono text-sm mt-0.5 block">
                {order.seats.join(', ')}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Người đặt</span>
              <span className="font-semibold text-white mt-0.5 block truncate">{order.customerName}</span>
            </div>
          </div>

          {/* Concessions list if any */}
          {order.concessions && order.concessions.length > 0 && (
            <div className="p-3 bg-[#141724] border border-slate-800 rounded-xl text-xs">
              <span className="text-[11px] font-bold text-orange-400 block mb-1">
                Bắp nước kèm theo:
              </span>
              {order.concessions.map((c, i) => (
                <div key={i} className="flex justify-between text-slate-300 text-[11px]">
                  <span>{c.item.name} x{c.quantity}</span>
                  <span className="font-mono">{formatVND(c.item.price * c.quantity)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Total amount and Barcode / QR Section */}
          <div className="p-4 bg-[#111420] border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Tổng tiền thanh toán:</span>
              <span className="text-lg font-black text-orange-400 font-mono">
                {formatVND(order.totalAmount)}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                ✓ Đã thanh toán (Mô phỏng)
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <QrCode className="w-12 h-12 text-black" />
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1">Quét tại cổng soát vé</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="w-full sm:flex-1 py-3 px-4 bg-[#1a1f30] hover:bg-[#252c44] text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>In / Lưu Vé Điện Tử</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewMyTickets();
              }}
              className="w-full sm:flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Ticket className="w-4 h-4 stroke-[2.5]" />
              <span>Xem Vé Của Tôi</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
