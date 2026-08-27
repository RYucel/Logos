import React, { useState } from 'react';
import {
  Sparkles,
  Timer,
  Headphones,
  BookOpen,
  SpellCheck,
  ArrowRight,
  X,
  Volume2,
  CheckCircle2,
  Award,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GREEK_BUST_IMAGE, PLACEMENT_QUESTIONS } from '../data/mockData';
import { speakGreek, playSound } from '../utils/speech';

interface PlacementTestProps {
  isDarkMode: boolean;
  onComplete: (assignedLevel: 'A1' | 'A2' | 'B1' | 'B2') => void;
  onExit: () => void;
}

export const PlacementTest: React.FC<PlacementTestProps> = ({
  isDarkMode,
  onComplete,
  onExit
}) => {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = PLACEMENT_QUESTIONS[currentQIndex];
  const totalQuestions = PLACEMENT_QUESTIONS.length;
  const progressPercent = ((currentQIndex + 1) / totalQuestions) * 100;

  const handleStart = () => {
    playSound('click');
    setStage('quiz');
    setCurrentQIndex(0);
    setSelectedOption(null);
    setCorrectAnswersCount(0);
  };

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    playSound('click');
    // If choice has Greek text, optionally speak it
    const choiceText = currentQ.options[idx];
    if (choiceText && /[\u0370-\u03FF]/.test(choiceText)) {
      speakGreek(choiceText, undefined, 1.0);
    }
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    setIsSubmitting(true);
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      playSound('correct');
      setCorrectAnswersCount(prev => prev + 1);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      if (currentQIndex + 1 < totalQuestions) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedOption(null);
      } else {
        // Complete Quiz!
        playSound('success');
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
        setStage('result');
      }
    }, 350);
  };

  // Determine diagnosed level from test score
  const getDiagnosedLevel = () => {
    const ratio = correctAnswersCount / totalQuestions;
    if (ratio >= 0.8) return 'B1';
    if (ratio >= 0.5) return 'A2';
    return 'A1';
  };

  /* ------------------- 1. INTRO STAGE ------------------- */
  if (stage === 'intro') {
    return (
      <main
        className={`min-h-[85vh] flex items-center justify-center p-5 md:p-10 transition-colors ${
          isDarkMode ? 'bg-[#0c1420] text-[#dbe3f4]' : 'bg-[#f7f9ff] text-[#161c22]'
        }`}
      >
        <div className="max-w-[1024px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center relative">
          {/* Subtle Ambient Glow for Desktop */}
          <div
            className={`hidden md:block absolute -top-16 -left-16 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse pointer-events-none ${
              isDarkMode ? 'bg-[#3d91ff]' : 'bg-[#a2c9ff]'
            }`}
          />

          {/* Left Content Column */}
          <div className="flex flex-col gap-5 z-10">
            {/* Top Academic Tag */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit mb-2 shadow-xs ${
                isDarkMode ? 'bg-[#1e293b] text-[#3d91ff]' : 'bg-[#e3e9f0] text-[#004379]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Akademik Değerlendirme
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-tight tracking-tight ${
                isDarkMode ? 'text-white' : 'text-[#004379]'
              }`}
            >
              Seviye Tespit Sınavı
            </h1>

            {/* Subtext */}
            <p
              className={`text-base md:text-lg leading-relaxed ${
                isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
              } max-w-lg`}
            >
              Bilimsel yöntemlerle size en uygun başlangıç noktasını belirleyelim. Bu test, mevcut
              Yunanca bilginizi analiz ederek size özel bir müfredat oluşturmamızı sağlar.
            </p>

            {/* Bento-style Expectation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-2">
              {/* Card 1: Duration */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-[#16202c] border-[#2d3542] hover:border-[#3d91ff]/40 shadow-sm'
                    : 'bg-white border-[#dde3eb] hover:shadow-md'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isDarkMode ? 'bg-[#1e293b] text-[#3d91ff]' : 'bg-[#eff4fc] text-[#004379]'
                  }`}
                >
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Süre</h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
                    }`}
                  >
                    Yaklaşık 5-10 dakika sürecektir.
                  </p>
                </div>
              </div>

              {/* Card 2: Listening */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-[#16202c] border-[#2d3542] hover:border-[#3d91ff]/40 shadow-sm'
                    : 'bg-white border-[#dde3eb] hover:shadow-md'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isDarkMode ? 'bg-[#1e293b] text-[#3d91ff]' : 'bg-[#eff4fc] text-[#004379]'
                  }`}
                >
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Dinleme</h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
                    }`}
                  >
                    Kısa diyaloglar ve sesli telaffuzlar.
                  </p>
                </div>
              </div>

              {/* Card 3: Reading */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-[#16202c] border-[#2d3542] hover:border-[#3d91ff]/40 shadow-sm'
                    : 'bg-white border-[#dde3eb] hover:shadow-md'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isDarkMode ? 'bg-[#1e293b] text-[#3d91ff]' : 'bg-[#eff4fc] text-[#004379]'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Okuma</h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
                    }`}
                  >
                    Metin anlama ve kelime bilgisi.
                  </p>
                </div>
              </div>

              {/* Card 4: Grammar */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all duration-200 ${
                  isDarkMode
                    ? 'bg-[#16202c] border-[#2d3542] hover:border-[#3d91ff]/40 shadow-sm'
                    : 'bg-white border-[#dde3eb] hover:shadow-md'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isDarkMode ? 'bg-[#1e293b] text-[#3d91ff]' : 'bg-[#eff4fc] text-[#004379]'
                  }`}
                >
                  <SpellCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Gramer</h3>
                  <p
                    className={`text-xs mt-0.5 ${
                      isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
                    }`}
                  >
                    Temel dilbilgisi kuralları testi.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleStart}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa]'
                    : 'bg-[#004379] text-white hover:bg-[#005ba1]'
                }`}
              >
                <span>Sınava Başla</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onExit}
                className={`w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-medium transition-colors ${
                  isDarkMode
                    ? 'text-[#94a3b8] hover:text-white hover:bg-[#1e293b]'
                    : 'text-[#727782] hover:text-[#161c22] hover:bg-[#e9eef6]'
                }`}
              >
                Daha sonra hatırlat
              </button>
            </div>
          </div>

          {/* Right Illustration Column with Classical Greek Bust */}
          <div className="hidden md:flex justify-center items-center z-10 relative">
            <div
              className={`absolute inset-0 rounded-[40px] transform rotate-3 scale-105 shadow-xl transition-colors ${
                isDarkMode
                  ? 'bg-gradient-to-tr from-[#16202c] to-[#1e293b] border border-[#3d91ff]/20'
                  : 'bg-gradient-to-tr from-[#e9eef6] to-[#dde3eb]'
              }`}
            />
            <div
              className={`relative rounded-[36px] p-6 border shadow-xl overflow-hidden backdrop-blur-md ${
                isDarkMode
                  ? 'bg-[#16202c]/90 border-[#3d91ff]/30 meander-pattern-dark'
                  : 'bg-white/90 border-[#c1c7d2]/30 meander-pattern-light'
              }`}
            >
              <img
                src={GREEK_BUST_IMAGE}
                alt="Classical Greek Apollo Marble Bust"
                className="w-full max-w-[360px] h-auto object-cover rounded-2xl relative z-10 shadow-sm"
              />
              <div className="mt-4 text-center">
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${
                    isDarkMode ? 'text-[#ffd700]' : 'text-[#004379]'
                  }`}
                >
                  Gnosis • Greek Academy
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ------------------- 2. QUIZ QUESTIONS STAGE ------------------- */
  if (stage === 'quiz') {
    return (
      <div
        className={`min-h-[90vh] flex flex-col transition-colors ${
          isDarkMode ? 'bg-[#0c1420] text-[#dbe3f4]' : 'bg-[#f7f9ff] text-[#161c22]'
        }`}
      >
        {/* Top Header & Progress */}
        <header
          className={`sticky top-0 z-30 w-full px-5 md:px-10 py-4 border-b ${
            isDarkMode
              ? 'bg-[#0c1420]/95 border-[#2d3542]'
              : 'bg-[#f7f9ff]/95 border-[#dde3eb]'
          } backdrop-blur-md`}
        >
          <div className="max-w-[1024px] mx-auto flex items-center justify-between gap-4">
            <button
              onClick={onExit}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
                  : 'text-[#414751] hover:bg-[#e9eef6] hover:text-black'
              }`}
              title="Sınavdan Çık"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Progress Bar */}
            <div className="flex-1 max-w-lg mx-auto flex items-center gap-4">
              <div
                className={`w-full h-2.5 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-[#1e293b]' : 'bg-[#dde3eb]'
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    isDarkMode ? 'bg-[#3d91ff] shadow-[0_0_10px_rgba(61,145,255,0.5)]' : 'bg-[#004379]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span
                className={`text-xs md:text-sm font-bold whitespace-nowrap ${
                  isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'
                }`}
              >
                {currentQIndex + 1} / {totalQuestions}
              </span>
            </div>

            <div className="w-9" />
          </div>
        </header>

        {/* Question Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center px-5 md:px-10 py-8 max-w-[800px] mx-auto w-full">
          {/* Question Title */}
          <div className="text-center mb-6 w-full">
            <span
              className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                isDarkMode ? 'text-[#a9c7ff]' : 'text-[#005ba1]'
              }`}
            >
              Seviye Tespit • Soru {currentQIndex + 1}
            </span>
            <h2
              className={`text-2xl md:text-3xl font-bold font-display ${
                isDarkMode ? 'text-white' : 'text-[#161c22]'
              }`}
            >
              {currentQ.prompt}
            </h2>
            <p
              className={`text-sm md:text-base mt-1 ${
                isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
              }`}
            >
              {currentQ.subPrompt}
            </p>
          </div>

          {/* Source Phrase / Audio Card */}
          <div
            className={`w-full p-6 md:p-8 rounded-2xl text-center mb-6 border relative overflow-hidden transition-all shadow-xs ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542] meander-pattern-dark'
                : 'bg-white border-[#dde3eb] meander-pattern-light'
            }`}
          >
            <p
              className={`text-xl md:text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-[#004379]'
              }`}
            >
              {currentQ.sourceSentence}
            </p>

            {currentQ.audioText && (
              <button
                onClick={() => speakGreek(currentQ.audioText!)}
                className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#1e293b] text-[#3d91ff] hover:bg-[#2d3542]'
                    : 'bg-[#eff4fc] text-[#004379] hover:bg-[#d3e4ff]'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Dinle (Listen)</span>
              </button>
            )}
          </div>

          {/* Options List (Bento options) */}
          <div className="w-full flex flex-col gap-3.5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 md:p-5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-[#1e293b] border-[#3d91ff] shadow-[0_0_15px_rgba(61,145,255,0.2)]'
                        : 'bg-[#d3e4ff]/70 border-[#004379] shadow-sm'
                      : isDarkMode
                      ? 'bg-[#16202c] border-[#2d3542] hover:bg-[#1e293b] hover:border-[#3d91ff]/30'
                      : 'bg-white border-[#c1c7d2]/60 hover:bg-[#eff4fc] hover:border-[#004379]/40'
                  }`}
                >
                  <span
                    className={`font-display text-lg md:text-xl font-medium ${
                      isSelected
                        ? isDarkMode
                          ? 'text-white'
                          : 'text-[#004379]'
                        : isDarkMode
                        ? 'text-[#dbe3f4]'
                        : 'text-[#161c22]'
                    }`}
                  >
                    {option}
                  </span>

                  {/* Radio Indicator */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-colors ${
                      isSelected
                        ? isDarkMode
                          ? 'border-[#3d91ff] bg-[#3d91ff]'
                          : 'border-[#004379] bg-[#004379]'
                        : isDarkMode
                        ? 'border-[#8b919f]'
                        : 'border-[#c1c7d2]'
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Continue Button */}
          <div className="w-full mt-8 flex justify-end">
            <button
              onClick={handleNext}
              disabled={selectedOption === null || isSubmitting}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                selectedOption !== null && !isSubmitting
                  ? isDarkMode
                    ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa] shadow-md active:scale-95'
                    : 'bg-[#004379] text-white hover:bg-[#005ba1] shadow-md active:scale-95'
                  : isDarkMode
                  ? 'bg-[#1e293b] text-[#8b919f] opacity-50 cursor-not-allowed'
                  : 'bg-[#dde3eb] text-[#727782] opacity-60 cursor-not-allowed'
              }`}
            >
              <span>{currentQIndex + 1 === totalQuestions ? 'Testi Bitir' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* ------------------- 3. RESULTS STAGE ------------------- */
  const diagnosedLevel = getDiagnosedLevel();

  return (
    <main
      className={`min-h-[85vh] flex items-center justify-center p-5 md:p-10 transition-colors ${
        isDarkMode ? 'bg-[#0c1420] text-[#dbe3f4]' : 'bg-[#f7f9ff] text-[#161c22]'
      }`}
    >
      <div
        className={`max-w-xl w-full mx-auto rounded-3xl p-8 md:p-10 border shadow-2xl text-center relative overflow-hidden ${
          isDarkMode
            ? 'bg-[#16202c] border-[#3d91ff]/30 meander-pattern-dark'
            : 'bg-white border-[#dde3eb] meander-pattern-light'
        }`}
      >
        <div
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 shadow-md ${
            isDarkMode ? 'bg-[#3d91ff]/20 text-[#3d91ff]' : 'bg-[#c8f17a] text-[#496800]'
          }`}
        >
          <Award className="w-10 h-10" />
        </div>

        <h2
          className={`text-2xl md:text-3xl font-extrabold font-display ${
            isDarkMode ? 'text-white' : 'text-[#004379]'
          }`}
        >
          Değerlendirme Tamamlandı!
        </h2>

        <p
          className={`text-sm md:text-base mt-2 mb-6 ${
            isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
          }`}
        >
          Doğru cevap oranı: %{Math.round((correctAnswersCount / totalQuestions) * 100)} ({correctAnswersCount}/{totalQuestions})
        </p>

        {/* Assigned Level Card */}
        <div
          className={`p-6 rounded-2xl border mb-6 text-center ${
            isDarkMode ? 'bg-[#1e293b] border-[#3d91ff]/40' : 'bg-[#eff4fc] border-[#004379]/20'
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#005ba1] block mb-1">
            Önerilen Başlangıç Seviyesi
          </span>
          <div
            className={`text-5xl font-black font-display my-2 ${
              isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'
            }`}
          >
            {diagnosedLevel}
          </div>
          <p
            className={`text-sm font-semibold ${
              isDarkMode ? 'text-[#dbe3f4]' : 'text-[#161c22]'
            }`}
          >
            {diagnosedLevel === 'B1'
              ? 'Orta Seviye (Intermediate) — Günlük akıcı diyaloglar & felsefi metinler'
              : diagnosedLevel === 'A2'
              ? 'Temel-Orta Seviye (Elementary) — Pratik yapılar & kelime dağarcığı'
              : 'Başlangıç Seviyesi (Beginner) — Alfabe, telaffuz ve temel selamlaşmalar'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onComplete(diagnosedLevel)}
            className={`px-8 py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
              isDarkMode
                ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa]'
                : 'bg-[#004379] text-white hover:bg-[#005ba1]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Programa Başla</span>
          </button>

          <button
            onClick={() => setStage('quiz')}
            className={`px-6 py-3.5 rounded-full font-medium text-sm border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isDarkMode
                ? 'border-[#2d3542] text-[#c1c6d5] hover:bg-[#1e293b]'
                : 'border-[#c1c7d2] text-[#414751] hover:bg-[#e9eef6]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Testi Tekrarla</span>
          </button>
        </div>
      </div>
    </main>
  );
};
