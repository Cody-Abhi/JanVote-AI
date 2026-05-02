import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          nav_parties: "Parties",
          app_name: "JanVote AI",
          nav_home: "Home",
          nav_chat: "AI Assistant",
          nav_timeline: "Timeline",
          nav_quiz: "Quiz",
          nav_journey: "Voter Journey",
          nav_maps: "Polling Booths",
          nav_stats: "Stats",
          nav_leaderboard: "Leaderboard",
          hero_title: "Empowering Indian Voters with AI",
          hero_subtitle: "Your comprehensive guide to the Indian Elections. Educate, Engage, and Empower.",
          get_started: "Get Started",
          sign_in: "Sign In with Google",
          sign_out: "Sign Out",
          chat_placeholder: "Ask anything about Indian elections...",
          quiz_title: "Election Hero Quiz",
          voter_journey_title: "Your Path to the Voting Booth",
          stats_title: "Election Insights",
          difficulty_easy: "Easy",
          difficulty_medium: "Medium",
          difficulty_hard: "Hard",
          phases: "Election Phases"
        ,
          hero_main_1: "समझो। जागो।"
        ,
          hero_main_2: "Vote करो।"
        ,
          hero_desc: "JanVote AI is your intelligent companion for India's democratic process — from voter registration to casting your ballot."
        ,
          consult_ai: "Consult AI Assistant"
        ,
          find_booth: "Find Polling Booth"
        ,
          scroll_explore: "SCROLL TO EXPLORE"
        ,
          eligible_voters: "Eligible Voters"
        ,
          lok_sabha_seats: "Lok Sabha Seats"
        ,
          your_vote_counts: "Your Vote Counts"
        ,
          core_cap: "Core Capabilities"
        ,
          empower_vote: "Empower Your Vote"
        ,
          elector_ai_title: "Elector AI"
        ,
          elector_ai_desc: "24/7 intelligent chat for any voting or political query."
        ,
          timeline_title: "Election Timeline"
        ,
          timeline_desc: "Track every phase of the upcoming general elections."
        ,
          sim_title: "EVM Simulator"
        ,
          sim_desc: "A gamified polling booth experience to practice voting."
        ,
          parties_title: "Political Parties"
        ,
          parties_desc: "Explore major political parties and ideologies, unbiased."
        ,
          booth_title: "Booth Finder"
        ,
          booth_desc: "GPS-enabled station locator with accessibility info."
        ,
          journey_title: "Voter Journey"
        ,
          journey_desc: "Your animated path from registration to voting day."
        ,
          launch_exp: "LAUNCH EXPERIENCE"
        ,
          did_you_know: "DID YOU KNOW?"
        ,
          wonders: "India's Electoral Wonders"
        ,
          faq_title: "Frequently Asked Questions",
          nav_simulation: "Simulation",
          nav_readiness: "Am I Ready?",
          nav_news: "Live Context",
          nav_laws: "Laws & Rules",
          nav_profile: "My Profile",
          navigation: "Navigation",
          empower_nation: "Empower Your Nation",
          ai_powered_badge: "AI-POWERED VOTER EDUCATION"
        }
      },
      hi: {
        translation: {
          nav_parties: "दल",
          app_name: "जनवोट AI",
          nav_home: "मुख्य",
          nav_chat: "AI सहायक",
          nav_timeline: "समयरेखा",
          nav_quiz: "प्रश्नोत्तरी",
          nav_journey: "मतदाता यात्रा",
          nav_maps: "मतदान केंद्र",
          nav_stats: "आंकड़े",
          nav_leaderboard: "लीडरबोर्ड",
          hero_title: "AI के साथ भारतीय मतदाताओं को सशक्त बनाना",
          hero_subtitle: "भारतीय चुनावों के लिए आपका व्यापक मार्गदर्शक। शिक्षित, संलग्न और सशक्त बनें।",
          get_started: "शुरुआत करें",
          sign_in: "Google के साथ साइन इन करें",
          sign_out: "साइन आउट",
          chat_placeholder: "भारतीय चुनावों के बारे में कुछ भी पूछें...",
          quiz_title: "इलेक्शन हीरो क्विज",
          voter_journey_title: "मतदान केंद्र तक आपका रास्ता",
          stats_title: "चुनाव अंतर्दृष्टि",
          difficulty_easy: "आसान",
          difficulty_medium: "मध्यम",
          difficulty_hard: "कठिन",
          phases: "चुनाव चरण"
        ,
          hero_main_1: "समझो। जागो।"
        ,
          hero_main_2: "Vote करो।"
        ,
          hero_desc: "जनवोट एआई भारत की लोकतांत्रिक प्रक्रिया के लिए आपका बुद्धिमान साथी है - मतदाता पंजीकरण से लेकर मतदान तक।"
        ,
          consult_ai: "एआई सहायक से पूछें"
        ,
          find_booth: "मतदान केंद्र खोजें"
        ,
          scroll_explore: "खोजने के लिए स्क्रॉल करें"
        ,
          eligible_voters: "पात्र मतदाता"
        ,
          lok_sabha_seats: "लोकसभा सीटें"
        ,
          your_vote_counts: "आपका वोट मायने रखता है"
        ,
          core_cap: "मुख्य क्षमताएं"
        ,
          empower_vote: "अपने वोट को सशक्त करें"
        ,
          elector_ai_title: "इलेक्टर एआई"
        ,
          elector_ai_desc: "किसी भी मतदान या राजनीतिक प्रश्न के लिए 24/7 बुद्धिमान चैट।"
        ,
          timeline_title: "चुनाव समयरेखा"
        ,
          timeline_desc: "आगामी आम चुनावों के हर चरण को ट्रैक करें।"
        ,
          sim_title: "ईवीएम सिम्युलेटर"
        ,
          sim_desc: "मतदान का अभ्यास करने के लिए एक गेमिफाइड मतदान केंद्र अनुभव।"
        ,
          parties_title: "राजनीतिक दल"
        ,
          parties_desc: "प्रमुख राजनीतिक दलों और विचारधाराओं का निष्पक्ष अन्वेषण करें।"
        ,
          booth_title: "बूथ खोजक"
        ,
          booth_desc: "पहुंच जानकारी के साथ जीपीएस-सक्षम स्टेशन लोकेटर।"
        ,
          journey_title: "मतदाता यात्रा"
        ,
          journey_desc: "पंजीकरण से लेकर मतदान के दिन तक आपका एनिमेटेड मार्ग।"
        ,
          launch_exp: "अनुभव शुरू करें"
        ,
          did_you_know: "क्या आप जानते हैं?"
        ,
          wonders: "भारत के चुनावी अजूबे"
        ,
          faq_title: "अक्सर पूछे जाने वाले प्रश्न",
          nav_simulation: "सिमुलेशन",
          nav_readiness: "क्या मैं तैयार हूँ?",
          nav_news: "लाइव संदर्भ",
          nav_laws: "कानून और नियम",
          nav_profile: "मेरी प्रोफ़ाइल",
          navigation: "नेविगेशन",
          empower_nation: "अपने राष्ट्र को सशक्त करें",
          ai_powered_badge: "एआई-संचालित मतदाता शिक्षा"
        }
      },
      bn: {
        translation: {
          nav_parties: "দল",
          app_name: "জনভোট AI",
          nav_home: "হোম",
          nav_chat: "AI সহকারী",
          nav_timeline: "টাইমলাইন",
          nav_quiz: "কুইজ",
          nav_journey: "ভোটার যাত্রা",
          nav_maps: "পোলিং বুথ",
          nav_stats: "পরিসংখ্যান",
          nav_leaderboard: "লিডারবোর্ড",
          hero_title: "এআই দিয়ে ভারতীয় ভোটারদের ক্ষমতায়ন",
          hero_subtitle: "ভারতীয় নির্বাচনের জন্য আপনার ব্যাপক নির্দেশিকা।",
          get_started: "শুরু করুন",
          sign_in: "Google দিয়ে সাইন ইন করুন",
          sign_out: "সাইন আউট",
          chat_placeholder: "ভারতীয় নির্বাচন সম্পর্কে কিছু জিজ্ঞাসা করুন...",
          quiz_title: "ইলেকশন হিরো কুইজ",
          voter_journey_title: "ভোটকেন্দ্রে আপনার পথ",
          stats_title: "নির্বাচনের অন্তর্দৃষ্টি",
          difficulty_easy: "সহজ",
          difficulty_medium: "মাঝারি",
          difficulty_hard: "কঠিন",
          phases: "নির্বাচনের পর্যায়"
        ,
          hero_main_1: "বুঝুন। জাগুন।"
        ,
          hero_main_2: "ভোট দিন।"
        ,
          hero_desc: "জনভোট এআই ভারতের গণতান্ত্রিক প্রক্রিয়ার জন্য আপনার বুদ্ধিমান সঙ্গী - ভোটার নিবন্ধন থেকে ভোট দেওয়া পর্যন্ত।"
        ,
          consult_ai: "এআই সহকারীর সাথে পরামর্শ করুন"
        ,
          find_booth: "ভোটকেন্দ্র খুঁজুন"
        ,
          scroll_explore: "অন্বেষণ করতে স্ক্রোল করুন"
        ,
          eligible_voters: "যোগ্য ভোটার"
        ,
          lok_sabha_seats: "লোকসভা আসন"
        ,
          your_vote_counts: "আপনার ভোট গুরুত্বপূর্ণ"
        ,
          core_cap: "মূল ক্ষমতা"
        ,
          empower_vote: "আপনার ভোটকে ক্ষমতায়িত করুন"
        ,
          elector_ai_title: "ইলেক্টর এআই"
        ,
          elector_ai_desc: "যেকোনো ভোটিং বা রাজনৈতিক প্রশ্নের জন্য 24/7 বুদ্ধিমান চ্যাট।"
        ,
          timeline_title: "নির্বাচনের টাইমলাইন"
        ,
          timeline_desc: "আসন্ন সাধারণ নির্বাচনের প্রতিটি পর্যায় ট্র্যাক করুন।"
        ,
          sim_title: "ইভিএম সিমুলেটর"
        ,
          sim_desc: "ভোট দেওয়ার অনুশীলনের জন্য একটি গ্যামিফাইড পোলিং বুথের অভিজ্ঞতা।"
        ,
          parties_title: "রাজনৈতিক দল"
        ,
          parties_desc: "প্রধান রাজনৈতিক দল এবং মতাদর্শগুলো নিরপেক্ষভাবে অন্বেষণ করুন।"
        ,
          booth_title: "বুথ ফাইন্ডার"
        ,
          booth_desc: "অ্যাক্সেসযোগ্যতা তথ্য সহ জিপিএস-সक्षम স্টেশন লোকেটার।"
        ,
          journey_title: "ভোটার যাত্রা"
        ,
          journey_desc: "নিবন্ধন থেকে ভোটের দিন পর্যন্ত আপনার অ্যানিমেটেড পথ।"
        ,
          launch_exp: "অভিজ্ঞতা চালু করুন"
        ,
          did_you_know: "আপনি কি জানতেন?"
        ,
          wonders: "ভারতের নির্বাচনী বিস্ময়"
        ,
          faq_title: "সচরাচর জিজ্ঞাস্য",
          nav_simulation: "সিমুলেশন",
          nav_readiness: "আমি কি প্রস্তুত?",
          nav_news: "লাইভ প্রসঙ্গ",
          nav_laws: "আইন ও বিধি",
          nav_profile: "আমার প্রোফাইল",
          navigation: "নেভিগেশন",
          empower_nation: "আপনার জাতিকে সক্ষম করুন",
          ai_powered_badge: "এআই-চালিত ভোটার শিক্ষা"
        }
      },
      te: {
        translation: {
          nav_parties: "పార్టీలు",
          app_name: "జన్ ఓటు AI",
          nav_home: "హోమ్",
          nav_chat: "AI సహాయకుడు",
          nav_timeline: "టైమ్‌లైన్",
          nav_quiz: "క్విజ్",
          nav_journey: "ఓటరు ప్రయాణం",
          nav_maps: "పోలింగ్ బూత్‌లు",
          nav_stats: "గణాంకాలు",
          nav_leaderboard: "లీడర్‌బోర్డ్",
          hero_title: "AI సహకారంతో భారతీయ ఓటర్ల సాధికారత",
          hero_subtitle: "భారత ఎన్నికల కోసం మీ సమగ్ర మార్గదర్శకం.",
          get_started: "ప్రారంభించండి",
          sign_in: "Googleతో సైన్ ఇన్ చేయండి",
          sign_out: "సైన్ అవుట్",
          chat_placeholder: "భారత ఎన్నికల గురించి ఏదైనా అడగండి...",
          quiz_title: "ఎలక్షన్ హీరో క్విజ్",
          voter_journey_title: "ఓటింగ్ బూత్‌కు మీ మార్గం",
          stats_title: "ఎన్నికల అంతర్దృష్టులు",
          difficulty_easy: "సులువు",
          difficulty_medium: "మధ్యస్థం",
          difficulty_hard: "కష్టం",
          phases: "ఎన్నికల దశలు"
        ,
          hero_main_1: "అర్థం చేసుకోండి. మేల్కొనండి."
        ,
          hero_main_2: "ఓటు వేయండి."
        ,
          hero_desc: "జన్ వోట్ ఏఐ భారతదేశ ప్రజాస్వామ్య ప్రక్రియలో మీ స్నేహితుడు - ఓటరు నమోదు నుండి ఓటు వేయడం వరకు."
        ,
          consult_ai: "ఏఐ సహాయకుడిని అడగండి"
        ,
          find_booth: "పోలింగ్ బూత్‌ను కనుగొనండి"
        ,
          scroll_explore: "చూడటానికి స్క్రోల్ చేయండి"
        ,
          eligible_voters: "అర్హత గల ఓటర్లు"
        ,
          lok_sabha_seats: "లోక్‌సభ స్థానాలు"
        ,
          your_vote_counts: "మీ ఓటు ముఖ్యం"
        ,
          core_cap: "ప్రధాన సామర్థ్యాలు"
        ,
          empower_vote: "మీ ఓటును శక్తివంతం చేయండి"
        ,
          elector_ai_title: "ఎలెక్టర్ ఏఐ"
        ,
          elector_ai_desc: "ఏదైనా ఓటింగ్ లేదా రాజకీయ ప్రశ్నల కోసం 24/7 ఇంటెలిజెంట్ చాట్."
        ,
          timeline_title: "ఎన్నికల టైమ్‌లైన్"
        ,
          timeline_desc: "రాబోయే సాధారణ ఎన్నికల ప్రతి దశను ట్రాక్ చేయండి."
        ,
          sim_title: "ఈవీఎం సిమ్యులేటర్"
        ,
          sim_desc: "ఓటు వేయడానికి సాధన చేయడానికి గేమిఫైడ్ పోలింగ్ బూత్ అనుభవం."
        ,
          parties_title: "రాజకీయ పార్టీలు"
        ,
          parties_desc: "ప్రధాన రాజకీయ పార్టీలు మరియు సిద్ధాంతాలను నిష్పాక్షికంగా అన్వేషించండి."
        ,
          booth_title: "బూత్ ఫైండర్"
        ,
          booth_desc: "యాక్సెసిబిలిటీ సమాచారంతో జీపీఎస్-ప్రారంభించబడిన స్టేషన్ లొకేటర్."
        ,
          journey_title: "ఓటరు ప్రయాణం"
        ,
          journey_desc: "నమోదు నుండి ఓటింగ్ రోజు వరకు మీ యానిమేటెడ్ మార్గం."
        ,
          launch_exp: "అనుభవాన్ని ప్రారంభించండి"
        ,
          did_you_know: "మీకు తెలుసా?"
        ,
          wonders: "భారతదేశ ఎన్నికల అద్భుతాలు"
        ,
          faq_title: "తరచుగా అడిగే ప్రశ్నలు",
          nav_simulation: "సిమ్యులేషన్",
          nav_readiness: "నేను సిద్ధంగా ఉన్నానా?",
          nav_news: "లైవ్ సందర్భం",
          nav_laws: "చట్టాలు & నిబంధనలు",
          nav_profile: "నా ప్రొఫైల్",
          navigation: "నావిగేషన్",
          empower_nation: "మీ దేశాన్ని సశక్తం చేయండి",
          ai_powered_badge: "ఏఐ-శక్తివంతమైన ఓటరు విద్య"
        }
      },
      ta: {
        translation: {
          nav_parties: "கட்சிகள்",
          app_name: "ஜன்வோட் AI",
          nav_home: "முகப்பு",
          nav_chat: "AI உதவியாளர்",
          nav_timeline: "காலவரிசை",
          nav_quiz: "வினாடி வினா",
          nav_journey: "வாக்காளர் பயணம்",
          nav_maps: "வாக்குச்சாவடிகள்",
          nav_stats: "புள்ளிவிவரங்கள்",
          nav_leaderboard: "முன்னிலைப்பலகை",
          hero_title: "AI உடன் இந்திய வாக்காளர்களை மேம்படுத்துதல்",
          hero_subtitle: "இந்திய தேர்தலுக்கான உங்கள் விரிவான வழிகாட்டி.",
          get_started: "தொடங்கவும்",
          sign_in: "Google மூலம் உள்நுழைக",
          sign_out: "வெளியேறு",
          chat_placeholder: "இந்திய தேர்தல் பற்றி ஏதேனும் கேளுங்கள்...",
          quiz_title: "தேர்தல் ஹீரோ வினாடி வினா",
          voter_journey_title: "வாக்குச்சாவடிக்கு உங்கள் பாதை",
          stats_title: "தேர்தல் நுண்ணறிவு",
          difficulty_easy: "எளிதானது",
          difficulty_medium: "நடுத்தர",
          difficulty_hard: "கடினம்",
          phases: "தேர்தல் கட்டங்கள்"
        ,
          hero_main_1: "புரிந்துகொள். விழித்தெழு."
        ,
          hero_main_2: "வாக்களி."
        ,
          hero_desc: "ஜன்வோட் ஏஐ இந்தியாவின் ஜனநாயக செயல்முறைக்கான உங்கள் அறிவார்ந்த துணை - வாக்காளர் பதிவு முதல் வாக்களிப்பது வரை."
        ,
          consult_ai: "ஏஐ உதவியாளரை கேளுங்கள்"
        ,
          find_booth: "வாக்குச்சாவடியைக் கண்டறியவும்"
        ,
          scroll_explore: "ஆராய கீழே உருட்டவும்"
        ,
          eligible_voters: "தகுதியான வாக்காளர்கள்"
        ,
          lok_sabha_seats: "மக்களவை இடங்கள்"
        ,
          your_vote_counts: "உங்கள் வாக்கு முக்கியமானது"
        ,
          core_cap: "முக்கிய திறன்கள்"
        ,
          empower_vote: "உங்கள் வாக்கை அதிகாரப்படுத்துங்கள்"
        ,
          elector_ai_title: "எலெக்டர் ஏஐ"
        ,
          elector_ai_desc: "எந்த வாக்களிப்பு அல்லது அரசியல் கேள்விக்கும் 24/7 அறிவார்ந்த அரட்டை."
        ,
          timeline_title: "தேர்தல் காலவரிசை"
        ,
          timeline_desc: "வரவிருக்கும் பொதுத் தேர்தல்களின் ஒவ்வொரு கட்டத்தையும் கண்காணிக்கவும்."
        ,
          sim_title: "ஈவிஎம் சிமுலேட்டர்"
        ,
          sim_desc: "வாக்களிக்க பயிற்சி பெற ஒரு விளையாட்டு வாக்குச்சாவடி அனுபவம்."
        ,
          parties_title: "அரசியல் கட்சிகள்"
        ,
          parties_desc: "முக்கிய அரசியல் கட்சிகள் மற்றும் சித்தாந்தங்களை பக்கச்சார்பற்ற முறையில் ஆராயுங்கள்."
        ,
          booth_title: "பூத் ஃபைண்டர்"
        ,
          booth_desc: "அணுகல் தகவலுடன் ஜிபிஎஸ்-இயக்கப்பட்ட நிலைய லொக்கேட்டர்."
        ,
          journey_title: "வாக்காளர் பயணம்"
        ,
          journey_desc: "பதிவு முதல் வாக்களிக்கும் நாள் வரை உங்கள் அனிமேஷன் பாதை."
        ,
          launch_exp: "அனுபவத்தைத் தொடங்கவும்"
        ,
          did_you_know: "உங்களுக்குத் தெரியுமா?"
        ,
          wonders: "இந்தியாவின் தேர்தல் அதிசயங்கள்"
        ,
          faq_title: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
          nav_simulation: "உருவகப்படுத்தல்",
          nav_readiness: "நான் தயாரா?",
          nav_news: "நேரடி சூழல்",
          nav_laws: "சட்டங்கள் & விதிகள்",
          nav_profile: "என் சுயவிவரம்",
          navigation: "வழிசெலுத்தல்",
          empower_nation: "உங்கள் நாட்டை வலுப்படுத்துங்கள்",
          ai_powered_badge: "ஏஐ-இயங்கும் வாக்காளர் கல்வி"
        }
      },
      mr: {
        translation: {
          nav_parties: "पक्ष",
          app_name: "जनवोट AI",
          nav_home: "मुख्यपृष्ठ",
          nav_chat: "AI सहाय्यक",
          nav_timeline: "टाइमलाइन",
          nav_quiz: "क्विझ",
          nav_journey: "मतदार प्रवास",
          nav_maps: "मतदान केंद्रे",
          nav_stats: "आकडेवारी",
          nav_leaderboard: "लीडरबोर्ड",
          hero_title: "AI सह भारतीय मतदारांचे सक्षमीकरण",
          hero_subtitle: "भारतीय निवडणुकांसाठी आपले सर्वसमावेशक मार्गदर्शक.",
          get_started: "सुरुवात करा",
          sign_in: "Google सह साइन इन करा",
          sign_out: "साइन आउट करा",
          chat_placeholder: "भारतीय निवडणुकांबद्दल काहीही विचारा...",
          quiz_title: "इलेक्शन हीरो क्विझ",
          voter_journey_title: "मतदान केंद्राकडे आपला मार्ग",
          stats_title: "निवडणूक अंतर्दृष्टी",
          difficulty_easy: "सोपे",
          difficulty_medium: "मध्यम",
          difficulty_hard: "कठीण",
          phases: "निवडणुकीचे टप्पे"
        ,
          hero_main_1: "समजून घ्या. जागे व्हा."
        ,
          hero_main_2: "मतदान करा."
        ,
          hero_desc: "जनवोट एआय हा भारताच्या लोकशाही प्रक्रियेसाठी तुमचा बुद्धिमान साथीदार आहे - मतदार नोंदणीपासून ते मतदान करेपर्यंत."
        ,
          consult_ai: "एआय सहाय्यकाला विचारा"
        ,
          find_booth: "मतदान केंद्र शोधा"
        ,
          scroll_explore: "अन्वेषण करण्यासाठी स्क्रोल करा"
        ,
          eligible_voters: "पात्र मतदार"
        ,
          lok_sabha_seats: "लोकसभा जागा"
        ,
          your_vote_counts: "तुमचे मत महत्त्वाचे आहे"
        ,
          core_cap: "मुख्य क्षमता"
        ,
          empower_vote: "तुमचे मत सक्षम करा"
        ,
          elector_ai_title: "इलेक्टर एआय"
        ,
          elector_ai_desc: "कोणत्याही मतदान किंवा राजकीय प्रश्नासाठी 24/7 बुद्धिमान चॅट."
        ,
          timeline_title: "निवडणूक टाइमलाइन"
        ,
          timeline_desc: "आगामी सार्वत्रिक निवडणुकांच्या प्रत्येक टप्प्याचा मागोवा घ्या."
        ,
          sim_title: "ईव्हीएम सिम्युलेटर"
        ,
          sim_desc: "मतदानाचा सराव करण्यासाठी एक गॅमिफाइड मतदान केंद्र अनुभव."
        ,
          parties_title: "राजकीय पक्ष"
        ,
          parties_desc: "प्रमुख राजकीय पक्ष आणि विचारसरणींचे निष्पक्षपणे अन्वेषण करा."
        ,
          booth_title: "बूथ फाइंडर"
        ,
          booth_desc: "प्रवेश माहितीसह जीपीएस-सक्षम स्टेशन लोकेटर."
        ,
          journey_title: "मतदार प्रवास"
        ,
          journey_desc: "नोंदणीपासून मतदानाच्या दिवसापर्यंतचा तुमचा ॲनिमेटेड मार्ग."
        ,
          launch_exp: "अनुभव सुरू करा"
        ,
          did_you_know: "तुम्हाला माहीत आहे का?"
        ,
          wonders: "भारतातील निवडणूक चमत्कार"
        ,
          faq_title: "सतत विचारले जाणारे प्रश्न",
          nav_simulation: "सिम्युलेशन",
          nav_readiness: "मी तयार आहे का?",
          nav_news: "थेट संदर्भ",
          nav_laws: "कायदे आणि नियम",
          nav_profile: "माझी प्रोफाइल",
          navigation: "नेव्हिगेशन",
          empower_nation: "तुमच्या राष्ट्राला सशक्त करा",
          ai_powered_badge: "एआय-चालित मतदार शिक्षण"
        }
      }
    }
  });

export default i18n;
