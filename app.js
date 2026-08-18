"use strict";

const THEMES = [
  { id: 1, title: "What is identity?", icon: "🪪", available: true, words: 60 },
  { id: 2, title: "Sắp cập nhật", icon: "🌍", available: false },
  { id: 3, title: "Sắp cập nhật", icon: "🔬", available: false },
  { id: 4, title: "Sắp cập nhật", icon: "🎨", available: false },
  { id: 5, title: "Sắp cập nhật", icon: "🌱", available: false },
  { id: 6, title: "Sắp cập nhật", icon: "🚀", available: false },
  { id: 7, title: "Sắp cập nhật", icon: "🏛️", available: false },
  { id: 8, title: "Sắp cập nhật", icon: "💡", available: false },
  { id: 9, title: "Sắp cập nhật", icon: "🌈", available: false }
];

const VOCABULARY = [
  { id: 1, lesson: "1", title: "What is identity?", word: "identity", speak: "identity", ipa: "/aɪˈdentəti/", pos: "N", meaning: "Danh tính; những đặc điểm tạo nên một người", example: "Identity is more than a name.", icon: "🪪" },
  { id: 2, lesson: "1", title: "What is identity?", word: "identify", speak: "identify", ipa: "/aɪˈdentɪfaɪ/", pos: "V", meaning: "Nhận dạng; xác định", example: "In what ways can we identify a person?", icon: "🔎" },
  { id: 3, lesson: "1", title: "What is identity?", word: "characteristic", speak: "characteristic", ipa: "/ˌkærəktəˈrɪstɪk/", pos: "N", meaning: "Đặc điểm; đặc trưng", example: "Why is it useful to use physical characteristics to identify people?", icon: "🧩" },
  { id: 4, lesson: "1", title: "What is identity?", word: "astronaut", speak: "astronaut", ipa: "/ˈæstrənɔːt/", pos: "N", meaning: "Phi hành gia", example: "Ellen Ochoa was one of NASA's first female astronauts.", icon: "👩‍🚀" },
  { id: 5, lesson: "1", title: "What is identity?", word: "gender", speak: "gender", ipa: "/ˈdʒendə/", pos: "N", meaning: "Giới tính", example: "How can gender make it difficult to achieve a goal?", icon: "⚧️" },
  { id: 6, lesson: "1", title: "What is identity?", word: "well-dressed", speak: "well dressed", ipa: "/ˌwel ˈdrest/", pos: "Adj", meaning: "Ăn mặc đẹp; ăn mặc lịch sự", example: "Moziah Bridges is a well-dressed fashion designer who has created a successful business.", icon: "👔" },
  { id: 7, lesson: "1", title: "What is identity?", word: "determined", speak: "determined", ipa: "/dɪˈtɜːmɪnd/", pos: "Adj", meaning: "Quyết tâm; kiên định", example: "Robin Emmons is a kind and determined middle-aged woman.", icon: "🎯" },
  { id: 8, lesson: "1", title: "What is identity?", word: "enthusiastic", speak: "enthusiastic", ipa: "/ɪnˌθjuːziˈæstɪk/", pos: "Adj", meaning: "Nhiệt tình; đầy nhiệt huyết", example: "The elderly and enthusiastic runner Fauja Singh completed marathons even after his 100th birthday.", icon: "🤩" },
  { id: 9, lesson: "1", title: "What is identity?", word: "blond-haired", speak: "blond haired", ipa: "/ˌblɒnd ˈheəd/", pos: "Adj", meaning: "Có mái tóc vàng", example: "Blond-haired, blue-eyed Mick Fanning is a courageous surfer who once survived a shark attack.", icon: "👱" },
  { id: 10, lesson: "1", title: "What is identity?", word: "blue-eyed", speak: "blue eyed", ipa: "/ˌbluː ˈaɪd/", pos: "Adj", meaning: "Có đôi mắt xanh", example: "Blond-haired, blue-eyed Mick Fanning is a courageous surfer who once survived a shark attack.", icon: "👁️" },
  { id: 11, lesson: "1", title: "What is identity?", word: "elderly", speak: "elderly", ipa: "/ˈeldəli/", pos: "Adj", meaning: "Cao tuổi; lớn tuổi", example: "The elderly and enthusiastic runner Fauja Singh completed marathons even after his 100th birthday.", icon: "👵" },
  { id: 12, lesson: "1", title: "What is identity?", word: "ethnic group", speak: "ethnic group", ipa: "/ˌeθnɪk ˈɡruːp/", pos: "NP", meaning: "Nhóm dân tộc", example: "A person's ethnic group can form part of their identity.", icon: "🌍" },
  { id: 13, lesson: "2", title: "What makes you unique?", word: "passion", speak: "passion", ipa: "/ˈpæʃn/", pos: "N", meaning: "Niềm đam mê", example: "My real passion is basketball.", icon: "🏀" },
  { id: 14, lesson: "2", title: "What makes you unique?", word: "recipe", speak: "recipe", ipa: "/ˈresəpi/", pos: "N", meaning: "Công thức nấu ăn", example: "Maybe they like my Indian recipes!", icon: "🍲" },
  { id: 15, lesson: "2", title: "What makes you unique?", word: "inspiration", speak: "inspiration", ipa: "/ˌɪnspəˈreɪʃn/", pos: "N", meaning: "Nguồn cảm hứng", example: "Gandhi, who we're studying in school, is really an inspiration for me.", icon: "💡" },
  { id: 16, lesson: "3", title: "Same but different", word: "divide into", speak: "divide into", ipa: "/dɪˈvaɪd ˈɪntuː/", pos: "VP", meaning: "Chia thành", example: "Why is it divided into two parts?", icon: "🧱" },
  { id: 17, lesson: "3", title: "Same but different", word: "gist", speak: "gist", ipa: "/dʒɪst/", pos: "N", meaning: "Ý chính; nội dung khái quát", example: "When we read for the general idea or gist, we don't focus on every individual word.", icon: "🎯" },
  { id: 18, lesson: "3", title: "Same but different", word: "biometric technology", speak: "biometric technology", ipa: "/ˌbaɪəʊˈmetrɪk tekˈnɒlədʒi/", pos: "NP", meaning: "Công nghệ sinh trắc học", example: "How does biometric technology work?", icon: "🖐️" },
  { id: 19, lesson: "3", title: "Same but different", word: "unique", speak: "unique", ipa: "/juˈniːk/", pos: "Adj", meaning: "Độc nhất; riêng biệt", example: "Physically, we are all unique in many ways.", icon: "🦄" },
  { id: 20, lesson: "3", title: "Same but different", word: "similarity", speak: "similarity", ipa: "/ˌsɪməˈlærəti/", pos: "N", meaning: "Sự tương đồng; điểm giống nhau", example: "Their similarities weren't only physical.", icon: "🧬" },
  { id: 21, lesson: "3", title: "Same but different", word: "measure / measurement", speak: "measure, measurement", ipa: "/ˈmeʒə/ · /ˈmeʒəmənt/", pos: "V / N", meaning: "Đo lường / phép đo; số đo", example: "Scanners use measurements, data, and algorithms to recognize our unique features.", icon: "📏" },
  { id: 22, lesson: "3", title: "Same but different", word: "identical", speak: "identical", ipa: "/aɪˈdentɪkl/", pos: "Adj", meaning: "Giống hệt nhau", example: "Even identical-looking people have unique fingerprints.", icon: "👯" },
  { id: 23, lesson: "4", title: "What makes us who we are?", word: "optimistic", speak: "optimistic", ipa: "/ˌɒptɪˈmɪstɪk/", pos: "Adj", meaning: "Lạc quan", example: "Maybe that's why I'm an optimistic person.", icon: "🌞" },
  { id: 24, lesson: "4", title: "What makes us who we are?", word: "pacifist", speak: "pacifist", ipa: "/ˈpæsɪfɪst/", pos: "N", meaning: "Người theo chủ nghĩa hòa bình", example: "He needed a lot of courage to be a pacifist.", icon: "🕊️" },
  { id: 25, lesson: "4", title: "What makes us who we are?", word: "courage", speak: "courage", ipa: "/ˈkʌrɪdʒ/", pos: "N", meaning: "Lòng dũng cảm", example: "He needed a lot of courage to be a pacifist.", icon: "🦁" },
  { id: 26, lesson: "4", title: "What makes us who we are?", word: "courageous", speak: "courageous", ipa: "/kəˈreɪdʒəs/", pos: "Adj", meaning: "Dũng cảm", example: "Mick Fanning is a courageous surfer who once survived a shark attack.", icon: "🦸" },
  { id: 27, lesson: "5", title: "Who am I?", word: "hectic", speak: "hectic", ipa: "/ˈhektɪk/", pos: "Adj", meaning: "Bận rộn; hối hả", example: "Asha's life can be hectic because she has music, cooking, basketball, and school.", icon: "🏃" },
  { id: 28, lesson: "5", title: "Who am I?", word: "rewarding", speak: "rewarding", ipa: "/rɪˈwɔːdɪŋ/", pos: "Adj", meaning: "Bổ ích; đem lại cảm giác thỏa mãn", example: "Learning a new instrument can be challenging but rewarding.", icon: "🏆" },
  { id: 29, lesson: "6", title: "Why do we need to protect our identity?", word: "digital resilience", speak: "digital resilience", ipa: "/ˌdɪdʒɪtl rɪˈzɪliəns/", pos: "NP", meaning: "Khả năng thích ứng và phục hồi trong môi trường số", example: "Digital resilience helps people respond safely to online risks.", icon: "🛡️" },
  { id: 30, lesson: "6", title: "Why do we need to protect our identity?", word: "fraud", speak: "fraud", ipa: "/frɔːd/", pos: "N", meaning: "Hành vi gian lận; lừa đảo", example: "Criminals can use a person's identity to commit fraud.", icon: "🚨" },
  { id: 31, lesson: "6", title: "Why do we need to protect our identity?", word: "identity theft", speak: "identity theft", ipa: "/aɪˈdentəti θeft/", pos: "NP", meaning: "Hành vi đánh cắp danh tính", example: "Some young people become victims of identity theft, when criminals use a person's identity to get money or a credit card.", icon: "🕵️" },
  { id: 32, lesson: "6", title: "Why do we need to protect our identity?", word: "phishing", speak: "phishing", ipa: "/ˈfɪʃɪŋ/", pos: "N", meaning: "Lừa đảo trực tuyến nhằm đánh cắp dữ liệu", example: "Phishing is when we receive emails which ask us to send private information or trick us to click on links.", icon: "🎣" },
  { id: 33, lesson: "6", title: "Why do we need to protect our identity?", word: "scam", speak: "scam", ipa: "/skæm/", pos: "N / V", meaning: "Trò lừa đảo; lừa đảo", example: "A phishing email may be part of an online scam.", icon: "⚠️" },
  { id: 34, lesson: "6", title: "Why do we need to protect our identity?", word: "shoulder surfer", speak: "shoulder surfer", ipa: "/ˈʃəʊldə ˌsɜːfə/", pos: "NP", meaning: "Kẻ nhìn trộm màn hình để lấy thông tin", example: "Shoulder surfers try to look at screens to get a PIN, password, and other data.", icon: "👀" },
  { id: 35, lesson: "7", title: "What is identity theft?", word: "identity alert", speak: "identity alert", ipa: "/aɪˈdentəti əˈlɜːt/", pos: "NP", meaning: "Cảnh báo về nguy cơ đánh cắp danh tính", example: "The Identity Alert page explains the risks of sharing personal information online.", icon: "🚨" },
  { id: 36, lesson: "7", title: "What is identity theft?", word: "privacy", speak: "privacy", ipa: "/ˈprɪvəsi/", pos: "N", meaning: "Quyền riêng tư; sự riêng tư", example: "Many teens worry about the privacy of their personal information.", icon: "🔐" },
  { id: 37, lesson: "7", title: "What is identity theft?", word: "private", speak: "private", ipa: "/ˈpraɪvət/", pos: "Adj", meaning: "Riêng tư; cá nhân", example: "Phishing emails may ask us to send private information.", icon: "🙈" },
  { id: 38, lesson: "7", title: "What is identity theft?", word: "PIN (Personal Identification Number)", speak: "PIN, Personal Identification Number", ipa: "/pɪn/", pos: "NP", meaning: "Mã số định danh cá nhân; mã PIN", example: "Shoulder surfers try to get a PIN, password, and other data.", icon: "🔢" },
  { id: 39, lesson: "7", title: "What is identity theft?", word: "avoid", speak: "avoid", ipa: "/əˈvɔɪd/", pos: "V", meaning: "Tránh", example: "Prepare a talk with advice about identity theft and how to avoid it.", icon: "🚧" },
  { id: 40, lesson: "7", title: "What is identity theft?", word: "hotspot", speak: "hotspot", ipa: "/ˈhɒtspɒt/", pos: "N", meaning: "Điểm phát / truy cập Wi-Fi", example: "Most of us use public Wi-Fi hotspots, but many of them are open and unsecured.", icon: "📶" },
  { id: 41, lesson: "7", title: "What is identity theft?", word: "spyware", speak: "spyware", ipa: "/ˈspaɪweə/", pos: "N", meaning: "Phần mềm gián điệp", example: "Some links can install viruses or spyware.", icon: "🐛" },
  { id: 42, lesson: "7", title: "What is identity theft?", word: "consequence", speak: "consequence", ipa: "/ˈkɒnsɪkwəns/", pos: "N", meaning: "Hậu quả", example: "A serious consequence of identity theft is losing money or access to an account.", icon: "🔄" },
  { id: 43, lesson: "8", title: "Protecting our identity online", word: "repetition", speak: "repetition", ipa: "/ˌrepəˈtɪʃn/", pos: "N", meaning: "Sự lặp lại", example: "Repetition means saying something important several times in different ways.", icon: "🔁" },
  { id: 44, lesson: "8", title: "Protecting our identity online", word: "emphasize", speak: "emphasize", ipa: "/ˈemfəsaɪz/", pos: "V", meaning: "Nhấn mạnh", example: "We can emphasize a point or argument in various ways.", icon: "📣" },
  { id: 45, lesson: "10", title: "How to avoid identity theft", word: "cyber security", speak: "cyber security", ipa: "/ˌsaɪbə sɪˈkjʊərəti/", pos: "NP", meaning: "An ninh mạng", example: "Good cyber security protects your devices and personal information.", icon: "🛡️" },
  { id: 46, lesson: "10", title: "How to avoid identity theft", word: "install", speak: "install", ipa: "/ɪnˈstɔːl/", pos: "V", meaning: "Cài đặt", example: "Some links can install viruses or spyware.", icon: "💾" },
  { id: 47, lesson: "11", title: "A descriptive profile", word: "appearance", speak: "appearance", ipa: "/əˈpɪərəns/", pos: "N", meaning: "Ngoại hình", example: "A descriptive profile can include appearance, clothes, family, interests, and personality.", icon: "🪞" },
  { id: 48, lesson: "11", title: "A descriptive profile", word: "stand out", speak: "stand out", ipa: "/ˌstænd ˈaʊt/", pos: "VP", meaning: "Nổi bật", example: "He doesn't like to stand out, but you can't miss him because of his height.", icon: "🌟" },
  { id: 49, lesson: "11", title: "A descriptive profile", word: "eccentric", speak: "eccentric", ipa: "/ɪkˈsentrɪk/", pos: "Adj", meaning: "Lập dị; khác thường", example: "His brightly colored hats make me think he's a little eccentric.", icon: "🎩" },
  { id: 50, lesson: "11", title: "A descriptive profile", word: "show off", speak: "show off", ipa: "/ˌʃəʊ ˈɒf/", pos: "VP", meaning: "Khoe khoang", example: "He's modest and he doesn't show off.", icon: "💃" },
  { id: 51, lesson: "11", title: "A descriptive profile", word: "gossip", speak: "gossip", ipa: "/ˈɡɒsɪp/", pos: "V", meaning: "Buôn chuyện; lan truyền tin đồn", example: "He never gossips online and people respect that, I think.", icon: "🗣️" },
  { id: 52, lesson: "11", title: "A descriptive profile", word: "aspect", speak: "aspect", ipa: "/ˈæspekt/", pos: "N", meaning: "Khía cạnh", example: "Describe the aspects of their identity that you can see and those you can't.", icon: "🔍" },
  { id: 53, lesson: "11", title: "A descriptive profile", word: "modify", speak: "modify", ipa: "/ˈmɒdɪfaɪ/", pos: "V", meaning: "Chỉnh sửa; điều chỉnh", example: "So you think it's OK to modify pictures for social media?", icon: "✏️" },
  { id: 54, lesson: "14–15", title: "Someone I look up to", word: "code breaking", speak: "code breaking", ipa: "/ˈkəʊd ˌbreɪkɪŋ/", pos: "NP", meaning: "Việc giải mã; phá mã", example: "Code breaking was an important part of Alan Turing's work.", icon: "🧠" },
  { id: 55, lesson: "14–15", title: "Someone I look up to", word: "dishonest", speak: "dishonest", ipa: "/dɪsˈɒnɪst/", pos: "Adj", meaning: "Không trung thực", example: "It is dishonest to claim that another person's work is your own.", icon: "🤥" },
  { id: 56, lesson: "14–15", title: "Someone I look up to", word: "participate in", speak: "participate in", ipa: "/pɑːˈtɪsɪpeɪt ɪn/", pos: "VP", meaning: "Tham gia vào", example: "An estimated 15.5 million young people participate in volunteer activities.", icon: "🙋" },
  { id: 57, lesson: "14–15", title: "Someone I look up to", word: "reputation", speak: "reputation", ipa: "/ˌrepjuˈteɪʃn/", pos: "N", meaning: "Danh tiếng", example: "His achievements earned him a reputation as a brilliant mathematician.", icon: "🌟" },
  { id: 58, lesson: "14–15", title: "Someone I look up to", word: "look up to", speak: "look up to", ipa: "/ˌlʊk ˈʌp tuː/", pos: "VP", meaning: "Kính trọng; ngưỡng mộ", example: "Many people look up to Alan Turing because of his intelligence and courage.", icon: "🙌" },
  { id: 59, lesson: "14–15", title: "Someone I look up to", word: "look down on", speak: "look down on", ipa: "/ˌlʊk ˈdaʊn ɒn/", pos: "VP", meaning: "Coi thường", example: "We should never look down on people because they are different.", icon: "👎" },
  { id: 60, lesson: "14–15", title: "Someone I look up to", word: "admire", speak: "admire", ipa: "/ədˈmaɪə/", pos: "V", meaning: "Ngưỡng mộ; khâm phục", example: "Search online for information about a person you admire.", icon: "💖" }
];

const SITUATIONS = [
  "A username, face, values, and background can all form part of a person's ____.",
  "The police used a clear photograph to ____ the missing traveller.",
  "Patience is an important ____ of a good team leader.",
  "After years of space training, Linh hopes to work as an ____.",
  "The survey asks for age, nationality, and ____.",
  "Nam wore a clean suit and polished shoes, so he looked very ____.",
  "Mai failed twice, but she remained ____ and kept practising.",
  "The volunteers were so ____ that they arrived early and cheered everyone.",
  "In the portrait, the ____ child is wearing a red cap.",
  "The artist painted a ____ hero with dark hair.",
  "The community centre runs gentle exercise classes for ____ residents.",
  "Their shared language and traditions connect them as an ____.",
  "Photography is not just a hobby; it is her greatest ____.",
  "I followed a new ____ to make vegetable soup.",
  "My science teacher became my ____ and encouraged me to study engineering.",
  "Please ____ the class ____ four teams for the experiment.",
  "Read the headline and first paragraph to understand the ____.",
  "The airport scans faces using ____.",
  "No two snowflakes are exactly the same; each one is ____.",
  "A love of music is one ____ between the two friends.",
  "The nurse used a tape to ____ my height and wrote the ____ down.",
  "The twins wore ____ jackets, so I could not tell them apart.",
  "Even after a difficult day, Minh stays ____ and expects tomorrow to be better.",
  "A ____ refuses to support war and promotes peaceful solutions.",
  "It takes ____ to speak up when someone is being bullied.",
  "The ____ firefighter entered the building to help a family.",
  "My schedule was so ____ that I had no free time between school and practice.",
  "Teaching younger children can be tiring but very ____.",
  "After an online problem, ____ helps you recover, learn, and stay safe.",
  "The bank investigated a case of ____ involving false payments.",
  "Someone used Hoa's personal details to open an account; this is ____.",
  "A fake email asked me to enter my password on a suspicious page; it was ____.",
  "The offer promised a free phone but asked for money first—it was a ____.",
  "At the ATM, a ____ stood behind me trying to see my PIN.",
  "The banking app sent an ____ after an unusual login.",
  "Use strong settings to protect your online ____.",
  "Never post ____ information such as your home address.",
  "Cover the keypad when entering your ____.",
  "To ____ malware, do not download files from unknown senders.",
  "We connected our tablets to the library's Wi-Fi ____.",
  "The app secretly watched everything I typed; it contained ____.",
  "Losing access to your account can be a serious ____ of weak security.",
  "The coach used ____ by saying the key message several times.",
  "Use a stronger voice to ____ the most important warning.",
  "Strong passwords and software updates are part of good ____.",
  "Please ____ the security update before using the laptop.",
  "Hair, height, and clothing are parts of a person's ____.",
  "Her bright silver boots made her ____ in the crowd.",
  "The inventor was known for ____ habits, such as working only at midnight.",
  "Duy always talks loudly about his prizes because he likes to ____.",
  "It is unkind to ____ about classmates behind their backs.",
  "Confidence is one ____ of identity that cannot be seen in a photograph.",
  "Use the editor to ____ the brightness of the picture.",
  "The team used logic and patterns for ____ during the competition.",
  "Copying a classmate's project and calling it your own is ____.",
  "Every student can ____ the school clean-up day.",
  "Years of reliable work gave the doctor an excellent ____.",
  "I ____ my older sister because she works hard and helps others.",
  "We should not ____ someone because of their clothes or accent.",
  "I really ____ the scientist for using her knowledge to help communities."
];

const LESSONS = [...new Map(VOCABULARY.map(item => [item.lesson, item.title])).entries()];
const STORAGE_KEY_PREFIX = "7oic-vocabulary-progress-v2";

const state = {
  tableOrder: [...VOCABULARY],
  deck: [...VOCABULARY],
  cardIndex: 0,
  flipped: false,
  known: new Set(),
  review: new Set(),
  studentUid: null,
  voices: [],
  practice: createPracticeState()
};

const elements = {
  themeGrid: document.querySelector("#themeGrid"),
  tabs: [...document.querySelectorAll(".tab-button")],
  panels: [...document.querySelectorAll(".tab-panel")],
  searchInput: document.querySelector("#searchInput"),
  lessonFilter: document.querySelector("#lessonFilter"),
  speechRate: document.querySelector("#speechRate"),
  shuffleTableButton: document.querySelector("#shuffleTableButton"),
  resetTableButton: document.querySelector("#resetTableButton"),
  resultCount: document.querySelector("#resultCount"),
  vocabTableBody: document.querySelector("#vocabTableBody"),
  vocabMobileList: document.querySelector("#vocabMobileList"),
  emptyState: document.querySelector("#emptyState"),
  deckLessonFilter: document.querySelector("#deckLessonFilter"),
  shuffleDeckButton: document.querySelector("#shuffleDeckButton"),
  resetProgressButton: document.querySelector("#resetProgressButton"),
  flashcard: document.querySelector("#flashcard"),
  cardIcon: document.querySelector("#cardIcon"),
  cardBackIcon: document.querySelector("#cardBackIcon"),
  cardWord: document.querySelector("#cardWord"),
  cardIpa: document.querySelector("#cardIpa"),
  cardPos: document.querySelector("#cardPos"),
  cardMeaning: document.querySelector("#cardMeaning"),
  cardBackLesson: document.querySelector("#cardBackLesson"),
  cardPosition: document.querySelector("#cardPosition"),
  deckTotal: document.querySelector("#deckTotal"),
  cardLessonBadge: document.querySelector("#cardLessonBadge"),
  cardAudioButton: document.querySelector("#cardAudioButton"),
  cardSlowAudioButton: document.querySelector("#cardSlowAudioButton"),
  previousCardButton: document.querySelector("#previousCardButton"),
  nextCardButton: document.querySelector("#nextCardButton"),
  reviewButton: document.querySelector("#reviewButton"),
  knownButton: document.querySelector("#knownButton"),
  knownCount: document.querySelector("#knownCount"),
  reviewCount: document.querySelector("#reviewCount"),
  newCount: document.querySelector("#newCount"),
  progressPercent: document.querySelector("#progressPercent"),
  progressRing: document.querySelector("#progressRing"),
  hubProgressLabel: document.querySelector("#hubProgressLabel"),
  hubProgressTrack: document.querySelector("#hubProgressTrack"),
  hubProgressBar: document.querySelector("#hubProgressBar"),
  hubMasteryLabel: document.querySelector("#hubMasteryLabel"),
  deckProgressLabel: document.querySelector("#deckProgressLabel"),
  deckProgressTrack: document.querySelector("#deckProgressTrack"),
  deckProgressBar: document.querySelector("#deckProgressBar"),
  practiceModeButtons: [...document.querySelectorAll("[data-practice-mode]")],
  practiceModePanels: [...document.querySelectorAll("[data-practice-mode-panel]")],
  practiceOverallLabel: document.querySelector("#practiceOverallLabel"),
  practiceOverallBar: document.querySelector("#practiceOverallBar"),
  practiceOverallTrack: document.querySelector(".practice-overall-track"),
  matchingCoverage: document.querySelector("#matchingCoverage"),
  spellingCoverage: document.querySelector("#spellingCoverage"),
  situationCoverage: document.querySelector("#situationCoverage"),
  speedCoverage: document.querySelector("#speedCoverage"),
  matchingRoundSelect: document.querySelector("#matchingRoundSelect"),
  shuffleMatchingButton: document.querySelector("#shuffleMatchingButton"),
  matchingRoundProgress: document.querySelector("#matchingRoundProgress"),
  matchingWordBank: document.querySelector("#matchingWordBank"),
  matchingMeaningBank: document.querySelector("#matchingMeaningBank"),
  matchingFeedback: document.querySelector("#matchingFeedback"),
  shuffleSpellingButton: document.querySelector("#shuffleSpellingButton"),
  spellingPosition: document.querySelector("#spellingPosition"),
  spellingProgressBar: document.querySelector("#spellingProgressBar"),
  spellingScore: document.querySelector("#spellingScore"),
  spellingIcon: document.querySelector("#spellingIcon"),
  spellingLesson: document.querySelector("#spellingLesson"),
  spellingAudioButton: document.querySelector("#spellingAudioButton"),
  spellingLettersAudioButton: document.querySelector("#spellingLettersAudioButton"),
  spellingForm: document.querySelector("#spellingForm"),
  spellingInput: document.querySelector("#spellingInput"),
  checkSpellingButton: document.querySelector("#checkSpellingButton"),
  spellingFeedback: document.querySelector("#spellingFeedback"),
  previousSpellingButton: document.querySelector("#previousSpellingButton"),
  nextSpellingButton: document.querySelector("#nextSpellingButton"),
  shuffleSituationButton: document.querySelector("#shuffleSituationButton"),
  situationPosition: document.querySelector("#situationPosition"),
  situationProgressBar: document.querySelector("#situationProgressBar"),
  situationScore: document.querySelector("#situationScore"),
  situationIcon: document.querySelector("#situationIcon"),
  situationLesson: document.querySelector("#situationLesson"),
  situationPrompt: document.querySelector("#situationPrompt"),
  situationOptions: document.querySelector("#situationOptions"),
  situationFeedback: document.querySelector("#situationFeedback"),
  nextSituationButton: document.querySelector("#nextSituationButton"),
  speedSetup: document.querySelector("#speedSetup"),
  speedMissionCards: [...document.querySelectorAll("[data-speed-mission]")],
  speedMissionScores: [1, 2, 3, 4].map(number => document.querySelector(`#speedMissionScore${number}`)),
  startSpeedButton: document.querySelector("#startSpeedButton"),
  speedGame: document.querySelector("#speedGame"),
  speedTimer: document.querySelector("#speedTimer"),
  speedQuestionCount: document.querySelector("#speedQuestionCount"),
  speedLiveScore: document.querySelector("#speedLiveScore"),
  speedProgressBar: document.querySelector("#speedProgressBar"),
  speedQuestionType: document.querySelector("#speedQuestionType"),
  speedAudioButton: document.querySelector("#speedAudioButton"),
  speedPrompt: document.querySelector("#speedPrompt"),
  speedOptions: document.querySelector("#speedOptions"),
  speedResult: document.querySelector("#speedResult"),
  speedResultTitle: document.querySelector("#speedResultTitle"),
  speedResultScore: document.querySelector("#speedResultScore"),
  speedResultMessage: document.querySelector("#speedResultMessage"),
  retrySpeedButton: document.querySelector("#retrySpeedButton"),
  nextSpeedMissionButton: document.querySelector("#nextSpeedMissionButton"),
  toast: document.querySelector("#toast"),
  confetti: document.querySelector("#confetti")
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function populateLessonSelects() {
  const options = LESSONS.map(([lesson, title]) =>
    `<option value="${escapeHtml(lesson)}">Lesson ${escapeHtml(lesson)} · ${escapeHtml(title)}</option>`
  ).join("");
  elements.lessonFilter.insertAdjacentHTML("beforeend", options);
  elements.deckLessonFilter.insertAdjacentHTML("beforeend", options);
}

function renderThemeGrid() {
  elements.themeGrid.innerHTML = THEMES.map(theme => {
    const stateClass = theme.available ? "theme-card--active" : "theme-card--soon";
    const details = theme.available ? `${theme.words} từ · IPA · Audio · Flashcards · Practice Lab` : "Nội dung đang được chuẩn bị";
    return `
      <button class="theme-card ${stateClass}" type="button" data-theme-id="${theme.id}" aria-disabled="${String(!theme.available)}"${theme.available ? ' aria-current="true"' : ""}>
        <span class="theme-card__number">${theme.id}</span>
        <span class="theme-card__copy">
          <small>Theme ${theme.id}</small>
          <strong>${escapeHtml(theme.title)}</strong>
          <span>${escapeHtml(details)}</span>
        </span>
        <span class="theme-card__icon" aria-hidden="true">${theme.icon}</span>
        ${theme.available ? '<span class="theme-card__status">ĐÃ MỞ</span>' : ""}
      </button>
    `;
  }).join("");
}

function getFilteredVocabulary() {
  const query = elements.searchInput.value.trim().toLocaleLowerCase("vi");
  const lesson = elements.lessonFilter.value;
  return state.tableOrder.filter(item => {
    const lessonMatches = lesson === "all" || item.lesson === lesson;
    const haystack = `${item.word} ${item.meaning} ${item.ipa} ${item.title}`.toLocaleLowerCase("vi");
    return lessonMatches && (!query || haystack.includes(query));
  });
}

function renderVocabulary() {
  const items = getFilteredVocabulary();
  elements.resultCount.textContent = items.length;
  elements.emptyState.hidden = items.length > 0;

  elements.vocabTableBody.innerHTML = items.map(item => `
    <tr>
      <td>
        <span class="lesson-badge">
          <strong>Lesson ${escapeHtml(item.lesson)}</strong>
          <small>${escapeHtml(item.title)}</small>
        </span>
      </td>
      <td>
        <div class="word-cell">
          <span class="word-icon" aria-hidden="true">${item.icon}</span>
          <span class="word-main">
            <strong>${escapeHtml(item.word)}</strong>
            <span class="word-number">#${String(item.id).padStart(2, "0")}</span>
          </span>
        </div>
      </td>
      <td><span class="ipa-text">${escapeHtml(item.ipa)}</span></td>
      <td><span class="pos-pill">${escapeHtml(item.pos)}</span></td>
      <td><span class="meaning-text">${escapeHtml(item.meaning)}</span></td>
      <td><span class="example-text">${escapeHtml(item.example)}</span></td>
      <td class="audio-cell">
        <button class="mini-audio" type="button" data-audio="word" data-id="${item.id}" aria-label="Nghe từ ${escapeHtml(item.word)}" title="Nghe từ">🔊</button>
        <button class="mini-audio mini-audio--sentence" type="button" data-audio="example" data-id="${item.id}" aria-label="Nghe câu ví dụ của ${escapeHtml(item.word)}" title="Nghe câu ví dụ">💬</button>
      </td>
    </tr>
  `).join("");

  elements.vocabMobileList.innerHTML = items.map(item => `
    <article class="mobile-vocab-card">
      <span class="mobile-card-icon" aria-hidden="true">${item.icon}</span>
      <div>
        <div class="mobile-word-head">
          <strong>${escapeHtml(item.word)}</strong>
          <span class="ipa-text">${escapeHtml(item.ipa)}</span>
          <span class="pos-pill">${escapeHtml(item.pos)}</span>
        </div>
        <p class="mobile-meta">Lesson ${escapeHtml(item.lesson)} · ${escapeHtml(item.title)}</p>
        <p class="mobile-meaning">${escapeHtml(item.meaning)}</p>
      </div>
      <div class="mobile-audio-stack">
        <button class="mini-audio" type="button" data-audio="word" data-id="${item.id}" aria-label="Nghe từ ${escapeHtml(item.word)}">🔊</button>
        <button class="mini-audio mini-audio--sentence" type="button" data-audio="example" data-id="${item.id}" aria-label="Nghe câu ví dụ của ${escapeHtml(item.word)}">💬</button>
      </div>
      <p class="mobile-example">“${escapeHtml(item.example)}”</p>
    </article>
  `).join("");
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function numericSet(value) {
  return new Set((Array.isArray(value) ? value : []).map(Number).filter(number => Number.isInteger(number) && number >= 1 && number <= VOCABULARY.length));
}

function createPracticeState(progress = {}) {
  const matching = progress.matching || {};
  const spelling = progress.spelling || {};
  const situation = progress.situation || {};
  const speed = progress.speed || {};
  return {
    activeMode: "matching",
    matchingRound: 0,
    matchingSelectedId: null,
    matchingOrders: {},
    matchingCompleted: numericSet(matching.completedWords),
    matchingRounds: numericSet(matching.roundsCompleted),
    spellingOrder: VOCABULARY.map(item => item.id),
    spellingIndex: 0,
    spellingCompleted: numericSet(spelling.completedWords),
    spellingCorrect: numericSet(spelling.correctWords),
    spellingFeedback: "Nhấn nút loa, nghe kỹ rồi nhập đáp án.",
    spellingFeedbackType: "",
    situationOrder: VOCABULARY.map(item => item.id),
    situationIndex: 0,
    situationCompleted: numericSet(situation.completedWords),
    situationCorrect: numericSet(situation.correctWords),
    situationOptions: {},
    situationLocked: false,
    situationSelectedId: null,
    speedCompleted: numericSet(speed.completedWords),
    speedBestScores: { ...(speed.bestScores || {}) },
    speedMission: 0,
    speedQuestions: [],
    speedIndex: 0,
    speedScore: 0,
    speedTimeLeft: 90,
    speedStartedAt: null,
    speedAnswered: new Set(),
    speedSelectedId: null,
    speedLocked: false,
    speedActive: false,
    speedShowingResult: false,
    speedTimedOut: false,
    speedTimerId: null
  };
}

function practiceProgressPayload() {
  return {
    matching: {
      completedWords: [...state.practice.matchingCompleted].sort((a, b) => a - b),
      roundsCompleted: [...state.practice.matchingRounds].sort((a, b) => a - b)
    },
    spelling: {
      completedWords: [...state.practice.spellingCompleted].sort((a, b) => a - b),
      correctWords: [...state.practice.spellingCorrect].sort((a, b) => a - b)
    },
    situation: {
      completedWords: [...state.practice.situationCompleted].sort((a, b) => a - b),
      correctWords: [...state.practice.situationCorrect].sort((a, b) => a - b)
    },
    speed: {
      completedWords: [...state.practice.speedCompleted].sort((a, b) => a - b),
      bestScores: { ...state.practice.speedBestScores }
    }
  };
}

function recordPractice(action) {
  updatePracticeProgress();
  saveProgress({
    themeId: 1,
    coverageCount: 0,
    ...action
  });
}

function updatePracticeProgress() {
  const counts = [
    state.practice.matchingCompleted.size,
    state.practice.spellingCompleted.size,
    state.practice.situationCompleted.size,
    state.practice.speedCompleted.size
  ];
  const complete = counts.reduce((sum, count) => sum + count, 0);
  const percent = Math.round((complete / (VOCABULARY.length * 4)) * 100);
  elements.practiceOverallLabel.textContent = `${complete}/${VOCABULARY.length * 4} lượt từ đã hoàn thành`;
  elements.practiceOverallBar.style.width = `${percent}%`;
  elements.practiceOverallTrack.setAttribute("aria-valuenow", String(complete));
  elements.matchingCoverage.textContent = `${counts[0]}/${VOCABULARY.length}`;
  elements.spellingCoverage.textContent = `${counts[1]}/${VOCABULARY.length}`;
  elements.situationCoverage.textContent = `${counts[2]}/${VOCABULARY.length}`;
  elements.speedCoverage.textContent = `${counts[3]}/${VOCABULARY.length}`;
  elements.speedMissionScores.forEach((element, index) => {
    const score = state.practice.speedBestScores[`mission${index + 1}`];
    element.textContent = Number.isFinite(Number(score)) ? `Kỷ lục ${score}/15` : "Chưa làm";
  });
}

function populateMatchingRounds() {
  elements.matchingRoundSelect.innerHTML = Array.from({ length: Math.ceil(VOCABULARY.length / 6) }, (_, index) =>
    `<option value="${index}">Bộ ${index + 1} · Từ ${String(index * 6 + 1).padStart(2, "0")}–${String(Math.min(index * 6 + 6, VOCABULARY.length)).padStart(2, "0")}</option>`
  ).join("");
}

function matchingRoundItems() {
  const start = state.practice.matchingRound * 6;
  return VOCABULARY.slice(start, start + 6);
}

function matchingWordOrder() {
  const round = state.practice.matchingRound;
  if (!state.practice.matchingOrders[round]) {
    state.practice.matchingOrders[round] = shuffle(matchingRoundItems().map(item => item.id));
  }
  return state.practice.matchingOrders[round];
}

function renderMatching() {
  const items = matchingRoundItems();
  const order = matchingWordOrder();
  const matched = items.filter(item => state.practice.matchingCompleted.has(item.id)).length;
  elements.matchingRoundSelect.value = String(state.practice.matchingRound);
  elements.matchingRoundProgress.textContent = `${matched}/${items.length}`;
  elements.matchingWordBank.innerHTML = order.map(id => VOCABULARY.find(item => item.id === id))
    .filter(item => item && !state.practice.matchingCompleted.has(item.id))
    .map(item => `
      <button class="matching-word${state.practice.matchingSelectedId === item.id ? " is-selected" : ""}" type="button" draggable="true" data-match-word="${item.id}">
        <span>${item.icon}</span><strong>${escapeHtml(item.word)}</strong><small>${escapeHtml(item.ipa)}</small>
      </button>
    `).join("") || '<div class="matching-complete-badge">🎉 Hoàn thành bộ từ!</div>';
  elements.matchingMeaningBank.innerHTML = items.map(item => {
    const isMatched = state.practice.matchingCompleted.has(item.id);
    return `
      <button class="matching-meaning${isMatched ? " is-matched" : ""}" type="button" data-match-target="${item.id}" ${isMatched ? "disabled" : ""}>
        <span class="matching-drop-icon">${isMatched ? "✅" : "⬇️"}</span>
        <span><strong>${escapeHtml(item.meaning)}</strong>${isMatched ? `<small>${escapeHtml(item.word)}</small>` : "<small>Thả từ vào đây</small>"}</span>
      </button>
    `;
  }).join("");
  if (matched === items.length) {
    elements.matchingFeedback.className = "practice-feedback is-correct";
    elements.matchingFeedback.textContent = `Xuất sắc! Em đã nối đúng toàn bộ Bộ ${state.practice.matchingRound + 1}.`;
  } else {
    elements.matchingFeedback.className = "practice-feedback";
    elements.matchingFeedback.textContent = state.practice.matchingSelectedId
      ? `Đã chọn “${VOCABULARY.find(item => item.id === state.practice.matchingSelectedId)?.word}”. Bây giờ chọn nghĩa phù hợp.`
      : "Kéo một thẻ từ vào nghĩa đúng hoặc chạm để chọn.";
  }
}

function tryMatch(wordId, targetId) {
  const word = VOCABULARY.find(item => item.id === Number(wordId));
  const target = elements.matchingMeaningBank.querySelector(`[data-match-target="${Number(targetId)}"]`);
  if (!word || state.practice.matchingCompleted.has(word.id)) return;
  if (word.id !== Number(targetId)) {
    target?.classList.add("is-wrong");
    elements.matchingFeedback.className = "practice-feedback is-wrong";
    elements.matchingFeedback.textContent = `Chưa đúng. “${word.word}” không có nghĩa này — thử lại nhé!`;
    setTimeout(() => target?.classList.remove("is-wrong"), 520);
    return;
  }
  state.practice.matchingCompleted.add(word.id);
  state.practice.matchingSelectedId = null;
  const items = matchingRoundItems();
  const completed = items.every(item => state.practice.matchingCompleted.has(item.id));
  if (completed) {
    state.practice.matchingRounds.add(state.practice.matchingRound + 1);
    recordPractice({
      type: "practice-matching",
      activityId: `theme1-practice-matching-round-${state.practice.matchingRound + 1}`,
      exercise: "matching",
      exerciseTitle: "Nối từ với nghĩa",
      word: `Bộ ${state.practice.matchingRound + 1}: từ ${items[0].id}–${items.at(-1).id}`,
      lesson: "Theme 1",
      status: "completed",
      score: items.length,
      total: items.length,
      coverageCount: state.practice.matchingCompleted.size
    });
    celebrate();
    showToast(`Hoàn thành Bộ ${state.practice.matchingRound + 1}! ${state.practice.matchingCompleted.size}/60 từ đã được nối 🎉`);
  }
  renderMatching();
  updatePracticeProgress();
}

function currentSpellingItem() {
  const id = state.practice.spellingOrder[state.practice.spellingIndex] || 1;
  return VOCABULARY.find(item => item.id === id) || VOCABULARY[0];
}

function normalizeAnswer(value) {
  return String(value || "")
    .toLocaleLowerCase("en")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function acceptedSpellings(item) {
  const answers = [item.word, item.speak];
  if (item.id === 21) answers.push("measure measurement", "measure", "measurement");
  if (item.id === 38) answers.push("PIN", "Personal Identification Number", "PIN Personal Identification Number");
  return new Set(answers.map(normalizeAnswer));
}

function spellOutText(item) {
  const source = item.id === 38
    ? "PIN"
    : item.word.replace(/\([^)]*\)/g, "").replaceAll("/", " ").trim();
  return [...source.toLocaleLowerCase("en")]
    .map(character => {
      if (/[a-z0-9]/.test(character)) return character;
      if (character === " ") return "space";
      if (character === "-") return "hyphen";
      return "";
    })
    .filter(Boolean)
    .join(", ");
}

function renderSpelling() {
  const item = currentSpellingItem();
  const position = state.practice.spellingIndex + 1;
  elements.spellingPosition.textContent = `Từ ${position}/${VOCABULARY.length}`;
  elements.spellingProgressBar.style.width = `${Math.round((position / VOCABULARY.length) * 100)}%`;
  elements.spellingScore.textContent = `${state.practice.spellingCorrect.size} đúng`;
  elements.spellingIcon.textContent = item.icon;
  elements.spellingLesson.textContent = `Lesson ${item.lesson}`;
  elements.spellingFeedback.className = `practice-feedback${state.practice.spellingFeedbackType ? ` is-${state.practice.spellingFeedbackType}` : ""}`;
  elements.spellingFeedback.textContent = state.practice.spellingFeedback;
  elements.spellingInput.value = "";
  elements.previousSpellingButton.disabled = state.practice.spellingIndex === 0;
  elements.nextSpellingButton.disabled = state.practice.spellingIndex === VOCABULARY.length - 1;
}

function moveSpelling(direction) {
  state.practice.spellingIndex = Math.max(0, Math.min(VOCABULARY.length - 1, state.practice.spellingIndex + direction));
  state.practice.spellingFeedback = "Nhấn nút loa, nghe kỹ rồi nhập đáp án.";
  state.practice.spellingFeedbackType = "";
  renderSpelling();
}

function checkSpelling(event) {
  event.preventDefault();
  const item = currentSpellingItem();
  const answer = normalizeAnswer(elements.spellingInput.value);
  const correct = acceptedSpellings(item).has(answer);
  state.practice.spellingCompleted.add(item.id);
  if (correct) state.practice.spellingCorrect.add(item.id);
  state.practice.spellingFeedbackType = correct ? "correct" : "wrong";
  state.practice.spellingFeedback = correct
    ? `Chính xác! “${item.word}” ${item.ipa} · ${item.meaning}`
    : "Chưa chính xác. Em có thể nghe lại không giới hạn rồi thử lần nữa.";
  recordPractice({
    type: "practice-spelling",
    activityId: `theme1-practice-spelling-word-${item.id}`,
    exercise: "spelling",
    exerciseTitle: "Nghe audio và nhập từ",
    wordId: item.id,
    word: item.word,
    lesson: item.lesson,
    status: correct ? "correct" : "incorrect",
    score: correct ? 1 : 0,
    total: 1,
    coverageCount: state.practice.spellingCompleted.size
  });
  elements.spellingScore.textContent = `${state.practice.spellingCorrect.size} đúng`;
  elements.spellingFeedback.className = `practice-feedback is-${state.practice.spellingFeedbackType}`;
  elements.spellingFeedback.textContent = state.practice.spellingFeedback;
  if (correct) {
    celebrate();
    elements.spellingInput.value = "";
  }
  updatePracticeProgress();
}

function distractorItems(item, count = 3) {
  const sameForm = VOCABULARY.filter(candidate => candidate.id !== item.id && candidate.pos === item.pos);
  const others = VOCABULARY.filter(candidate => candidate.id !== item.id && candidate.pos !== item.pos);
  return shuffle([...sameForm, ...others]).slice(0, count);
}

function currentSituationItem() {
  const id = state.practice.situationOrder[state.practice.situationIndex] || 1;
  return VOCABULARY.find(item => item.id === id) || VOCABULARY[0];
}

function situationOptionIds(item) {
  if (!state.practice.situationOptions[item.id]) {
    state.practice.situationOptions[item.id] = shuffle([item, ...distractorItems(item)]).map(option => option.id);
  }
  return state.practice.situationOptions[item.id];
}

function renderSituation() {
  const item = currentSituationItem();
  const position = state.practice.situationIndex + 1;
  elements.situationPosition.textContent = `Câu ${position}/${VOCABULARY.length}`;
  elements.situationProgressBar.style.width = `${Math.round((position / VOCABULARY.length) * 100)}%`;
  elements.situationScore.textContent = `${state.practice.situationCorrect.size} đúng`;
  elements.situationIcon.textContent = item.icon;
  elements.situationLesson.textContent = `Lesson ${item.lesson}`;
  elements.situationPrompt.textContent = SITUATIONS[item.id - 1];
  elements.situationOptions.innerHTML = situationOptionIds(item).map(id => {
    const option = VOCABULARY.find(candidate => candidate.id === id);
    const classes = ["situation-option"];
    if (state.practice.situationLocked && id === item.id) classes.push("is-correct");
    if (state.practice.situationLocked && id === state.practice.situationSelectedId && id !== item.id) classes.push("is-wrong");
    return `<button class="${classes.join(" ")}" type="button" data-situation-answer="${id}" ${state.practice.situationLocked ? "disabled" : ""}><span>${option.icon}</span><strong>${escapeHtml(option.word)}</strong></button>`;
  }).join("");
  if (!state.practice.situationLocked) {
    elements.situationFeedback.className = "practice-feedback";
    elements.situationFeedback.textContent = "Đọc tình huống và chọn đáp án phù hợp nhất.";
  }
  elements.nextSituationButton.disabled = !state.practice.situationLocked;
  elements.nextSituationButton.textContent = state.practice.situationIndex === VOCABULARY.length - 1 ? "Hoàn thành ✓" : "Câu tiếp theo →";
}

function answerSituation(answerId) {
  if (state.practice.situationLocked) return;
  const item = currentSituationItem();
  const selectedId = Number(answerId);
  const correct = selectedId === item.id;
  state.practice.situationLocked = true;
  state.practice.situationSelectedId = selectedId;
  state.practice.situationCompleted.add(item.id);
  if (correct) state.practice.situationCorrect.add(item.id);
  elements.situationFeedback.className = `practice-feedback is-${correct ? "correct" : "wrong"}`;
  elements.situationFeedback.textContent = correct
    ? `Chính xác! “${item.word}” phù hợp nhất với tình huống này.`
    : `Đáp án đúng là “${item.word}” — ${item.meaning}.`;
  recordPractice({
    type: "practice-situation",
    activityId: `theme1-practice-situation-word-${item.id}`,
    exercise: "situation",
    exerciseTitle: "Chọn từ theo tình huống",
    wordId: item.id,
    word: item.word,
    lesson: item.lesson,
    status: correct ? "correct" : "incorrect",
    score: correct ? 1 : 0,
    total: 1,
    coverageCount: state.practice.situationCompleted.size
  });
  if (correct) celebrate();
  renderSituation();
  elements.situationFeedback.className = `practice-feedback is-${correct ? "correct" : "wrong"}`;
  elements.situationFeedback.textContent = correct
    ? `Chính xác! “${item.word}” phù hợp nhất với tình huống này.`
    : `Đáp án đúng là “${item.word}” — ${item.meaning}.`;
  updatePracticeProgress();
}

function nextSituation() {
  if (!state.practice.situationLocked && state.practice.situationIndex < VOCABULARY.length - 1) return;
  if (state.practice.situationIndex === VOCABULARY.length - 1) {
    if (state.practice.situationCompleted.size === VOCABULARY.length) {
      celebrate();
      showToast(`Hoàn thành 60 tình huống với ${state.practice.situationCorrect.size} từ đúng! 🌟`);
    } else {
      showToast(`Em đã đi đến cuối bộ. Đã làm ${state.practice.situationCompleted.size}/60 tình huống.`);
    }
    return;
  }
  state.practice.situationIndex += 1;
  state.practice.situationLocked = false;
  state.practice.situationSelectedId = null;
  renderSituation();
}

function speedMissionItems(mission) {
  return VOCABULARY.slice(mission * 15, mission * 15 + 15);
}

function buildSpeedQuestion(item) {
  const mode = item.id % 3;
  const optionItems = shuffle([item, ...distractorItems(item)]);
  if (mode === 0) {
    return {
      item,
      type: "MEANING CHALLENGE",
      prompt: `Nghĩa tiếng Việt nào phù hợp với “${item.word}”?`,
      audio: false,
      options: optionItems.map(option => ({ id: option.id, label: option.meaning, icon: option.icon }))
    };
  }
  if (mode === 1) {
    return {
      item,
      type: "WORD CHALLENGE",
      prompt: `Chọn từ có nghĩa: “${item.meaning}”`,
      audio: false,
      options: optionItems.map(option => ({ id: option.id, label: option.word, icon: option.icon }))
    };
  }
  return {
    item,
    type: "AUDIO CHALLENGE",
    prompt: "Nghe audio và chọn từ được phát âm.",
    audio: true,
    options: optionItems.map(option => ({ id: option.id, label: option.word, icon: option.icon }))
  };
}

function selectSpeedMission(mission) {
  if (state.practice.speedActive) return;
  state.practice.speedMission = Number(mission);
  state.practice.speedShowingResult = false;
  elements.speedMissionCards.forEach(card => card.classList.toggle("is-selected", Number(card.dataset.speedMission) === state.practice.speedMission));
  elements.startSpeedButton.textContent = `⚡ Bắt đầu Mission ${state.practice.speedMission + 1}`;
  elements.speedSetup.hidden = false;
  elements.speedGame.hidden = true;
  elements.speedResult.hidden = true;
}

function startSpeedQuiz() {
  clearInterval(state.practice.speedTimerId);
  state.practice.speedQuestions = shuffle(speedMissionItems(state.practice.speedMission)).map(buildSpeedQuestion);
  state.practice.speedIndex = 0;
  state.practice.speedScore = 0;
  state.practice.speedTimeLeft = 90;
  state.practice.speedStartedAt = Date.now();
  state.practice.speedAnswered = new Set();
  state.practice.speedSelectedId = null;
  state.practice.speedLocked = false;
  state.practice.speedActive = true;
  state.practice.speedShowingResult = false;
  state.practice.speedTimedOut = false;
  elements.speedSetup.hidden = true;
  elements.speedResult.hidden = true;
  elements.speedGame.hidden = false;
  renderSpeedQuestion();
  state.practice.speedTimerId = setInterval(() => {
    state.practice.speedTimeLeft -= 1;
    elements.speedTimer.textContent = state.practice.speedTimeLeft;
    elements.speedTimer.parentElement.classList.toggle("is-urgent", state.practice.speedTimeLeft <= 15);
    if (state.practice.speedTimeLeft <= 0) finishSpeedQuiz(true);
  }, 1000);
}

function currentSpeedQuestion() {
  return state.practice.speedQuestions[state.practice.speedIndex] || null;
}

function renderSpeedQuestion() {
  const question = currentSpeedQuestion();
  if (!question) return;
  elements.speedTimer.textContent = state.practice.speedTimeLeft;
  elements.speedQuestionCount.textContent = `${state.practice.speedIndex + 1}/15`;
  elements.speedLiveScore.textContent = state.practice.speedScore;
  elements.speedProgressBar.style.width = `${Math.round((state.practice.speedIndex / 15) * 100)}%`;
  elements.speedQuestionType.textContent = question.type;
  elements.speedPrompt.textContent = question.prompt;
  elements.speedAudioButton.hidden = !question.audio;
  elements.speedOptions.innerHTML = question.options.map(option => {
    const classes = ["speed-option"];
    if (state.practice.speedLocked && option.id === question.item.id) classes.push("is-correct");
    if (state.practice.speedLocked && option.id === state.practice.speedSelectedId && option.id !== question.item.id) classes.push("is-wrong");
    return `<button class="${classes.join(" ")}" type="button" data-speed-answer="${option.id}" ${state.practice.speedLocked ? "disabled" : ""}><span>${option.icon}</span><strong>${escapeHtml(option.label)}</strong></button>`;
  }).join("");
  if (question.audio && !state.practice.speedLocked) speak(question.item.speak, { rate: 0.82 });
}

function answerSpeedQuestion(answerId) {
  if (!state.practice.speedActive || state.practice.speedLocked) return;
  const question = currentSpeedQuestion();
  if (!question) return;
  const selectedId = Number(answerId);
  state.practice.speedLocked = true;
  state.practice.speedSelectedId = selectedId;
  state.practice.speedAnswered.add(question.item.id);
  state.practice.speedCompleted.add(question.item.id);
  if (selectedId === question.item.id) state.practice.speedScore += 1;
  renderSpeedQuestion();
  updatePracticeProgress();
  setTimeout(() => {
    if (!state.practice.speedActive) return;
    if (state.practice.speedIndex >= state.practice.speedQuestions.length - 1) {
      finishSpeedQuiz(false);
      return;
    }
    state.practice.speedIndex += 1;
    state.practice.speedLocked = false;
    state.practice.speedSelectedId = null;
    renderSpeedQuestion();
  }, 520);
}

function finishSpeedQuiz(timedOut) {
  if (!state.practice.speedActive) return;
  clearInterval(state.practice.speedTimerId);
  state.practice.speedTimerId = null;
  state.practice.speedActive = false;
  state.practice.speedShowingResult = true;
  state.practice.speedTimedOut = timedOut;
  const missionKey = `mission${state.practice.speedMission + 1}`;
  const previousBest = Number(state.practice.speedBestScores[missionKey]) || 0;
  state.practice.speedBestScores[missionKey] = Math.max(previousBest, state.practice.speedScore);
  const duration = Math.min(90, Math.max(1, Math.round((Date.now() - state.practice.speedStartedAt) / 1000)));
  elements.speedGame.hidden = true;
  elements.speedResult.hidden = false;
  elements.speedResultScore.textContent = `${state.practice.speedScore}/15`;
  elements.speedResultTitle.textContent = state.practice.speedScore >= 13 ? "Siêu tốc độ!" : state.practice.speedScore >= 9 ? "Làm rất tốt!" : "Tiếp tục luyện nhé!";
  elements.speedResultMessage.textContent = timedOut
    ? `Hết 90 giây · Em đã trả lời ${state.practice.speedAnswered.size}/15 câu.`
    : `Hoàn thành trong ${duration} giây · Kỷ lục Mission ${state.practice.speedMission + 1}: ${state.practice.speedBestScores[missionKey]}/15.`;
  elements.nextSpeedMissionButton.hidden = state.practice.speedMission === 3;
  recordPractice({
    type: "practice-speed",
    activityId: `theme1-practice-speed-mission-${state.practice.speedMission + 1}`,
    exercise: "speed",
    exerciseTitle: `Speed Quiz Mission ${state.practice.speedMission + 1}`,
    word: `Mission ${state.practice.speedMission + 1} · 15 từ`,
    lesson: "Theme 1",
    status: timedOut ? "timed-out" : "completed",
    score: state.practice.speedScore,
    total: 15,
    durationSeconds: duration,
    completed: state.practice.speedAnswered.size,
    coverageCount: state.practice.speedCompleted.size
  });
  if (state.practice.speedScore >= 9) celebrate();
  updatePracticeProgress();
}

function switchPracticeMode(mode) {
  state.practice.activeMode = mode;
  elements.practiceModeButtons.forEach(button => button.classList.toggle("is-active", button.dataset.practiceMode === mode));
  elements.practiceModePanels.forEach(panel => {
    const active = panel.dataset.practiceModePanel === mode;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  if (mode === "matching") renderMatching();
  if (mode === "spelling") renderSpelling();
  if (mode === "situation") renderSituation();
  if (mode === "speed") selectSpeedMission(state.practice.speedMission);
  updatePracticeProgress();
}

function initializePractice() {
  populateMatchingRounds();
  renderMatching();
  renderSpelling();
  renderSituation();
  selectSpeedMission(0);
  updatePracticeProgress();
}

function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  state.voices = window.speechSynthesis.getVoices();
}

function chooseBritishVoice() {
  const englishVoices = state.voices.filter(voice => voice.lang.toLowerCase().startsWith("en"));
  return englishVoices.find(voice => voice.lang.toLowerCase() === "en-gb")
    || englishVoices.find(voice => /uk|british|england/i.test(voice.name))
    || englishVoices[0]
    || null;
}

function speak(text, options = {}) {
  if (!("speechSynthesis" in window)) {
    showToast("Trình duyệt này chưa hỗ trợ phát âm. Hãy thử Chrome, Edge hoặc Safari nhé! 🎧");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = options.rate ?? Number(elements.speechRate.value || 0.88);
  utterance.pitch = 1.03;
  const voice = chooseBritishVoice();
  if (voice) utterance.voice = voice;
  if (options.button) {
    options.button.classList.add("is-speaking");
    utterance.onend = () => options.button.classList.remove("is-speaking");
    utterance.onerror = () => options.button.classList.remove("is-speaking");
  }
  window.speechSynthesis.speak(utterance);
}

function handleAudioClick(event) {
  const button = event.target.closest("[data-audio]");
  if (!button) return;
  const item = VOCABULARY.find(entry => entry.id === Number(button.dataset.id));
  if (!item) return;
  const text = button.dataset.audio === "example" ? item.example : item.speak;
  speak(text, { button });
}

function switchTab(tabName) {
  elements.tabs.forEach(button => {
    const active = button.dataset.tab === tabName;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  elements.panels.forEach(panel => {
    const active = panel.dataset.panel === tabName;
    panel.classList.toggle("is-active", active);
    panel.hidden = !active;
  });
  if (tabName === "flashcards") renderCard();
  if (tabName === "practice") switchPracticeMode(state.practice.activeMode);
}

function rebuildDeck(shuffleDeck = false) {
  const lesson = elements.deckLessonFilter.value;
  const filtered = VOCABULARY.filter(item => lesson === "all" || item.lesson === lesson);
  state.deck = shuffleDeck ? shuffle(filtered) : [...filtered];
  state.cardIndex = 0;
  state.flipped = false;
  renderCard();
}

function currentCard() {
  return state.deck[state.cardIndex] || VOCABULARY[0];
}

function renderCard() {
  const item = currentCard();
  elements.flashcard.classList.toggle("is-flipped", state.flipped);
  elements.flashcard.setAttribute("aria-pressed", String(state.flipped));
  elements.cardIcon.textContent = item.icon;
  elements.cardBackIcon.textContent = item.icon;
  elements.cardWord.textContent = item.word;
  elements.cardIpa.textContent = item.ipa;
  elements.cardPos.textContent = item.pos;
  elements.cardMeaning.textContent = item.meaning;
  elements.cardBackLesson.textContent = `Lesson ${item.lesson} · ${item.title}`;
  elements.cardPosition.textContent = state.cardIndex + 1;
  elements.deckTotal.textContent = state.deck.length;
  elements.cardLessonBadge.textContent = `Lesson ${item.lesson}`;
  elements.previousCardButton.disabled = state.deck.length <= 1;
  elements.nextCardButton.disabled = state.deck.length <= 1;
  updateProgress();
}

function flipCard() {
  state.flipped = !state.flipped;
  renderCard();
}

function moveCard(direction) {
  if (!state.deck.length) return;
  state.cardIndex = (state.cardIndex + direction + state.deck.length) % state.deck.length;
  state.flipped = false;
  renderCard();
}

function markCard(status) {
  const item = currentCard();
  if (status === "known") {
    state.known.add(item.id);
    state.review.delete(item.id);
    celebrate();
    showToast(`Tuyệt vời! Bạn đã nhớ “${item.word}” 🎉`);
  } else {
    state.review.add(item.id);
    state.known.delete(item.id);
    showToast(`Đã thêm “${item.word}” vào danh sách ôn lại 🔁`);
  }
  saveProgress({
    type: "flashcard",
    themeId: 1,
    wordId: item.id,
    word: item.word,
    lesson: item.lesson,
    status
  });
  updateProgress();
  moveCard(1);
}

function updateProgress() {
  const total = VOCABULARY.length;
  const learned = state.known.size;
  const reviewed = state.review.size;
  const practiced = learned + reviewed;
  const untouched = Math.max(0, total - learned - reviewed);
  const masteryPercent = Math.round((learned / total) * 100);
  const practicePercent = Math.round((practiced / total) * 100);
  elements.knownCount.textContent = learned;
  elements.reviewCount.textContent = reviewed;
  elements.newCount.textContent = untouched;
  elements.progressPercent.textContent = `${masteryPercent}%`;
  elements.progressRing.style.setProperty("--progress", `${masteryPercent * 3.6}deg`);
  elements.hubProgressLabel.textContent = `${practiced}/${total} thẻ`;
  elements.hubProgressBar.style.width = `${practicePercent}%`;
  elements.hubProgressTrack.setAttribute("aria-valuenow", String(practiced));
  elements.hubMasteryLabel.textContent = practiced
    ? `${learned} từ đã nhớ · ${reviewed} từ cần ôn lại`
    : "0 từ đã nhớ · Bắt đầu ngay nhé!";
  elements.deckProgressLabel.textContent = `${practiced}/${total}`;
  elements.deckProgressBar.style.width = `${practicePercent}%`;
  elements.deckProgressTrack.setAttribute("aria-valuenow", String(practiced));
}

function saveProgress(action = null) {
  if (!state.studentUid) return;
  const progress = {
    known: [...state.known],
    review: [...state.review],
    practice: practiceProgressPayload()
  };
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}:${state.studentUid}`, JSON.stringify(progress));
  } catch {
    // Progress remains available for the current session if storage is blocked.
  }
  document.dispatchEvent(new CustomEvent("oic:progress-changed", {
    detail: {
      ...progress,
      practiced: progress.known.length + progress.review.length,
      action
    }
  }));
}

function setStudentSession({ uid, known = [], review = [], practice = {} }) {
  state.studentUid = uid;
  state.known = new Set(Array.isArray(known) ? known : []);
  state.review = new Set(Array.isArray(review) ? review : []);
  clearInterval(state.practice.speedTimerId);
  state.practice = createPracticeState(practice);
  const firstMatchingRound = Array.from({ length: 10 }, (_, index) => index + 1).find(round => !state.practice.matchingRounds.has(round));
  state.practice.matchingRound = firstMatchingRound ? firstMatchingRound - 1 : 0;
  const firstSpelling = state.practice.spellingOrder.findIndex(id => !state.practice.spellingCompleted.has(id));
  state.practice.spellingIndex = firstSpelling >= 0 ? firstSpelling : 0;
  const firstSituation = state.practice.situationOrder.findIndex(id => !state.practice.situationCompleted.has(id));
  state.practice.situationIndex = firstSituation >= 0 ? firstSituation : 0;
  updateProgress();
  renderCard();
  initializePractice();
}

function clearStudentSession() {
  clearInterval(state.practice.speedTimerId);
  state.studentUid = null;
  state.known = new Set();
  state.review = new Set();
  state.practice = createPracticeState();
  updateProgress();
  initializePractice();
}

function resetProgress() {
  state.known.clear();
  state.review.clear();
  saveProgress({ type: "reset", themeId: 1, status: "reset" });
  updateProgress();
  showToast("Đã xóa tiến độ. Mình bắt đầu lại thật vui nhé! 🌱");
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2600);
}

function celebrate() {
  const symbols = ["⭐", "✨", "🌈", "💜", "🎉", "🌟", "🦄"];
  for (let index = 0; index < 18; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = symbols[index % symbols.length];
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    elements.confetti.appendChild(piece);
    setTimeout(() => piece.remove(), 2100);
  }
}

function bindEvents() {
  elements.themeGrid.addEventListener("click", event => {
    const card = event.target.closest("[data-theme-id]");
    if (!card) return;
    const theme = THEMES.find(item => item.id === Number(card.dataset.themeId));
    if (!theme) return;
    if (!theme.available) {
      showToast(`Theme ${theme.id} đang được chuẩn bị. Hẹn bạn ở bản cập nhật tiếp theo! ${theme.icon}`);
      return;
    }
    document.querySelector("#theme1").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Theme 1 đã sẵn sàng — chọn Bảng từ vựng, Flashcards hoặc Practice Lab nhé! 🚀");
  });
  elements.tabs.forEach(button => button.addEventListener("click", () => switchTab(button.dataset.tab)));
  elements.searchInput.addEventListener("input", renderVocabulary);
  elements.lessonFilter.addEventListener("change", renderVocabulary);
  elements.vocabTableBody.addEventListener("click", handleAudioClick);
  elements.vocabMobileList.addEventListener("click", handleAudioClick);

  elements.shuffleTableButton.addEventListener("click", () => {
    state.tableOrder = shuffle(state.tableOrder);
    renderVocabulary();
    showToast("Đã xáo trộn thứ tự bảng từ vựng 🔀");
  });
  elements.resetTableButton.addEventListener("click", () => {
    state.tableOrder = [...VOCABULARY];
    renderVocabulary();
    showToast("Đã trở về thứ tự bài học ban đầu ↩️");
  });

  elements.deckLessonFilter.addEventListener("change", () => rebuildDeck(false));
  elements.shuffleDeckButton.addEventListener("click", () => {
    rebuildDeck(true);
    showToast("Bộ flashcards đã được xáo trộn 🔀");
  });
  elements.resetProgressButton.addEventListener("click", resetProgress);
  elements.flashcard.addEventListener("click", flipCard);
  elements.previousCardButton.addEventListener("click", () => moveCard(-1));
  elements.nextCardButton.addEventListener("click", () => moveCard(1));
  elements.reviewButton.addEventListener("click", () => markCard("review"));
  elements.knownButton.addEventListener("click", () => markCard("known"));
  elements.cardAudioButton.addEventListener("click", event => {
    event.stopPropagation();
    speak(currentCard().speak, { button: elements.cardAudioButton });
  });
  elements.cardSlowAudioButton.addEventListener("click", event => {
    event.stopPropagation();
    speak(currentCard().speak, { rate: 0.58, button: elements.cardSlowAudioButton });
  });

  elements.practiceModeButtons.forEach(button => button.addEventListener("click", () => switchPracticeMode(button.dataset.practiceMode)));
  elements.matchingRoundSelect.addEventListener("change", () => {
    state.practice.matchingRound = Number(elements.matchingRoundSelect.value);
    state.practice.matchingSelectedId = null;
    renderMatching();
  });
  elements.shuffleMatchingButton.addEventListener("click", () => {
    state.practice.matchingOrders[state.practice.matchingRound] = shuffle(matchingRoundItems().map(item => item.id));
    state.practice.matchingSelectedId = null;
    renderMatching();
    showToast("Đã xáo trộn thẻ từ trong bộ hiện tại 🔀");
  });
  elements.matchingWordBank.addEventListener("click", event => {
    const card = event.target.closest("[data-match-word]");
    if (!card) return;
    state.practice.matchingSelectedId = Number(card.dataset.matchWord);
    renderMatching();
  });
  elements.matchingWordBank.addEventListener("dragstart", event => {
    const card = event.target.closest("[data-match-word]");
    if (!card) return;
    const id = card.dataset.matchWord;
    state.practice.matchingSelectedId = Number(id);
    event.dataTransfer?.setData("text/plain", id);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    card.classList.add("is-dragging");
  });
  elements.matchingWordBank.addEventListener("dragend", event => event.target.closest("[data-match-word]")?.classList.remove("is-dragging"));
  elements.matchingMeaningBank.addEventListener("dragover", event => {
    const target = event.target.closest("[data-match-target]");
    if (!target || target.disabled) return;
    event.preventDefault();
    target.classList.add("is-dragover");
  });
  elements.matchingMeaningBank.addEventListener("dragleave", event => event.target.closest("[data-match-target]")?.classList.remove("is-dragover"));
  elements.matchingMeaningBank.addEventListener("drop", event => {
    const target = event.target.closest("[data-match-target]");
    if (!target || target.disabled) return;
    event.preventDefault();
    target.classList.remove("is-dragover");
    const wordId = event.dataTransfer?.getData("text/plain") || state.practice.matchingSelectedId;
    tryMatch(wordId, target.dataset.matchTarget);
  });
  elements.matchingMeaningBank.addEventListener("click", event => {
    const target = event.target.closest("[data-match-target]");
    if (!target || target.disabled || !state.practice.matchingSelectedId) return;
    tryMatch(state.practice.matchingSelectedId, target.dataset.matchTarget);
  });

  elements.spellingAudioButton.addEventListener("click", () => speak(currentSpellingItem().speak, { button: elements.spellingAudioButton }));
  elements.spellingLettersAudioButton.addEventListener("click", () => speak(spellOutText(currentSpellingItem()), { rate: 0.55, button: elements.spellingLettersAudioButton }));
  elements.spellingForm.addEventListener("submit", checkSpelling);
  elements.previousSpellingButton.addEventListener("click", () => moveSpelling(-1));
  elements.nextSpellingButton.addEventListener("click", () => moveSpelling(1));
  elements.shuffleSpellingButton.addEventListener("click", () => {
    state.practice.spellingOrder = shuffle(VOCABULARY.map(item => item.id));
    state.practice.spellingIndex = 0;
    state.practice.spellingFeedback = "Bộ 60 từ đã được xáo trộn. Nhấn nghe để bắt đầu.";
    state.practice.spellingFeedbackType = "";
    renderSpelling();
  });

  elements.situationOptions.addEventListener("click", event => {
    const option = event.target.closest("[data-situation-answer]");
    if (option) answerSituation(option.dataset.situationAnswer);
  });
  elements.nextSituationButton.addEventListener("click", nextSituation);
  elements.shuffleSituationButton.addEventListener("click", () => {
    state.practice.situationOrder = shuffle(VOCABULARY.map(item => item.id));
    state.practice.situationIndex = 0;
    state.practice.situationOptions = {};
    state.practice.situationLocked = false;
    state.practice.situationSelectedId = null;
    renderSituation();
    showToast("Đã xáo trộn 60 tình huống mới 🔀");
  });

  elements.speedMissionCards.forEach(card => card.addEventListener("click", () => selectSpeedMission(card.dataset.speedMission)));
  elements.startSpeedButton.addEventListener("click", startSpeedQuiz);
  elements.speedOptions.addEventListener("click", event => {
    const option = event.target.closest("[data-speed-answer]");
    if (option) answerSpeedQuestion(option.dataset.speedAnswer);
  });
  elements.speedAudioButton.addEventListener("click", () => {
    const question = currentSpeedQuestion();
    if (question) speak(question.item.speak, { button: elements.speedAudioButton });
  });
  elements.retrySpeedButton.addEventListener("click", startSpeedQuiz);
  elements.nextSpeedMissionButton.addEventListener("click", () => selectSpeedMission(Math.min(3, state.practice.speedMission + 1)));

  document.addEventListener("keydown", event => {
    if (document.activeElement?.matches("input, select, textarea")) return;
    const flashcardsActive = document.querySelector('[data-panel="flashcards"]').classList.contains("is-active");
    if (!flashcardsActive) return;
    if (event.key === "ArrowLeft") moveCard(-1);
    if (event.key === "ArrowRight") moveCard(1);
    if (event.code === "Space") {
      event.preventDefault();
      flipCard();
    }
    if (event.key.toLowerCase() === "a") speak(currentCard().speak);
  });

  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
  }
}

function init() {
  renderThemeGrid();
  populateLessonSelects();
  renderVocabulary();
  renderCard();
  initializePractice();
  bindEvents();
  document.dispatchEvent(new CustomEvent("oic:app-ready"));
}

window.OICVocabulary = {
  clearStudentSession,
  setStudentSession
};

init();
