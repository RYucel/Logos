import React, { useState, useMemo } from 'react';
import {
  Search,
  Volume2,
  CheckCircle2,
  RotateCw,
  Sparkles,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  Zap,
  Check
} from 'lucide-react';
import { SM2QualityRating, VocabularyItem } from '../types';
import { speakGreek, playSound } from '../utils/speech';
import { formatNextReviewTime } from '../utils/sm2';

interface VocabularyLibraryProps {
  isDarkMode: boolean;
  vocabList: VocabularyItem[];
  onUpdateVocabStatus: (id: string, newStatus: 'Mastered' | 'Reviewing' | 'New') => void;
  onAddNewWord: (newWord: VocabularyItem) => void;
  onSM2Review?: (id: string, quality: SM2QualityRating) => void;
}

export const VocabularyLibrary: React.FC<VocabularyLibraryProps> = ({
  isDarkMode,
  vocabList,
  onUpdateVocabStatus,
  onAddNewWord,
  onSM2Review
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New word form state
  const [newGreek, setNewGreek] = useState('');
  const [newTransliteration, setNewTransliteration] = useState('');
  const [newTurkish, setNewTurkish] = useState('');
  const [newEnglish, setNewEnglish] = useState('');
  const [newCategory, setNewCategory] = useState<VocabularyItem['category']>('Nouns');

  const categories = [
    'All',
    'Greetings',
    'Daily Life',
    'Food',
    'Travel',
    'Verbs',
    'Nouns',
    'Adjectives',
    'Time & Numbers',
    'Shopping & Places',
    'Emotions & Body',
    'Culture & Philosophy',
    'Philosophy'
  ];
  const statuses = ['All', 'Due (Tekrarı Gelenler)', 'Reviewing', 'Mastered', 'New'];

  const dueCount = useMemo(() => {
    return vocabList.filter(item => item.status === 'Reviewing').length;
  }, [vocabList]);

  const filteredWords = useMemo(() => {
    return vocabList.filter(item => {
      const matchesSearch =
        item.greek.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.turkish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.english.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      let matchesStatus = true;
      if (selectedStatus === 'Due (Tekrarı Gelenler)') {
        matchesStatus = item.status === 'Reviewing';
      } else if (selectedStatus !== 'All') {
        matchesStatus = item.status === selectedStatus;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [vocabList, searchQuery, selectedCategory, selectedStatus]);

  const handlePlayAudio = (greekText: string, transliteration?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    speakGreek(greekText, transliteration);
  };

  const handleQuickSM2Rate = (
    itemId: string,
    quality: SM2QualityRating,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    playSound('correct');
    if (onSM2Review) {
      onSM2Review(itemId, quality);
    }
  };

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGreek || !newTurkish) return;

    const created: VocabularyItem = {
      id: `v-custom-${Date.now()}`,
      greek: newGreek,
      transliteration: newTransliteration || newGreek,
      turkish: newTurkish,
      english: newEnglish || newTurkish,
      category: newCategory,
      level: 'A1',
      masteryPercentage: 20,
      status: 'New',
      repetitions: 0,
      interval: 0,
      easeFactor: 2.5
    };

    onAddNewWord(created);
    playSound('correct');
    setNewGreek('');
    setNewTransliteration('');
    setNewTurkish('');
    setNewEnglish('');
    setIsAddModalOpen(false);
  };

  return (
    <main className="max-w-[1024px] mx-auto px-5 md:px-10 py-6 md:py-10 flex flex-col gap-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1
              className={`text-2xl md:text-3xl font-bold font-display ${
                isDarkMode ? 'text-white' : 'text-[#161c22]'
              }`}
            >
              Kelime Kütüphanesi &amp; SM-2
            </h1>
            {dueCount > 0 && (
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse ${
                  isDarkMode
                    ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border border-[#ffb4ab]/30'
                    : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}
              >
                {dueCount} Tekrar Bekliyor
              </span>
            )}
          </div>
          <p
            className={`text-sm mt-0.5 ${isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'}`}
          >
            {vocabList.length} kayıtlı kelime. SuperMemo SM-2 aralıklı tekrar algoritması ile hafızanızı güncel tutun.
          </p>
        </div>

        {/* Add Word Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`self-start sm:self-auto px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer ${
            isDarkMode
              ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa]'
              : 'bg-[#004379] text-white hover:bg-[#005ba1]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Kelime Ekle</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[#727782]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Yunanca veya Türkçe kelime arayın (örn. ήλιος, kitap)..."
          className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all text-sm md:text-base outline-none ${
            isDarkMode
              ? 'bg-[#16202c] border-[#2d3542] text-white placeholder-[#8b919f] focus:border-[#3d91ff] focus:ring-1 focus:ring-[#3d91ff]'
              : 'bg-white border-[#c1c7d2] text-[#161c22] placeholder-[#727782] focus:border-[#004379] focus:ring-1 focus:ring-[#004379]'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#727782] hover:text-black dark:hover:text-white"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Filter Chips Sections */}
      <div className="space-y-3">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-xs font-semibold text-[#727782] shrink-0">Kategori:</span>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  playSound('click');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-[#3d91ff] text-[#0a121e] shadow-xs'
                      : 'bg-[#004379] text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-[#1e293b] text-[#c1c6d5] hover:bg-[#2d3542]'
                    : 'bg-[#e9eef6] text-[#414751] hover:bg-[#dde3eb]'
                }`}
              >
                {cat === 'All' ? 'Tümü' : cat}
              </button>
            );
          })}
        </div>

        {/* Statuses */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-xs font-semibold text-[#727782] shrink-0">Durum:</span>
          {statuses.map((stat) => {
            const isSelected = selectedStatus === stat;
            return (
              <button
                key={stat}
                onClick={() => {
                  setSelectedStatus(stat);
                  playSound('click');
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-colors cursor-pointer ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-[#3d91ff] text-[#0a121e] shadow-xs'
                      : 'bg-[#004379] text-white shadow-xs'
                    : isDarkMode
                    ? 'bg-[#1e293b] text-[#c1c6d5] hover:bg-[#2d3542]'
                    : 'bg-[#e9eef6] text-[#414751] hover:bg-[#dde3eb]'
                }`}
              >
                {stat === 'Mastered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {stat === 'Reviewing' && <RotateCw className="w-3.5 h-3.5" />}
                {stat === 'New' && <Sparkles className="w-3.5 h-3.5" />}
                {stat === 'Due (Tekrarı Gelenler)' && <Clock className="w-3.5 h-3.5" />}
                <span>
                  {stat === 'All'
                    ? 'Tümü'
                    : stat === 'Due (Tekrarı Gelenler)'
                    ? `Tekrarı Gelenler (${dueCount})`
                    : stat}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      {filteredWords.length === 0 ? (
        <div
          className={`p-12 text-center rounded-2xl border ${
            isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
          }`}
        >
          <BookOpen className="w-10 h-10 mx-auto text-[#727782] mb-3 opacity-50" />
          <h3 className="font-semibold text-base mb-1">Eşleşen kelime bulunamadı</h3>
          <p className="text-xs text-[#727782]">Arama terimini veya filtreleri değiştirmeyi deneyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((item) => {
            const isExpanded = expandedCardId === item.id;
            const reviewInfo = formatNextReviewTime(item.nextReviewDate);

            return (
              <article
                key={item.id}
                onClick={() => setExpandedCardId(isExpanded ? null : item.id)}
                className={`p-5 rounded-2xl border shadow-xs relative overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px] ${
                  isDarkMode
                    ? item.status === 'Reviewing'
                      ? 'bg-[#16202c] border-[#3d91ff]/40 shadow-sm meander-pattern-dark'
                      : 'bg-[#16202c] border-[#2d3542] hover:border-[#3d91ff]/30 meander-pattern-dark'
                    : item.status === 'Reviewing'
                    ? 'bg-white border-[#004379]/40 shadow-sm meander-pattern-light'
                    : 'bg-white border-[#dde3eb] hover:border-[#004379]/30 meander-pattern-light'
                }`}
              >
                {/* Watermark character */}
                <div className="absolute bottom-0 right-0 p-2 opacity-5 text-current font-display text-7xl select-none pointer-events-none">
                  {item.greek.charAt(0).toUpperCase()}
                </div>

                {/* Card Header: Word and Audio */}
                <div className="flex justify-between items-start z-10">
                  <div>
                    <h3
                      className={`text-2xl md:text-3xl font-bold font-display tracking-tight leading-tight ${
                        isDarkMode ? 'text-white' : 'text-[#161c22]'
                      }`}
                    >
                      {item.greek}
                    </h3>
                    <p
                      className={`text-xs md:text-sm italic mt-0.5 ${
                        isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'
                      }`}
                    >
                      {item.transliteration}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handlePlayAudio(item.greek, item.transliteration, e)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'text-[#3d91ff] hover:bg-[#1e293b]'
                        : 'text-[#004379] hover:bg-[#eff4fc]'
                    }`}
                    title="Sesli Telaffuz"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Meanings */}
                <div className="my-2 z-10">
                  <p
                    className={`text-base font-semibold ${
                      isDarkMode ? 'text-[#dbe3f4]' : 'text-[#004379]'
                    }`}
                  >
                    {item.turkish}
                  </p>
                  <p className="text-xs text-[#727782]">({item.english})</p>

                  {/* SM-2 Metadata Bar */}
                  <div className="mt-2.5 pt-2 border-t border-current/10 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
                          reviewInfo.isDue
                            ? isDarkMode
                              ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                              : 'bg-[#ffdad6] text-[#ba1a1a]'
                            : isDarkMode
                            ? 'bg-[#1e293b] text-[#a9c7ff]'
                            : 'bg-[#eff4fc] text-[#004379]'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{reviewInfo.text}</span>
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-1 font-mono text-[10px] ${
                        isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'
                      }`}
                    >
                      <span>EF: {item.easeFactor ?? 2.5}</span>
                      <span>•</span>
                      <span>#{item.repetitions ?? 0}</span>
                      {item.interval !== undefined && item.interval > 0 && (
                        <>
                          <span>•</span>
                          <span>{item.interval}g</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Section: Examples & Quick SM-2 Rating Controls */}
                  {isExpanded && (
                    <div className="mt-3 space-y-3 animate-in fade-in duration-200">
                      {item.exampleSentence && (
                        <div
                          className={`p-3 rounded-lg border text-xs space-y-1 ${
                            isDarkMode
                              ? 'bg-[#1e293b] border-[#2d3542]'
                              : 'bg-[#eff4fc] border-[#dde3eb]'
                          }`}
                        >
                          <p className="font-semibold text-[#005ba1] dark:text-[#a9c7ff]">
                            {item.exampleSentence.greek}
                          </p>
                          <p className="text-[#727782]">{item.exampleSentence.turkish}</p>
                        </div>
                      )}

                      {/* Quick SM-2 Feedback Trigger Buttons */}
                      <div
                        className={`p-3 rounded-xl border ${
                          isDarkMode ? 'bg-[#0c1420] border-[#2d3542]' : 'bg-[#f7f9ff] border-[#dde3eb]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider mb-2 text-[#727782]">
                          <span>SM-2 Hızlı Değerlendirme</span>
                          <span className="text-[10px] font-normal normal-case">
                            Tarihi otomatik günceller
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={(e) => handleQuickSM2Rate(item.id, 2, e)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                              isDarkMode
                                ? 'bg-[#1e293b] text-[#ffb4ab] hover:bg-[#ffb4ab]/20'
                                : 'bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffb4ab]/40'
                            }`}
                            title="Zor (Quality 2): Tekrar 1 gün"
                          >
                            Zor
                          </button>
                          <button
                            onClick={(e) => handleQuickSM2Rate(item.id, 4, e)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                              isDarkMode
                                ? 'bg-[#1e293b] text-[#3d91ff] hover:bg-[#3d91ff]/20'
                                : 'bg-[#d3e4ff] text-[#004379] hover:bg-[#004379]/20'
                            }`}
                            title="İyi (Quality 4): Aralık genişletilir"
                          >
                            İyi
                          </button>
                          <button
                            onClick={(e) => handleQuickSM2Rate(item.id, 5, e)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                              isDarkMode
                                ? 'bg-[#1e293b] text-[#add461] hover:bg-[#add461]/20'
                                : 'bg-[#c8f17a] text-[#131f00] hover:bg-[#add461]/40'
                            }`}
                            title="Kolay (Quality 5): İleri tarihe ertelenir"
                          >
                            Kolay
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Progress Bar and Status */}
                <div className="z-10 flex items-center justify-between gap-3 pt-2 border-t border-current/10">
                  <div className="flex-1 flex items-center gap-2">
                    <div
                      className={`flex-1 h-1.5 rounded-full overflow-hidden ${
                        isDarkMode ? 'bg-[#0c1420]' : 'bg-[#dde3eb]'
                      }`}
                    >
                      <div
                        className={`h-full rounded-full ${
                          item.status === 'Mastered'
                            ? isDarkMode
                              ? 'bg-[#add461]'
                              : 'bg-[#496800]'
                            : isDarkMode
                            ? 'bg-[#3d91ff]'
                            : 'bg-[#004379]'
                        }`}
                        style={{ width: `${item.masteryPercentage}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-[#727782]">
                      %{item.masteryPercentage}
                    </span>
                  </div>

                  {/* Status Tag */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      const next =
                        item.status === 'Mastered'
                          ? 'Reviewing'
                          : item.status === 'Reviewing'
                          ? 'New'
                          : 'Mastered';
                      onUpdateVocabStatus(item.id, next);
                    }}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                      item.status === 'Mastered'
                        ? isDarkMode
                          ? 'bg-[#add461]/20 text-[#add461]'
                          : 'bg-[#c8f17a] text-[#131f00]'
                        : item.status === 'Reviewing'
                        ? isDarkMode
                          ? 'bg-[#3d91ff]/20 text-[#a9c7ff]'
                          : 'bg-[#d3e4ff] text-[#004379]'
                        : isDarkMode
                        ? 'bg-[#1e293b] text-[#c1c6d5]'
                        : 'bg-[#e9eef6] text-[#414751]'
                    }`}
                    title="Durumu değiştirmek için tıklayın"
                  >
                    {item.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* New Word Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`max-w-md w-full p-6 rounded-2xl border shadow-2xl ${
              isDarkMode ? 'bg-[#16202c] border-[#2d3542] text-white' : 'bg-white border-[#dde3eb]'
            }`}
          >
            <h3 className="text-lg font-bold font-display mb-4">Yeni Kelime Ekle</h3>

            <form onSubmit={handleCreateWord} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#727782] mb-1">
                  Yunanca Kelime (Greek) *
                </label>
                <input
                  type="text"
                  required
                  value={newGreek}
                  onChange={(e) => setNewGreek(e.target.value)}
                  placeholder="örn. αγάπη"
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none ${
                    isDarkMode
                      ? 'bg-[#1e293b] border-[#2d3542] text-white focus:border-[#3d91ff]'
                      : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22] focus:border-[#004379]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#727782] mb-1">
                  Okunuşu (Transliteration)
                </label>
                <input
                  type="text"
                  value={newTransliteration}
                  onChange={(e) => setNewTransliteration(e.target.value)}
                  placeholder="örn. agápi"
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none ${
                    isDarkMode
                      ? 'bg-[#1e293b] border-[#2d3542] text-white focus:border-[#3d91ff]'
                      : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22] focus:border-[#004379]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#727782] mb-1">
                    Türkçe Anlamı *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTurkish}
                    onChange={(e) => setNewTurkish(e.target.value)}
                    placeholder="örn. sevgi / aşk"
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none ${
                      isDarkMode
                        ? 'bg-[#1e293b] border-[#2d3542] text-white focus:border-[#3d91ff]'
                        : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22] focus:border-[#004379]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#727782] mb-1">
                    İngilizce
                  </label>
                  <input
                    type="text"
                    value={newEnglish}
                    onChange={(e) => setNewEnglish(e.target.value)}
                    placeholder="örn. love"
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none ${
                      isDarkMode
                        ? 'bg-[#1e293b] border-[#2d3542] text-white focus:border-[#3d91ff]'
                        : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22] focus:border-[#004379]'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#727782] mb-1">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as VocabularyItem['category'])}
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none ${
                    isDarkMode
                      ? 'bg-[#1e293b] border-[#2d3542] text-white'
                      : 'bg-[#f7f9ff] border-[#c1c7d2] text-[#161c22]'
                  }`}
                >
                  <option value="Nouns">Nouns (İsimler)</option>
                  <option value="Verbs">Verbs (Fiiller)</option>
                  <option value="Adjectives">Adjectives (Sıfatlar)</option>
                  <option value="Travel">Travel (Seyahat)</option>
                  <option value="Food">Food (Yemek)</option>
                  <option value="Philosophy">Philosophy (Felsefe)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-current/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#727782] hover:bg-current/5 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                    isDarkMode ? 'bg-[#3d91ff] text-[#0a121e]' : 'bg-[#004379] text-white'
                  }`}
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

