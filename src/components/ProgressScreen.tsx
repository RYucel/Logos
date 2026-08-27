import React, { useState } from 'react';
import {
  Clock,
  BookOpen,
  Flame,
  BarChart2,
  TrendingUp,
  Mic,
  Headphones,
  Info,
  Calendar
} from 'lucide-react';
import { HEATMAP_BLOCKS, WEEKLY_ACTIVITY_DATA } from '../data/mockData';

interface ProgressScreenProps {
  isDarkMode: boolean;
  totalWordsLearned: number;
  streakDays: number;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  isDarkMode,
  totalWordsLearned,
  streakDays
}) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  return (
    <main className="max-w-[1024px] mx-auto px-5 md:px-10 py-6 md:py-10 flex flex-col gap-8">
      {/* Page Title */}
      <div>
        <h1
          className={`text-2xl md:text-3xl font-bold font-display ${
            isDarkMode ? 'text-white' : 'text-[#161c22]'
          }`}
        >
          İlerleme ve İstatistikler
        </h1>
        <p
          className={`text-sm mt-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'}`}
        >
          Dil öğrenme yolculuğunuzun bilimsel ve istatistiksel analizi.
        </p>
      </div>

      {/* 1. Learning Summary Top Stat Cards */}
      <section>
        <h2
          className={`text-lg font-bold font-display mb-4 ${
            isDarkMode ? 'text-white' : 'text-[#161c22]'
          }`}
        >
          Öğrenme Özeti
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Stat Card 1 */}
          <div
            className={`p-5 rounded-2xl border shadow-xs relative overflow-hidden transition-all duration-200 ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542] hover:border-[#3d91ff]/40'
                : 'bg-white border-[#dde3eb] hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#727782]">
              <Clock
                className={`w-4 h-4 ${isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'}`}
              />
              <span>Toplam Süre</span>
            </div>
            <div
              className={`text-3xl md:text-4xl font-extrabold font-display ${
                isDarkMode ? 'text-white' : 'text-[#004379]'
              }`}
            >
              42 <span className="text-lg font-medium text-[#727782]">sa</span>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div
            className={`p-5 rounded-2xl border shadow-xs relative overflow-hidden transition-all duration-200 ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542] hover:border-[#3d91ff]/40'
                : 'bg-white border-[#dde3eb] hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#727782]">
              <BookOpen
                className={`w-4 h-4 ${isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'}`}
              />
              <span>Öğrenilen Kelime</span>
            </div>
            <div
              className={`text-3xl md:text-4xl font-extrabold font-display ${
                isDarkMode ? 'text-white' : 'text-[#004379]'
              }`}
            >
              {totalWordsLearned}
            </div>
          </div>

          {/* Stat Card 3 */}
          <div
            className={`p-5 rounded-2xl border shadow-xs relative overflow-hidden transition-all duration-200 ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542] hover:border-[#3d91ff]/40'
                : 'bg-white border-[#dde3eb] hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-[#727782]">
              <Flame
                className={`w-4 h-4 ${isDarkMode ? 'text-[#add461]' : 'text-[#496800]'}`}
              />
              <span>Güncel Seri</span>
            </div>
            <div
              className={`text-3xl md:text-4xl font-extrabold font-display ${
                isDarkMode ? 'text-white' : 'text-[#004379]'
              }`}
            >
              {streakDays} <span className="text-lg font-medium text-[#727782]">gün</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento Grid Section: Weekly Activity + Level Progress */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Weekly Activity (8 cols) */}
        <div
          className={`md:col-span-8 p-6 rounded-2xl border shadow-xs flex flex-col justify-between h-[360px] ${
            isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={`text-lg font-bold font-display flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-[#161c22]'
              }`}
            >
              <BarChart2 className="w-5 h-5 text-[#727782]" />
              <span>Haftalık Aktivite</span>
            </h3>
            <span className="text-xs text-[#727782]">Son 7 Gün</span>
          </div>

          {/* Bar Chart Canvas */}
          <div className="flex-1 flex items-end justify-between gap-3 pt-6 pb-2 relative">
            {/* Grid line background */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none opacity-20">
              <div className="border-t border-current w-full" />
              <div className="border-t border-current w-full" />
              <div className="border-t border-current w-full" />
              <div className="border-t border-current w-full" />
            </div>

            {/* Individual Bars */}
            {WEEKLY_ACTIVITY_DATA.map((item, idx) => {
              const isHovered = hoveredBar === item.day;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 z-10 w-full relative group cursor-pointer"
                  onMouseEnter={() => setHoveredBar(item.day)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* Tooltip */}
                  <div
                    className={`absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                      isHovered
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95 pointer-events-none'
                    } ${
                      isDarkMode
                        ? 'bg-[#1e293b] text-white border border-[#3d91ff]/30'
                        : 'bg-[#161c22] text-white shadow-md'
                    }`}
                  >
                    {item.label}
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full max-w-[42px] rounded-t-lg transition-all duration-300 ${
                      item.minutes === 0
                        ? isDarkMode
                          ? 'bg-[#1e293b]'
                          : 'bg-[#dde3eb]'
                        : item.isMax || item.isHigh
                        ? isDarkMode
                          ? 'bg-[#3d91ff] shadow-[0_0_12px_rgba(61,145,255,0.4)]'
                          : 'bg-[#004379]'
                        : isDarkMode
                        ? 'bg-[#3d91ff]/50 hover:bg-[#3d91ff]/70'
                        : 'bg-[#004379]/50 hover:bg-[#004379]/70'
                    }`}
                    style={{ height: `${Math.max(item.heightPct, 8)}%` }}
                  />

                  {/* Label */}
                  <span
                    className={`text-xs font-semibold ${
                      item.isMax
                        ? isDarkMode
                          ? 'text-[#3d91ff] font-bold'
                          : 'text-[#004379] font-bold'
                        : isDarkMode
                        ? 'text-[#94a3b8]'
                        : 'text-[#727782]'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Circular Level Progress (4 cols) */}
        <div
          className={`md:col-span-4 p-6 rounded-2xl border shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden h-[360px] ${
            isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
          }`}
        >
          <h3
            className={`text-lg font-bold font-display mb-4 ${
              isDarkMode ? 'text-white' : 'text-[#161c22]'
            }`}
          >
            Seviye İlerlemesi
          </h3>

          <div className="relative w-40 h-40 flex items-center justify-center mb-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke={isDarkMode ? '#1e293b' : '#e9eef6'}
                strokeWidth="8"
              />
              {/* Progress Arc (75%) */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="transparent"
                stroke={isDarkMode ? '#3d91ff' : '#004379'}
                strokeWidth="8"
                strokeDasharray="263.89"
                strokeDashoffset="65.97"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center">
              <span
                className={`text-4xl font-extrabold font-display leading-none ${
                  isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'
                }`}
              >
                A2
              </span>
              <span className="text-xs font-bold mt-1 text-[#727782]">%75 Tamamlandı</span>
            </div>
          </div>

          <p
            className={`text-xs mt-2 max-w-[220px] ${
              isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
            }`}
          >
            B1 seviyesine ulaşmak için 150 kelime daha öğrenin.
          </p>
        </div>
      </section>

      {/* 3. Scientific Metrics (Bilimsel Metrikler) */}
      <section>
        <h2
          className={`text-lg font-bold font-display mb-4 ${
            isDarkMode ? 'text-white' : 'text-[#161c22]'
          }`}
        >
          Bilimsel Metrikler
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Memory Strength Curve */}
          <div
            className={`p-6 rounded-2xl border shadow-xs ${
              isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className={`text-base font-bold font-display ${
                  isDarkMode ? 'text-white' : 'text-[#161c22]'
                }`}
              >
                Hafıza Gücü
              </h3>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isDarkMode
                    ? 'bg-[#3d91ff]/20 text-[#a9c7ff]'
                    : 'bg-[#d3e4ff] text-[#004379]'
                }`}
              >
                İyi Durumda
              </span>
            </div>

            {/* Smooth Memory Retention Curve Chart */}
            <div className="h-32 w-full relative flex items-end mb-2">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <defs>
                  <linearGradient id="memGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop
                      offset="0%"
                      stopColor={isDarkMode ? '#3d91ff' : '#004379'}
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor={isDarkMode ? '#3d91ff' : '#004379'}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0 32 Q 25 5, 45 18 T 75 16 T 100 6 L 100 40 L 0 40 Z"
                  fill="url(#memGrad)"
                />
                <path
                  d="M0 32 Q 25 5, 45 18 T 75 16 T 100 6"
                  fill="none"
                  stroke={isDarkMode ? '#3d91ff' : '#004379'}
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Plot points */}
              <div className="absolute left-[0%] bottom-[20%] w-2.5 h-2.5 rounded-full bg-[#004379] dark:bg-[#3d91ff] border-2 border-white -ml-1 -mb-1 shadow-xs" />
              <div className="absolute left-[45%] bottom-[55%] w-2.5 h-2.5 rounded-full bg-[#004379] dark:bg-[#3d91ff] border-2 border-white -ml-1 -mb-1 shadow-xs" />
              <div className="absolute left-[75%] bottom-[60%] w-2.5 h-2.5 rounded-full bg-[#004379] dark:bg-[#3d91ff] border-2 border-white -ml-1 -mb-1 shadow-xs" />
              <div className="absolute left-[100%] bottom-[85%] w-2.5 h-2.5 rounded-full bg-[#004379] dark:bg-[#3d91ff] border-2 border-white -ml-1 -mb-1 shadow-xs" />
            </div>

            <p
              className={`text-xs mt-3 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'}`}
            >
              Aralıklı tekrara dayalı kelime tutma oranınız zamanla üst seviyeye ulaşıyor.
            </p>
          </div>

          {/* Active Participation */}
          <div
            className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between ${
              isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
            }`}
          >
            <div>
              <h3
                className={`text-base font-bold font-display mb-4 ${
                  isDarkMode ? 'text-white' : 'text-[#161c22]'
                }`}
              >
                Aktif Katılım &amp; Alıştırmalar
              </h3>

              <div className="space-y-4">
                {/* Speaking Progress */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-[#727782]" />
                      <span>Konuşma Pratiği</span>
                    </span>
                    <span className={isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'}>
                      %85
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-[#1e293b]' : 'bg-[#dde3eb]'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        isDarkMode ? 'bg-[#3d91ff]' : 'bg-[#004379]'
                      }`}
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>

                {/* Listening Progress */}
                <div>
                  <div className="flex justify-between items-center mb-1.5 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Headphones className="w-3.5 h-3.5 text-[#727782]" />
                      <span>Dinleme Egzersizleri</span>
                    </span>
                    <span className={isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'}>
                      %60
                    </span>
                  </div>
                  <div
                    className={`w-full h-2 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-[#1e293b]' : 'bg-[#dde3eb]'
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${
                        isDarkMode ? 'bg-[#3d91ff]/70' : 'bg-[#004379]/70'
                      }`}
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Heatmap Grid */}
            <div className="mt-4 pt-4 border-t border-current/10">
              <span className="text-[11px] font-semibold text-[#727782] block mb-2">
                Günlük Aktivite Haritası
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {HEATMAP_BLOCKS.map((intensity, idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-xs transition-transform hover:scale-125 ${
                      intensity === 0
                        ? isDarkMode
                          ? 'bg-[#1e293b]'
                          : 'bg-[#dde3eb]'
                        : isDarkMode
                        ? 'bg-[#add461]'
                        : 'bg-[#496800]'
                    }`}
                    style={{
                      opacity: intensity > 0 ? Math.max(intensity, 0.35) : 1
                    }}
                    title={`Aktivite bloğu #${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
