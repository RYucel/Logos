import { VocabularyItem } from '../../types';
import { GREETINGS_VOCABULARY } from './greetings';
import { VERBS_VOCABULARY } from './verbs';
import { FOOD_VOCABULARY } from './food';
import { TRAVEL_VOCABULARY } from './travel';
import { NOUNS_VOCABULARY } from './nouns';
import { DAILY_LIFE_VOCABULARY } from './dailyLife';
import { ADJECTIVES_VOCABULARY } from './adjectives';
import { TIME_NUMBERS_VOCABULARY } from './timeNumbers';
import { EMOTIONS_BODY_VOCABULARY } from './emotionsBody';
import { SHOPPING_PLACES_VOCABULARY } from './shoppingPlaces';
import { CULTURE_VOCABULARY } from './culture';
import { EVERYDAY_A2_VOCABULARY } from './everydayA2';
import { DIALOGUES_IDIOMS_VOCABULARY } from './dialoguesAndIdioms';
import { CORE_PHRASES_VOCABULARY } from './corePhrases';

export const ALL_VOCABULARY_MODULES: VocabularyItem[] = [
  ...GREETINGS_VOCABULARY,
  ...VERBS_VOCABULARY,
  ...FOOD_VOCABULARY,
  ...TRAVEL_VOCABULARY,
  ...NOUNS_VOCABULARY,
  ...DAILY_LIFE_VOCABULARY,
  ...ADJECTIVES_VOCABULARY,
  ...TIME_NUMBERS_VOCABULARY,
  ...EMOTIONS_BODY_VOCABULARY,
  ...SHOPPING_PLACES_VOCABULARY,
  ...CULTURE_VOCABULARY,
  ...EVERYDAY_A2_VOCABULARY,
  ...DIALOGUES_IDIOMS_VOCABULARY,
  ...CORE_PHRASES_VOCABULARY
];

// Deduplicate by ID and greek text if any duplicates exist
const seenIds = new Set<string>();
const seenGreek = new Set<string>();

export const COMBINED_VOCABULARY_LIST: VocabularyItem[] = ALL_VOCABULARY_MODULES.filter(item => {
  if (seenIds.has(item.id) || seenGreek.has(item.greek.toLowerCase().trim())) {
    return false;
  }
  seenIds.add(item.id);
  seenGreek.add(item.greek.toLowerCase().trim());
  return true;
});

export {
  GREETINGS_VOCABULARY,
  VERBS_VOCABULARY,
  FOOD_VOCABULARY,
  TRAVEL_VOCABULARY,
  NOUNS_VOCABULARY,
  DAILY_LIFE_VOCABULARY,
  ADJECTIVES_VOCABULARY,
  TIME_NUMBERS_VOCABULARY,
  EMOTIONS_BODY_VOCABULARY,
  SHOPPING_PLACES_VOCABULARY,
  CULTURE_VOCABULARY,
  EVERYDAY_A2_VOCABULARY,
  DIALOGUES_IDIOMS_VOCABULARY,
  CORE_PHRASES_VOCABULARY
};
