import React from 'react';
import {
  Flame,
  Timer,
  ArrowRight,
  Info,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  RotateCw,
  Clock,
  FastForward,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SunMedium,
  RotateCcw
} from 'lucide-react';
import { LessonTask, SM2SchedulerState } from '../types';
import { playSound } from '../utils/speech';

interface LearnDashboardProps {
  isDarkMode: boolean;
  currentLevel: string;
  currentDayNumber: number;
  dayThemeTitle: string;
  dayThemeSubtitle: string;
  tasks: LessonTask[];
  onStartSession: (taskType?: 'vocabulary' | 'conversation' | 'grammar') => void;
  onToggleTask: (taskId: string) => void;
  onAdvanceToNextDay: () => void;
  onSelectDay: (dayNumber: number) => void;
  onResetCurrentDayTasks: () => void;
  streakDays: number;
  schedulerState?: SM2SchedulerState;
  onTriggerSchedulerCheck?: () => void;
  onFastForwardDays?: (days: number) => void;
  onResetSimulationTime?: () => void;
  onOpenLibrary?: () => void;
  dayRolloverNotice?: string | null;
  onDismissNotice?: () => void;
}

export const LearnDashboard: React.FC<LearnDashboardProps> = ({
  isDarkMode,
  currentLevel,
  currentDayNumber,
  dayThemeTitle,
  dayThemeSubtitle,
  tasks,
  onStartSession,
  onToggleTask,
  onAdvanceToNextDay,
  onSelectDay,
  onResetCurrentDayTasks,
  streakDays,
  schedulerState,
  onTriggerSchedulerCheck,
  onFastForwardDays,
  onResetSimulationTime,
  onOpenLibrary,
  dayRolloverNotice,
  onDismissNotice
}) => {
  const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);
  const completedCount = tasks.filter(t => t.completed).length;
  const nextUncompletedTask = tasks.find(t => !t.completed);
  const nextTaskIndex = tasks.findIndex(t => !t.completed);
  const totalEstimatedMinutes = tasks.reduce((sum, t) => sum + t.durationMinutes, 0);

  const simulatedDays = schedulerState
    ? Math.round(schedulerState.simulatedOffsetMs / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <main className="max-w-[1024px] mx-auto px-5 md:px-10 py-6 md:py-10 flex flex-col gap-8">
      {/* Rollover / Day Notice Banner */}
      {dayRolloverNotice && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-top-3 duration-300 ${
            isDarkMode
              ? 'bg-[#1b2a47] border-[#3d91ff]/40 text-[#dbe3f4]'
              : 'bg-[#d3e4ff] border-[#004379]/30 text-[#001c38]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isDarkMode ? 'bg-[#3d91ff]/20 text-[#a9c7ff]' : 'bg-[#004379]/15 text-[#004379]'
              }`}
            >
              <SunMedium className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-sm">{dayRolloverNotice}</p>
              <p className="text-xs opacity-80 mt-0.5">
                Yeni günün derslerini tamamlayarak çalışma serinizi sürdürün.
              </p>
            </div>
          </div>
          {onDismissNotice && (
            <button
              onClick={() => {
                playSound('click');
                onDismissNotice();
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-lg border bg-white/20 hover:bg-white/30 transition-all cursor-pointer shrink-0"
            >
              Tamam
            </button>
          )}
        </div>
      )}

      {/* Header Section */}
      <div className="text-center md:text-left flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          {/* Day Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black shadow-xs ${
              isDarkMode
                ? 'bg-[#3d91ff] text-[#0a121e]'
                : 'bg-[#004379] text-white'
            }`}
          >
            <span>🏛️ Gün {currentDayNumber}</span>
          </div>

          {/* Level Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold shadow-xs ${
              isDarkMode
                ? 'bg-[#3d91ff]/20 text-[#a9c7ff] border border-[#3d91ff]/30'
                : 'bg-[#d3e4ff] text-[#001c38] border border-[#004379]/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentLevel} Seviyesi</span>
          </div>
        </div>

        <h1
          className={`text-2xl md:text-3xl lg:text-4xl font-bold font-display ${
            isDarkMode ? 'text-white' : 'text-[#004379]'
          }`}
        >
          Gün {currentDayNumber}: {dayThemeTitle}
        </h1>

        <p
          className={`text-sm md:text-base max-w-2xl mx-auto md:mx-0 leading-relaxed ${
            isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
          }`}
        >
          {dayThemeSubtitle || `Bugün için bilimsel olarak optimize edilmiş ${totalEstimatedMinutes} dakikalık çalışma planınız.`}
        </p>
      </div>

      {/* Dashboard 12-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Today's Tasks Timeline */}
        <div className="md:col-span-8 space-y-4">
          <div
            className={`rounded-2xl p-5 md:p-6 border shadow-xs relative overflow-hidden ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542] meander-pattern-dark'
                : 'bg-white border-[#dde3eb] meander-pattern-light'
            }`}
          >
            {/* Task Card Header & Day Navigation Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 mb-6 border-current/10">
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className={`text-lg md:text-xl font-bold font-display ${
                      isDarkMode ? 'text-white' : 'text-[#161c22]'
                    }`}
                  >
                    Gün {currentDayNumber} Görevleri
                  </h2>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      allCompleted
                        ? 'bg-[#c8f17a] text-[#131f00]'
                        : isDarkMode
                        ? 'bg-[#1e293b] text-[#a9c7ff]'
                        : 'bg-[#eff4fc] text-[#004379]'
                    }`}
                  >
                    {completedCount} / {tasks.length} {allCompleted ? 'Tamamlandı 🎉' : 'Bitti'}
                  </span>
                </div>
                <p className="text-xs text-[#727782] mt-0.5">
                  Her gün 3 görevi tamamlayarak sonraki güne geçiş yapın.
                </p>
              </div>

              {/* Day Switcher Controls */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  onClick={() => {
                    if (currentDayNumber > 1) {
                      playSound('click');
                      onSelectDay(currentDayNumber - 1);
                    }
                  }}
                  disabled={currentDayNumber <= 1}
                  className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-0.5 transition-all ${
                    currentDayNumber <= 1
                      ? 'opacity-40 cursor-not-allowed border-transparent'
                      : isDarkMode
                      ? 'bg-[#1e293b] border-[#2d3542] text-[#a9c7ff] hover:bg-[#2d3542] cursor-pointer'
                      : 'bg-white border-[#dde3eb] text-[#004379] hover:bg-[#eff4fc] cursor-pointer'
                  }`}
                  title="Önceki Günün Görevleri"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Gün {currentDayNumber - 1}</span>
                </button>

                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    isDarkMode ? 'bg-[#0c1420] text-white border border-[#2d3542]' : 'bg-[#e9eef6] text-[#004379]'
                  }`}
                >
                  Gün {currentDayNumber}
                </span>

                <button
                  onClick={() => {
                    playSound('click');
                    onSelectDay(currentDayNumber + 1);
                  }}
                  className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-0.5 transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#1e293b] border-[#2d3542] text-[#a9c7ff] hover:bg-[#2d3542]'
                      : 'bg-white border-[#dde3eb] text-[#004379] hover:bg-[#eff4fc]'
                  }`}
                  title="Sonraki Günün Görevleri"
                >
                  <span className="hidden sm:inline">Gün {currentDayNumber + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Timeline Vertical Container */}
            <div className="relative pl-6 space-y-4">
              {/* Timeline Connector Line */}
              <div
                className={`absolute left-[11px] top-3 bottom-6 w-0.5 ${
                  isDarkMode ? 'bg-[#2d3542]' : 'bg-[#dde3eb]'
                }`}
              />

              {tasks.map((task, index) => {
                const isNextActive = !task.completed && index === nextTaskIndex;

                return (
                  <div
                    key={task.id}
                    className="relative flex items-start group cursor-pointer"
                    onClick={() => {
                      onStartSession(task.type);
                    }}
                  >
                    {/* Node Dot / Check Indicator */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound(task.completed ? 'click' : 'correct');
                        onToggleTask(task.id);
                      }}
                      className={`absolute -left-6 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-[#add461] border-[#add461] text-[#131f00]'
                          : isNextActive
                          ? isDarkMode
                            ? 'bg-[#0c1420] border-[#3d91ff] ring-4 ring-[#3d91ff]/20'
                            : 'bg-white border-[#004379] ring-4 ring-[#004379]/15'
                          : isDarkMode
                          ? 'bg-[#16202c] border-[#8b919f] group-hover:border-[#3d91ff]'
                          : 'bg-white border-[#c1c7d2] group-hover:border-[#004379]'
                      }`}
                      title={task.completed ? 'Tamamlandı' : 'Tamamla'}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#131f00]" />
                      ) : isNextActive ? (
                        <div
                          className={`w-2.5 h-2.5 rounded-full animate-pulse ${
                            isDarkMode ? 'bg-[#3d91ff]' : 'bg-[#004379]'
                          }`}
                        />
                      ) : null}
                    </button>

                    {/* Task Card Content */}
                    <div
                      className={`rounded-xl p-4 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 border transition-all duration-200 ${
                        task.completed
                          ? isDarkMode
                            ? 'bg-[#1e293b]/50 border-[#2d3542] opacity-75'
                            : 'bg-[#eff4fc]/50 border-[#dde3eb] opacity-80'
                          : isNextActive
                          ? isDarkMode
                            ? 'bg-[#1e293b] border-[#3d91ff] shadow-[0_0_20px_rgba(61,145,255,0.15)] ring-1 ring-[#3d91ff]/30'
                            : 'bg-[#eff4fc] border-[#004379] shadow-sm ring-1 ring-[#004379]/20'
                          : isDarkMode
                          ? 'bg-[#16202c] border-[#2d3542] group-hover:border-[#3d91ff]/40'
                          : 'bg-white border-[#dde3eb] group-hover:border-[#004379]/40 group-hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-semibold text-sm md:text-base ${
                              task.completed
                                ? 'line-through opacity-70'
                                : isDarkMode
                                ? 'text-white'
                                : 'text-[#161c22]'
                            }`}
                          >
                            {task.title}
                          </h3>
                          {isNextActive && (
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                isDarkMode
                                  ? 'bg-[#3d91ff]/20 text-[#a9c7ff]'
                                  : 'bg-[#d3e4ff] text-[#004379]'
                              }`}
                            >
                              Sıradaki Görev
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs md:text-sm mt-0.5 ${
                            isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            isNextActive
                              ? isDarkMode
                                ? 'bg-[#3d91ff]/20 text-[#a9c7ff]'
                                : 'bg-[#d3e4ff] text-[#004379]'
                              : isDarkMode
                              ? 'bg-[#1e293b] text-[#8b919f]'
                              : 'bg-[#e9eef6] text-[#727782]'
                          }`}
                        >
                          <Timer className="w-3.5 h-3.5" />
                          <span>{task.durationMinutes} dk</span>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completion Banner & Next Day Advance Action */}
            {allCompleted ? (
              <div
                className={`mt-8 p-5 rounded-2xl border text-center animate-in zoom-in-95 duration-300 ${
                  isDarkMode
                    ? 'bg-[#0f1d2e] border-[#3d91ff]/40 shadow-[0_0_30px_rgba(61,145,255,0.15)]'
                    : 'bg-[#eff4fc] border-[#004379]/30 shadow-md'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 shadow-md ${
                    isDarkMode ? 'bg-[#add461]/20 text-[#add461]' : 'bg-[#c8f17a] text-[#131f00]'
                  }`}
                >
                  <Sparkles className="w-6 h-6" />
                </div>

                <h3
                  className={`text-lg md:text-xl font-bold font-display ${
                    isDarkMode ? 'text-white' : 'text-[#004379]'
                  }`}
                >
                  🎉 Gün {currentDayNumber} Görevleri Başarıyla Tamamlandı! (3/3)
                </h3>

                <p
                  className={`text-xs md:text-sm mt-1 mb-5 max-w-md mx-auto ${
                    isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
                  }`}
                >
                  Harika bir çalışma disiplini! Günlük seriniz ilerledi. Şimdi doğrudan sonraki günün programına geçebilirsiniz.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      playSound('success');
                      onAdvanceToNextDay();
                    }}
                    className={`w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-all duration-200 active:scale-95 cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa] shadow-[0px_4px_25px_rgba(61,145,255,0.35)]'
                        : 'bg-[#004379] text-white hover:bg-[#005ba1] shadow-[0px_8px_25px_rgba(0,67,121,0.25)]'
                    }`}
                  >
                    <span>🚀 Gün {currentDayNumber + 1} Görevlerine Başla (0/3)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      playSound('click');
                      onResetCurrentDayTasks();
                    }}
                    className={`w-full sm:w-auto px-4 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#1e293b] border-[#2d3542] text-[#a9c7ff] hover:bg-[#2d3542]'
                        : 'bg-white border-[#dde3eb] text-[#414751] hover:bg-[#eff4fc]'
                    }`}
                    title="Bu günün görevlerini baştan tekrarla"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Bu Günü Sıfırla & Tekrarla</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => onStartSession(nextUncompletedTask?.type || 'vocabulary')}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-lg transition-all duration-200 active:scale-95 cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa] shadow-[0px_4px_20px_rgba(61,145,255,0.25)]'
                      : 'bg-[#004379] text-white hover:bg-[#005ba1] shadow-[0px_10px_30px_rgba(0,67,121,0.15)]'
                  }`}
                >
                  <span>{nextUncompletedTask?.title || 'Bugünün Görevine'} Başla</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Streak and Cognitive Load */}
        <div className="md:col-span-4 space-y-4">
          {/* Daily Streak Card */}
          <div
            className={`rounded-2xl p-6 border text-center flex flex-col items-center justify-center relative overflow-hidden shadow-xs ${
              isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 shadow-sm ${
                isDarkMode ? 'bg-[#add461]/20 text-[#add461]' : 'bg-[#c8f17a] text-[#131f00]'
              }`}
            >
              <Flame className="w-7 h-7 fill-current" />
            </div>

            <div
              className={`text-4xl md:text-5xl font-black font-display tracking-tight ${
                isDarkMode ? 'text-white' : 'text-[#161c22]'
              }`}
            >
              {streakDays}
            </div>

            <p
              className={`text-xs font-bold uppercase tracking-widest mt-1 ${
                isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
              }`}
            >
              Günlük Seri
            </p>

            {/* 7-day Dot Matrix */}
            <div className="flex justify-center gap-1.5 mt-4">
              {[1, 2, 3, 4, 5, 6, 7].map((dayIdx) => {
                const isActive = dayIdx <= (currentDayNumber % 7 === 0 ? 7 : currentDayNumber % 7);
                return (
                  <div
                    key={dayIdx}
                    className={`w-2.5 h-2.5 rounded-full ${
                      isActive
                        ? isDarkMode
                          ? 'bg-[#add461]'
                          : 'bg-[#496800]'
                        : isDarkMode
                        ? 'bg-[#2d3542]'
                        : 'bg-[#dde3eb]'
                    }`}
                    title={`Gün ${dayIdx}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Cognitive Load Tracking Card */}
          <div
            className={`rounded-2xl p-5 border shadow-xs ${
              isDarkMode ? 'bg-[#16202c] border-[#2d3542]' : 'bg-white border-[#dde3eb]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BrainCircuit
                  className={`w-4 h-4 ${isDarkMode ? 'text-[#3d91ff]' : 'text-[#004379]'}`}
                />
                <h3
                  className={`text-sm font-semibold ${
                    isDarkMode ? 'text-white' : 'text-[#161c22]'
                  }`}
                >
                  Bilişsel Yük
                </h3>
              </div>
              <span
                className={`p-1 rounded-full text-xs cursor-help ${
                  isDarkMode ? 'text-[#8b919f]' : 'text-[#727782]'
                }`}
                title="Hata oranı ve cevap hızınıza göre hesaplanan zihinsel kapasite optimizasyonu."
              >
                <Info className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Progress bar */}
            <div
              className={`w-full h-2 rounded-full overflow-hidden mb-2 ${
                isDarkMode ? 'bg-[#1e293b]' : 'bg-[#dde3eb]'
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isDarkMode ? 'bg-[#3d91ff] shadow-[0_0_8px_rgba(61,145,255,0.4)]' : 'bg-[#004379]'
                }`}
                style={{ width: '65%' }}
              />
            </div>

            <div
              className={`flex justify-between text-xs ${
                isDarkMode ? 'text-[#8b919f]' : 'text-[#727782]'
              }`}
            >
              <span>Düşük</span>
              <span
                className={`font-bold ${isDarkMode ? 'text-[#a9c7ff]' : 'text-[#004379]'}`}
              >
                Optimum (%65)
              </span>
              <span>Yüksek</span>
            </div>

            <p
              className={`text-xs mt-3 text-center leading-normal ${
                isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
              }`}
            >
              Öğrenme verimliliğiniz şu an en üst düzeyde.
            </p>
          </div>

          {/* SM-2 Spaced Repetition Scheduler Monitor Card */}
          <div
            className={`rounded-2xl p-5 border shadow-xs ${
              isDarkMode
                ? 'bg-[#16202c] border-[#2d3542]'
                : 'bg-white border-[#dde3eb]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <RotateCw
                    className={`w-4 h-4 ${
                      schedulerState?.isChecking
                        ? 'animate-spin text-[#3d91ff]'
                        : isDarkMode
                        ? 'text-[#3d91ff]'
                        : 'text-[#004379]'
                    }`}
                  />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3
                  className={`text-sm font-semibold ${
                    isDarkMode ? 'text-white' : 'text-[#161c22]'
                  }`}
                >
                  SM-2 Aralıklı Tekrar Motoru
                </h3>
              </div>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  (schedulerState?.dueCount ?? 0) > 0
                    ? isDarkMode
                      ? 'bg-[#ffb4ab]/20 text-[#ffb4ab]'
                      : 'bg-[#ffdad6] text-[#ba1a1a]'
                    : isDarkMode
                    ? 'bg-[#add461]/20 text-[#add461]'
                    : 'bg-[#c8f17a] text-[#131f00]'
                }`}
              >
                {(schedulerState?.dueCount ?? 0) > 0
                  ? `${schedulerState?.dueCount} Tekrar Bekliyor`
                  : 'Güncel'}
              </span>
            </div>

            <p
              className={`text-xs mb-3 ${
                isDarkMode ? 'text-[#94a3b8]' : 'text-[#414751]'
              }`}
            >
              Arka planda periyodik olarak kelime tekrar tarihlerini denetler ve günü gelenleri otomatik olarak <strong className="text-current font-bold">Reviewing</strong> durumuna aktarır.
            </p>

            {/* Scheduler Status Metrics */}
            <div
              className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between text-xs font-mono ${
                isDarkMode
                  ? 'bg-[#0c1420] border-[#2d3542]'
                  : 'bg-[#f7f9ff] border-[#dde3eb]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#727782]" />
                <span className="text-[#727782]">Son Tarama:</span>
                <span className="font-semibold">
                  {schedulerState?.lastRunDate
                    ? new Date(schedulerState.lastRunDate).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })
                    : 'Şimdi'}
                </span>
              </div>

              {simulatedDays !== 0 && (
                <span className="text-amber-500 font-bold">
                  +{simulatedDays} Gün İleri
                </span>
              )}
            </div>

            {/* Quick Time Fast-Forward Controls (For Testing Scheduler & Days) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#727782]">
                <span className="flex items-center gap-1">
                  <FastForward className="w-3 h-3" />
                  Zaman & Gün İlerlemesi Testi:
                </span>
                {simulatedDays !== 0 && onResetSimulationTime && (
                  <button
                    onClick={() => {
                      playSound('click');
                      onResetSimulationTime();
                    }}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Sıfırla
                  </button>
                )}
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => {
                    playSound('click');
                    onFastForwardDays?.(1);
                  }}
                  className={`py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#1e293b] border-[#2d3542] text-[#a9c7ff] hover:bg-[#2d3542]'
                      : 'bg-white border-[#dde3eb] text-[#004379] hover:bg-[#eff4fc]'
                  }`}
                  title="1 Gün İleri Sar"
                >
                  +1 Gün
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    onFastForwardDays?.(3);
                  }}
                  className={`py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#1e293b] border-[#2d3542] text-[#a9c7ff] hover:bg-[#2d3542]'
                      : 'bg-white border-[#dde3eb] text-[#004379] hover:bg-[#eff4fc]'
                  }`}
                  title="3 Gün İleri Sar"
                >
                  +3 Gün
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    onFastForwardDays?.(7);
                  }}
                  className={`py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#1e293b] border-[#2d3542] text-[#a9c7ff] hover:bg-[#2d3542]'
                      : 'bg-white border-[#dde3eb] text-[#004379] hover:bg-[#eff4fc]'
                  }`}
                  title="1 Hafta İleri Sar"
                >
                  +7 Gün
                </button>
                <button
                  onClick={() => {
                    playSound('click');
                    onTriggerSchedulerCheck?.();
                  }}
                  className={`py-1 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#3d91ff]/20 border-[#3d91ff]/40 text-[#3d91ff] hover:bg-[#3d91ff]/30'
                      : 'bg-[#d3e4ff] border-[#004379]/30 text-[#004379] hover:bg-[#b5d3ff]'
                  }`}
                  title="Hemen Tara"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Tara</span>
                </button>
              </div>
            </div>

            {/* Action button to Library when items are due */}
            {(schedulerState?.dueCount ?? 0) > 0 && onOpenLibrary && (
              <button
                onClick={() => {
                  playSound('click');
                  onOpenLibrary();
                }}
                className={`w-full mt-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#3d91ff] text-[#0a121e] hover:bg-[#60a5fa]'
                    : 'bg-[#004379] text-white hover:bg-[#005ba1]'
                }`}
              >
                <span>Tekrarları İncele ({schedulerState?.dueCount})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
