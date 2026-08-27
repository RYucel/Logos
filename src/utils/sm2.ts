import { SM2QualityRating, VocabularyItem } from '../types';

/**
 * Default parameters for SM-2 Algorithm
 */
export const DEFAULT_EASE_FACTOR = 2.5;
export const MINIMUM_EASE_FACTOR = 1.3;

/**
 * Calculates new SM-2 spaced repetition values for a vocabulary item after review.
 * 
 * Quality Rating (0 to 5):
 * 5 - Perfect response (Kolay)
 * 4 - Correct response after a hesitation (İyi)
 * 3 - Correct response recalled with serious difficulty (Orta)
 * 2 - Incorrect response; where the correct one seemed easy to recall (Zor)
 * 1 - Incorrect response; the correct one remembered (Zor)
 * 0 - Complete blackout (Bilinmiyor)
 * 
 * @param item Current vocabulary item state
 * @param quality Quality grade (0-5)
 * @param reviewTimestamp Optional specific timestamp (defaults to Date.now())
 */
export function calculateSM2(
  item: VocabularyItem,
  quality: SM2QualityRating,
  reviewTimestamp: number = Date.now()
): VocabularyItem {
  const currentEaseFactor = item.easeFactor ?? DEFAULT_EASE_FACTOR;
  const currentRepetitions = item.repetitions ?? 0;
  const currentInterval = item.interval ?? 0;

  // 1. Calculate new Ease Factor (EF)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const qDiff = 5 - quality;
  let newEaseFactor = currentEaseFactor + (0.1 - qDiff * (0.08 + qDiff * 0.02));
  if (newEaseFactor < MINIMUM_EASE_FACTOR) {
    newEaseFactor = MINIMUM_EASE_FACTOR;
  }
  newEaseFactor = Math.round(newEaseFactor * 100) / 100;

  // 2. Calculate new repetitions and interval
  let newRepetitions: number;
  let newInterval: number;

  if (quality < 3) {
    // Incorrect or difficult answer resets repetitions sequence
    newRepetitions = 0;
    newInterval = 1; // 1 day until next review
  } else {
    // Correct answer
    if (currentRepetitions === 0) {
      newInterval = 1;
    } else if (currentRepetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.max(1, Math.round(currentInterval * newEaseFactor));
    }
    newRepetitions = currentRepetitions + 1;
  }

  // 3. Calculate next review date
  const nextReviewMs = reviewTimestamp + newInterval * 24 * 60 * 60 * 1000;
  const nextReviewDate = new Date(nextReviewMs).toISOString();
  const lastReviewedDate = new Date(reviewTimestamp).toISOString();

  // 4. Calculate updated mastery percentage
  let masteryPercentage = 20;
  if (newRepetitions === 1) masteryPercentage = 45;
  else if (newRepetitions === 2) masteryPercentage = 65;
  else if (newRepetitions === 3) masteryPercentage = 80;
  else if (newRepetitions >= 4) {
    masteryPercentage = Math.min(100, 90 + (newRepetitions - 4) * 2.5);
  }
  if (quality < 3) {
    masteryPercentage = Math.max(20, Math.round(masteryPercentage * 0.6));
  }

  // 5. Calculate status
  // If next review is scheduled in future and was successfully mastered:
  let status: VocabularyItem['status'] = 'Mastered';
  if (quality < 3) {
    status = 'Reviewing';
  } else if (newRepetitions < 3 && masteryPercentage < 75) {
    status = 'Reviewing';
  } else {
    status = 'Mastered';
  }

  const reviewRecord = {
    date: lastReviewedDate,
    quality,
    intervalDays: newInterval,
    easeFactor: newEaseFactor
  };

  const reviewHistory = item.reviewHistory
    ? [reviewRecord, ...item.reviewHistory.slice(0, 19)]
    : [reviewRecord];

  return {
    ...item,
    repetitions: newRepetitions,
    interval: newInterval,
    easeFactor: newEaseFactor,
    nextReviewDate,
    lastReviewedDate,
    masteryPercentage: Math.round(masteryPercentage),
    status,
    reviewHistory
  };
}

/**
 * Checks if a vocabulary item is due for review based on current time.
 */
export function isItemDueForReview(item: VocabularyItem, currentTime: number = Date.now()): boolean {
  if (!item.nextReviewDate) {
    // If it's a new item or never scheduled, but marked as reviewing, it's due
    return item.status === 'Reviewing';
  }
  const reviewTime = new Date(item.nextReviewDate).getTime();
  return reviewTime <= currentTime;
}

/**
 * Checks and updates the status of a single vocabulary item based on current time.
 * If the item's nextReviewDate is in the past, status is automatically updated to 'Reviewing'.
 * Returns whether any change occurred.
 */
export function evaluateItemReviewStatus(
  item: VocabularyItem,
  currentTime: number = Date.now()
): { updatedItem: VocabularyItem; changed: boolean } {
  if (!item.nextReviewDate) {
    return { updatedItem: item, changed: false };
  }

  const isDue = new Date(item.nextReviewDate).getTime() <= currentTime;

  if (isDue && item.status !== 'Reviewing') {
    return {
      updatedItem: {
        ...item,
        status: 'Reviewing'
      },
      changed: true
    };
  }

  return { updatedItem: item, changed: false };
}

/**
 * Formats time remaining until next review date into human readable Turkish string.
 */
export function formatNextReviewTime(nextReviewDateStr?: string, currentTime: number = Date.now()): {
  text: string;
  isDue: boolean;
  daysRemaining: number;
} {
  if (!nextReviewDateStr) {
    return { text: 'Planlanmadı', isDue: false, daysRemaining: 0 };
  }

  const reviewMs = new Date(nextReviewDateStr).getTime();
  const diffMs = reviewMs - currentTime;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs <= 0) {
    const overdueDays = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));
    if (overdueDays === 0) {
      return { text: 'Bugün tekrar vakti!', isDue: true, daysRemaining: 0 };
    }
    return { text: `${overdueDays} gün gecikti`, isDue: true, daysRemaining: -overdueDays };
  }

  if (diffDays === 1) {
    const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
    if (hours < 24) {
      return { text: `${hours} saat sonra`, isDue: false, daysRemaining: 1 };
    }
    return { text: 'Yarın', isDue: false, daysRemaining: 1 };
  }

  return { text: `${diffDays} gün sonra`, isDue: false, daysRemaining: diffDays };
}
