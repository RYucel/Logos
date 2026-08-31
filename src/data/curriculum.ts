import {
  ConversationScenario,
  Flashcard,
  GrammarExercise,
  LessonTask
} from '../types';

export interface DayCurriculum {
  dayNumber: number;
  themeTitle: string;
  themeSubtitle: string;
  estimatedMinutes: number;
  tasks: LessonTask[];
  flashcards: Flashcard[];
  conversationScenario: ConversationScenario;
  grammarExercises: GrammarExercise[];
}

/**
 * Pre-defined rich curriculum for Days 1 through 7
 */
export const CURRICULUM_DAYS: Record<number, DayCurriculum> = {
  1: {
    dayNumber: 1,
    themeTitle: 'Temel Tanışma & Selamlaşma',
    themeSubtitle: 'Yunanca harflere aşinalık, ilk selamlaşmalar ve bir kafede kahve siparişi.',
    estimatedMinutes: 12,
    tasks: [
      {
        id: 'task-d1-1',
        title: '1. Temel Kelime Tekrarı',
        description: 'Aralıklı tekrar algoritması ile temel selamlaşma ve nezaket kelimeleri.',
        durationMinutes: 3,
        type: 'vocabulary',
        completed: false
      },
      {
        id: 'task-d1-2',
        title: '2. Günlük Konuşma: Kafe Siparişi',
        description: 'Barista Eleni ile Atina kafesinde Yunan kahvesi sipariş diyaloğu.',
        durationMinutes: 5,
        type: 'conversation',
        completed: false
      },
      {
        id: 'task-d1-3',
        title: '3. Dilbilgisi: "Είμαι" (Olmak) Fiili',
        description: 'Şahıs zamirleri ve "olmak" fiilinin geniş zaman çekim kuralları.',
        durationMinutes: 4,
        type: 'grammar',
        completed: false
      }
    ],
    flashcards: [
      {
        id: 'flash-d1-1',
        greek: 'Ἓν οἶδα ὅτι οὐδὲν οἶδα',
        transliteration: 'Hèn oîda hóti oudèn oîda',
        english: 'I know one thing, that I know nothing.',
        turkish: 'Bildiğim tek şey hiçbir şey bilmediğimdir.',
        categoryTag: 'Socrates • Felsefe',
        audioText: 'Ἓν οἶδα ὅτι οὐδὲν οἶδα',
        breakdown: [
          { greek: 'Ἓν (Hen)', transliteration: 'Hen', meaning: 'bir şey', grammarInfo: 'nötr tekil isim' },
          { greek: 'οἶδα (oida)', transliteration: 'oida', meaning: 'biliyorum', grammarInfo: '1. tekil şahıs fiil' },
          { greek: 'ὅτι (hoti)', transliteration: 'hoti', meaning: 'ki / olduğunu', grammarInfo: 'bağlaç' },
          { greek: 'οὐδὲν (ouden)', transliteration: 'ouden', meaning: 'hiçbir şey', grammarInfo: 'olumsuz zamir' }
        ]
      },
      {
        id: 'flash-d1-2',
        greek: 'Γεια σας, πώς είστε;',
        transliteration: 'Yia sas, pos eiste?',
        english: 'Hello, how are you? (Formal/Plural)',
        turkish: 'Merhaba, nasılsınız? (Nezaket/Çoğul)',
        categoryTag: 'Selamlaşma • Günlük Yaşam',
        audioText: 'Γεια σας, πώς είστε;',
        breakdown: [
          { greek: 'Γεια σας (Yia sas)', transliteration: 'Yia sas', meaning: 'Merhaba / Esenlikler', grammarInfo: 'nezaket selamı' },
          { greek: 'πώς (pos)', transliteration: 'pos', meaning: 'nasıl', grammarInfo: 'soru zarfı' },
          { greek: 'είστε (eiste)', transliteration: 'eiste', meaning: 'sizsiniz', grammarInfo: '2. çoğul şahıs geniş zaman' }
        ]
      },
      {
        id: 'flash-d1-3',
        greek: 'Ένα ποτήρι νερό, παρακαλώ.',
        transliteration: 'Ena potiri nero, parakalo.',
        english: 'A glass of water, please.',
        turkish: 'Bir bardak su, lütfen.',
        categoryTag: 'Restoran & Kafe',
        audioText: 'Ένα ποτήρι νερό, παρακαλώ.',
        breakdown: [
          { greek: 'Ένα (Ena)', transliteration: 'Ena', meaning: 'bir', grammarInfo: 'nötr sayı sıfatı' },
          { greek: 'ποτήρι (potiri)', transliteration: 'potiri', meaning: 'bardak', grammarInfo: 'nötr isim' },
          { greek: 'νερό (nero)', transliteration: 'nero', meaning: 'su', grammarInfo: 'nötr isim' },
          { greek: 'παρακαλώ (parakalo)', transliteration: 'parakalo', meaning: 'lütfen', grammarInfo: 'nezaket zarfı' }
        ]
      }
    ],
    conversationScenario: {
      id: 'sc-d1',
      title: "Atina'da Bir Kafede Sipariş",
      description: 'Geleneksel bir Yunan kafesinde kahve siparişi verme ve nazik diyalog pratiği.',
      location: 'Monastiraki, Atina',
      partnerName: 'Eleni',
      partnerRole: 'Barista & Kafe Sahibi',
      dialogue: [
        {
          id: 'd1-1',
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
          id: 'd1-2',
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
          id: 'd1-3',
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
          id: 'd1-4',
          speaker: 'partner',
          partnerName: 'Eleni',
          greek: 'Ευχαριστώ πάρα πολύ! Καλή σας μέρα και καλή απόλαυση!',
          transliteration: 'Efcharistó pára polý! Kalí sas méra kai kalí apólafsi!',
          turkish: 'Çok teşekkür ederim! İyi günler ve afiyet olsun!',
          audioText: 'Ευχαριστώ πάρα πολύ! Καλή σας μέρα και καλή απόλαυση!',
          userOptions: [
            {
              id: 'opt-4a',
              greek: 'Επίσης! Γεια σας και τα λέμε σύντομα!',
              transliteration: 'Epísis! Yia sas kai ta léme sýntoma!',
              turkish: 'Sana da! Hoşça kalın ve yakında görüşmek üzere!',
              feedback: 'Sohbeti mükemmel ve dostça sonlandırdınız! (Επίσης = Sana da)'
            }
          ]
        }
      ]
    },
    grammarExercises: [
      {
        id: 'g-d1-1',
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
        id: 'g-d1-2',
        title: '2. Tekil Şahıs: "Εσύ είσαι"',
        ruleTitle: 'Karşı tarafa hitap',
        ruleDescription: '"Εσύ" (Sen) için fiil çekimi "είσαι" şeklindedir.',
        prompt: '"Sen Atina\'dan mısın?" cümlesindeki boşluğu tamamlayın:',
        sourceSentence: 'Εσύ ______ από την Αθήνα;',
        options: ['είμαι', 'είσαι', 'είμαστε', 'είστε'],
        correctIndex: 1,
        explanation: '"Εσύ" (Sen) için doğru form "είσαι"dir.',
        audioText: 'Εσύ είσαι από την Αθήνα;',
        grammarFocus: '2nd Person Singular'
      }
    ]
  },

  2: {
    dayNumber: 2,
    themeTitle: 'Sayılar, Fiyatlar & Taverna Siparişi',
    themeSubtitle: '1-20 arası sayılar, menü okuma ve Plaka mahallesinde lezzetli bir akşam yemeği.',
    estimatedMinutes: 14,
    tasks: [
      {
        id: 'task-d2-1',
        title: '1. Sayılar & Fiyat Kelimeleri',
        description: 'Sayılar, para birimleri ve hesap isteme kalıpları üzerine SM-2 tekrarı.',
        durationMinutes: 3,
        type: 'vocabulary',
        completed: false
      },
      {
        id: 'task-d2-2',
        title: '2. Günlük Konuşma: Tavernada Akşam Yemeği',
        description: 'Garson Nikos ile geleneksel mezeler ve ana yemek siparişi diyaloğu.',
        durationMinutes: 6,
        type: 'conversation',
        completed: false
      },
      {
        id: 'task-d2-3',
        title: '3. Dilbilgisi: Belirlilik Artikelleri (Ο, Η, Το)',
        description: 'Eril, dişil ve nötr isimlerin yalın hal (Nominative) tanımlayıcıları.',
        durationMinutes: 5,
        type: 'grammar',
        completed: false
      }
    ],
    flashcards: [
      {
        id: 'flash-d2-1',
        greek: 'Πόσο κοστίζει αυτό, παρακαλώ;',
        transliteration: 'Póso kostízei aftó, parakaló?',
        english: 'How much does this cost, please?',
        turkish: 'Bu ne kadar / kaç para, lütfen?',
        categoryTag: 'Alışveriş & Fiyatlar',
        audioText: 'Πόσο κοστίζει αυτό, παρακαλώ;',
        breakdown: [
          { greek: 'Πόσο (Póso)', transliteration: 'Póso', meaning: 'ne kadar / kaç', grammarInfo: 'soru zarfı' },
          { greek: 'κοστίζει (kostízei)', transliteration: 'kostízei', meaning: 'maliyeti / tutuyor', grammarInfo: '3. tekil fiil' },
          { greek: 'αυτό (aftó)', transliteration: 'aftó', meaning: 'bu', grammarInfo: 'nötr işaret zamiri' }
        ]
      },
      {
        id: 'flash-d2-2',
        greek: 'Τον λογαριασμό, παρακαλώ.',
        transliteration: 'Ton logariasmó, parakaló.',
        english: 'The bill / check, please.',
        turkish: 'Hesabı alabilir miyim, lütfen.',
        categoryTag: 'Taverna & Restoran',
        audioText: 'Τον λογαριασμό, παρακαλώ.',
        breakdown: [
          { greek: 'Τον (Ton)', transliteration: 'Ton', meaning: '-i hali artikeli', grammarInfo: 'eril belirtme artikeli' },
          { greek: 'λογαριασμό (logariasmó)', transliteration: 'logariasmó', meaning: 'hesap / fatura', grammarInfo: 'eril isim' }
        ]
      },
      {
        id: 'flash-d2-3',
        greek: 'Μία χωριάτικη σαλάτα και ένα τζατζίκι.',
        transliteration: 'Mía choriátiki saláta kai éna tzatzíki.',
        english: 'One Greek salad and one tzatziki.',
        turkish: 'Bir Yunan salatası (köy salatası) ve bir cacık.',
        categoryTag: 'Yunan Mutfağı',
        audioText: 'Μία χωριάτικη σαλάτα και ένα τζατζίκι.',
        breakdown: [
          { greek: 'χωριάτικη (choriátiki)', transliteration: 'choriátiki', meaning: 'köy usulü', grammarInfo: 'dişil sıfat' },
          { greek: 'σαλάτα (saláta)', transliteration: 'saláta', meaning: 'salata', grammarInfo: 'dişil isim' },
          { greek: 'τζατζίκι (tzatzíki)', transliteration: 'tzatzíki', meaning: 'cacık', grammarInfo: 'nötr isim' }
        ]
      }
    ],
    conversationScenario: {
      id: 'sc-d2',
      title: "Plaka'da Geleneksel Taverna Akşamı",
      description: "Tarihi Plaka sokaklarındaki bir tavernada garson Nikos ile yemek siparişi diyaloğu.",
      location: 'Plaka, Atina',
      partnerName: 'Nikos',
      partnerRole: 'Taverna Garsonu & Şef',
      dialogue: [
        {
          id: 'd2-1',
          speaker: 'partner',
          partnerName: 'Nikos',
          greek: 'Καλησπέρα σας! Τραπέζι για ένα ή δύο άτομα;',
          transliteration: 'Kalispera sas! Trapezi yia ena i dyo atoma?',
          turkish: 'İyi akşamlar! Bir veya iki kişilik mi masa bakmıştınız?',
          audioText: 'Καλησπέρα σας! Τραπέζι για ένα ή δύο άτομα;',
          userOptions: [
            {
              id: 'opt-d2-1a',
              greek: 'Καλησπέρα! Για δύο άτομα δίπλα στο παράθυρο, παρακαλώ.',
              transliteration: 'Kalispera! Yia dyo atoma dipla sto parathyro, parakalo.',
              turkish: 'İyi akşamlar! Pencere kenarında iki kişilik lütfen.',
              feedback: 'Harika bir yer seçimi ve kibar bir giriş!'
            },
            {
              id: 'opt-d2-1b',
              greek: 'Γεια σας! Για ένα άτομο έξω στην αυλή.',
              transliteration: 'Yia sas! Yia ena atomo exo stin avli.',
              turkish: 'Merhaba! Avluda tek kişilik masa lütfen.',
              feedback: 'Çok net ve samimi bir ifade.'
            }
          ]
        },
        {
          id: 'd2-2',
          speaker: 'partner',
          partnerName: 'Nikos',
          greek: 'Ορίστε ο κατάλογος! Τι θα πιείτε για αρχή;',
          transliteration: 'Oriste o katalogos! Ti tha pieite yia archi?',
          turkish: 'Buyrun menü! Başlangıç olarak ne içmek istersiniz?',
          audioText: 'Ορίστε ο κατάλογος! Τι θα πιείτε για αρχή;',
          userOptions: [
            {
              id: 'opt-d2-2a',
              greek: 'Ένα μπουκάλι παγωμένο νερό και λευκό κρασί, παρακαλώ.',
              transliteration: 'Ena boukali pagomeno nero kai lefko krasi, parakalo.',
              turkish: 'Bir şişe soğuk su ve beyaz şarap lütfen.',
              feedback: 'Taverna klasiği içecek siparişi!'
            },
            {
              id: 'opt-d2-2b',
              greek: 'Μία ελληνική μπύρα και λίγο ούζο.',
              transliteration: 'Mia elliniki bira kai ligo ouzo.',
              turkish: 'Bir Yunan birası ve biraz uzo.',
              feedback: 'Yunan lezzetlerine çok uygun bir tercih.'
            }
          ]
        },
        {
          id: 'd2-3',
          speaker: 'partner',
          partnerName: 'Nikos',
          greek: 'Εξαιρετικά! Και από φαγητό, τι προτιμάτε;',
          transliteration: 'Exairetika! Kai apo fayito, ti protimate?',
          turkish: 'Harika! Peki yemek olarak ne tercih edersiniz?',
          audioText: 'Εξαιρετικά! Και από φαγητό, τι προτιμάτε;',
          userOptions: [
            {
              id: 'opt-d2-3a',
              greek: 'Μία χωριάτικη σαλάτα, μουσακά και ψητό χταπόδι!',
              transliteration: 'Mia choriatiki salata, mousaka kai psito chtapodi!',
              turkish: 'Bir Yunan salatası, musakka ve ızgara ahtapot!',
              feedback: 'Enfes bir Akdeniz ziyafeti menüsü!'
            },
            {
              id: 'opt-d2-3b',
              greek: 'Σουβλάκι με πατάτες και τζατζίκι, παρακαλώ.',
              transliteration: 'Souvlaki me patates kai tzatziki, parakalo.',
              turkish: 'Patatesli souvlaki ve cacık lütfen.',
              feedback: 'Her zaman lezzetli ve doyurucu bir seçim.'
            }
          ]
        }
      ]
    },
    grammarExercises: [
      {
        id: 'g-d2-1',
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
        id: 'g-d2-2',
        title: 'Dişil İsim Artikeli: "Η"',
        ruleTitle: 'Dişil Kelime Belirteci',
        ruleDescription: '"θάλασσα" (deniz) dişil bir kelimedir ve "Η" artikeli ile kullanılır.',
        prompt: '"Η" artikelini gerektiren cümleyi tamamlayın:',
        sourceSentence: '______ θάλασσα είναι πολύ ζεστή.',
        options: ['Ο', 'Η', 'Το', 'Ένα'],
        correctIndex: 1,
        explanation: 'Dişil isimler önlerine "Η" artikeli alırlar.',
        audioText: 'Η θάλασσα είναι πολύ ζεστή.',
        grammarFocus: 'Feminine Articles'
      }
    ]
  },

  3: {
    dayNumber: 3,
    themeTitle: 'Günlük Yaşam, Saatler & Randevular',
    themeSubtitle: 'Zaman ifadeleri, günlük rutinler ve Sintagma Meydanı\'nda bir buluşma organize etme.',
    estimatedMinutes: 13,
    tasks: [
      {
        id: 'task-d3-1',
        title: '1. Zaman & Rutin Kelimeleri',
        description: 'Saatler, günler ve sabah/öğle/akşam zaman zarfları pratiği.',
        durationMinutes: 3,
        type: 'vocabulary',
        completed: false
      },
      {
        id: 'task-d3-2',
        title: '2. Günlük Konuşma: Buluşma Planlama',
        description: 'Sophia ile Sintagma Meydanı\'nda akşam buluşması için saat ve yer seçimi.',
        durationMinutes: 5,
        type: 'conversation',
        completed: false
      },
      {
        id: 'task-d3-3',
        title: '3. Dilbilgisi: Düzenli Fiiller (-ω Grubu)',
        description: 'Geniş zamanda κάνω (yapmak), μένω (oturmak/yaşamak), μαθαίνω (öğrenmek) çekimleri.',
        durationMinutes: 5,
        type: 'grammar',
        completed: false
      }
    ],
    flashcards: [
      {
        id: 'flash-d3-1',
        greek: 'Τι ώρα είναι τώρα;',
        transliteration: 'Ti ora einai tora?',
        english: 'What time is it now?',
        turkish: 'Şu an saat kaç?',
        categoryTag: 'Zaman & Saatler',
        audioText: 'Τι ώρα είναι τώρα;',
        breakdown: [
          { greek: 'Τι (Ti)', transliteration: 'Ti', meaning: 'ne / hangi', grammarInfo: 'soru zamiri' },
          { greek: 'ώρα (ora)', transliteration: 'ora', meaning: 'saat / zaman', grammarInfo: 'dişil isim' },
          { greek: 'τώρα (tora)', transliteration: 'tora', meaning: 'şimdi / şu an', grammarInfo: 'zaman zarfı' }
        ]
      },
      {
        id: 'flash-d3-2',
        greek: 'Συναντιόμαστε στις οκτώ το βράδυ.',
        transliteration: 'Synantiomaste stis okto to vrady.',
        english: 'We meet at eight in the evening.',
        turkish: 'Akşam saat sekizde buluşuyoruz.',
        categoryTag: 'Randevu & Buluşma',
        audioText: 'Συναντιόμαστε στις οκτώ το βράδυ.',
        breakdown: [
          { greek: 'Συναντιόμαστε', transliteration: 'Synantiomaste', meaning: 'buluşuyoruz', grammarInfo: '1. çoğul şahıs edilgen/dönüşlü fiil' },
          { greek: 'στις οκτώ', transliteration: 'stis okto', meaning: 'sekizde', grammarInfo: 'saat kalıbı' },
          { greek: 'το βράδυ', transliteration: 'to vrady', meaning: 'akşamleyin', grammarInfo: 'zaman ifadesi' }
        ]
      },
      {
        id: 'flash-d3-3',
        greek: 'Κάθε μέρα μαθαίνω νέα ελληνικά λόγια.',
        transliteration: 'Kathe mera mathaino nea ellinika loyia.',
        english: 'Every day I learn new Greek words.',
        turkish: 'Her gün yeni Yunanca kelimeler öğreniyorum.',
        categoryTag: 'Öğrenme & Rutin',
        audioText: 'Κάθε μέρα μαθαίνω νέα ελληνικά λόγια.',
        breakdown: [
          { greek: 'Κάθε μέρα (Kathe mera)', transliteration: 'Kathe mera', meaning: 'Her gün', grammarInfo: 'zaman sıfat tamlaması' },
          { greek: 'μαθαίνω (mathaino)', transliteration: 'mathaino', meaning: 'öğreniyorum', grammarInfo: '1. tekil şahıs fiil' }
        ]
      }
    ],
    conversationScenario: {
      id: 'sc-d3',
      title: "Sintagma Meydanı'nda Buluşma Ayarlama",
      description: "Arkadaşınız Sophia ile kahve içmek ve yürüyüş yapmak için randevulaşma diyaloğu.",
      location: 'Sintagma, Atina',
      partnerName: 'Sophia',
      partnerRole: 'Mimar & Arkadaş',
      dialogue: [
        {
          id: 'd3-1',
          speaker: 'partner',
          partnerName: 'Sophia',
          greek: 'Γεια σου! Είσαι ελεύθερος σήμερα το απόγευμα για έναν καφέ;',
          transliteration: 'Yia sou! Eisai eleftheros simera to apogevma yia enan kafe?',
          turkish: 'Selam! Bugün öğleden sonra bir kahve için müsait misin?',
          audioText: 'Γεια σου! Είσαι ελεύθερος σήμερα το απόγευμα για έναν καφέ;',
          userOptions: [
            {
              id: 'opt-d3-1a',
              greek: 'Ναι, φυσικά! Τι ώρα θα συναντηθούμε στο Σύνταγμα;',
              transliteration: 'Nai, fysika! Ti ora tha synantithoume sto Syntagma?',
              turkish: 'Evet, tabii ki! Sintagma\'da saat kaçta buluşalım?',
              feedback: 'Mükemmel bir kabul ve saat sorma cümlesi!'
            },
            {
              id: 'opt-d3-1b',
              greek: 'Μετά τις έξι είμαι ελεύθερος.',
              transliteration: 'Meta tis exi eimai eleftheros.',
              turkish: 'Saat altıdan sonra boşum.',
              feedback: 'Net ve zaman belirten pratik bir yanıt.'
            }
          ]
        },
        {
          id: 'd3-2',
          speaker: 'partner',
          partnerName: 'Sophia',
          greek: 'Τέλεια! Ας βρεθούμε στις έξι και μισή μπροστά από τη Βουλή.',
          transliteration: 'Teleia! As vrethoume stis exi kai misi brosta apo ti Vouli.',
          turkish: 'Harika! Saat altı buçukta Parlamento Binası önünde buluşalım.',
          audioText: 'Τέλεια! Ας βρεθούμε στις έξι και μισή μπροστά από τη Βουλή.',
          userOptions: [
            {
              id: 'opt-d3-2a',
              greek: 'Συμφωνώ! Θα τα πούμε εκεί στις έξι και μισή.',
              transliteration: 'Symfono! Tha ta poume ekei stis exi kai misi.',
              turkish: 'Anlaştık! Orada altı buçukta görüşürüz.',
              feedback: 'Çok sıcak ve teyit eden bir veda.'
            },
            {
              id: 'opt-d3-2b',
              greek: 'Τέλεια ιδέα, θα είμαι εκεί στην ώρα μου!',
              transliteration: 'Teleia idea, tha eimai ekei stin ora mou!',
              turkish: 'Harika fikir, tam vaktinde orada olacağım!',
              feedback: 'Kendine güvenen ve kibar bir yanıt.'
            }
          ]
        }
      ]
    },
    grammarExercises: [
      {
        id: 'g-d3-1',
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
      }
    ]
  },

  4: {
    dayNumber: 4,
    themeTitle: 'Alışveriş, Mağaza & Pazarlık',
    themeSubtitle: 'Monastiraki pazarında hediyelik eşya seçimi, fiyat sorma ve indirim isteme.',
    estimatedMinutes: 15,
    tasks: [
      {
        id: 'task-d4-1',
        title: '1. Alışveriş & Beden Kelimeleri',
        description: 'Renkler, kıyafetler, bedenler ve ödeme terimleri üzerine kelime kartları.',
        durationMinutes: 4,
        type: 'vocabulary',
        completed: false
      },
      {
        id: 'task-d4-2',
        title: '2. Günlük Konuşma: Monastiraki Bit Pazarı',
        description: 'Antikacı Giorgos ile el yapımı seramik ve zeytinyağı sabunu pazarlığı.',
        durationMinutes: 6,
        type: 'conversation',
        completed: false
      },
      {
        id: 'task-d4-3',
        title: '3. Dilbilgisi: Belirtme Hali (Accusative)',
        description: 'İsmin -i hali (Accusative) artikel ve kelime sonu dönüşümleri (Τον, Την, Το).',
        durationMinutes: 5,
        type: 'grammar',
        completed: false
      }
    ],
    flashcards: [
      {
        id: 'flash-d4-1',
        greek: 'Έχετε αυτό σε μικρότερο νούμερο;',
        transliteration: 'Echete afto se mikrotero noumero?',
        english: 'Do you have this in a smaller size?',
        turkish: 'Bunun daha küçük bedeni var mı?',
        categoryTag: 'Alışveriş & Giyim',
        audioText: 'Έχετε αυτό σε μικρότερο νούμερο;',
        breakdown: [
          { greek: 'Έχετε', transliteration: 'Echete', meaning: 'sahip misiniz / var mı', grammarInfo: '2. çoğul şahıs fiil' },
          { greek: 'μικρότερο', transliteration: 'mikrotero', meaning: 'daha küçük', grammarInfo: 'karşılaştırma sıfatı' },
          { greek: 'νούμερο', transliteration: 'noumero', meaning: 'numara / beden', grammarInfo: 'nötr isim' }
        ]
      },
      {
        id: 'flash-d4-2',
        greek: 'Μπορώ να πληρώσω με πιστωτική κάρτα;',
        transliteration: 'Boro na pliroso me pistotiki karta?',
        english: 'Can I pay by credit card?',
        turkish: 'Kredi kartıyla ödeyebilir miyim?',
        categoryTag: 'Ödeme & Bankacılık',
        audioText: 'Μπορώ να πληρώσω με πιστωτική κάρτα;',
        breakdown: [
          { greek: 'Μπορώ', transliteration: 'Boro', meaning: 'yapabilirim / -ebilmek', grammarInfo: '1. tekil şahıs fiil' },
          { greek: 'να πληρώσω', transliteration: 'na pliroso', meaning: 'ödemek', grammarInfo: 'istek kipi fiil' }
        ]
      }
    ],
    conversationScenario: {
      id: 'sc-d4',
      title: "Monastiraki Bit Pazarında Alışveriş",
      description: "Monastiraki sokaklarında antikacı Giorgos ile hediyelik eşya seçimi ve samimi pazarlık.",
      location: 'Monastiraki Bit Pazarı, Atina',
      partnerName: 'Giorgos',
      partnerRole: 'Antikacı & Zanaatkar',
      dialogue: [
        {
          id: 'd4-1',
          speaker: 'partner',
          partnerName: 'Giorgos',
          greek: 'Γεια σας φίλε μου! Κοιτάζετε αυτά τα όμορφα χειροποίητα κεραμικά;',
          transliteration: 'Yia sas file mou! Koitazete afta ta omorfa cheiropoiita keramika?',
          turkish: 'Merhaba dostum! Bu güzel el yapımı seramiklere mi bakıyordunuz?',
          audioText: 'Γεια σας φίλε μου! Κοιτάζετε αυτά τα όμορφα χειροποίητα κεραμικά;',
          userOptions: [
            {
              id: 'opt-d4-1a',
              greek: 'Ναι, αυτό το μπλε βάζο είναι υπέροχο. Πόσο κάνει;',
              transliteration: 'Nai, afto to ble vazo einai yperocho. Poso kanei?',
              turkish: 'Evet, bu mavi vazo harika. Kaç para acaba?',
              feedback: 'Çok doğal bir beğeni ve fiyat sorma cümlesi!'
            },
            {
              id: 'opt-d4-1b',
              greek: 'Ψάχνω ένα παραδοσιακό σουβενίρ για δώρο.',
              transliteration: 'Psachno ena paradosiako souvenir yia doro.',
              turkish: 'Hediye olarak geleneksel bir hatıra eşyası arıyorum.',
              feedback: 'İhtiyacı tam olarak belirten net bir ifade.'
            }
          ]
        },
        {
          id: 'd4-2',
          speaker: 'partner',
          partnerName: 'Giorgos',
          greek: 'Για εσάς, μόνο είκοσι ευρώ! Είναι αυθεντικό σχέδιο από την Κρήτη.',
          transliteration: 'Yia esas, mono eikosi evro! Einai afthentiko schedio apo tin Kriti.',
          turkish: 'Size özel sadece yirmi euro! Girit\'ten otantik bir desendir.',
          audioText: 'Για εσάς, μόνο είκοσι ευρώ! Είναι αυθεντικό σχέδιο από την Κρήτη.',
          userOptions: [
            {
              id: 'opt-d4-2a',
              greek: 'Μπορείτε να μου κάνετε μια καλύτερη τιμή στα δεκαπέντε ευρώ;',
              transliteration: 'Boreite na mou kanete mia kalyteri timi sta dekapente evro?',
              turkish: 'On beş euroya bırakarak biraz indirim yapabilir misiniz?',
              feedback: 'Nezaketle pazarlık yapmanın en uygun Yunanca yolu!'
            },
            {
              id: 'opt-d4-2b',
              greek: 'Εντάξει, το παίρνω! Ορίστε είκοσι ευρώ.',
              transliteration: 'Entaxei, to pairno! Oriste eikosi evro.',
              turkish: 'Tamamdır, alıyorum! Buyrun yirmi euro.',
              feedback: 'Hızlı ve dostça bir alışveriş kararı.'
            }
          ]
        }
      ]
    },
    grammarExercises: [
      {
        id: 'g-d4-1',
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
      }
    ]
  },

  5: {
    dayNumber: 5,
    themeTitle: 'Seyahat, Ulaşım & Yön Sorma',
    themeSubtitle: 'Metro, feribot, Santorini bileti alma ve sokakta yön tarifleri sorma.',
    estimatedMinutes: 14,
    tasks: [
      {
        id: 'task-d5-1',
        title: '1. Ulaşım & Bilet Kelimeleri',
        description: 'İstasyon, bilet, peron, gidiş-dönüş ve yön bildiren kelimeler.',
        durationMinutes: 3,
        type: 'vocabulary',
        completed: false
      },
      {
        id: 'task-d5-2',
        title: '2. Günlük Konuşma: Pire Limanında Feribot',
        description: 'Bilet gişe memuru Dimitris ile Santorini feribot iskelesi ve saatleri sohbeti.',
        durationMinutes: 6,
        type: 'conversation',
        completed: false
      },
      {
        id: 'task-d5-3',
        title: '3. Dilbilgisi: Soru Zamirleri (Πού, Πώς, Τι)',
        description: 'Yunanca temel soru kalıpları ve "Nereden / Nereye" yapıları.',
        durationMinutes: 5,
        type: 'grammar',
        completed: false
      }
    ],
    flashcards: [
      {
        id: 'flash-d5-1',
        greek: 'Πού είναι ο πλησιέστερος σταθμός του μετρό;',
        transliteration: 'Pou einai o plisiesteros stathmos tou metro?',
        english: 'Where is the nearest metro station?',
        turkish: 'En yakın metro istasyonu nerede?',
        categoryTag: 'Ulaşım & Seyahat',
        audioText: 'Πού είναι ο πλησιέστερος σταθμός του μετρό;',
        breakdown: [
          { greek: 'Πού', transliteration: 'Pou', meaning: 'Nerede / Nereye', grammarInfo: 'soru zarfı' },
          { greek: 'πλησιέστερος', transliteration: 'plisiesteros', meaning: 'en yakın', grammarInfo: 'üstünlük sıfatı' },
          { greek: 'σταθμός', transliteration: 'stathmos', meaning: 'istasyon / durak', grammarInfo: 'eril isim' }
        ]
      }
    ],
    conversationScenario: {
      id: 'sc-d5',
      title: "Pire Limanı Gişesinde Feribot Bileti",
      description: "Santorini adasına hızlı feribot bileti alma ve kalkış iskelesini öğrenme.",
      location: 'Pire Limanı, Atina',
      partnerName: 'Dimitris',
      partnerRole: 'Liman Bilet Görevlisi',
      dialogue: [
        {
          id: 'd5-1',
          speaker: 'partner',
          partnerName: 'Dimitris',
          greek: 'Καλημέρα σας! Για ποιο νησί ενδιαφέρεστε;',
          transliteration: 'Kalimera sas! Yia poio nisi endiafereste?',
          turkish: 'Günaydın! Hangi ada ile ilgileniyordunuz?',
          audioText: 'Καλημέρα σας! Για ποιο νησί ενδιαφέρεστε;',
          userOptions: [
            {
              id: 'opt-d5-1a',
              greek: 'Καλημέρα! Ένα εισιτήριο για τη Σαντορίνη με το πρωινό πλοίο, παρακαλώ.',
              transliteration: 'Kalimera! Ena eisitirio yia ti Santorini me to proino ploio, parakalo.',
              turkish: 'Günaydın! Sabah feribotuyla Santorini\'ye bir bilet lütfen.',
              feedback: 'Açık, net ve eksiksiz bir bilet talebi!'
            }
          ]
        }
      ]
    },
    grammarExercises: [
      {
        id: 'g-d5-1',
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
    ]
  },

  6: {
    dayNumber: 6,
    themeTitle: 'Konaklama, Otel & Şehir Rehberi',
    themeSubtitle: 'Otelde check-in yapma, oda anahtarı teslimi ve şehirde gezilecek yerler.',
    estimatedMinutes: 13,
    tasks: [
      {
        id: 'task-d6-1',
        title: '1. Otel & Rezervasyon Kelimeleri',
        description: 'Anahtar, resepsiyon, manzara, kahvaltı ve oda terimleri.',
        durationMinutes: 3,
        type: 'vocabulary',
        completed: false
      },
      {
        id: 'task-d6-2',
        title: '2. Günlük Konuşma: Otel Check-in',
        description: 'Resepsiyonist Maria ile odaya yerleşme ve Wi-Fi şifresi alma sohbeti.',
        durationMinutes: 5,
        type: 'conversation',
        completed: false
      },
      {
        id: 'task-d6-3',
        title: '3. Dilbilgisi: İyelik Zamirleri (μου, σου, του)',
        description: 'Varlıkların kime ait olduğunu belirten pratik iyelik ekleri.',
        durationMinutes: 5,
        type: 'grammar',
        completed: false
      }
    ],
    flashcards: [
      {
        id: 'flash-d6-1',
        greek: 'Έχω κάνει κράτηση στο όνομα Demetriou.',
        transliteration: 'Echo kanei kratisi sto onoma Demetriou.',
        english: 'I have a reservation under the name Demetriou.',
        turkish: 'Demetriou adına rezervasyonum var.',
        categoryTag: 'Otel & Konaklama',
        audioText: 'Έχω κάνει κράτηση στο όνομα Demetriou.',
        breakdown: [
          { greek: 'κράτηση', transliteration: 'kratisi', meaning: 'rezervasyon', grammarInfo: 'dişil isim' },
          { greek: 'στο όνομα', transliteration: 'sto onoma', meaning: 'adına / isminde', grammarInfo: 'edat tamlaması' }
        ]
      }
    ],
    conversationScenario: {
      id: 'sc-d6',
      title: "Otel Resepsiyonunda Check-in",
      description: "Atina merkezindeki butik otelde check-in yapma ve oda detaylarını öğrenme.",
      location: 'Plaka Butik Otel, Atina',
      partnerName: 'Maria',
      partnerRole: 'Otel Resepsiyon Müdürü',
      dialogue: [
        {
          id: 'd6-1',
          speaker: 'partner',
          partnerName: 'Maria',
          greek: 'Καλώς ορίσατε στο ξενοδοχείο μας! Έχετε κράτηση;',
          transliteration: 'Kalos orisate sto xenodocheio mas! Echete kratisi?',
          turkish: 'Otelimize hoş geldiniz! Rezervasyonunuz var mıydı?',
          audioText: 'Καλώς ορίσατε στο ξενοδοχείο μας! Έχετε κράτηση;',
          userOptions: [
            {
              id: 'opt-d6-1a',
              greek: 'Γεια σας! Ναι, έχω κράτηση για τρία βράδια.',
              transliteration: 'Yia sas! Nai, echo kratisi yia tria vradia.',
              turkish: 'Merhaba! Evet, üç gecelik rezervasyonum var.',
              feedback: 'Kusursuz ve net bir resepsiyon ifadesi!'
            }
          ]
        }
      ]
    },
    grammarExercises: [
      {
        id: 'g-d6-1',
        title: 'İyelik Zamirleri: "μου", "σου"',
        ruleTitle: 'Aitlik Belirtme',
        ruleDescription: 'İsimden sonra gelen "μου" (benim), "σου" (senin) zamirleri aitlik bildirir (το κλειδί μου = benim anahtarım).',
        prompt: '"Benim anahtarım" ifadesini tamamlayın:',
        sourceSentence: 'Το κλειδί ______ είναι στη ρεσεψιόν.',
        options: ['μου', 'σου', 'μας', 'σας'],
        correctIndex: 0,
        explanation: '"μου" 1. tekil şahıs iyelik zamiridir.',
        audioText: 'Το κλειδί μου είναι στη ρεσεψιόν.',
        grammarFocus: 'Possessive Pronouns'
      }
    ]
  },

  7: {
    dayNumber: 7,
    themeTitle: 'Antik Felsefe & Kültürel Logos',
    themeSubtitle: 'Sokratik düşünce, Akropolis Müzesi ve bilgelik kavramları ile 1. haftanın taçlandırılması.',
    estimatedMinutes: 15,
    tasks: [
      {
        id: 'task-d7-1',
        title: '1. Felsefe & Bilgelik Kelimeleri',
        description: 'Logos, Nous, Ethos, Arete gibi klasik felsefi terimler ve alıntılar.',
        durationMinutes: 4,
        type: 'vocabulary',
        completed: false
      },
      {
        id: 'task-d7-2',
        title: '2. Günlük Konuşma: Akropolis Müzesinde Rehber',
        description: 'Sanat tarihçisi Chloe ile Parthenon heykelleri ve antik felsefe sohbeti.',
        durationMinutes: 6,
        type: 'conversation',
        completed: false
      },
      {
        id: 'task-d7-3',
        title: '3. Dilbilgisi: Basit Geçmiş Zaman (Aorist Giriş)',
        description: 'Geçmişte yaşanan eylemleri anlatmak için temel geçmiş zaman yapıları.',
        durationMinutes: 5,
        type: 'grammar',
        completed: false
      }
    ],
    flashcards: [
      {
        id: 'flash-d7-1',
        greek: 'Γνῶθι σεαυτόν',
        transliteration: 'Gnothi seauton',
        english: 'Know thyself.',
        turkish: 'Kendini bil (tanı).',
        categoryTag: 'Delfi Tapınağı • Felsefe',
        audioText: 'Γνῶθι σεαυτόν',
        breakdown: [
          { greek: 'Γνῶθι', transliteration: 'Gnothi', meaning: 'Bil / Tanı', grammarInfo: 'antik emir kipi' },
          { greek: 'σεαυτόν', transliteration: 'seauton', meaning: 'kendini', grammarInfo: 'dönüşlü zamir' }
        ]
      }
    ],
    conversationScenario: {
      id: 'sc-d7',
      title: "Akropolis Müzesinde Antik Felsefe",
      description: "Akropolis Müzesi'nde antik heykellerin ve Sokratik düşüncenin büyüleyici dünyası.",
      location: 'Akropolis Müzesi, Atina',
      partnerName: 'Chloe',
      partnerRole: 'Sanat Tarihçisi & Müze Rehberi',
      dialogue: [
        {
          id: 'd7-1',
          speaker: 'partner',
          partnerName: 'Chloe',
          greek: 'Καλώς ήρθατε στο Μουσείο της Ακρόπολης! Εντυπωσιακό το φως εδώ, έτσι δεν είναι;',
          transliteration: 'Kalos irthate sto Mouseio tis Akropolis! Entyposiako to fos edo, etsi den einai?',
          turkish: 'Akropolis Müzesi\'ne hoş geldiniz! Buradaki ışık büyüleyici, öyle değil mi?',
          audioText: 'Καλώς ήρθατε στο Μουσείο της Ακρόπολης! Εντυπωσιακό το φως εδώ, έτσι δεν είναι;',
          userOptions: [
            {
              id: 'opt-d7-1a',
              greek: 'Είναι πραγματικά μαγευτικό! Τα αρχαία αγάλματα φαίνονται ζωντανά.',
              transliteration: 'Einai pragmatika mayeftiko! Ta archaia agalmata fainontai zontana.',
              turkish: 'Gerçekten büyüleyici! Antik heykeller adeta canlı görünüyor.',
              feedback: 'Harika bir estetik gözlem ve zarif bir ifade!'
            }
          ]
        }
      ]
    },
    grammarExercises: [
      {
        id: 'g-d7-1',
        title: 'Geçmiş Zaman: "Ήμουν" (İdim / Vardım)',
        ruleTitle: 'Olmak Fiilinin Geçmiş Zamanı',
        ruleDescription: 'Εγώ ήμουν (Ben idim), Εσύ ήσουν (Sen idin), Αυτός ήταν (O idi).',
        prompt: '"Dün Atina\'daydım" cümlesini tamamlayın:',
        sourceSentence: 'Χθες εγώ ______ στην Αθήνα.',
        options: ['ήμουν', 'ήσουν', 'ήταν', 'είμαι'],
        correctIndex: 0,
        explanation: '1. Tekil şahıs geçmiş zaman "ήμουν"dur.',
        audioText: 'Χθες εγώ ήμουν στην Αθήνα.',
        grammarFocus: 'Past Tense: to be'
      }
    ]
  }
};

/**
 * Procedural themes for infinite day generation (Day 8, Day 9, Day 10, ...)
 */
const INFINITE_DAY_THEMES = [
  {
    theme: 'Yunan Müziği, Rebetiko & Şiir',
    subtitle: 'Müzik aletleri, şarkı sözleri, Rebetiko kültürü ve canlı müzik tavernası.',
    partner: 'Vassilis',
    role: 'Buzuki Sanatçısı',
    location: 'Psirri, Atina'
  },
  {
    theme: 'Ege Adaları & Deniz Yaşamı',
    subtitle: 'Ada yaşamı, plajlar, denizcilik terimleri ve Kiklad mimarisi.',
    partner: 'Elena',
    role: 'Santorini Kaptanı',
    location: 'Oia, Santorini'
  },
  {
    theme: 'Sağlık, Beden & Eczane',
    subtitle: 'Vücut organları, semptom anlatma, eczaneden ilaç isteme kalıpları.',
    partner: 'Dr. Kostas',
    role: 'Eczacı',
    location: 'Kolonaki, Atina'
  },
  {
    theme: 'Hava Durumu, Doğa & Mevsimler',
    subtitle: 'Hava tahminleri, mevsim özellikleri ve doğa yürüyüşü planlama.',
    partner: 'Irini',
    role: 'Doğa Rehberi',
    location: 'Meteora Dağları'
  },
  {
    theme: 'Aile, Ev & Akraba İlişkileri',
    subtitle: 'Aile fertleri, ev eşyaları ve geleneksel bir pazar günü aile yemeği.',
    partner: 'Stavros',
    role: 'Ev Sahibi',
    location: 'Hanya, Girit'
  },
  {
    theme: 'İş Dünyası & Profesyonel İletişim',
    subtitle: 'Ofis ortamı, iş görüşmesi, e-posta yazma ve resmi hitap kalıpları.',
    partner: 'Anna',
    role: 'Proje Yöneticisi',
    location: 'Maroussi İş Merkezi, Atina'
  },
  {
    theme: 'Yunan Mitolojisi & Efsaneler',
    subtitle: 'Olimpos tanrıları, mitolojik efsaneler ve antik hikayeler.',
    partner: 'Odysseas',
    role: 'Mitoloji Uzmanı',
    location: 'Delfi Antik Kenti'
  }
];

/**
 * Retrieves the complete curriculum for any day number (1, 2, 3, ... N)
 */
export function getDayCurriculum(dayNumber: number): DayCurriculum {
  if (CURRICULUM_DAYS[dayNumber]) {
    return CURRICULUM_DAYS[dayNumber];
  }

  // Procedural generator for Day 8 and beyond
  const themeIndex = (dayNumber - 8) % INFINITE_DAY_THEMES.length;
  const themeData = INFINITE_DAY_THEMES[themeIndex];

  return {
    dayNumber,
    themeTitle: `Gün ${dayNumber}: ${themeData.theme}`,
    themeSubtitle: themeData.subtitle,
    estimatedMinutes: 14,
    tasks: [
      {
        id: `task-d${dayNumber}-1`,
        title: `1. ${themeData.theme} Kelimeleri`,
        description: `${themeData.theme} konulu aralıklı tekrar kelime kartları.`,
        durationMinutes: 4,
        type: 'vocabulary',
        completed: false
      },
      {
        id: `task-d${dayNumber}-2`,
        title: `2. Günlük Konuşma: ${themeData.partner}`,
        description: `${themeData.role} ${themeData.partner} ile ${themeData.location} konumunda interaktif diyalog.`,
        durationMinutes: 6,
        type: 'conversation',
        completed: false
      },
      {
        id: `task-d${dayNumber}-3`,
        title: `3. Dilbilgisi Pratiği (Seviye ${dayNumber > 10 ? 'B1' : 'A2'})`,
        description: `İleri cümle yapıları ve konuşma akıcılığı testleri.`,
        durationMinutes: 4,
        type: 'grammar',
        completed: false
      }
    ],
    flashcards: [
      {
        id: `flash-d${dayNumber}-1`,
        greek: 'Η γνώση είναι δύναμη και ελευθερία.',
        transliteration: 'I gnosi einai dynami kai eleftheria.',
        english: 'Knowledge is power and freedom.',
        turkish: 'Bilgi, güç ve özgürlüktür.',
        categoryTag: `${themeData.theme} • Logos`,
        audioText: 'Η γνώση είναι δύναμη και ελευθερία.',
        breakdown: [
          { greek: 'Η γνώση', transliteration: 'I gnosi', meaning: 'Bilgi', grammarInfo: 'dişil isim' },
          { greek: 'δύναμη', transliteration: 'dynami', meaning: 'güç', grammarInfo: 'dişil isim' },
          { greek: 'ελευθερία', transliteration: 'eleftheria', meaning: 'özgürlük', grammarInfo: 'dişil isim' }
        ]
      }
    ],
    conversationScenario: {
      id: `sc-d${dayNumber}`,
      title: `${themeData.theme} Sohbeti`,
      description: `${themeData.location} konumunda ${themeData.partner} ile akıcı Yunanca diyalog.`,
      location: themeData.location,
      partnerName: themeData.partner,
      partnerRole: themeData.role,
      dialogue: [
        {
          id: `d${dayNumber}-1`,
          speaker: 'partner',
          partnerName: themeData.partner,
          greek: `Γεια σας! Χαίρομαι πολύ που σας συναντώ εδώ στο ${themeData.location}. Πώς περνάτε;`,
          transliteration: `Yia sas! Chairomai poly pou sas synanto edo. Pos pernate?`,
          turkish: `Merhaba! Sizinle burada karşılaştığıma çok memnun oldum. Nasıl geçiyor?`,
          audioText: `Γεια σας! Χαίρομαι πολύ που σας συναντώ εδώ. Πώς περνάτε;`,
          userOptions: [
            {
              id: `opt-d${dayNumber}-1a`,
              greek: 'Εξαιρετικά, ευχαριστώ! Μαθαίνω ελληνικά κάθε μέρα με μεγάλο ενθουσιασμό.',
              transliteration: 'Exairetika, efcharisto! Mathaino ellinika kathe mera me megalo enthousiasmo.',
              turkish: 'Harika, teşekkürler! Her gün büyük bir hevesle Yunanca öğreniyorum.',
              feedback: 'İlham verici ve akıcı bir Yunanca cümle!'
            }
          ]
        }
      ]
    },
    grammarExercises: [
      {
        id: `g-d${dayNumber}-1`,
        title: `İleri Dilbilgisi: Cümle Yapısı (Gün ${dayNumber})`,
        ruleTitle: `Akıcılık ve Cümle Bağlaçları`,
        ruleDescription: `Yunancada "επειδή" (çünkü), "αν" (eğer), "όταν" (ne zaman ki) gibi bağlaçlarla yan cümle kurma.`,
        prompt: '"Çünkü" anlamına gelen doğru bağlacı seçin:',
        sourceSentence: 'Μαθαίνω ελληνικά ______ αγαπώ την Ελλάδα.',
        options: ['επειδή', 'αλλά', 'ή', 'αν'],
        correctIndex: 0,
        explanation: '"επειδή" Yunanca "çünkü / sebebiyle" anlamına gelir.',
        audioText: 'Μαθαίνω ελληνικά επειδή αγαπώ την Ελλάδα.',
        grammarFocus: 'Conjunctions'
      }
    ]
  };
}
