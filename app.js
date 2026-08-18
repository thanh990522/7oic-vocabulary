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
  voices: []
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
    const details = theme.available ? `${theme.words} từ · IPA · Audio · Flashcards` : "Nội dung đang được chuẩn bị";
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
    review: [...state.review]
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

function setStudentSession({ uid, known = [], review = [] }) {
  state.studentUid = uid;
  state.known = new Set(Array.isArray(known) ? known : []);
  state.review = new Set(Array.isArray(review) ? review : []);
  updateProgress();
  renderCard();
}

function clearStudentSession() {
  state.studentUid = null;
  state.known = new Set();
  state.review = new Set();
  updateProgress();
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
    showToast("Theme 1 đã sẵn sàng — chọn Bảng từ vựng hoặc Flashcards nhé! 🚀");
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
  bindEvents();
  document.dispatchEvent(new CustomEvent("oic:app-ready"));
}

window.OICVocabulary = {
  clearStudentSession,
  setStudentSession
};

init();
