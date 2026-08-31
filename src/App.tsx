/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { NavTab, UserProfile, VocabularyItem, LessonTask } from './types';
import {
  INITIAL_USER_PROFILE,
  VOCABULARY_LIST
} from './data/mockData';
import { getDayCurriculum } from './data/curriculum';
import { Navbar } from './components/Navbar';
import { LearnDashboard } from './components/LearnDashboard';
import { PlacementTest } from './components/PlacementTest';
import { ActiveSession } from './components/ActiveSession';
import { ProgressScreen } from './components/ProgressScreen';
import { VocabularyLibrary } from './components/VocabularyLibrary';
import { SettingsScreen } from './components/SettingsScreen';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { useSM2Scheduler } from './hooks/useSM2Scheduler';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('learn');
  const [isPlacementActive, setIsPlacementActive] = useState(false);
  const [isActiveSessionOpen, setIsActiveSessionOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [activeSessionTaskType, setActiveSessionTaskType] = useState<
    'vocabulary' | 'conversation' | 'grammar'
  >('vocabulary');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('logos_dark_mode');
    if (saved !== null) return saved === 'true';
    return false;
  });

  const [currentDayNumber, setCurrentDayNumber] = useState<number>(() => {
    const saved = localStorage.getItem('logos_current_day_number');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 1;
  });

  const currentCurriculum = useMemo(() => {
    return getDayCurriculum(currentDayNumber);
  }, [currentDayNumber]);

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('logos_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_USER_PROFILE;
  });

  const [vocabList, setVocabList] = useState<VocabularyItem[]>(() => {
    const saved = localStorage.getItem('logos_vocab_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return VOCABULARY_LIST;
  });

  // Background SM-2 Spaced Repetition Scheduler
  const {
    schedulerState,
    triggerManualCheck,
    processSM2Review,
    fastForwardDays,
    resetSimulatedTime
  } = useSM2Scheduler({
    vocabList,
    setVocabList,
    intervalMs: 15000, // Check periodically every 15s in background
    onStatusUpdated: (updatedCount, dueCount) => {
      console.log(
        `[SM-2 Scheduler] ${updatedCount} words marked as Reviewing. Total due: ${dueCount}`
      );
    }
  });

  const [tasks, setTasks] = useState<LessonTask[]>(() => {
    const saved = localStorage.getItem('logos_daily_tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    const savedDay = localStorage.getItem('logos_current_day_number');
    const dayNum = savedDay ? parseInt(savedDay, 10) || 1 : 1;
    return getDayCurriculum(dayNum).tasks;
  });

  const [dayRolloverNotice, setDayRolloverNotice] = useState<string | null>(null);

  // Check on load if calendar date changed and previous day was completed
  useEffect(() => {
    const todayDateKey = new Date().toISOString().slice(0, 10);
    const lastActiveDate = localStorage.getItem('logos_last_active_date');

    if (lastActiveDate && lastActiveDate !== todayDateKey) {
      // New calendar day!
      const savedTasksRaw = localStorage.getItem('logos_daily_tasks');
      let prevTasksCompleted = false;
      if (savedTasksRaw) {
        try {
          const parsed = JSON.parse(savedTasksRaw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            prevTasksCompleted = parsed.every((t: LessonTask) => t.completed);
          }
        } catch {
          // ignore
        }
      }

      if (prevTasksCompleted) {
        const nextDay = currentDayNumber + 1;
        setCurrentDayNumber(nextDay);
        const nextCurr = getDayCurriculum(nextDay);
        setTasks(nextCurr.tasks.map(t => ({ ...t, completed: false })));
        setDayRolloverNotice(`Yeni gün başladı! Gün ${nextDay}: ${nextCurr.themeTitle} görevleriniz hazır.`);
      }
    }
    localStorage.setItem('logos_last_active_date', todayDateKey);
  }, []);

  // Sync dark mode class with document root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0c1420';
      document.body.style.color = '#dbe3f4';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f7f9ff';
      document.body.style.color = '#161c22';
    }
    localStorage.setItem('logos_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Persist states
  useEffect(() => {
    localStorage.setItem('logos_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('logos_vocab_list', JSON.stringify(vocabList));
  }, [vocabList]);

  useEffect(() => {
    localStorage.setItem('logos_daily_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('logos_current_day_number', String(currentDayNumber));
  }, [currentDayNumber]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handlePlacementComplete = (assignedLevel: 'A1' | 'A2' | 'B1' | 'B2') => {
    setUserProfile(prev => ({
      ...prev,
      level: assignedLevel === 'B1' ? 'Orta Seviye - B1' : assignedLevel === 'A2' ? 'Temel Seviye - A2' : 'Başlangıç - A1'
    }));
    setIsPlacementActive(false);
    setActiveTab('learn');
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleStartSession = (taskType?: 'vocabulary' | 'conversation' | 'grammar') => {
    if (taskType) {
      setActiveSessionTaskType(taskType);
    } else {
      const firstUncompleted = tasks.find(t => !t.completed);
      setActiveSessionTaskType(firstUncompleted ? firstUncompleted.type : 'vocabulary');
    }
    setIsActiveSessionOpen(true);
  };

  const handleLessonFinish = (completedTaskType: 'vocabulary' | 'conversation' | 'grammar') => {
    setTasks(prev => {
      const updated = prev.map(t =>
        t.type === completedTaskType ? { ...t, completed: true } : t
      );
      return updated;
    });
  };

  const handleAdvanceToNextDay = (targetDay?: number) => {
    const nextDay = targetDay ?? (currentDayNumber + 1);
    setCurrentDayNumber(nextDay);
    const nextCurr = getDayCurriculum(nextDay);
    const newTasks = nextCurr.tasks.map(t => ({ ...t, completed: false }));
    setTasks(newTasks);

    // Increment streak & award progress
    setUserProfile(prev => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      totalWordsLearned: prev.totalWordsLearned + 8
    }));

    setDayRolloverNotice(`Tebrikler! Gün ${nextDay}: ${nextCurr.themeTitle} programına geçtiniz. 🔥 Seri: ${userProfile.streakDays + 1} Gün`);
  };

  const handleSelectDay = (dayNumber: number) => {
    if (dayNumber < 1) return;
    setCurrentDayNumber(dayNumber);
    const targetCurr = getDayCurriculum(dayNumber);
    setTasks(targetCurr.tasks.map(t => ({ ...t, completed: false })));
  };

  const handleResetCurrentDayTasks = () => {
    setTasks(prev => prev.map(t => ({ ...t, completed: false })));
  };

  const handleUpdateVocabStatus = (
    id: string,
    newStatus: 'Mastered' | 'Reviewing' | 'New'
  ) => {
    setVocabList(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        let mastery = item.masteryPercentage;
        if (newStatus === 'Mastered') mastery = 100;
        if (newStatus === 'Reviewing') mastery = 60;
        if (newStatus === 'New') mastery = 20;
        return {
          ...item,
          status: newStatus,
          masteryPercentage: mastery
        };
      })
    );
  };

  const handleAddNewWord = (newWord: VocabularyItem) => {
    setVocabList(prev => [newWord, ...prev]);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updated }));
  };

  const handleResetStatistics = () => {
    // 1. Reset userProfile stats (streak, total words learned)
    setUserProfile(prev => ({
      ...prev,
      streakDays: 0,
      totalWordsLearned: 0
    }));

    // 2. Reset vocabulary items back to New / initial state
    setVocabList(prev =>
      prev.map(item => ({
        ...item,
        status: 'New',
        masteryPercentage: 0,
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        nextReviewDate: undefined,
        lastReviewedDate: undefined,
        reviewHistory: []
      }))
    );

    // 3. Reset to Day 1 tasks
    setCurrentDayNumber(1);
    const day1Curriculum = getDayCurriculum(1);
    setTasks(day1Curriculum.tasks.map(t => ({ ...t, completed: false })));
    localStorage.setItem('logos_current_day_number', '1');

    // 4. Reset simulation time & cached states
    resetSimulatedTime();
    localStorage.removeItem('logos_sm2_simulated_days');
    setDayRolloverNotice(null);
  };

  const handleThemePreference = (theme: 'light' | 'dark' | 'system') => {
    if (theme === 'dark') {
      setIsDarkMode(true);
    } else if (theme === 'light') {
      setIsDarkMode(false);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  };

  // Full-screen Placement Test View
  if (isPlacementActive) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <PlacementTest
          isDarkMode={isDarkMode}
          onComplete={handlePlacementComplete}
          onExit={() => setIsPlacementActive(false)}
        />
      </div>
    );
  }

  // Full-screen Active Lesson Session View
  if (isActiveSessionOpen) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <ActiveSession
          isDarkMode={isDarkMode}
          onClose={() => setIsActiveSessionOpen(false)}
          onLessonFinish={handleLessonFinish}
          onSM2Review={processSM2Review}
          vocabList={vocabList}
          sessionType={activeSessionTaskType}
          onSwitchSessionType={setActiveSessionTaskType}
          curriculum={currentCurriculum}
          currentDayNumber={currentDayNumber}
          onAdvanceToNextDay={handleAdvanceToNextDay}
        />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDarkMode ? 'dark bg-[#0c1420] text-[#dbe3f4]' : 'bg-[#f7f9ff] text-[#161c22]'
      }`}
    >
      {/* Top and Bottom Navbars */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onStartPlacement={() => setIsPlacementActive(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        userProfile={userProfile}
        dueCount={schedulerState.dueCount}
        onOpenInstall={() => setIsPwaModalOpen(true)}
      />

      {/* PWA Install Modal / Floating Prompt */}
      <PWAInstallPrompt
        forceOpen={isPwaModalOpen}
        onCloseForce={() => setIsPwaModalOpen(false)}
      />

      {/* Main View Body */}
      <div className="flex-1 pb-24 md:pb-12">
        {activeTab === 'learn' && (
          <LearnDashboard
            isDarkMode={isDarkMode}
            currentLevel={userProfile.level}
            currentDayNumber={currentDayNumber}
            dayThemeTitle={currentCurriculum.themeTitle}
            dayThemeSubtitle={currentCurriculum.themeSubtitle}
            tasks={tasks}
            onStartSession={handleStartSession}
            onToggleTask={handleToggleTask}
            onAdvanceToNextDay={handleAdvanceToNextDay}
            onSelectDay={handleSelectDay}
            onResetCurrentDayTasks={handleResetCurrentDayTasks}
            streakDays={userProfile.streakDays}
            schedulerState={schedulerState}
            onTriggerSchedulerCheck={triggerManualCheck}
            onFastForwardDays={fastForwardDays}
            onResetSimulationTime={resetSimulatedTime}
            onOpenLibrary={() => setActiveTab('library')}
            dayRolloverNotice={dayRolloverNotice}
            onDismissNotice={() => setDayRolloverNotice(null)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressScreen
            isDarkMode={isDarkMode}
            totalWordsLearned={userProfile.totalWordsLearned}
            streakDays={userProfile.streakDays}
          />
        )}

        {activeTab === 'library' && (
          <VocabularyLibrary
            isDarkMode={isDarkMode}
            vocabList={vocabList}
            onUpdateVocabStatus={handleUpdateVocabStatus}
            onAddNewWord={handleAddNewWord}
            onSM2Review={processSM2Review}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            isDarkMode={isDarkMode}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onToggleTheme={handleThemePreference}
            onResetStats={handleResetStatistics}
          />
        )}
      </div>
    </div>
  );
}
