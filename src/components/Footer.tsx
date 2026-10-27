import React from 'react';
import { Film, Phone, Mail, MapPin, ShieldCheck, Ticket } from 'lucide-react';

interface FooterProps {
  onOpenMyTickets: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenMyTickets, onOpenAdmin }) => {
  return (
    <footer className="bg-[#050609] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Brand & Intro */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-black font-extrabold shadow-md shadow-orange-500/30">
                <Film className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white font-display">
                CINE<span className="text-orange-500">GLOW</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hệ thống rạp chiếu phim hiện đại hàng đầu với công nghệ IMAX Laser, âm thanh Dolby Atmos và dịch vụ đặt vé trực tuyến nhanh chóng, tiện lợi.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] text-orange-400 font-bold">Hotline 24/7:</span>
              <span className="text-white font-mono font-bold">1900 6868</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
              Dịch Vụ & Tiện Ích
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('movies-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Phim đang chiếu tại rạp
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('movies-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-orange-400 transition-colors"
                >
                  Phim sắp chiếu bom tấn
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenMyTickets}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 text-orange-400 font-semibold"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  Tra cứu vé đã đặt
                </button>
              </li>
              <li>
                <span className="hover:text-orange-400 transition-colors cursor-pointer">
                  Khuyến mãi thẻ thành viên CineGlow Gold
                </span>
              </li>
              <li>
                <span className="hover:text-orange-400 transition-colors cursor-pointer">
                  Bắp nước & Combo ưu đãi
                </span>
              </li>
            </ul>
          </div>

          {/* Cinema Clusters */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
              Cụm Rạp Chiếu Phim
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>CineGlow Landmark 81 IMAX (TP. HCM)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>CineGlow Royal City IMAX (Hà Nội)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>CineGlow Hai Bà Trưng (Quận 1, TP. HCM)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>CineGlow Sông Hàn (Đà Nẵng)</span>
              </li>
            </ul>
          </div>

          {/* Admin & Security Policy */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-3">
              Hệ Thống Rạp
            </h4>
            <p className="text-slate-400 mb-3 text-xs">
              Dành cho quản lý rạp phim: Quản lý 20 phim chiếu, thêm lịch chiếu và kiểm tra thông tin đặt vé.
            </p>
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 bg-[#171b2b] hover:bg-orange-500 hover:text-black text-slate-200 border border-slate-700 hover:border-orange-500 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Trang Quản Trị Admin</span>
            </button>
            <div className="mt-4 text-[11px] text-slate-500">
              Giấy phép phát hành số 08/GP-CINE do Cục Điện ảnh cấp.
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 CineGlow Cinema. Nền tảng thương mại điện tử đặt vé xem phim trực tuyến hiện đại.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Điều khoản sử dụng</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Chính sách bảo mật</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">Quy chế hoạt động</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
