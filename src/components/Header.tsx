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

  const cycleLanguage = () => {
    if (currentLang === 'en') onLanguageChange('hi');
    else if (currentLang === 'hi') onLanguageChange('kn');
    else onLanguageChange('en');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full max-w-full overflow-hidden">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 px-3 sm:px-4 py-1.5 text-[10px] sm:text-[11px] flex items-center justify-between border-b border-slate-800 w-full">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
          <p className="truncate text-slate-300">
            <span className="font-semibold text-slate-100">FSSAI Registry Sync</span> · Food Safety Trust & Violation Verifier
          </p>
          <div className="ml-auto hidden md:flex items-center gap-3 shrink-0 text-slate-400">
            <span>FoSCoS Verified</span>
            <span aria-hidden="true">·</span>
            <span>Unbiased Safety Analytics</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          {/* Logo */}
          <button
            onClick={onLogoClick}
            className="flex items-center gap-2 text-left group shrink-0 focus:outline-hidden"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">LabelTrust</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  IN
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate hidden sm:block">
                FSSAI Regulatory & Trust Verifier
              </p>
            </div>
          </button>

          {/* Search Bar (Desktop Center) */}
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
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Guide Button (Desktop) */}
            <button
              onClick={onOpenGuide}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              title="Learn how FSSAI licenses work"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>FSSAI Guide</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={onOpenCompare}
              disabled={compareCount === 0}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-xl transition-all shadow-xs ${
                compareCount > 0
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
              title="Compare selected products"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Compare</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  compareCount > 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}
              >
                {compareCount}
              </span>
            </button>

            {/* Language Switcher - Compact for Mobile & Full for Desktop */}
            {/* Mobile Language Button */}
            <button
              onClick={cycleLanguage}
              className="md:hidden flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200"
              title="Change language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentLang === 'en' ? 'EN' : currentLang === 'hi' ? 'हिं' : 'ಕನ್ನ'}</span>
            </button>

            {/* Desktop Language Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
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
        <div className="mt-2 md:hidden w-full">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-7 py-2 bg-slate-100 text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-slate-200 focus:border-emerald-500 focus:bg-white outline-hidden box-border"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
