import React from 'react';
import {
  GraduationCap,
  BarChart3,
  BookOpen,
  Settings,
  Menu,
  Sun,
  Moon,
  Compass,
  Download
} from 'lucide-react';
import { NavTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onStartPlacement: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userProfile: UserProfile;
  dueCount?: number;
  onOpenInstall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onStartPlacement,
  isDarkMode,
  onToggleDarkMode,
  userProfile,
  dueCount = 0,
  onOpenInstall
}) => {
  return (
    <>
      {/* Desktop Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
          isDarkMode
            ? 'bg-[#0c1420]/95 border-b border-[#2d3542]/60 text-[#dbe3f4]'
            : 'bg-[#f7f9ff]/95 border-b border-[#dde3eb]/70 text-[#161c22]'
        } backdrop-blur-md shadow-xs`}
      >
        <div className="max-w-[1024px] mx-auto px-5 md:px-10 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('learn')}
              className="flex items-center gap-2 group cursor-pointer text-left"
              title="ΛΟΓΟΣ Greek"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-400/30 shadow-xs">
                <img src="./icons/icon-96x96.png" alt="Λ" className="w-full h-full object-cover" />
              </div>
              <span
                className={`font-display text-2xl font-bold tracking-widest transition-colors ${
                  isDarkMode ? 'text-[#ffd700]' : 'text-[#004379]'
                }`}
              >
                ΛΟΓΟΣ
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'learn'
                  ? isDarkMode
                    ? 'bg-[#3d91ff]/20 text-[#a9c7ff] shadow-xs'
                    : 'bg-[#c8f17a]/40 text-[#004379] font-bold shadow-xs'
                  : isDarkMode
                  ? 'text-[#c1c6d5] hover:text-white hover:bg-[#1e293b]'
                  : 'text-[#414751] hover:text-[#004379] hover:bg-[#e9eef6]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Learn</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'progress'
                  ? isDarkMode
                    ? 'bg-[#3d91ff]/20 text-[#a9c7ff] shadow-xs'
                    : 'bg-[#c8f17a]/40 text-[#004379] font-bold shadow-xs'
                  : isDarkMode
                  ? 'text-[#c1c6d5] hover:text-white hover:bg-[#1e293b]'
                  : 'text-[#414751] hover:text-[#004379] hover:bg-[#e9eef6]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Progress</span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer relative ${
                activeTab === 'library'
                  ? isDarkMode
                    ? 'bg-[#3d91ff]/20 text-[#a9c7ff] shadow-xs'
                    : 'bg-[#c8f17a]/40 text-[#004379] font-bold shadow-xs'
                  : isDarkMode
                  ? 'text-[#c1c6d5] hover:text-white hover:bg-[#1e293b]'
                  : 'text-[#414751] hover:text-[#004379] hover:bg-[#e9eef6]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Library</span>
              {dueCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                    isDarkMode
                      ? 'bg-[#ffb4ab] text-[#690005]'
                      : 'bg-[#ba1a1a] text-white'
                  }`}
                >
                  {dueCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'settings'
                  ? isDarkMode
                    ? 'bg-[#3d91ff]/20 text-[#a9c7ff] shadow-xs'
                    : 'bg-[#c8f17a]/40 text-[#004379] font-bold shadow-xs'
                  : isDarkMode
                  ? 'text-[#c1c6d5] hover:text-white hover:bg-[#1e293b]'
                  : 'text-[#414751] hover:text-[#004379] hover:bg-[#e9eef6]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* PWA Install Button */}
            {onOpenInstall && (
              <button
                onClick={onOpenInstall}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shadow-xs cursor-pointer ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 border border-blue-400/30'
                    : 'bg-gradient-to-r from-[#005ba1] to-[#007cd8] text-white hover:opacity-95'
                }`}
                title="PWA Olarak Yükle (Android / iOS / Masaüstü)"
              >
                <Download className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline">Uygulamayı Yükle</span>
                <span className="sm:hidden">Yükle</span>
              </button>
            )}

            {/* Quick Placement Test CTA */}
            <button
              onClick={onStartPlacement}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                isDarkMode
                  ? 'bg-[#1e293b] text-[#a9c7ff] hover:bg-[#2d3542] border border-[#3d91ff]/30'
                  : 'bg-[#d3e4ff] text-[#004379] hover:bg-[#b5d3ff] border border-[#004379]/15'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Seviye Sınavı</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1e293b] text-[#ffd700] hover:bg-[#2d3542]'
                  : 'bg-[#eff4fc] text-[#004379] hover:bg-[#dde3eb]'
              }`}
              title={isDarkMode ? 'Açık Mod (Light Mode)' : 'Karanlık Mod (Dark Mode)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Avatar Click to Settings */}
            <button
              onClick={() => setActiveTab('settings')}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#004379]/20 hover:border-[#3d91ff] transition-all cursor-pointer shadow-xs"
              title={`${userProfile.name} - Ayarlar`}
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Top Header */}
      <div
        className={`md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40 ${
          isDarkMode
            ? 'bg-[#0c1420]/95 border-b border-[#2d3542]/60'
            : 'bg-[#f7f9ff]/95 border-b border-[#dde3eb]/70'
        } backdrop-blur-md`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={onStartPlacement}
            className={`p-1.5 rounded-full ${
              isDarkMode ? 'text-[#c1c6d5] hover:bg-[#1e293b]' : 'text-[#414751] hover:bg-[#e9eef6]'
            }`}
            title="Seviye Tespit Sınavı"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="w-6 h-6 rounded-md overflow-hidden">
            <img src="./icons/icon-96x96.png" alt="Λ" className="w-full h-full object-cover" />
          </div>
          <h1
            className={`font-display text-lg font-bold tracking-widest ${
              isDarkMode ? 'text-[#ffd700]' : 'text-[#004379]'
            }`}
          >
            ΛΟΓΟΣ
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#005ba1] text-white shadow-xs"
            >
              <Download className="w-3 h-3" />
              <span>Yükle</span>
            </button>
          )}
          <button
            onClick={onToggleDarkMode}
            className={`p-1.5 rounded-full ${
              isDarkMode ? 'text-[#ffd700] bg-[#1e293b]' : 'text-[#004379] bg-[#eff4fc]'
            }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="w-7 h-7 rounded-full overflow-hidden border border-[#004379]/30"
          >
            <img src={userProfile.avatar} alt="Profil" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Fixed Navigation Bar */}
      <nav
        className={`fixed bottom-0 left-0 w-full z-50 md:hidden flex justify-around items-center h-18 px-3 pb-[env(safe-area-inset-bottom)] transition-colors duration-200 ${
          isDarkMode
            ? 'bg-[#16202c] border-t border-[#2d3542] shadow-[0px_-4px_20px_rgba(0,0,0,0.4)]'
            : 'bg-[#f7f9ff] border-t border-[#dde3eb] shadow-[0px_-4px_20px_rgba(0,0,0,0.05)]'
        }`}
      >
        {/* Learn */}
        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all ${
            activeTab === 'learn'
              ? isDarkMode
                ? 'bg-[#3d91ff]/20 text-[#3d91ff]'
                : 'bg-[#c8f17a]/40 text-[#004379]'
              : isDarkMode
              ? 'text-[#8b919f]'
              : 'text-[#727782]'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span className="text-[11px] font-semibold tracking-wider mt-0.5">Learn</span>
        </button>

        {/* Progress */}
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all ${
            activeTab === 'progress'
              ? isDarkMode
                ? 'bg-[#3d91ff]/20 text-[#3d91ff]'
                : 'bg-[#c8f17a]/40 text-[#004379]'
              : isDarkMode
              ? 'text-[#8b919f]'
              : 'text-[#727782]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[11px] font-semibold tracking-wider mt-0.5">Progress</span>
        </button>

        {/* Library */}
        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all relative ${
            activeTab === 'library'
              ? isDarkMode
                ? 'bg-[#3d91ff]/20 text-[#3d91ff]'
                : 'bg-[#c8f17a]/40 text-[#004379]'
              : isDarkMode
              ? 'text-[#8b919f]'
              : 'text-[#727782]'
          }`}
        >
          <div className="relative">
            <BookOpen className="w-5 h-5" />
            {dueCount > 0 && (
              <span
                className={`absolute -top-1 -right-2 text-[9px] px-1 rounded-full font-bold leading-none py-0.5 ${
                  isDarkMode
                    ? 'bg-[#ffb4ab] text-[#690005]'
                    : 'bg-[#ba1a1a] text-white'
                }`}
              >
                {dueCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold tracking-wider mt-0.5">Library</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all ${
            activeTab === 'settings'
              ? isDarkMode
                ? 'bg-[#3d91ff]/20 text-[#3d91ff]'
                : 'bg-[#c8f17a]/40 text-[#004379]'
              : isDarkMode
              ? 'text-[#8b919f]'
              : 'text-[#727782]'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[11px] font-semibold tracking-wider mt-0.5">Settings</span>
        </button>
      </nav>
    </>
  );
};
