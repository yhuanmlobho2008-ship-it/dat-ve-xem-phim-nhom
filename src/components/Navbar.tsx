import React, { useState } from 'react';
import { Film, Ticket, ShieldCheck, Search, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: 'home' | 'now_showing' | 'coming_soon' | 'admin';
  setCurrentTab: (tab: 'home' | 'now_showing' | 'coming_soon' | 'admin') => void;
  onOpenMyTickets: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  bookedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenMyTickets,
  searchQuery,
  setSearchQuery,
  bookedCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#07080c]/90 backdrop-blur-md border-b border-orange-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            setCurrentTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0 focus-visible:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform duration-200">
            <Film className="w-5 h-5 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white font-display flex items-center gap-1">
              CINE<span className="text-orange-500">GLOW</span>
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-300">
          <button
            onClick={() => {
              setCurrentTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors whitespace-nowrap hover:text-orange-400 ${
              currentTab === 'home' ? 'text-orange-500 font-bold' : ''
            }`}
          >
            Trang Chủ
          </button>

          <button
            onClick={() => {
              setCurrentTab('now_showing');
              const el = document.getElementById('movies-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`transition-colors whitespace-nowrap hover:text-orange-400 ${
              currentTab === 'now_showing' ? 'text-orange-500 font-bold' : ''
            }`}
          >
            Phim Đang Chiếu
          </button>

          <button
            onClick={() => {
              setCurrentTab('coming_soon');
              const el = document.getElementById('movies-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`transition-colors whitespace-nowrap hover:text-orange-400 ${
              currentTab === 'coming_soon' ? 'text-orange-500 font-bold' : ''
            }`}
          >
            Phim Sắp Chiếu
          </button>

          <button
            onClick={onOpenMyTickets}
            className="flex items-center gap-1.5 transition-colors whitespace-nowrap hover:text-orange-400 text-slate-300"
          >
            <Ticket className="w-4 h-4 text-orange-500" />
            <span>Vé Của Tôi</span>
            {bookedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-orange-500 text-black text-xs font-bold rounded-full">
                {bookedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Search & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick search input */}
          <div className="relative hidden lg:block w-48 xl:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm phim, đạo diễn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131622] border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Toggle search on mobile */}
          <button
            onClick={() => setShowSearchInput(!showSearchInput)}
            className="lg:hidden p-2 rounded-lg bg-[#141620] text-slate-300 hover:text-orange-400 border border-slate-800"
            title="Tìm kiếm"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Admin Dashboard Switch */}
          <button
            onClick={() => setCurrentTab(currentTab === 'admin' ? 'home' : 'admin')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 border ${
              currentTab === 'admin'
                ? 'bg-orange-500 text-black border-orange-400 shadow-lg shadow-orange-500/20'
                : 'bg-[#151824] text-slate-200 border-slate-700/80 hover:border-orange-500/50 hover:text-orange-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{currentTab === 'admin' ? 'Thoát Quản Trị' : 'Quản Trị Admin'}</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#141620] text-slate-300 hover:text-white border border-slate-800"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search bar if toggled */}
      {showSearchInput && (
        <div className="lg:hidden px-4 pb-3 pt-1 border-t border-slate-800/80 bg-[#090b11]">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên phim, diễn viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131622] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-5 border-t border-slate-800/80 bg-[#0a0c13] space-y-2">
          <button
            onClick={() => {
              setCurrentTab('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-slate-200 hover:text-orange-400 rounded-md hover:bg-slate-900"
          >
            Trang Chủ
          </button>
          <button
            onClick={() => {
              setCurrentTab('now_showing');
              setMobileMenuOpen(false);
              const el = document.getElementById('movies-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-slate-200 hover:text-orange-400 rounded-md hover:bg-slate-900"
          >
            Phim Đang Chiếu
          </button>
          <button
            onClick={() => {
              setCurrentTab('coming_soon');
              setMobileMenuOpen(false);
              const el = document.getElementById('movies-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-slate-200 hover:text-orange-400 rounded-md hover:bg-slate-900"
          >
            Phim Sắp Chiếu
          </button>
          <button
            onClick={() => {
              onOpenMyTickets();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 text-sm font-medium text-orange-400 hover:text-orange-300 rounded-md hover:bg-slate-900 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Vé Của Tôi
            </span>
            {bookedCount > 0 && (
              <span className="px-2 py-0.5 bg-orange-500 text-black text-xs font-bold rounded-full">
                {bookedCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
