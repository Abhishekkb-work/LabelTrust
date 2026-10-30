import React from 'react';
import { ShieldCheck, Search, SlidersHorizontal, BookOpen, Globe } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenGuide: () => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  searchQuery,
  onSearchChange,
  compareCount,
  onOpenCompare,
  onOpenGuide,
  onLogoClick,
}) => {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-[11px] flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
          <p className="truncate">
            <span className="font-semibold text-slate-100">FSSAI Public Registry Sync</span> · Real-time trust scoring for packaged foods in India
          </p>
          <div className="ml-auto hidden md:flex items-center gap-3 shrink-0 text-slate-400">
            <span>FoSCoS Verified</span>
            <span aria-hidden="true">·</span>
            <span>Unbiased Safety Analytics</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">LabelTrust</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">FSSAI Regulatory & Trust Verifier</p>
            </div>
          </button>

          {/* Search Bar (Center) */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9.5 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Actions on Right */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Guide Button */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Learn how FSSAI licenses work"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">FSSAI Guide</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              disabled={compareCount === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs ${
                compareCount > 0
                  ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Compare</span>
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  compareCount > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {compareCount}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1" />
              {(['en', 'hi', 'kn'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                    currentLang === lang
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'ಕನ್ನಡ'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white outline-hidden"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
