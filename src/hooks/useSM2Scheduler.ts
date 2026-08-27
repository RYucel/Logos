import { useState, useEffect, useRef, useCallback, Dispatch, SetStateAction } from 'react';
import { SM2QualityRating, SM2SchedulerState, VocabularyItem } from '../types';
import { runSM2SchedulerCheck } from '../utils/scheduler';
import { calculateSM2 } from '../utils/sm2';

interface UseSM2SchedulerProps {
  vocabList: VocabularyItem[];
  setVocabList: Dispatch<SetStateAction<VocabularyItem[]>>;
  intervalMs?: number;
  checkIntervalSeconds?: number;
  onStatusUpdated?: (updatedCount: number, dueCount: number) => void;
  onItemsBecameDue?: (count: number, itemIds: string[]) => void;
}

export function useSM2Scheduler({
  vocabList,
  setVocabList,
  intervalMs,
  checkIntervalSeconds = 15,
  onStatusUpdated,
  onItemsBecameDue
}: UseSM2SchedulerProps) {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isSchedulerRunning, setIsSchedulerRunning] = useState<boolean>(true);
  const [lastCheckTime, setLastCheckTime] = useState<number>(Date.now());
  const [simulatedOffsetMs, setSimulatedOffsetMs] = useState<number>(() => {
    const saved = localStorage.getItem('logos_sm2_time_offset');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [dueCount, setDueCount] = useState<number>(0);
  const [lastAutoUpdateNotice, setLastAutoUpdateNotice] = useState<{
    timestamp: number;
    count: number;
  } | null>(null);

  // Keep a ref to latest vocabList to avoid stale closures in interval
  const vocabListRef = useRef(vocabList);
  vocabListRef.current = vocabList;

  const onStatusUpdatedRef = useRef(onStatusUpdated);
  onStatusUpdatedRef.current = onStatusUpdated;

  const onItemsBecameDueRef = useRef(onItemsBecameDue);
  onItemsBecameDueRef.current = onItemsBecameDue;

  // Persist simulated offset
  useEffect(() => {
    localStorage.setItem('logos_sm2_time_offset', String(simulatedOffsetMs));
  }, [simulatedOffsetMs]);

  /**
   * Performs an immediate scheduler cycle check
   */
  const performCycleCheck = useCallback(() => {
    setIsChecking(true);
    const currentList = vocabListRef.current;
    const { updatedList, changedCount, dueCount: currentDue, changedIds } = runSM2SchedulerCheck(
      currentList,
      simulatedOffsetMs
    );

    setDueCount(currentDue);
    setLastCheckTime(Date.now());

    if (changedCount > 0) {
      setVocabList(updatedList);
      setLastAutoUpdateNotice({
        timestamp: Date.now(),
        count: changedCount
      });
      if (onItemsBecameDueRef.current) {
        onItemsBecameDueRef.current(changedCount, changedIds);
      }
      if (onStatusUpdatedRef.current) {
        onStatusUpdatedRef.current(changedCount, currentDue);
      }
    }

    setTimeout(() => {
      setIsChecking(false);
    }, 400);
  }, [simulatedOffsetMs, setVocabList]);

  // Main Background Scheduler Interval
  useEffect(() => {
    if (!isSchedulerRunning) return;

    // Run on initial mount or when offset changes
    performCycleCheck();

    const checkInterval = intervalMs ?? checkIntervalSeconds * 1000;

    // Schedule background periodic interval
    const timerId = setInterval(() => {
      performCycleCheck();
    }, checkInterval);

    // Also run on window focus / visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performCycleCheck();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      clearInterval(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isSchedulerRunning, intervalMs, checkIntervalSeconds, performCycleCheck]);

  /**
   * Process a direct SM-2 quality review on a specific vocabulary item
   */
  const processSM2Review = useCallback(
    (itemId: string, quality: SM2QualityRating) => {
      setVocabList(prev => {
        const effectiveNow = Date.now() + simulatedOffsetMs;
        const updated = prev.map(item => {
          if (item.id !== itemId) return item;
          return calculateSM2(item, quality, effectiveNow);
        });
        return updated;
      });

      // trigger a cycle check shortly after state update
      setTimeout(() => {
        performCycleCheck();
      }, 100);
    },
    [simulatedOffsetMs, setVocabList, performCycleCheck]
  );

  // Fast-Forward Time Helpers for Testing / Simulation
  const advanceTime = useCallback((hours: number) => {
    setSimulatedOffsetMs(prev => prev + hours * 60 * 60 * 1000);
  }, []);

  const fastForwardDays = useCallback((days: number) => {
    setSimulatedOffsetMs(prev => prev + days * 24 * 60 * 60 * 1000);
  }, []);

  const resetSimulatedTime = useCallback(() => {
    setSimulatedOffsetMs(0);
  }, []);

  const toggleScheduler = useCallback(() => {
    setIsSchedulerRunning(prev => !prev);
  }, []);

  const schedulerState: SM2SchedulerState = {
    isChecking,
    isRunning: isSchedulerRunning,
    lastRunDate: new Date(lastCheckTime).toISOString(),
    dueCount,
    totalWords: vocabList.length,
    simulatedOffsetMs,
    lastAutoUpdateNotice
  };

  return {
    schedulerState,
    isSchedulerRunning,
    lastCheckTime,
    dueCount,
    simulatedOffsetMs,
    effectiveCurrentTime: Date.now() + simulatedOffsetMs,
    lastAutoUpdateNotice,
    triggerManualCheck: performCycleCheck,
    performCycleCheck,
    processSM2Review,
    advanceTime,
    advanceDays: fastForwardDays,
    fastForwardDays,
    resetSimulatedTime,
    toggleScheduler
  };
}
