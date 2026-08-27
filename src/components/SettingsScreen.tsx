import React, { useState } from 'react';
import {
  User,
  Flag,
  Sparkles,
  Bell,
  Sliders,
  Moon,
  Globe,
  Camera,
  ShieldCheck,
  Check,
  RotateCcw
} from 'lucide-react';
import { UserProfile } from '../types';
import { playSound } from '../utils/speech';

interface SettingsScreenProps {
  isDarkMode: boolean;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onToggleTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isDarkMode,
  userProfile,
  onUpdateProfile,
  onToggleTheme
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleChange = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdateProfile(formData);
    playSound('correct');
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleDiscard = () => {
    setFormData({ ...userProfile });
    playSound('click');
  };

  return (
    <main className="max-w-[1024px] mx-auto px-5 md:px-10 py-6 md:py-10 flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl ${
              isDarkMode ? 'bg-[#3d91ff]/20 text-[#3d91ff]' : 'bg-[#d3e4ff] text-[#004379]'
            }`}
          >
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1
              className={`text-2xl md:text-3xl font-bold font-display ${
                isDarkMode ? 'text-white' : 'text-[#161c22]'
              }`}
            >
              Settings &amp; Profile
            </h1>
            <p className={`text-xs md:text-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'}`}>
              Hesap detayları, çalışma hedefleri ve bilimsel yöntem tercihleri.
            </p>
          </div>
        </div>

        {isSavedNotice && (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-[#c8f17a] text-[#131f00] animate-in fade-in">
            <Check className="w-3.5 h-3.5" />
            Kaydedildi
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* 1. Profile Details & Membership Card */}
        <section
          className={`p-6 rounded-2xl border shadow-xs relative overflow-hidden ${
            isDarkMode
              ? 'bg-[#16202c] border-[#2d3542] meander-pattern-dark'
              : 'bg-white border-[#dde3eb] meander-pattern-light'
          }`}
        >
          <h2
            className={`text-lg font-bold font-display pb-3 mb-6 border-b border-current/10 ${
              isDarkMode ? 'text-white' : 'text-[#161c22]'
            }`}
          >
            Profile Details
          </h2>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            {/* Avatar with edit overlay */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#004379]/30 group cursor-pointer shadow-md">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <button className="text-xs font-semibold text-[#005ba1] dark:text-[#a9c7ff] hover:underline cursor-pointer">
                Fotoğrafı Değiştir
              </button>
            </div>

            {/* Inputs */}
            <div className="flex-1 w-full flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#727782] mb-1">
                    Ad Soyad (Full Name)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none ${
                      isDarkMode
                        ? 'bg-[#1e293b] border-[#2d3542] text-white focus:border-[#3d91ff]'
                        : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22] focus:border-[#004379]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#727782] mb-1">
                    E-posta Adresi (Email)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none ${
                      isDarkMode
                        ? 'bg-[#1e293b] border-[#2d3542] text-white focus:border-[#3d91ff]'
                        : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22] focus:border-[#004379]'
                    }`}
                  />
                </div>
              </div>

              {/* Membership status badge */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                  isDarkMode
                    ? 'bg-[#1e293b]/70 border-[#3d91ff]/30'
                    : 'bg-[#eff4fc] border-[#004379]/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-[#ffd700]/20 text-[#ffd700]'
                        : 'bg-[#c8f17a] text-[#496800]'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Gnosis Scholar Pro</h3>
                    <p className="text-xs text-[#727782]">Active until {formData.proExpiryDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => alert('Scholar Pro aboneliğiniz aktif ve geçerlidir.')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'border-[#3d91ff] text-[#3d91ff] hover:bg-[#3d91ff]/10'
                      : 'border-[#004379] text-[#004379] hover:bg-[#004379]/5'
                  }`}
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Daily Targets & Scientific Methodology (Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Targets */}
          <section
            className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between ${
              isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-current/10">
                <Flag
                  className={`w-4 h-4 ${isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'}`}
                />
                <h3
                  className={`font-bold text-base font-display ${
                    isDarkMode ? 'text-white' : 'text-[#161c22]'
                  }`}
                >
                  Daily Targets
                </h3>
              </div>

              <div className="space-y-5">
                {/* Commitment Minutes */}
                <div>
                  <label className="block text-xs font-semibold text-[#727782] mb-2.5">
                    Commitment (Minutes/Day)
                  </label>
                  <div className="flex gap-2.5">
                    {[15, 30, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => handleChange('targetMinutes', mins as 15 | 30 | 60)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                          formData.targetMinutes === mins
                            ? isDarkMode
                              ? 'bg-[#3d91ff] text-[#0a121e] shadow-xs'
                              : 'bg-[#004379] text-white shadow-xs'
                            : isDarkMode
                            ? 'bg-[#1e293b] text-[#c1c6d5] border border-[#2d3542]'
                            : 'bg-[#eff4fc] text-[#414751] border border-[#dde3eb]'
                        }`}
                      >
                        {mins}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Focus Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-[#727782] mb-1.5">
                    Vocabulary Focus
                  </label>
                  <select
                    value={formData.vocabularyFocus}
                    onChange={(e) =>
                      handleChange(
                        'vocabularyFocus',
                        e.target.value as UserProfile['vocabularyFocus']
                      )
                    }
                    className={`w-full p-2.5 rounded-xl border text-sm outline-none ${
                      isDarkMode
                        ? 'bg-[#1e293b] border-[#2d3542] text-white'
                        : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22]'
                    }`}
                  >
                    <option value="Modern Conversational">Modern Conversational (Günlük Konuşma)</option>
                    <option value="Academic & Classical">Academic &amp; Classical (Akademik &amp; Klasik)</option>
                    <option value="Business & Professional">Business &amp; Professional (İş &amp; Ticaret)</option>
                    <option value="Travel & Culture">Travel &amp; Culture (Seyahat &amp; Kültür)</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Scientific Methodology */}
          <section
            className={`p-6 rounded-2xl border shadow-xs flex flex-col justify-between ${
              isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-current/10">
                <Sparkles
                  className={`w-4 h-4 ${isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'}`}
                />
                <h3
                  className={`font-bold text-base font-display ${
                    isDarkMode ? 'text-white' : 'text-[#161c22]'
                  }`}
                >
                  Methodology
                </h3>
              </div>

              <div className="space-y-4">
                {/* Toggle 1: Cognitive Load */}
                <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors hover:bg-current/5">
                  <div className="pr-4">
                    <p className="font-semibold text-xs md:text-sm">Cognitive Load Tracking</p>
                    <p className="text-xs text-[#727782] mt-0.5">
                      Adapts lesson length based on your error rate.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.cognitiveLoadTracking}
                    onChange={(e) => handleChange('cognitiveLoadTracking', e.target.checked)}
                    className="w-5 h-5 rounded text-[#004379] dark:text-[#3d91ff] focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Toggle 2: Spaced Repetition */}
                <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors hover:bg-current/5">
                  <div className="pr-4">
                    <p className="font-semibold text-xs md:text-sm">Strict Spaced Repetition</p>
                    <p className="text-xs text-[#727782] mt-0.5">
                      Forces reviews before new content unlocks.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.strictSpacedRepetition}
                    onChange={(e) => handleChange('strictSpacedRepetition', e.target.checked)}
                    className="w-5 h-5 rounded text-[#004379] dark:text-[#3d91ff] focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* 3. App Settings (List Style) */}
        <section
          className={`rounded-2xl border shadow-xs overflow-hidden ${
            isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
          }`}
        >
          <div className="p-5 border-b border-current/10">
            <h3
              className={`font-bold text-base font-display ${
                isDarkMode ? 'text-white' : 'text-[#161c22]'
              }`}
            >
              App Preferences
            </h3>
          </div>

          <div className="divide-y divide-current/10">
            {/* Daily Reminders */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#727782]" />
                <div>
                  <p className="font-semibold text-sm">Daily Reminders</p>
                  <p className="text-xs text-[#727782]">Push notifications for practice sessions.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.dailyReminders}
                onChange={(e) => handleChange('dailyReminders', e.target.checked)}
                className="w-5 h-5 rounded text-[#004379] dark:text-[#3d91ff] focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Dark Mode */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#727782]" />
                <div>
                  <p className="font-semibold text-sm">Dark Mode / Tema</p>
                  <p className="text-xs text-[#727782]">Match system settings or force dark/light.</p>
                </div>
              </div>
              <select
                value={formData.darkModeSetting}
                onChange={(e) => {
                  const val = e.target.value as 'light' | 'dark' | 'system';
                  handleChange('darkModeSetting', val);
                  onToggleTheme(val);
                }}
                className={`p-2 rounded-lg border text-xs font-semibold outline-none ${
                  isDarkMode
                    ? 'bg-[#1e293b] border-[#2d3542] text-white'
                    : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22]'
                }`}
              >
                <option value="system">System (Sistem)</option>
                <option value="light">Light (Açık)</option>
                <option value="dark">Dark (Karanlık)</option>
              </select>
            </div>

            {/* PWA & Mobile App Installation Card */}
            <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-xs border border-blue-200 dark:border-blue-800 shrink-0">
                  <img src="./icons/icon-192x192.png" alt="Λ" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">PWA Mobil & Masaüstü Uygulaması</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      v1.2.0 PWA
                    </span>
                  </div>
                  <p className="text-xs text-[#727782] dark:text-[#94a3b8]">
                    Çevrimdışı çalışma, anında açılış ve tam ekran mobil deneyim.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const ev = new CustomEvent('open-pwa-install');
                  window.dispatchEvent(ev);
                  // also try fallback prompt trigger
                  if ('beforeinstallprompt' in window) {
                    // prompt trigger
                  }
                  alert('PWA Kurulumu: Tarayıcınızın menüsünden veya ekranın altındaki bildirimden "Uygulamayı Yükle" veya "Ana Ekrana Ekle" butonuna dokunabilirsiniz.');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#005ba1] text-white hover:bg-[#004e8c] transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Cihaza Yükle
              </button>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleDiscard}
            className={`px-6 py-3 rounded-xl text-sm font-semibold border transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-[#2d3542] text-[#c1c6d5] hover:bg-[#1e293b]'
                : 'border-[#c1c7d2] text-[#414751] hover:bg-[#e9eef6]'
            }`}
          >
            Discard Changes
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
              isDarkMode
                ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa]'
                : 'bg-[#004379] text-white hover:bg-[#005ba1]'
            }`}
          >
            Save Preferences
          </button>
        </div>

        {/* Support & Legal Links */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-[#727782]">
          <a href="#help" onClick={(e) => { e.preventDefault(); alert('Destek merkezine hoş geldiniz. E-posta: support@logos.edu'); }} className="hover:underline">
            Help Center
          </a>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Gizlilik Politikası: Verileriniz yerel cihazınızda korunur.'); }} className="hover:underline">
            Privacy Policy
          </a>
          <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Kullanım Koşulları: LOGOS Academy akademik lisansı ile sunulmaktadır.'); }} className="hover:underline">
            Terms of Service
          </a>
        </div>

        <div className="text-center">
          <button
            onClick={() => alert('Çıkış yapıldı. Oturumunuz güvende.')}
            className="text-xs font-semibold text-[#ba1a1a] dark:text-[#ffb4ab] hover:underline cursor-pointer"
          >
            Log Out (Çıkış Yap)
          </button>
        </div>
      </div>
    </main>
  );
};
