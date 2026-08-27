export type ThemeMode = 'light' | 'dark' | 'system';

export type NavTab = 'learn' | 'progress' | 'library' | 'settings';

export type ActiveView = NavTab | 'placement-intro' | 'placement-quiz' | 'lesson-session';

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  level: string;
  streakDays: number;
  totalWordsLearned: number;
  isPro: boolean;
  proExpiryDate: string;
  targetMinutes: 15 | 30 | 60;
  vocabularyFocus: 'Modern Conversational' | 'Academic & Classical' | 'Business & Professional' | 'Travel & Culture';
  cognitiveLoadTracking: boolean;
  strictSpacedRepetition: boolean;
  dailyReminders: boolean;
  darkModeSetting: 'light' | 'dark' | 'system';
  interfaceLanguage: 'Turkish' | 'English' | 'Greek';
}

export type SM2QualityRating = 0 | 1 | 2 | 3 | 4 | 5;

export interface SM2ReviewRecord {
  date: string;
  quality: SM2QualityRating;
  intervalDays: number;
  easeFactor: number;
}

export type VocabCategory =
  | 'Nouns'
  | 'Verbs'
  | 'Adjectives'
  | 'Travel'
  | 'Food'
  | 'Philosophy'
  | 'Greetings'
  | 'Time & Numbers'
  | 'Daily Life'
  | 'Emotions & Body'
  | 'Shopping & Places'
  | 'Culture & Philosophy';

export interface VocabularyItem {
  id: string;
  greek: string;
  transliteration: string;
  turkish: string;
  english: string;
  category: VocabCategory;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  masteryPercentage: number;
  status: 'Mastered' | 'Reviewing' | 'New';
  // SM-2 Spaced Repetition Fields
  repetitions?: number;        // n: consecutive successful reviews
  interval?: number;           // I: current interval in days
  easeFactor?: number;         // EF: ease factor (starts at 2.5, min 1.3)
  nextReviewDate?: string;     // ISO timestamp when due
  lastReviewedDate?: string;   // ISO timestamp of last review
  reviewHistory?: SM2ReviewRecord[];
  exampleSentence?: {
    greek: string;
    turkish: string;
    english: string;
  };
}

export interface QuizQuestion {
  id: string;
  type: 'translate-to-greek' | 'translate-to-target' | 'listening' | 'grammar';
  prompt: string;
  subPrompt?: string;
  sourceSentence: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  audioText?: string;
}

export interface LessonTask {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  type: 'vocabulary' | 'conversation' | 'grammar';
  completed: boolean;
}

export interface Flashcard {
  id: string;
  greek: string;
  transliteration: string;
  english: string;
  turkish: string;
  categoryTag: string;
  audioText: string;
  breakdown: Array<{
    greek: string;
    transliteration: string;
    meaning: string;
    grammarInfo: string;
  }>;
}

export interface SM2SchedulerState {
  isChecking: boolean;
  isRunning: boolean;
  lastRunDate: string;
  dueCount: number;
  totalWords: number;
  simulatedOffsetMs: number;
  lastAutoUpdateNotice: {
    timestamp: number;
    count: number;
  } | null;
}

export interface DialogueTurn {
  id: string;
  speaker: 'partner' | 'user';
  partnerName?: string;
  avatar?: string;
  greek: string;
  transliteration: string;
  turkish: string;
  audioText?: string;
  userOptions?: Array<{
    id: string;
    greek: string;
    transliteration: string;
    turkish: string;
    feedback?: string;
  }>;
}

export interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  location: string;
  partnerName: string;
  partnerRole: string;
  dialogue: DialogueTurn[];
}

export interface GrammarExercise {
  id: string;
  title: string;
  ruleTitle: string;
  ruleDescription: string;
  prompt: string;
  sourceSentence?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  audioText?: string;
  grammarFocus: string;
}

