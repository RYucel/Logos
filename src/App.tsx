/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavTab, UserProfile, VocabularyItem, LessonTask } from './types';
import {
  INITIAL_USER_PROFILE,
  VOCABULARY_LIST,
  DAILY_TASKS
} from './data/mockData';
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
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const savedMap = new Map(parsed.map((item: VocabularyItem) => [item.id, item]));
          const merged = VOCABULARY_LIST.map((item) => {
            const existing = savedMap.get(item.id);
            return existing ? { ...item, ...existing } : item;
          });
          const customWords = parsed.filter((item: VocabularyItem) => item.id.startsWith('v-custom-'));
          return [...merged, ...customWords];
        }
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
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return DAILY_TASKS;
  });

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
            tasks={tasks}
            onStartSession={handleStartSession}
            onToggleTask={handleToggleTask}
            streakDays={userProfile.streakDays}
            schedulerState={schedulerState}
            onTriggerSchedulerCheck={triggerManualCheck}
            onFastForwardDays={fastForwardDays}
            onResetSimulationTime={resetSimulatedTime}
            onOpenLibrary={() => setActiveTab('library')}
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
          />
        )}
      </div>
    </div>
  );
}

