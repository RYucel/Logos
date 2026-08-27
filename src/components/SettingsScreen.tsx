import React, { useState, useRef } from 'react';
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
  RotateCcw,
  Upload,
  Link,
  Trash2,
  AlertTriangle,
  X,
  RefreshCw,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';
import { UserProfile } from '../types';
import { playSound } from '../utils/speech';
import { GREEK_BUST_IMAGE } from '../data/mockData';

interface PresetAvatar {
  id: string;
  name: string;
  role: string;
  url: string;
  tag: string;
}

const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'avatar-alexander',
    name: 'Alexander Demetriou',
    role: 'Klasik Akademisyen',
    tag: 'Akademi',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-elena',
    name: 'Elena Papadopoulou',
    role: 'Atina Öğrencisi',
    tag: 'Modern',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-socrates',
    name: 'Sokrat (Filozof)',
    role: 'Antik Düşünür',
    tag: 'Felsefe',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-athena',
    name: 'Athena (Bilgelik)',
    role: 'Bilim & Sanat',
    tag: 'Mitoloji',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-nikos',
    name: 'Nikos Katsaros',
    role: 'Ege Kaşifi',
    tag: 'Santorini',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-sophia',
    name: 'Sophia Theodorou',
    role: 'Dilbilimci',
    tag: 'Filoloji',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'avatar-bust',
    name: 'Klasik Mermer Büst',
    role: 'Antik Heykel',
    tag: 'Klasik',
    url: GREEK_BUST_IMAGE
  },
  {
    id: 'avatar-dimitris',
    name: 'Dimitris Vangelis',
    role: 'Tarihçi & Çevirmen',
    tag: 'Selanik',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
  }
];

interface SettingsScreenProps {
  isDarkMode: boolean;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onToggleTheme: (theme: 'light' | 'dark' | 'system') => void;
  onResetStats?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  isDarkMode,
  userProfile,
  onUpdateProfile,
  onToggleTheme,
  onResetStats
}) => {
  const [formData, setFormData] = useState<UserProfile>({ ...userProfile });
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccessNotice, setResetSuccessNotice] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [avatarTab, setAvatarTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Profile Picture Handlers
  const handleSelectPresetAvatar = (url: string) => {
    handleChange('avatar', url);
    onUpdateProfile({ avatar: url });
    playSound('click');
    setIsAvatarModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('Seçilen resim boyutu 4MB\'dan küçük olmalıdır.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        const base64Data = event.target.result;
        handleChange('avatar', base64Data);
        onUpdateProfile({ avatar: base64Data });
        playSound('correct');
        setIsAvatarModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    handleChange('avatar', customUrlInput.trim());
    onUpdateProfile({ avatar: customUrlInput.trim() });
    playSound('correct');
    setCustomUrlInput('');
    setIsAvatarModalOpen(false);
  };

  // Reset Statistics Confirmation Handler
  const handleConfirmResetStats = () => {
    if (onResetStats) {
      onResetStats();
    }
    setFormData(prev => ({
      ...prev,
      streakDays: 0,
      totalWordsLearned: 0
    }));
    playSound('click');
    setIsResetModalOpen(false);
    setResetSuccessNotice(true);
    setTimeout(() => setResetSuccessNotice(false), 3500);
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
              Settings &amp; Profile (Profil ve Ayarlar)
            </h1>
            <p className={`text-xs md:text-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'}`}>
              Hesap detayları, profil resmi, isim ve bilimsel aralıklı tekrar tercihleri.
            </p>
          </div>
        </div>

        {isSavedNotice && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full bg-[#c8f17a] text-[#131f00] shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <Check className="w-4 h-4 text-[#131f00]" />
            Değişiklikler Kaydedildi
          </span>
        )}

        {resetSuccessNotice && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
            <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-300" />
            İstatistikler Sıfırlandı
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {/* 1. Profile Details & Avatar Management Card */}
        <section
          className={`p-6 rounded-2xl border shadow-xs relative overflow-hidden ${
            isDarkMode
              ? 'bg-[#16202c] border-[#2d3542] meander-pattern-dark'
              : 'bg-white border-[#dde3eb] meander-pattern-light'
          }`}
        >
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-current/10">
            <h2
              className={`text-lg font-bold font-display flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-[#161c22]'
              }`}
            >
              <User className="w-5 h-5 text-[#005ba1] dark:text-[#3d91ff]" />
              <span>Profil Bilgileri (Profile Details)</span>
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#005ba1]/10 text-[#005ba1] dark:text-[#a9c7ff] font-semibold">
              {formData.level}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
            {/* Avatar with edit overlay */}
            <div className="flex flex-col items-center gap-2.5 shrink-0">
              <div
                onClick={() => setIsAvatarModalOpen(true)}
                className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#004379]/40 dark:border-blue-400/40 group cursor-pointer shadow-lg transition-transform active:scale-95"
                title="Profil Resmini Değiştir"
              >
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Değiştir
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#005ba1] dark:text-[#a9c7ff] hover:underline cursor-pointer bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Fotoğrafı Değiştir</span>
              </button>
            </div>

            {/* Form Inputs (Name & Email) */}
            <div className="flex-1 w-full flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#727782] dark:text-[#94a3b8] mb-1.5">
                    Ad Soyad (Full Name) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.name}
                      maxLength={40}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Örn: Alexander Demetriou"
                      className={`w-full p-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                        isDarkMode
                          ? 'bg-[#1e293b] border-[#2d3542] text-white focus:border-[#3d91ff] focus:ring-2 focus:ring-[#3d91ff]/20'
                          : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22] focus:border-[#004379] focus:ring-2 focus:ring-[#004379]/10'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-[#727782] dark:text-[#94a3b8] mt-1 block">
                    Gezinme çubuğunda ve sertifikalarda görünen isim.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#727782] dark:text-[#94a3b8] mb-1.5">
                    E-posta Adresi (Email)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="ornek@logos.edu"
                    className={`w-full p-3 rounded-xl border text-sm font-medium outline-none transition-all ${
                      isDarkMode
                        ? 'bg-[#1e293b] border-[#2d3542] text-white focus:border-[#3d91ff]'
                        : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22] focus:border-[#004379]'
                    }`}
                  />
                  <span className="text-[10px] text-[#727782] dark:text-[#94a3b8] mt-1 block">
                    İlerleme bildirimleri ve hesap kurtarma adresi.
                  </span>
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
                    className={`p-2.5 rounded-xl ${
                      isDarkMode
                        ? 'bg-[#ffd700]/20 text-[#ffd700]'
                        : 'bg-[#c8f17a] text-[#496800]'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">Gnosis Scholar Pro</h3>
                      <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md bg-[#004379] text-white">
                        Aktif
                      </span>
                    </div>
                    <p className="text-xs text-[#727782] dark:text-[#94a3b8]">
                      Geçerlilik: {formData.proExpiryDate} • Tüm 500+ Kelime & SM-2 Aralıklı Tekrar Modülü Açık
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Scholar Pro aboneliğiniz aktif ve geçerlidir.')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                    isDarkMode
                      ? 'border-[#3d91ff] text-[#3d91ff] hover:bg-[#3d91ff]/10'
                      : 'border-[#004379] text-[#004379] hover:bg-[#004379]/5'
                  }`}
                >
                  Üyeliği Yönet
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
              <div className="flex items-center gap-2 mb-4">
                <Flag className="w-5 h-5 text-[#004379] dark:text-[#3d91ff]" />
                <h2
                  className={`text-lg font-bold font-display ${
                    isDarkMode ? 'text-white' : 'text-[#161c22]'
                  }`}
                >
                  Günlük Hedefler
                </h2>
              </div>
              <p className="text-xs text-[#727782] dark:text-[#94a3b8] mb-4">
                Çalışma sürenizi ve odaklanmak istediğiniz Yunanca kategorisini belirleyin.
              </p>

              {/* Target minutes buttons */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#727782] dark:text-[#94a3b8] mb-2">
                  Günlük Hedef Süre
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleChange('targetMinutes', mins as 15 | 30 | 60)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        formData.targetMinutes === mins
                          ? isDarkMode
                            ? 'bg-[#3d91ff] text-[#0a121e] border-[#3d91ff] shadow-sm'
                            : 'bg-[#004379] text-white border-[#004379] shadow-sm'
                          : isDarkMode
                          ? 'border-[#2d3542] text-[#94a3b8] hover:bg-[#1e293b]'
                          : 'border-[#c1c7d2] text-[#414751] hover:bg-[#eff4fc]'
                      }`}
                    >
                      {mins} Dakika
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus Area Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#727782] dark:text-[#94a3b8] mb-2">
                  Kelime &amp; Müfredat Odağı
                </label>
                <select
                  value={formData.vocabularyFocus}
                  onChange={(e) =>
                    handleChange(
                      'vocabularyFocus',
                      e.target.value as UserProfile['vocabularyFocus']
                    )
                  }
                  className={`w-full p-3 rounded-xl border text-xs font-semibold outline-none transition-all ${
                    isDarkMode
                      ? 'bg-[#1e293b] border-[#2d3542] text-white'
                      : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22]'
                  }`}
                >
                  <option value="Modern Conversational">Modern Günlük Konuşma &amp; Diyaloglar</option>
                  <option value="Academic & Classical">Akademik &amp; Klasik Felsefe Yunancası</option>
                  <option value="Business & Professional">İş &amp; Ticari Yunanca</option>
                  <option value="Travel & Culture">Seyahat, Turizm ve Yunan Kültürü</option>
                </select>
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
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#496800] dark:text-[#c8f17a]" />
                <h2
                  className={`text-lg font-bold font-display ${
                    isDarkMode ? 'text-white' : 'text-[#161c22]'
                  }`}
                >
                  Bilimsel Yöntem Tercihleri
                </h2>
              </div>
              <p className="text-xs text-[#727782] dark:text-[#94a3b8] mb-4">
                Algoritmik hafıza ve bilişsel yük takibi motorunu özelleştirin.
              </p>

              <div className="space-y-4">
                {/* Strict Spaced Repetition */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-xs text-gray-900 dark:text-gray-100">
                      Katı Aralıklı Tekrar (Strict SM-2)
                    </p>
                    <p className="text-[11px] text-[#727782] dark:text-[#94a3b8]">
                      Kelimeler tam vaktinde tekrar edilmezse hafıza puanı sıfırlanır.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.strictSpacedRepetition}
                    onChange={(e) =>
                      handleChange('strictSpacedRepetition', e.target.checked)
                    }
                    className="w-4 h-4 rounded text-[#004379] dark:text-[#3d91ff] focus:ring-0 cursor-pointer"
                  />
                </label>

                {/* Cognitive Load Tracking */}
                <label className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-800 transition-colors cursor-pointer">
                  <div>
                    <p className="font-semibold text-xs text-gray-900 dark:text-gray-100">
                      Bilişsel Yük Takibi
                    </p>
                    <p className="text-[11px] text-[#727782] dark:text-[#94a3b8]">
                      Cevaplama sürenize göre soru zorluğunu dinamik dengeler.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.cognitiveLoadTracking}
                    onChange={(e) =>
                      handleChange('cognitiveLoadTracking', e.target.checked)
                    }
                    className="w-4 h-4 rounded text-[#004379] dark:text-[#3d91ff] focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* 3. System Preferences & App Settings */}
        <section
          className={`rounded-2xl border shadow-xs overflow-hidden ${
            isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
          }`}
        >
          <div className="p-5 border-b border-current/10">
            <h2
              className={`text-lg font-bold font-display ${
                isDarkMode ? 'text-white' : 'text-[#161c22]'
              }`}
            >
              Uygulama &amp; Sistem Ayarları
            </h2>
          </div>

          <div className="divide-y divide-current/10">
            {/* Daily Reminders */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#727782]" />
                <div>
                  <p className="font-semibold text-sm">Günlük Bildirimler &amp; Hatırlatıcılar</p>
                  <p className="text-xs text-[#727782]">Çalışma seansları için tarayıcı/cihaz hatırlatmaları.</p>
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
                  <p className="font-semibold text-sm">Karanlık Mod (Dark Theme)</p>
                  <p className="text-xs text-[#727782]">Sistem ayarına uyum sağla veya koyu/açık temayı kilitle.</p>
                </div>
              </div>
              <select
                value={formData.darkModeSetting}
                onChange={(e) => {
                  const val = e.target.value as 'light' | 'dark' | 'system';
                  handleChange('darkModeSetting', val);
                  onToggleTheme(val);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold outline-none ${
                  isDarkMode
                    ? 'bg-[#1e293b] border-[#2d3542] text-white'
                    : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22]'
                }`}
              >
                <option value="system">Sistem Teması (System)</option>
                <option value="light">Açık Tema (Light)</option>
                <option value="dark">Koyu Tema (Dark)</option>
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
                    <p className="font-semibold text-sm">PWA Mobil &amp; Masaüstü Uygulaması</p>
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
                  alert('PWA Kurulumu: Tarayıcınızın menüsünden veya ekranın altındaki bildirimden "Uygulamayı Yükle" veya "Ana Ekrana Ekle" butonuna dokunabilirsiniz.');
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#005ba1] text-white hover:bg-[#004e8c] transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Cihaza Yükle
              </button>
            </div>
          </div>
        </section>

        {/* 4. Danger Zone: Reset Statistics & Progress */}
        <section
          className={`p-6 rounded-2xl border shadow-xs overflow-hidden ${
            isDarkMode
              ? 'bg-rose-950/10 border-rose-900/40 text-white'
              : 'bg-rose-50/60 border-rose-200 text-[#161c22]'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-900 dark:text-rose-200">
                  İstatistikleri ve İlerlemeyi Sıfırla
                </h3>
                <p className="text-xs text-rose-700/80 dark:text-rose-300/80 mt-1 max-w-xl">
                  Öğrenilen tüm kelime puanlarını (mastery), SM-2 aralıklı tekrar hafıza geçmişini, günlük serileri (streak) ve ders tamamlama istatistiklerini sıfırlar. Bu işlem geri alınamaz.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm active:scale-95 shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>İstatistikleri Sıfırla</span>
            </button>
          </div>
        </section>

        {/* 5. Save & Discard Action Buttons */}
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
            Değişiklikleri İptal Et
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
              isDarkMode
                ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa]'
                : 'bg-[#004379] text-white hover:bg-[#005ba1]'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Ayarları &amp; İsmi Kaydet</span>
          </button>
        </div>

        {/* Support & Legal Links */}
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-[#727782]">
          <a
            href="#help"
            onClick={(e) => {
              e.preventDefault();
              alert('Destek merkezine hoş geldiniz. E-posta: support@logos.edu');
            }}
            className="hover:underline"
          >
            Help Center (Yardım Merkezi)
          </a>
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              alert('Gizlilik Politikası: Verileriniz yerel cihazınızda korunur.');
            }}
            className="hover:underline"
          >
            Privacy Policy (Gizlilik)
          </a>
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              alert('Kullanım Koşulları: LOGOS Academy akademik lisansı ile sunulmaktadır.');
            }}
            className="hover:underline"
          >
            Terms of Service (Şartlar)
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AVATAR SELECTION MODAL                                                    */}
      {/* ========================================================================= */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16202c] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#005ba1] dark:text-[#3d91ff]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">
                    Profil Resmini Değiştir
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Hazır avatarlardan seçin, cihazınızdan yükleyin veya URL girin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-800 pt-3">
              <button
                type="button"
                onClick={() => setAvatarTab('presets')}
                className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                  avatarTab === 'presets'
                    ? 'border-[#005ba1] text-[#005ba1] dark:border-[#3d91ff] dark:text-[#3d91ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Hazır Avatarlar
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab('upload')}
                className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                  avatarTab === 'upload'
                    ? 'border-[#005ba1] text-[#005ba1] dark:border-[#3d91ff] dark:text-[#3d91ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Fotoğraf Yükle
              </button>
              <button
                type="button"
                onClick={() => setAvatarTab('url')}
                className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors ${
                  avatarTab === 'url'
                    ? 'border-[#005ba1] text-[#005ba1] dark:border-[#3d91ff] dark:text-[#3d91ff]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                Resim Linki (URL)
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto py-5">
              {avatarTab === 'presets' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = formData.avatar === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(preset.url)}
                        className={`p-2.5 rounded-2xl border text-center transition-all group flex flex-col items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'border-[#005ba1] bg-blue-50/70 dark:border-[#3d91ff] dark:bg-blue-950/40 ring-2 ring-[#005ba1]/20'
                            : 'border-gray-200 dark:border-gray-800 hover:border-[#005ba1]/50 dark:hover:border-blue-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/40'
                        }`}
                      >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#005ba1]/40 flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="w-full">
                          <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                            {preset.name}
                          </p>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {preset.tag}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {avatarTab === 'upload' && (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl gap-4 text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#005ba1] dark:text-[#3d91ff] flex items-center justify-center shadow-inner">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      Cihazınızdan Resim Seçin
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      JPG, PNG, WebP formatları (Maks. 4MB). Resim otomatik boyutlandırılır.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-[#005ba1] hover:bg-[#004e8c] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Dosya Seç</span>
                  </button>
                </div>
              )}

              {avatarTab === 'url' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Resim Bağlantısı (Direct Image URL)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customUrlInput}
                        onChange={(e) => setCustomUrlInput(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="flex-1 p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium outline-none text-gray-900 dark:text-white focus:border-[#005ba1]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCustomUrl}
                        disabled={!customUrlInput.trim()}
                        className="px-4 py-3 bg-[#005ba1] hover:bg-[#004e8c] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Uygula
                      </button>
                    </div>
                  </div>

                  {customUrlInput.trim() && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 shrink-0">
                        <img
                          src={customUrlInput}
                          alt="Önizleme"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = GREEK_BUST_IMAGE;
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                        <p className="font-semibold">Önizleme</p>
                        <p className="truncate text-[10px] text-gray-400">{customUrlInput}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESET STATISTICS CONFIRMATION MODAL                                       */}
      {/* ========================================================================= */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#16202c] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900/40 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3.5 mb-4 text-rose-600 dark:text-rose-400">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  İstatistikleri Sıfırla
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                  Bu işlem geri alınamaz!
                </p>
              </div>
            </div>

            <div className="space-y-2.5 py-3 text-xs text-gray-600 dark:text-gray-300 bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 mb-5">
              <p className="font-semibold text-gray-900 dark:text-white">
                Sıfırlanacak veriler:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>Öğrenilen kelimeler (0 kelimeye döner)</li>
                <li>Günlük çalışma serisi (0 güne döner)</li>
                <li>Tüm kelimelerin SM-2 aralıklı tekrar hafıza kayıtları</li>
                <li>Günlük ders tamamlama işaretleri</li>
              </ul>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmResetStats}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Evet, Sıfırla</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
