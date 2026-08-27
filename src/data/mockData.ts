import {
  ConversationScenario,
  Flashcard,
  GrammarExercise,
  LessonTask,
  QuizQuestion,
  UserProfile,
  VocabularyItem
} from '../types';
import { COMBINED_VOCABULARY_LIST } from './vocab';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alexander Demetriou',
  email: 'alexander.d@example.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDAVlT4zkMfMUvrzGTXjdIhli85GWK8enrlg2eXBO0jQRenjUU8OKV1K8LdbPTVGCg2SOClsloTlHH9diLFxggcf8MY_b1Sa6MqyhlcPcxPkvwDP46NE5tX1jrASgEWY77tqUJyZr7OzEsmWdXNz9a8rAj1Qogq0tj1yl2vCHCpyS41UcerFq5KqrMSnkxStXX0gBBGSIyVOc7qQimoRMavO1vK6ThQxAadhSQk00zK1q7bTC3atEtEw',
  level: 'Orta Seviye - B1',
  streakDays: 14,
  totalWordsLearned: 850,
  isPro: true,
  proExpiryDate: 'Oct 24, 2026',
  targetMinutes: 30,
  vocabularyFocus: 'Modern Conversational',
  cognitiveLoadTracking: true,
  strictSpacedRepetition: false,
  dailyReminders: true,
  darkModeSetting: 'light',
  interfaceLanguage: 'Turkish'
};

export const GREEK_BUST_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCOtw_gXJjUzAZTXKY8Tg8P0piHsY1fTB3PQrowFPdF4umwPwfO4erkkQ_pyIxLr1qkN5i4zxfr31Wuj9i9tiWLTIg_LGDkJdlOGJFZm0DVHii_vinC-zq0HUltNg69Z7ukQp2s8rDMES43xrWISPEBm4kfUHrrkzYNW09mnxXc5WEt6WaeLBR5rlfjwlO9OLhx3qzIergpjBl20-LU1ySVejIdcx7NcBOQN4yAcJWubADxIf97nRDesw';

export const PLACEMENT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'translate-to-greek',
    prompt: "Bu cümleyi Yunanca'ya çevirin",
    subPrompt: 'Translate this sentence to Greek',
    sourceSentence: '"Merhaba, nasılsın?"',
    options: [
      'Γεια, τι κάνεις;',
      'Καλημέρα, πώς είστε;',
      'Αντίο, τα λέμε.',
      'Ευχαριστώ πολύ.'
    ],
    correctIndex: 0,
    explanation: '"Γεια, τι κάνεις;" means "Hello, how are you?".',
    audioText: 'Γεια, τι κάνεις;'
  },
  {
    id: 'q2',
    type: 'translate-to-greek',
    prompt: "Bu cümleyi Yunanca'ya çevirin",
    subPrompt: 'Translate this sentence to Greek',
    sourceSentence: '"Benim adım Yanni."',
    options: [
      'Με λένε Γιάννη.',
      'Το όνομά μου είναι Γιάννης.',
      'Είμαι ο Γιάννης.',
      'Ονομάζομαι Γιάννης.'
    ],
    correctIndex: 1,
    explanation: '"Το όνομά μου είναι Γιάννης" translates directly to "My name is Yanni."',
    audioText: 'Το όνομά μου είναι Γιάννης.'
  },
  {
    id: 'q3',
    type: 'translate-to-greek',
    prompt: "Kelime anlamını seçin",
    subPrompt: 'Select the Greek equivalent of "Thank you very much"',
    sourceSentence: '"Çok teşekkür ederim"',
    options: [
      'Παρακαλώ πολύ.',
      'Ευχαριστώ πολύ.',
      'Συγγνώμη.',
      'Καλησπέρα.'
    ],
    correctIndex: 1,
    explanation: '"Ευχαριστώ πολύ" means "Thank you very much".',
    audioText: 'Ευχαριστώ πολύ.'
  },
  {
    id: 'q4',
    type: 'listening',
    prompt: "Duyduğunuz cümleyi seçin",
    subPrompt: 'Listen carefully and select the spoken sentence',
    sourceSentence: '🔊 Ses kaydını dinleyin',
    options: [
      'Καλημέρα, πώς είστε;',
      'Καληνύχτα, τα λέμε αύριο.',
      'Γεια σας, χαίρω πολύ.',
      'Καλή όρεξη!'
    ],
    correctIndex: 0,
    explanation: 'The audio speaks "Καλημέρα, πώς είστε;" (Good morning, how are you?).',
    audioText: 'Καλημέρα, πώς είστε;'
  },
  {
    id: 'q5',
    type: 'grammar',
    prompt: "Boşluğu doğru çekimle doldurun",
    subPrompt: 'Fill in the blank with the correct verb form',
    sourceSentence: 'Εγώ ______ ελληνικά στο σχολείο. (öğreniyorum)',
    options: [
      'μαθαίνω',
      'μαθαίνεις',
      'μαθαίνει',
      'μαθαίνουμε'
    ],
    correctIndex: 0,
    explanation: '1st person singular of the verb is "μαθαίνω" (I learn).',
    audioText: 'Εγώ μαθαίνω ελληνικά στο σχολείο.'
  }
];

export const DAILY_TASKS: LessonTask[] = [
  {
    id: 'task-1',
    title: '1. Kelime Tekrarı',
    description: 'Aralıklı tekrar algoritması ile kelime pratiği.',
    durationMinutes: 3,
    type: 'vocabulary',
    completed: false
  },
  {
    id: 'task-2',
    title: '2. Günlük Konuşma',
    description: 'Yapay zeka asistanı ile diyalog pratiği.',
    durationMinutes: 5,
    type: 'conversation',
    completed: false
  },
  {
    id: 'task-3',
    title: '3. Dilbilgisi Pratiği',
    description: 'Geniş zaman cümle yapıları üzerine alıştırmalar.',
    durationMinutes: 4,
    type: 'grammar',
    completed: false
  }
];

export const FLASHCARD_LESSONS: Flashcard[] = [
  {
    id: 'flash-1',
    greek: 'Ἓν οἶδα ὅτι οὐδὲν οἶδα',
    transliteration: 'Hèn oîda hóti oudèn oîda',
    english: 'I know one thing, that I know nothing.',
    turkish: 'Bildiğim tek şey hiçbir şey bilmediğimdir.',
    categoryTag: 'Socrates • Philosophy',
    audioText: 'Ἓν οἶδα ὅτι οὐδὲν οἶδα',
    breakdown: [
      {
        greek: 'Ἓν (Hen)',
        transliteration: 'Hen',
        meaning: 'one thing / bir şey',
        grammarInfo: 'acc. neuter singular'
      },
      {
        greek: 'οἶδα (oida)',
        transliteration: 'oida',
        meaning: 'I know / biliyorum',
        grammarInfo: 'perfect verb active'
      },
      {
        greek: 'ὅτι (hoti)',
        transliteration: 'hoti',
        meaning: 'that / ki',
        grammarInfo: 'conjunction'
      },
      {
        greek: 'οὐδὲν (ouden)',
        transliteration: 'ouden',
        meaning: 'nothing / hiçbir şey',
        grammarInfo: 'pronoun neuter'
      }
    ]
  },
  {
    id: 'flash-2',
    greek: 'Γεια σας, πώς είστε;',
    transliteration: 'Yia sas, pos eiste?',
    english: 'Hello, how are you? (Formal/Plural)',
    turkish: 'Merhaba, nasılsınız?',
    categoryTag: 'Daily Conversation • Greetings',
    audioText: 'Γεια σας, πώς είστε;',
    breakdown: [
      {
        greek: 'Γεια σας (Yia sas)',
        transliteration: 'Yia sas',
        meaning: 'Hello / Merhaba',
        grammarInfo: 'polite greeting'
      },
      {
        greek: 'πώς (pos)',
        transliteration: 'pos',
        meaning: 'how / nasıl',
        grammarInfo: 'interrogative adverb'
      },
      {
        greek: 'είστε (eiste)',
        transliteration: 'eiste',
        meaning: 'you are / sizsiniz',
        grammarInfo: '2nd person plural present'
      }
    ]
  },
  {
    id: 'flash-3',
    greek: 'Ένα ποτήρι νερό, παρακαλώ.',
    transliteration: 'Ena potiri nero, parakalo.',
    english: 'A glass of water, please.',
    turkish: 'Bir bardak su, lütfen.',
    categoryTag: 'Restaurant • Daily Life',
    audioText: 'Ένα ποτήρι νερό, παρακαλώ.',
    breakdown: [
      {
        greek: 'Ένα (Ena)',
        transliteration: 'Ena',
        meaning: 'one / bir',
        grammarInfo: 'neuter numeral'
      },
      {
        greek: 'ποτήρι (potiri)',
        transliteration: 'potiri',
        meaning: 'glass / bardak',
        grammarInfo: 'noun neuter'
      },
      {
        greek: 'νερό (nero)',
        transliteration: 'nero',
        meaning: 'water / su',
        grammarInfo: 'noun neuter'
      },
      {
        greek: 'παρακαλώ (parakalo)',
        transliteration: 'parakalo',
        meaning: 'please / lütfen',
        grammarInfo: 'polite adverb'
      }
    ]
  }
];

const now = Date.now();
const oneDayMs = 24 * 60 * 60 * 1000;

export const VOCABULARY_LIST: VocabularyItem[] = COMBINED_VOCABULARY_LIST;

export const WEEKLY_ACTIVITY_DATA = [
  { day: 'Pzt', dayEn: 'Mon', minutes: 15, heightPct: 30, label: '15m' },
  { day: 'Sal', dayEn: 'Tue', minutes: 45, heightPct: 80, label: '45m', isMax: true },
  { day: 'Çar', dayEn: 'Wed', minutes: 30, heightPct: 50, label: '30m' },
  { day: 'Per', dayEn: 'Thu', minutes: 20, heightPct: 40, label: '20m' },
  { day: 'Cum', dayEn: 'Fri', minutes: 50, heightPct: 90, label: '50m', isHigh: true },
  { day: 'Cmt', dayEn: 'Sat', minutes: 5, heightPct: 15, label: '5m' },
  { day: 'Paz', dayEn: 'Sun', minutes: 0, heightPct: 5, label: '0m' }
];

export const HEATMAP_BLOCKS = [
  1, 0.8, 0, 0.4, 1, 0.6, 0.8, 0, 0, 0.2, 0.4, 0, 0.8, 1, 0.6, 0, 0.4, 0, 1, 0.8, 1,
  0.5, 0.9, 0, 0.3, 0.7, 0.4, 1, 0.2, 0, 0.6, 0.9, 0.8, 1, 0
];

export const CONVERSATION_SCENARIOS: ConversationScenario[] = [
  {
    id: 'sc-1',
    title: "Atina'da Bir Kafede Sipariş",
    description: 'Bir kafede geleneksel Yunan kahvesi sipariş etme ve sohbet etme pratiği.',
    location: 'Monastiraki, Atina',
    partnerName: 'Eleni',
    partnerRole: 'Barista & Kafe Sahibi',
    dialogue: [
      {
        id: 'd1',
        speaker: 'partner',
        partnerName: 'Eleni',
        greek: 'Καλημέρα! Καλώς ήρθατε. Τι θα πάρετε παρακαλώ;',
        transliteration: 'Kaliméra! Kalós írthate. Ti tha párete parakaló?',
        turkish: 'Günaydın! Hoş geldiniz. Ne alırdınız lütfen?',
        audioText: 'Καλημέρα! Καλώς ήρθατε. Τι θα πάρετε παρακαλώ;',
        userOptions: [
          {
            id: 'opt-1a',
            greek: 'Καλημέρα! Έναν ελληνικό καφέ μέτριο, παρακαλώ.',
            transliteration: 'Kaliméra! Énan ellinikó kafé métrio, parakaló.',
            turkish: 'Günaydın! Bir orta şekerli Yunan kahvesi, lütfen.',
            feedback: 'Mükemmel ve çok doğal bir sipariş ifadesi! (μέτριο = orta şekerli)'
          },
          {
            id: 'opt-1b',
            greek: 'Γεια σας! Ένα ποτήρι νερό και ένα τσάι.',
            transliteration: 'Yia sas! Éna potíri neró kai éna tsái.',
            turkish: 'Merhaba! Bir bardak su ve bir çay.',
            feedback: 'Çok kibar ve anlaşılır bir talep.'
          },
          {
            id: 'opt-1c',
            greek: 'Ένα φραπέ γλυκό με γάλα, παρακαλώ!',
            transliteration: 'Éna frapé glykó me gála, parakaló!',
            turkish: 'Sütlü, şekerli bir frappe lütfen!',
            feedback: 'Yunanistan klasiği frappe siparişi için harika seçim!'
          }
        ]
      },
      {
        id: 'd2',
        speaker: 'partner',
        partnerName: 'Eleni',
        greek: 'Πολύ ωραία! Θα καθίσετε εδώ ή το θέλετε σε πακέτο;',
        transliteration: 'Polý oraía! Tha kathísete edó í to thélete se pakéto?',
        turkish: 'Çok güzel! Burada mı oturacaksınız yoksa paket mi istersiniz?',
        audioText: 'Πολύ ωραία! Θα καθίσετε εδώ ή το θέλετε σε πακέτο;',
        userOptions: [
          {
            id: 'opt-2a',
            greek: 'Θα καθίσω έξω στον ήλιο, ευχαριστώ.',
            transliteration: 'Tha kathíso éxo ston ílio, efcharistó.',
            turkish: 'Dışarıda güneşte oturacağım, teşekkürler.',
            feedback: 'Akıcı ve duruma çok uygun bir yanıt.'
          },
          {
            id: 'opt-2b',
            greek: 'Σε πακέτο, παρακαλώ. Βιάζομαι λίγο.',
            transliteration: 'Se pakéto, parakaló. Viázomai lígo.',
            turkish: 'Paket lütfen. Biraz acelem var.',
            feedback: 'Mükemmel günlük konuşma kalıbı (βιάζομαι = acelem var).'
          }
        ]
      },
      {
        id: 'd3',
        speaker: 'partner',
        partnerName: 'Eleni',
        greek: 'Ορίστε ο καφές σας! Είναι τρία ευρώ.',
        transliteration: 'Oríste o kafés sas! Eínai tría evró.',
        turkish: 'Buyrun kahveniz! Üç euro.',
        audioText: 'Ορίστε ο καφές σας! Είναι τρία ευρώ.',
        userOptions: [
          {
            id: 'opt-3a',
            greek: 'Ορίστε πέντε ευρώ. Κρατήστε τα ρέστα!',
            transliteration: 'Oríste pénte evró. Kratíste ta résta!',
            turkish: 'Buyrun 5 euro. Üstü kalsın!',
            feedback: 'Harika bir jest! (Κρατήστε τα ρέστα = Üstü kalsın)'
          },
          {
            id: 'opt-3b',
            greek: 'Ορίστε ακριβώς τρία ευρώ. Ευχαριστώ πολύ!',
            transliteration: 'Oríste akrivós tría evró. Efcharistó polý!',
            turkish: 'Buyrun tam 3 euro. Çok teşekkür ederim!',
            feedback: 'Net ve nezaket dolu bir ifade.'
          }
        ]
      },
      {
        id: 'd4',
        speaker: 'partner',
        partnerName: 'Eleni',
        greek: 'Ευχαριστώ πάρα πολύ! Καλή σας μέρα και καλή απόλαυση!',
        transliteration: 'Efcharistó pára polý! Kalí sas méra kai kalí apólafsi!',
        turkish: 'Çok teşekkür ederim! İyi günler ve afiyet olsun!',
        audioText: 'Ευχαριστώ πάρα πολύ! Καλή σας μέρα και καλή απόλαυση;',
        userOptions: [
          {
            id: 'opt-4a',
            greek: 'Επίσης! Γεια σας και τα λέμε σύντομα!',
            transliteration: 'Epísis! Yia sas kai ta léme sýntoma!',
            turkish: 'Sana da! Hoşça kalın ve yakında görüşmek üzere!',
            feedback: 'Sohbeti mükemmel ve dostça sonlandırdınız! (Επίσης = Sana da / Bilmukabele)'
          }
        ]
      }
    ]
  }
];

export const GRAMMAR_EXERCISES: GrammarExercise[] = [
  {
    id: 'g-1',
    title: 'Geniş Zaman: "Είμαι" (Olmak) Fiil Çekimi',
    ruleTitle: 'Şahıs Zamirleri ve "Είμαι"',
    ruleDescription: 'Yunanca "είμαι" düzensiz bir fiildir: Εγώ είμαι, Εσύ είσαι, Αυτός/ή/ό είναι, Εμείς είμαστε, Εσείς είστε, Αυτοί/ές/ά είναι.',
    prompt: 'Cümledeki boşluğa "Εμείς" (Biz) öznesi için doğru fiil çekimini yerleştirin:',
    sourceSentence: 'Εμείς ______ φοιτητές στην Αθήνα.',
    options: ['είμαι', 'είσαι', 'είμαστε', 'είναι'],
    correctIndex: 2,
    explanation: '1. Çoğul şahıs "Εμείς" (Biz) için doğru çekim "είμαστε"dir. (Biz Atina\'da öğrenciyiz).',
    audioText: 'Εμείς είμαστε φοιτητές στην Αθήνα.',
    grammarFocus: 'Verb Conjugation: to be'
  },
  {
    id: 'g-2',
    title: 'Belirlilik Artikelleri: Eril (Ο), Dişil (Η), Nötr (Το)',
    ruleTitle: 'Yalın Hal (Nominative) Artikelleri',
    ruleDescription: 'Eril isimler "Ο" (örn. Ο ήλιος), dişil isimler "Η" (örn. Η θάλασσα), nötr isimler "Το" (örn. Το νερό) artikeli alır.',
    prompt: 'Eril bir isim olan "ήλιος" (güneş) için doğru artikeli seçin:',
    sourceSentence: '______ ήλιος λάμπει σήμερα.',
    options: ['Ο', 'Η', 'Το', 'Οι'],
    correctIndex: 0,
    explanation: '"ήλιος" -os bitimli eril (masculine) bir isim olduğu için yalın halde "Ο" artikeli alır.',
    audioText: 'Ο ήλιος λάμπει σήμερα.',
    grammarFocus: 'Definite Articles'
  },
  {
    id: 'g-3',
    title: 'Düzenli Fiiller: -ω ile Biten Fiiller',
    ruleTitle: '2. Tekil Şahıs (Εσύ - Sen) Çekimi',
    ruleDescription: 'Yunanca birinci grup fiiller (-ω ile bitenler) 2. tekil şahısta "-εις" eki alır (κάνω -> κάνεις, μαθαίνω -> μαθαίνεις).',
    prompt: '"Εσύ" (Sen) öznesine uygun fiil çekimini seçin:',
    sourceSentence: 'Τι ______ εσύ σήμερα το απόγευμα;',
    options: ['κάνω', 'κάνεις', 'κάνει', 'κάνουμε'],
    correctIndex: 1,
    explanation: '"Εσύ" (Sen) için doğru ek "-εις" olup "κάνεις" (yapıyorsun) doğrudur.',
    audioText: 'Τι κάνεις εσύ σήμερα το απόγευμα;',
    grammarFocus: 'Present Tense Regular Verbs'
  },
  {
    id: 'g-4',
    title: 'Belirtme Hali (Accusative) Artikeli',
    ruleTitle: 'Nesne Konumundaki Dişil Kelimeler',
    ruleDescription: 'Dişil isimler nesne (belirtme) durumuna geçtiğinde "Η" artikeli "Την" veya "Τη" formuna dönüşür.',
    prompt: 'Cümledeki boşluğa uygun belirtme hali artikelini yerleştirin:',
    sourceSentence: 'Βλέπω ______ όμορφη θάλασσα.',
    options: ['την', 'τον', 'το', 'τους'],
    correctIndex: 0,
    explanation: '"θάλασσα" (deniz) dişil bir kelimedir ve belirtme halinde "την" artikeli alır.',
    audioText: 'Βλέπω την όμορφη θάλασσα.',
    grammarFocus: 'Accusative Case Articles'
  },
  {
    id: 'g-5',
    title: 'Soru Zamirleri & Cümle Kurulumu',
    ruleTitle: 'Temel Soru Kalıpları',
    ruleDescription: '"Πού" (Nerede/Nereye), "Πώς" (Nasıl), "Τι" (Ne), "Ποιος" (Kim). "Από πού" = Nereden.',
    prompt: '"Nereden geliyorsun / Nerelisin?" sorusunu tamamlayın:',
    sourceSentence: 'Από ______ είσαι;',
    options: ['πού', 'τι', 'πώς', 'ποιος'],
    correctIndex: 0,
    explanation: '"Από πού είσαι;" Yunanca "Nerelisin?" anlamına gelen en temel soru kalıbıdır.',
    audioText: 'Από πού είσαι;',
    grammarFocus: 'Question Words'
  }
];
