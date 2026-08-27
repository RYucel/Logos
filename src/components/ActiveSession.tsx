import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Volume2,
  Eye,
  Check,
  Sparkles,
  ArrowRight,
  Zap,
  MessageSquare,
  BookOpen,
  Award,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CONVERSATION_SCENARIOS,
  FLASHCARD_LESSONS,
  GRAMMAR_EXERCISES
} from '../data/mockData';
import { speakGreek, playSound } from '../utils/speech';
import { SM2QualityRating, VocabularyItem } from '../types';
import { calculateSM2 } from '../utils/sm2';

export type ActiveSessionType = 'vocabulary' | 'conversation' | 'grammar' | 'due-reviews';

interface ActiveSessionProps {
  isDarkMode: boolean;
  onClose: () => void;
  onLessonFinish: (completedTaskType: 'vocabulary' | 'conversation' | 'grammar') => void;
  vocabList?: VocabularyItem[];
  onSM2Review?: (id: string, quality: SM2QualityRating) => void;
  sessionType?: ActiveSessionType;
  onSwitchSessionType?: (newType: 'vocabulary' | 'conversation' | 'grammar') => void;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  isDarkMode,
  onClose,
  onLessonFinish,
  vocabList = [],
  onSM2Review,
  sessionType = 'vocabulary',
  onSwitchSessionType
}) => {
  const currentTaskType: 'vocabulary' | 'conversation' | 'grammar' =
    sessionType === 'conversation'
      ? 'conversation'
      : sessionType === 'grammar'
      ? 'grammar'
      : 'vocabulary';

  /* -------------------------------------------------------------
     1. VOCABULARY STATE & LOGIC
  ------------------------------------------------------------- */
  const [vocabIndex, setVocabIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const sessionCards = useMemo(() => {
    if (sessionType === 'due-reviews' && vocabList.length > 0) {
      const due = vocabList.filter(v => v.status === 'Reviewing');
      if (due.length > 0) {
        return due.map(item => ({
          id: item.id,
          isVocabItem: true,
          originalItem: item,
          greek: item.greek,
          transliteration: item.transliteration,
          english: item.english,
          turkish: item.turkish,
          categoryTag: `${item.category} • Seviye ${item.level}`,
          audioText: item.greek,
          breakdown: item.exampleSentence
            ? [
                {
                  greek: item.exampleSentence.greek,
                  transliteration: item.greek,
                  meaning: item.exampleSentence.turkish,
                  grammarInfo: 'Örnek Cümle'
                }
              ]
            : [
                {
                  greek: item.greek,
                  transliteration: item.transliteration,
                  meaning: item.turkish,
                  grammarInfo: item.category
                }
              ]
        }));
      }
    }
    return FLASHCARD_LESSONS.map(f => ({ ...f, isVocabItem: false, originalItem: undefined }));
  }, [sessionType, vocabList]);

  const card = sessionCards[vocabIndex] || sessionCards[0];
  const totalVocabCards = sessionCards.length;

  const sm2Previews = useMemo(() => {
    if (card?.originalItem) {
      const hardResult = calculateSM2(card.originalItem, 2);
      const goodResult = calculateSM2(card.originalItem, 4);
      const easyResult = calculateSM2(card.originalItem, 5);
      return {
        hardInterval: `${hardResult.interval} gün`,
        goodInterval: `${goodResult.interval} gün`,
        easyInterval: `${easyResult.interval} gün`,
        currentEF: card.originalItem.easeFactor ?? 2.5
      };
    }
    return {
      hardInterval: '1 gün',
      goodInterval: '6 gün',
      easyInterval: '15 gün',
      currentEF: 2.5
    };
  }, [card]);

  /* -------------------------------------------------------------
     2. CONVERSATION STATE & LOGIC
  ------------------------------------------------------------- */
  const [activeScenarioIndex] = useState(0);
  const scenario = CONVERSATION_SCENARIOS[activeScenarioIndex] || CONVERSATION_SCENARIOS[0];
  const [conversationTurnIndex, setConversationTurnIndex] = useState(0);
  const [selectedUserOptionId, setSelectedUserOptionId] = useState<string | null>(null);
  const [revealedFeedback, setRevealedFeedback] = useState<string | null>(null);
  const [isTurnAdvancing, setIsTurnAdvancing] = useState(false);

  const currentDialogueTurn = scenario.dialogue[conversationTurnIndex] || scenario.dialogue[0];
  const totalTurns = scenario.dialogue.length;

  // Speak partner line when dialogue turn changes
  useEffect(() => {
    if (currentTaskType === 'conversation' && currentDialogueTurn) {
      speakGreek(currentDialogueTurn.greek, currentDialogueTurn.transliteration);
    }
  }, [currentTaskType, conversationTurnIndex, currentDialogueTurn]);

  /* -------------------------------------------------------------
     3. GRAMMAR EXERCISE STATE & LOGIC
  ------------------------------------------------------------- */
  const [grammarIndex, setGrammarIndex] = useState(0);
  const [selectedGrammarOption, setSelectedGrammarOption] = useState<number | null>(null);
  const [isGrammarChecked, setIsGrammarChecked] = useState(false);
  const [, setGrammarCorrectCount] = useState(0);

  const currentGrammarQ = GRAMMAR_EXERCISES[grammarIndex] || GRAMMAR_EXERCISES[0];
  const totalGrammarQuestions = GRAMMAR_EXERCISES.length;

  /* -------------------------------------------------------------
     SESSION FINISH STATE
  ------------------------------------------------------------- */
  const [isFinished, setIsFinished] = useState(false);

  const triggerCompletionCelebration = (taskType: 'vocabulary' | 'conversation' | 'grammar') => {
    playSound('success');
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
    setIsFinished(true);
    onLessonFinish(taskType);
  };

  /* -------------------------------------------------------------
     HANDLERS
  ------------------------------------------------------------- */
  // Vocabulary Rating
  const handleRating = (rating: 'hard' | 'good' | 'easy') => {
    const qualityMap: Record<'hard' | 'good' | 'easy', SM2QualityRating> = {
      hard: 2,
      good: 4,
      easy: 5
    };
    const quality = qualityMap[rating];

    playSound('correct');

    if (card?.originalItem && onSM2Review) {
      onSM2Review(card.originalItem.id, quality);
    }

    if (vocabIndex + 1 < totalVocabCards) {
      setVocabIndex(prev => prev + 1);
      setIsRevealed(false);
    } else {
      triggerCompletionCelebration('vocabulary');
    }
  };

  // Conversation Option Select
  const handleSelectConversationOption = (option: {
    id: string;
    greek: string;
    transliteration?: string;
    turkish: string;
    feedback?: string;
  }) => {
    if (isTurnAdvancing) return;
    setSelectedUserOptionId(option.id);
    setRevealedFeedback(option.feedback || 'Çok iyi bir yanıt!');
    playSound('correct');
    speakGreek(option.greek, option.transliteration);

    setIsTurnAdvancing(true);
    setTimeout(() => {
      if (conversationTurnIndex + 1 < totalTurns) {
        setConversationTurnIndex(prev => prev + 1);
        setSelectedUserOptionId(null);
        setRevealedFeedback(null);
        setIsTurnAdvancing(false);
      } else {
        setIsTurnAdvancing(false);
        triggerCompletionCelebration('conversation');
      }
    }, 1800);
  };

  // Grammar Check
  const handleGrammarSelect = (idx: number) => {
    if (isGrammarChecked) return;
    setSelectedGrammarOption(idx);
    playSound('click');
  };

  const handleGrammarCheckAnswer = () => {
    if (selectedGrammarOption === null || isGrammarChecked) return;
    setIsGrammarChecked(true);

    const isCorrect = selectedGrammarOption === currentGrammarQ.correctIndex;
    if (isCorrect) {
      playSound('correct');
      setGrammarCorrectCount(prev => prev + 1);
    } else {
      playSound('click');
    }

    if (currentGrammarQ.audioText) {
      speakGreek(currentGrammarQ.audioText);
    }
  };

  const handleGrammarNext = () => {
    if (grammarIndex + 1 < totalGrammarQuestions) {
      setGrammarIndex(prev => prev + 1);
      setSelectedGrammarOption(null);
      setIsGrammarChecked(false);
    } else {
      triggerCompletionCelebration('grammar');
    }
  };

  // Switch to next sequential task
  const handleProceedToNextTask = () => {
    playSound('click');
    setIsFinished(false);

    if (currentTaskType === 'vocabulary') {
      if (onSwitchSessionType) {
        onSwitchSessionType('conversation');
      }
      setConversationTurnIndex(0);
      setSelectedUserOptionId(null);
      setRevealedFeedback(null);
    } else if (currentTaskType === 'conversation') {
      if (onSwitchSessionType) {
        onSwitchSessionType('grammar');
      }
      setGrammarIndex(0);
      setSelectedGrammarOption(null);
      setIsGrammarChecked(false);
    } else {
      onClose();
    }
  };

  /* -------------------------------------------------------------
     COMPLETION MODAL VIEW
  ------------------------------------------------------------- */
  if (isFinished) {
    const nextTaskInfo =
      currentTaskType === 'vocabulary'
        ? {
            title: '2. Günlük Konuşma',
            desc: 'Yapay zeka partneriniz Eleni ile kafede sipariş diyaloğu pratiği yapın.',
            type: 'conversation' as const
          }
        : currentTaskType === 'conversation'
        ? {
            title: '3. Dilbilgisi Pratiği',
            desc: 'Geniş zaman ve artikel kurallarını pekiştirici interaktif alıştırmalar.',
            type: 'grammar' as const
          }
        : null;

    return (
      <main
        className={`min-h-screen flex items-center justify-center p-5 md:p-10 transition-colors ${
          isDarkMode ? 'bg-[#0c1420] text-[#dbe3f4]' : 'bg-[#f7f9ff] text-[#161c22]'
        }`}
      >
        <div
          className={`max-w-lg w-full p-8 rounded-3xl border shadow-2xl text-center animate-in zoom-in-95 duration-300 ${
            isDarkMode
              ? 'bg-[#16202c] border-[#3d91ff]/30 meander-pattern-dark'
              : 'bg-white border-[#dde3eb] meander-pattern-light'
          }`}
        >
          <div
            className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5 shadow-lg ${
              isDarkMode ? 'bg-[#add461]/20 text-[#add461]' : 'bg-[#c8f17a] text-[#496800]'
            }`}
          >
            <Sparkles className="w-10 h-10" />
          </div>

          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              isDarkMode ? 'bg-[#3d91ff]/20 text-[#3d91ff]' : 'bg-[#eff4fc] text-[#004379]'
            }`}
          >
            {currentTaskType === 'vocabulary'
              ? '1. Görev Tamamlandı'
              : currentTaskType === 'conversation'
              ? '2. Görev Tamamlandı'
              : '3. Görev Tamamlandı'}
          </span>

          <h2
            className={`text-2xl md:text-3xl font-bold font-display ${
              isDarkMode ? 'text-white' : 'text-[#004379]'
            }`}
          >
            {currentTaskType === 'vocabulary'
              ? 'Kelime Tekrarı Tamamlandı!'
              : currentTaskType === 'conversation'
              ? 'Günlük Konuşma Tamamlandı!'
              : 'Günün Tüm Görevleri Tamamlandı! 🎉'}
          </h2>

          <p
            className={`text-sm mt-2 mb-6 ${
              isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
            }`}
          >
            {currentTaskType === 'vocabulary'
              ? 'SuperMemo SM-2 algoritması hafıza matrisinizi ve sonraki tekrar tarihlerini başarıyla güncelledi.'
              : currentTaskType === 'conversation'
              ? 'Atina kafesi diyalog senaryosunu başarıyla tamamlayıp telaffuz ve nezaket kalıplarını pekiştirdiniz.'
              : 'Tebrikler! Bugünün 3/3 günlük ders hedefini tamamladınız ve çalışma serinizi başarıyla sürdürdünüz.'}
          </p>

          {/* Next Task Card Prompt */}
          {nextTaskInfo ? (
            <div
              className={`p-4 rounded-2xl border text-left mb-6 ${
                isDarkMode
                  ? 'bg-[#0c1420] border-[#3d91ff]/30'
                  : 'bg-[#eff4fc] border-[#004379]/20'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-[#a9c7ff]' : 'text-[#004379]'
                  }`}
                >
                  Sıradaki Günlük Görev
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                    isDarkMode ? 'bg-[#1e293b] text-white' : 'bg-white text-[#161c22]'
                  }`}
                >
                  {nextTaskInfo.type === 'conversation' ? '5 dk' : '4 dk'}
                </span>
              </div>
              <h3 className="font-bold text-base">{nextTaskInfo.title}</h3>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
                }`}
              >
                {nextTaskInfo.desc}
              </p>
            </div>
          ) : (
            <div
              className={`p-4 rounded-2xl border text-center mb-6 ${
                isDarkMode
                  ? 'bg-[#add461]/10 border-[#add461]/30 text-[#add461]'
                  : 'bg-[#c8f17a]/30 border-[#496800]/20 text-[#131f00]'
              }`}
            >
              <Award className="w-8 h-8 mx-auto mb-1" />
              <p className="font-bold text-sm">Günün Yıldız Öğrencisi Rozeti!</p>
              <p className="text-xs mt-0.5 opacity-80">+50 XP ve +1 Gün Çalışma Serisi</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {nextTaskInfo && (
              <button
                onClick={handleProceedToNextTask}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa] shadow-[0_4px_20px_rgba(61,145,255,0.3)]'
                    : 'bg-[#004379] text-white hover:bg-[#005ba1] shadow-[0_4px_20px_rgba(0,67,121,0.2)]'
                }`}
              >
                <span>Sıradaki Göreve Geç: {nextTaskInfo.title}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className={`w-full py-3 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1e293b] text-[#94a3b8] hover:text-white hover:bg-[#2d3542]'
                  : 'bg-[#e9eef6] text-[#414751] hover:text-black hover:bg-[#dde3eb]'
              }`}
            >
              Ana Ekrana Dön
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* -------------------------------------------------------------
     MAIN SESSION CONTAINER & HEADER
  ------------------------------------------------------------- */
  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        isDarkMode ? 'bg-[#0c1420] text-[#dbe3f4]' : 'bg-[#f7f9ff] text-[#161c22]'
      }`}
    >
      {/* Top Header & Task Switcher Navigation */}
      <header
        className={`sticky top-0 z-30 w-full px-5 md:px-10 py-3.5 border-b ${
          isDarkMode ? 'bg-[#0c1420]/95 border-[#2d3542]' : 'bg-[#f7f9ff]/95 border-[#dde3eb]'
        } backdrop-blur-md`}
      >
        <div className="max-w-[1024px] mx-auto flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isDarkMode
                ? 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
                : 'text-[#414751] hover:bg-[#e9eef6] hover:text-black'
            }`}
            title="Dersi Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Task Title & Progress */}
          <div className="flex-1 max-w-md mx-auto flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span
                className={`px-2.5 py-0.5 rounded-full ${
                  isDarkMode ? 'bg-[#1e293b] text-[#3d91ff]' : 'bg-[#eff4fc] text-[#004379]'
                }`}
              >
                {currentTaskType === 'vocabulary'
                  ? '1. Kelime Tekrarı'
                  : currentTaskType === 'conversation'
                  ? '2. Günlük Konuşma'
                  : '3. Dilbilgisi Pratiği'}
              </span>

              <span className={isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'}>
                {currentTaskType === 'vocabulary'
                  ? `${vocabIndex + 1} / ${totalVocabCards}`
                  : currentTaskType === 'conversation'
                  ? `${conversationTurnIndex + 1} / ${totalTurns}`
                  : `${grammarIndex + 1} / ${totalGrammarQuestions}`}
              </span>
            </div>

            {/* Progress Bar */}
            <div
              className={`w-full h-1.5 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-[#1e293b]' : 'bg-[#dde3eb]'
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isDarkMode ? 'bg-[#3d91ff] shadow-[0_0_10px_rgba(61,145,255,0.5)]' : 'bg-[#004379]'
                }`}
                style={{
                  width: `${
                    currentTaskType === 'vocabulary'
                      ? ((vocabIndex + 1) / totalVocabCards) * 100
                      : currentTaskType === 'conversation'
                      ? ((conversationTurnIndex + 1) / totalTurns) * 100
                      : ((grammarIndex + 1) / totalGrammarQuestions) * 100
                  }%`
                }}
              />
            </div>
          </div>

          <div className="w-9" />
        </div>
      </header>

      {/* -------------------------------------------------------------
          TASK 1 VIEW: VOCABULARY FLASHCARDS & SM-2
      ------------------------------------------------------------- */}
      {currentTaskType === 'vocabulary' && (
        <main className="flex-1 flex flex-col items-center justify-center px-5 md:px-10 py-6 max-w-[720px] mx-auto w-full">
          <div
            className={`w-full rounded-2xl border shadow-xl relative overflow-hidden transition-all duration-300 flex flex-col ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542] meander-pattern-dark'
                : 'bg-white border-[#dde3eb] meander-pattern-light'
            }`}
          >
            {/* Category Pill & EF Badge */}
            <div className="p-6 pb-2 flex justify-between items-center">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  isDarkMode
                    ? 'bg-[#1e293b] text-[#3d91ff] border-[#3d91ff]/30'
                    : 'bg-[#eff4fc] text-[#004379] border-[#004379]/15'
                }`}
              >
                {card?.categoryTag}
              </span>

              {card?.originalItem && (
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 font-mono ${
                    isDarkMode ? 'bg-[#0c1420] text-[#a9c7ff]' : 'bg-[#eff4fc] text-[#004379]'
                  }`}
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>EF: {card.originalItem.easeFactor ?? 2.5}</span>
                  <span>• Tekrar: #{card.originalItem.repetitions ?? 0}</span>
                </span>
              )}
            </div>

            {/* Greek Main Phrase */}
            <div className="px-6 py-8 md:py-12 flex flex-col items-center text-center">
              <h1
                className={`text-3xl md:text-4xl lg:text-5xl font-bold font-display leading-tight tracking-tight mb-4 ${
                  isDarkMode ? 'text-white' : 'text-[#161c22]'
                }`}
              >
                {card?.greek}
              </h1>

              <p
                className={`text-sm md:text-base italic mb-6 ${
                  isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'
                }`}
              >
                {card?.transliteration}
              </p>

              {/* Audio Pronunciation Button */}
              <button
                onClick={() => speakGreek(card?.audioText || card?.greek || '', card?.transliteration)}
                className={`p-4 rounded-full shadow-lg transition-all active:scale-95 group cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#1e293b] text-[#3d91ff] hover:bg-[#3d91ff] hover:text-[#0a121e]'
                    : 'bg-[#eff4fc] text-[#004379] hover:bg-[#004379] hover:text-white'
                }`}
                title="Telaffuzu Dinle"
              >
                <Volume2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Revealed Translation & Breakdown */}
            {isRevealed ? (
              <div
                className={`p-6 border-t animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  isDarkMode ? 'border-[#2d3542] bg-[#0c1420]/50' : 'border-[#dde3eb] bg-[#eff4fc]/50'
                }`}
              >
                <div className="text-center mb-5">
                  <p
                    className={`text-lg md:text-xl font-medium italic ${
                      isDarkMode ? 'text-[#dbe3f4]' : 'text-[#004379]'
                    }`}
                  >
                    "{card?.turkish}"
                  </p>
                  <p
                    className={`text-xs md:text-sm mt-0.5 ${
                      isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'
                    }`}
                  >
                    ({card?.english})
                  </p>
                </div>

                {/* Grammar Breakdown */}
                {card?.breakdown && card.breakdown.length > 0 && (
                  <div
                    className={`rounded-xl p-4 border text-left text-xs md:text-sm space-y-2.5 ${
                      isDarkMode
                        ? 'bg-[#1e293b] border-[#2d3542]'
                        : 'bg-white border-[#dde3eb]'
                    }`}
                  >
                    <div
                      className={`font-semibold uppercase tracking-wider text-[11px] pb-1 border-b ${
                        isDarkMode ? 'text-[#a9c7ff] border-[#2d3542]' : 'text-[#004379] border-[#dde3eb]'
                      }`}
                    >
                      Kelime &amp; Dilbilgisi Analizi
                    </div>
                    {card.breakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b last:border-b-0 border-current/10"
                      >
                        <span className="font-semibold">{item.greek}</span>
                        <div className="flex items-center gap-2">
                          <span className={isDarkMode ? 'text-[#c1c6d5]' : 'text-[#414751]'}>
                            {item.meaning}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              isDarkMode ? 'bg-[#0c1420] text-[#94a3b8]' : 'bg-[#e9eef6] text-[#727782]'
                            }`}
                          >
                            {item.grammarInfo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  playSound('reveal');
                  setIsRevealed(true);
                }}
                className={`w-full py-4 border-t font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'border-[#2d3542] bg-[#1e293b] text-[#c1c6d5] hover:bg-[#2d3542] hover:text-white'
                    : 'border-[#dde3eb] bg-[#f7f9ff] text-[#414751] hover:bg-[#eff4fc] hover:text-[#004379]'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Çeviriyi Göster (Anlamı Gör)</span>
              </button>
            )}
          </div>

          {/* SM-2 SRS Feedback Buttons */}
          <div className="w-full mt-6 flex gap-3">
            <button
              onClick={() => handleRating('hard')}
              disabled={!isRevealed}
              className={`flex-1 py-3.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                isRevealed
                  ? isDarkMode
                    ? 'bg-[#16202c] border-[#ffb4ab]/30 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 active:scale-95 cursor-pointer'
                    : 'bg-white border-[#ba1a1a]/30 text-[#ba1a1a] hover:bg-[#ffdad6]/40 active:scale-95 cursor-pointer'
                  : 'opacity-30 cursor-not-allowed border-current/20'
              }`}
            >
              <span className="font-bold text-xs uppercase tracking-wider">ZOR (HARD)</span>
              <span className="text-[11px] opacity-75">Tekrar: {sm2Previews.hardInterval}</span>
            </button>

            <button
              onClick={() => handleRating('good')}
              disabled={!isRevealed}
              className={`flex-1 py-3.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                isRevealed
                  ? isDarkMode
                    ? 'bg-[#16202c] border-[#3d91ff]/40 text-[#3d91ff] hover:bg-[#3d91ff]/10 active:scale-95 shadow-[0_0_15px_rgba(61,145,255,0.1)] cursor-pointer'
                    : 'bg-white border-[#004379]/40 text-[#004379] hover:bg-[#d3e4ff]/40 active:scale-95 cursor-pointer'
                  : 'opacity-30 cursor-not-allowed border-current/20'
              }`}
            >
              <span className="font-bold text-xs uppercase tracking-wider">İYİ (GOOD)</span>
              <span className="text-[11px] opacity-75">Tekrar: {sm2Previews.goodInterval}</span>
            </button>

            <button
              onClick={() => handleRating('easy')}
              disabled={!isRevealed}
              className={`flex-1 py-3.5 px-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                isRevealed
                  ? isDarkMode
                    ? 'bg-[#16202c] border-[#add461]/40 text-[#add461] hover:bg-[#add461]/10 active:scale-95 cursor-pointer'
                    : 'bg-white border-[#496800]/40 text-[#496800] hover:bg-[#c8f17a]/40 active:scale-95 cursor-pointer'
                  : 'opacity-30 cursor-not-allowed border-current/20'
              }`}
            >
              <span className="font-bold text-xs uppercase tracking-wider">KOLAY (EASY)</span>
              <span className="text-[11px] opacity-75">Tekrar: {sm2Previews.easyInterval}</span>
            </button>
          </div>
        </main>
      )}

      {/* -------------------------------------------------------------
          TASK 2 VIEW: GREEK AI CONVERSATION SIMULATOR
      ------------------------------------------------------------- */}
      {currentTaskType === 'conversation' && (
        <main className="flex-1 flex flex-col justify-between px-5 md:px-10 py-6 max-w-[800px] mx-auto w-full">
          {/* Scenario Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between mb-6 shadow-xs ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542]'
                : 'bg-white border-[#dde3eb]'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#3d91ff]" />
                <h2 className="font-bold text-sm md:text-base">{scenario.title}</h2>
              </div>
              <p
                className={`text-xs mt-0.5 ${
                  isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'
                }`}
              >
                Konum: {scenario.location} • Muhatap: {scenario.partnerName} ({scenario.partnerRole})
              </p>
            </div>

            <button
              onClick={() => speakGreek(currentDialogueTurn.greek, currentDialogueTurn.transliteration)}
              className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-semibold cursor-pointer ${
                isDarkMode
                  ? 'bg-[#1e293b] border-[#2d3542] text-[#3d91ff] hover:bg-[#2d3542]'
                  : 'bg-[#eff4fc] border-[#dde3eb] text-[#004379] hover:bg-[#dde3eb]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Tekrar Dinle</span>
            </button>
          </div>

          {/* Dialogue Chat Stream */}
          <div className="space-y-5 flex-1 flex flex-col justify-center my-4">
            {/* Greek Partner Bubble */}
            <div className="flex items-start gap-3.5 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                {scenario.partnerName.charAt(0)}
              </div>

              <div
                className={`p-5 rounded-2xl rounded-tl-xs border shadow-sm max-w-[90%] md:max-w-[80%] ${
                  isDarkMode
                    ? 'bg-[#16202c] border-[#3d91ff]/30 text-white'
                    : 'bg-white border-[#004379]/20 text-[#161c22]'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-bold text-[#3d91ff]">
                    {currentDialogueTurn.partnerName || scenario.partnerName}
                  </span>
                  <button
                    onClick={() => speakGreek(currentDialogueTurn.greek, currentDialogueTurn.transliteration)}
                    className="text-xs text-[#727782] hover:text-current cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xl md:text-2xl font-bold font-display leading-snug">
                  {currentDialogueTurn.greek}
                </p>

                <p
                  className={`text-xs md:text-sm italic mt-1 ${
                    isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'
                  }`}
                >
                  {currentDialogueTurn.transliteration}
                </p>

                <div
                  className={`mt-3 pt-2.5 border-t text-xs md:text-sm font-medium ${
                    isDarkMode
                      ? 'border-[#2d3542] text-[#dbe3f4]'
                      : 'border-[#dde3eb] text-[#004379]'
                  }`}
                >
                  "{currentDialogueTurn.turkish}"
                </div>
              </div>
            </div>

            {/* Instant Linguistic Feedback Banner */}
            {revealedFeedback && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  isDarkMode
                    ? 'bg-[#add461]/15 border-[#add461]/30 text-[#add461]'
                    : 'bg-[#c8f17a]/40 border-[#496800]/20 text-[#131f00]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{revealedFeedback}</span>
              </div>
            )}
          </div>

          {/* User Response Options */}
          <div className="space-y-2.5 mt-6">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#727782]">
              <span>Cevabınızı Seçin (Yunanca Yanıt Verin):</span>
              <span>{conversationTurnIndex + 1} / {totalTurns} Adım</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {currentDialogueTurn.userOptions?.map((option) => {
                const isSelected = selectedUserOptionId === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectConversationOption(option)}
                    disabled={isTurnAdvancing}
                    className={`p-4 rounded-xl border text-left transition-all active:scale-98 cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-[#3d91ff]/20 border-[#3d91ff] text-white shadow-md'
                          : 'bg-[#eff4fc] border-[#004379] text-[#004379] shadow-md'
                        : isDarkMode
                        ? 'bg-[#16202c] border-[#2d3542] hover:border-[#3d91ff]/40 text-[#dbe3f4]'
                        : 'bg-white border-[#dde3eb] hover:border-[#004379]/40 text-[#161c22]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-base md:text-lg">
                        {option.greek}
                      </span>
                      <Volume2 className="w-4 h-4 opacity-60 hover:opacity-100" />
                    </div>

                    <p
                      className={`text-xs italic ${
                        isDarkMode ? 'text-[#94a3b8]' : 'text-[#727782]'
                      }`}
                    >
                      {option.transliteration}
                    </p>

                    <p
                      className={`text-xs font-medium ${
                        isDarkMode ? 'text-[#a9c7ff]' : 'text-[#004379]'
                      }`}
                    >
                      {option.turkish}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {/* -------------------------------------------------------------
          TASK 3 VIEW: GRAMMAR MASTERY & EXERCISES
      ------------------------------------------------------------- */}
      {currentTaskType === 'grammar' && (
        <main className="flex-1 flex flex-col justify-between px-5 md:px-10 py-6 max-w-[760px] mx-auto w-full">
          {/* Rule Insight Card */}
          <div
            className={`p-5 rounded-2xl border shadow-xs mb-6 ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542]'
                : 'bg-white border-[#dde3eb]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#3d91ff]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#3d91ff]">
                Dilbilgisi Kuralı: {currentGrammarQ.grammarFocus}
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold font-display mb-1">
              {currentGrammarQ.ruleTitle}
            </h2>

            <p
              className={`text-xs md:text-sm leading-relaxed ${
                isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
              }`}
            >
              {currentGrammarQ.ruleDescription}
            </p>
          </div>

          {/* Grammar Exercise Question Card */}
          <div
            className={`p-6 md:p-8 rounded-2xl border shadow-lg relative flex-1 flex flex-col justify-center ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542] meander-pattern-dark'
                : 'bg-white border-[#dde3eb] meander-pattern-light'
            }`}
          >
            <p className="text-sm md:text-base font-semibold mb-4 text-[#727782]">
              {currentGrammarQ.prompt}
            </p>

            {currentGrammarQ.sourceSentence && (
              <div className="my-4 text-center">
                <h1
                  className={`text-2xl md:text-3xl lg:text-4xl font-bold font-display ${
                    isDarkMode ? 'text-white' : 'text-[#004379]'
                  }`}
                >
                  {currentGrammarQ.sourceSentence}
                </h1>
              </div>
            )}

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {currentGrammarQ.options.map((option, idx) => {
                const isSelected = selectedGrammarOption === idx;
                const isCorrect = idx === currentGrammarQ.correctIndex;

                let optionStyles = isDarkMode
                  ? 'bg-[#1e293b] border-[#2d3542] text-white hover:border-[#3d91ff]'
                  : 'bg-[#eff4fc] border-[#dde3eb] text-[#161c22] hover:border-[#004379]';

                if (isSelected && !isGrammarChecked) {
                  optionStyles = isDarkMode
                    ? 'bg-[#3d91ff]/20 border-[#3d91ff] text-[#a9c7ff]'
                    : 'bg-[#d3e4ff] border-[#004379] text-[#004379]';
                } else if (isGrammarChecked) {
                  if (isCorrect) {
                    optionStyles = isDarkMode
                      ? 'bg-[#add461]/20 border-[#add461] text-[#add461]'
                      : 'bg-[#c8f17a] border-[#496800] text-[#131f00] font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyles = isDarkMode
                      ? 'bg-[#ffb4ab]/20 border-[#ffb4ab] text-[#ffb4ab]'
                      : 'bg-[#ffdad6] border-[#ba1a1a] text-[#ba1a1a]';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleGrammarSelect(idx)}
                    disabled={isGrammarChecked}
                    className={`py-4 px-4 rounded-xl border text-center font-bold text-base md:text-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${optionStyles}`}
                  >
                    <span>{option}</span>
                    {isGrammarChecked && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {isGrammarChecked && (
              <div
                className={`mt-6 p-4 rounded-xl border text-xs md:text-sm animate-in fade-in duration-200 ${
                  selectedGrammarOption === currentGrammarQ.correctIndex
                    ? isDarkMode
                      ? 'bg-[#add461]/15 border-[#add461]/30 text-[#dbe3f4]'
                      : 'bg-[#c8f17a]/30 border-[#496800]/20 text-[#131f00]'
                    : isDarkMode
                    ? 'bg-[#ffb4ab]/15 border-[#ffb4ab]/30 text-[#dbe3f4]'
                    : 'bg-[#ffdad6]/40 border-[#ba1a1a]/20 text-[#ba1a1a]'
                }`}
              >
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4" />
                  <span>
                    {selectedGrammarOption === currentGrammarQ.correctIndex
                      ? 'Doğru Cevap!'
                      : 'Açıklama'}
                  </span>
                </div>
                <p>{currentGrammarQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Bottom Action Button */}
          <div className="mt-6">
            {!isGrammarChecked ? (
              <button
                onClick={handleGrammarCheckAnswer}
                disabled={selectedGrammarOption === null}
                className={`w-full py-4 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                  selectedGrammarOption !== null
                    ? isDarkMode
                      ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa] cursor-pointer'
                      : 'bg-[#004379] text-white hover:bg-[#005ba1] cursor-pointer'
                    : 'opacity-40 cursor-not-allowed bg-neutral-400 text-neutral-200'
                }`}
              >
                <span>Cevabı Kontrol Et</span>
                <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleGrammarNext}
                className={`w-full py-4 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa]'
                    : 'bg-[#004379] text-white hover:bg-[#005ba1]'
                }`}
              >
                <span>
                  {grammarIndex + 1 < totalGrammarQuestions
                    ? 'Sıradaki Alıştırma'
                    : 'Dilbilgisi Dersini Bitir'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </main>
      )}
    </div>
  );
};
