import { VocabularyItem } from '../types';
import { evaluateItemReviewStatus, isItemDueForReview } from './sm2';

export interface SchedulerStats {
  isActive: boolean;
  lastCheckTime: number;
  dueCount: number;
  totalItems: number;
  simulatedTimeOffsetMs: number; // For fast-forwarding/testing
}

/**
 * Runs a check on all vocabulary items against current (or simulated) time.
 * Automatically updates items whose review dates have arrived to 'Reviewing' status.
 */
export function runSM2SchedulerCheck(
  vocabList: VocabularyItem[],
  simulatedOffsetMs: number = 0
): {
  updatedList: VocabularyItem[];
  changedCount: number;
  dueCount: number;
  changedIds: string[];
} {
  const currentTime = Date.now() + simulatedOffsetMs;
  let changedCount = 0;
  const changedIds: string[] = [];
  let dueCount = 0;

  const updatedList = vocabList.map(item => {
    const isDue = isItemDueForReview(item, currentTime);
    if (isDue) {
      dueCount++;
    }

    const { updatedItem, changed } = evaluateItemReviewStatus(item, currentTime);
    if (changed) {
      changedCount++;
      changedIds.push(item.id);
    }
    return updatedItem;
  });

  return {
    updatedList,
    changedCount,
    dueCount,
    changedIds
  };
}
