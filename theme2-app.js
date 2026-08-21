"use strict";

const THEMES = [
  { id: 1, title: "What is identity?", icon: "🪪", available: true, words: 60 },
  { id: 2, title: "Language & Communication", icon: "🌍", available: true, words: 71 },
  { id: 3, title: "Coming soon", icon: "🔬", available: false },
  { id: 4, title: "Coming soon", icon: "🎨", available: false },
  { id: 5, title: "Coming soon", icon: "🌱", available: false },
  { id: 6, title: "Coming soon", icon: "🚀", available: false },
  { id: 7, title: "Coming soon", icon: "🏛️", available: false },
  { id: 8, title: "Coming soon", icon: "💡", available: false },
  { id: 9, title: "Coming soon", icon: "🌈", available: false }
];

const VOCABULARY = window.THEME_2_DATA.vocabulary;

const PRACTICE_MODES = ["matching", "spelling", "situation", "speed"];
const PRACTICE_GROUP_SIZES = [19, 19, 18, 15];
const MATCHING_ROUND_SIZE = 5;
let practiceOffset = 0;
const PRACTICE_ITEMS = Object.fromEntries(PRACTICE_MODES.map((mode, index) => {
  const items = VOCABULARY.slice(practiceOffset, practiceOffset + PRACTICE_GROUP_SIZES[index]);
  practiceOffset += PRACTICE_GROUP_SIZES[index];
  return [mode, items];
}));
const PRACTICE_ID_SETS = Object.fromEntries(PRACTICE_MODES.map(mode => [
  mode,
  new Set(PRACTICE_ITEMS[mode].map(item => item.id))
]));
const MATCHING_ROUND_COUNT = Math.ceil(PRACTICE_ITEMS.matching.length / MATCHING_ROUND_SIZE);

const SITUATIONS = window.THEME_2_DATA.situations;

const LESSONS = [...new Map(VOCABULARY.map(item => [item.lesson, item.title])).entries()];
const STORAGE_KEY_PREFIX = "7oic-vocabulary-progress-theme2-v2";

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
  speedMissionScores: [document.querySelector("#speedMissionScore1")],
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
    const details = theme.available ? `${theme.words} words · IPA · Audio · Flashcards · Practice Lab` : "Content is being prepared";
    return `
      <button class="theme-card ${stateClass}" type="button" data-theme-id="${theme.id}" aria-disabled="${String(!theme.available)}"${theme.id === 2 ? ' aria-current="true"' : ""}>
        <span class="theme-card__number">${theme.id}</span>
        <span class="theme-card__copy">
          <small>Theme ${theme.id}</small>
          <strong>${escapeHtml(theme.title)}</strong>
          <span>${escapeHtml(details)}</span>
        </span>
        <span class="theme-card__icon" aria-hidden="true">${theme.icon}</span>
        ${theme.available ? '<span class="theme-card__status">OPEN</span>' : ""}
      </button>
    `;
  }).join("");
}

function getFilteredVocabulary() {
  const query = elements.searchInput.value.trim().toLocaleLowerCase("en");
  const lesson = elements.lessonFilter.value;
  return state.tableOrder.filter(item => {
    const lessonMatches = lesson === "all" || item.lesson === lesson;
    const haystack = `${item.word} ${item.meaning} ${item.ipa} ${item.title}`.toLocaleLowerCase("en");
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
        <button class="mini-audio" type="button" data-audio="word" data-id="${item.id}" aria-label="Play ${escapeHtml(item.word)}" title="Play word">🔊</button>
        <button class="mini-audio mini-audio--sentence" type="button" data-audio="example" data-id="${item.id}" aria-label="Play the example sentence for ${escapeHtml(item.word)}" title="Play example sentence">💬</button>
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
        <button class="mini-audio" type="button" data-audio="word" data-id="${item.id}" aria-label="Play ${escapeHtml(item.word)}">🔊</button>
        <button class="mini-audio mini-audio--sentence" type="button" data-audio="example" data-id="${item.id}" aria-label="Play the example sentence for ${escapeHtml(item.word)}">💬</button>
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

function numericSet(value, allowedIds = null) {
  return new Set((Array.isArray(value) ? value : []).map(Number).filter(number =>
    Number.isInteger(number)
    && number >= 1
    && number <= VOCABULARY.length
    && (!allowedIds || allowedIds.has(number))
  ));
}

function createPracticeState(progress = {}) {
  const matching = progress.matching || {};
  const spelling = progress.spelling || {};
  const situation = progress.situation || {};
  const speed = progress.speed || {};
  const legacySpeedScores = speed.bestScores || {};
  const assignedSpeedBest = Number(legacySpeedScores.mission4 ?? legacySpeedScores.mission1) || 0;
  return {
    activeMode: "matching",
    matchingRound: 0,
    matchingSelectedId: null,
    matchingOrders: {},
    matchingCompleted: numericSet(matching.completedWords, PRACTICE_ID_SETS.matching),
    matchingRounds: new Set((Array.isArray(matching.roundsCompleted) ? matching.roundsCompleted : [])
      .map(Number)
      .filter(round => Number.isInteger(round) && round >= 1 && round <= MATCHING_ROUND_COUNT)),
    spellingOrder: PRACTICE_ITEMS.spelling.map(item => item.id),
    spellingIndex: 0,
    spellingCompleted: numericSet(spelling.completedWords, PRACTICE_ID_SETS.spelling),
    spellingCorrect: numericSet(spelling.correctWords, PRACTICE_ID_SETS.spelling),
    spellingFeedback: "Press the audio button, listen carefully, and type your answer.",
    spellingFeedbackType: "",
    situationOrder: PRACTICE_ITEMS.situation.map(item => item.id),
    situationIndex: 0,
    situationCompleted: numericSet(situation.completedWords, PRACTICE_ID_SETS.situation),
    situationCorrect: numericSet(situation.correctWords, PRACTICE_ID_SETS.situation),
    situationOptions: {},
    situationLocked: false,
    situationSelectedId: null,
    speedCompleted: numericSet(speed.completedWords, PRACTICE_ID_SETS.speed),
    speedBestScores: assignedSpeedBest ? { mission1: assignedSpeedBest } : {},
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
    themeId: 2,
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
  const coveredWords = new Set([
    ...state.practice.matchingCompleted,
    ...state.practice.spellingCompleted,
    ...state.practice.situationCompleted,
    ...state.practice.speedCompleted
  ]);
  const complete = coveredWords.size;
  const percent = Math.round((complete / VOCABULARY.length) * 100);
  elements.practiceOverallLabel.textContent = `${complete}/${VOCABULARY.length} words practised`;
  elements.practiceOverallBar.style.width = `${percent}%`;
  elements.practiceOverallTrack.setAttribute("aria-valuenow", String(complete));
  elements.matchingCoverage.textContent = `${counts[0]}/${PRACTICE_ITEMS.matching.length}`;
  elements.spellingCoverage.textContent = `${counts[1]}/${PRACTICE_ITEMS.spelling.length}`;
  elements.situationCoverage.textContent = `${counts[2]}/${PRACTICE_ITEMS.situation.length}`;
  elements.speedCoverage.textContent = `${counts[3]}/${PRACTICE_ITEMS.speed.length}`;
  elements.speedMissionScores.forEach((element, index) => {
    if (!element) return;
    const score = state.practice.speedBestScores[`mission${index + 1}`];
    element.textContent = Number.isFinite(Number(score)) ? `Best ${score}/${PRACTICE_ITEMS.speed.length}` : "Not attempted";
  });
}

function populateMatchingRounds() {
  elements.matchingRoundSelect.innerHTML = Array.from({ length: MATCHING_ROUND_COUNT }, (_, index) => {
    const items = PRACTICE_ITEMS.matching.slice(index * MATCHING_ROUND_SIZE, (index + 1) * MATCHING_ROUND_SIZE);
    return `<option value="${index}">Set ${index + 1} · Words ${String(items[0].id).padStart(2, "0")}–${String(items.at(-1).id).padStart(2, "0")}</option>`;
  }).join("");
}

function matchingRoundItems() {
  const start = state.practice.matchingRound * MATCHING_ROUND_SIZE;
  return PRACTICE_ITEMS.matching.slice(start, start + MATCHING_ROUND_SIZE);
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
      <button class="matching-word${state.practice.matchingSelectedId === item.id ? " is-selected" : ""}" type="button" data-match-word="${item.id}" aria-pressed="${state.practice.matchingSelectedId === item.id}">
        <span>${item.icon}</span><strong>${escapeHtml(item.word)}</strong><small>${escapeHtml(item.ipa)}</small>
      </button>
    `).join("") || '<div class="matching-complete-badge">🎉 Set complete!</div>';
  elements.matchingMeaningBank.innerHTML = items.map(item => {
    const isMatched = state.practice.matchingCompleted.has(item.id);
    return `
      <button class="matching-meaning${isMatched ? " is-matched" : state.practice.matchingSelectedId ? " is-ready" : ""}" type="button" data-match-target="${item.id}" ${isMatched ? "disabled" : ""}>
        <span class="matching-drop-icon">${isMatched ? "✅" : "🔗"}</span>
        <span><strong>${escapeHtml(item.meaning)}</strong>${isMatched ? `<small>${escapeHtml(item.word)}</small>` : "<small>Select this meaning</small>"}</span>
      </button>
    `;
  }).join("");
  if (matched === items.length) {
    elements.matchingFeedback.className = "practice-feedback is-correct";
    elements.matchingFeedback.textContent = `Excellent! You matched every word in Set ${state.practice.matchingRound + 1}.`;
  } else {
    elements.matchingFeedback.className = "practice-feedback";
    elements.matchingFeedback.textContent = state.practice.matchingSelectedId
      ? `You selected “${VOCABULARY.find(item => item.id === state.practice.matchingSelectedId)?.word}”. Now choose its meaning.`
      : "Select a word card on the left, then choose its matching meaning on the right.";
  }
}

function tryMatch(wordId, targetId) {
  const word = VOCABULARY.find(item => item.id === Number(wordId));
  const target = elements.matchingMeaningBank.querySelector(`[data-match-target="${Number(targetId)}"]`);
  if (!word || state.practice.matchingCompleted.has(word.id)) return;
  if (word.id !== Number(targetId)) {
    target?.classList.add("is-wrong");
    elements.matchingFeedback.className = "practice-feedback is-wrong";
    elements.matchingFeedback.textContent = `Not quite. “${word.word}” does not match this meaning — try again!`;
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
      activityId: `theme2-practice-matching-round-${state.practice.matchingRound + 1}`,
      exercise: "matching",
      exerciseTitle: "Match words with meanings",
      word: `Set ${state.practice.matchingRound + 1}: words ${items[0].id}–${items.at(-1).id}`,
      lesson: "Theme 2",
      status: "completed",
      score: items.length,
      total: items.length,
      coverageCount: state.practice.matchingCompleted.size
    });
    celebrate();
    showToast(`Set ${state.practice.matchingRound + 1} complete! ${state.practice.matchingCompleted.size}/${PRACTICE_ITEMS.matching.length} words matched 🎉`);
  }
  renderMatching();
  updatePracticeProgress();
}

function currentSpellingItem() {
  const fallback = PRACTICE_ITEMS.spelling[0];
  const id = state.practice.spellingOrder[state.practice.spellingIndex] || fallback.id;
  return VOCABULARY.find(item => item.id === id) || fallback;
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
  if (item.id === 38) answers.push("concentrate", "concentration", "concentrate concentration");
  if (item.id === 45) answers.push("participate", "participation", "participate participation");
  if (item.id === 59) answers.push("pros and cons");
  return new Set(answers.map(normalizeAnswer));
}

function spellOutText(item) {
  const source = item.word.replace(/\([^)]*\)/g, "").replaceAll("/", " ").trim();
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
  const total = PRACTICE_ITEMS.spelling.length;
  elements.spellingPosition.textContent = `Word ${position}/${total}`;
  elements.spellingProgressBar.style.width = `${Math.round((position / total) * 100)}%`;
  elements.spellingScore.textContent = `${state.practice.spellingCorrect.size} correct`;
  elements.spellingIcon.textContent = item.icon;
  elements.spellingLesson.textContent = `Lesson ${item.lesson}`;
  elements.spellingFeedback.className = `practice-feedback${state.practice.spellingFeedbackType ? ` is-${state.practice.spellingFeedbackType}` : ""}`;
  elements.spellingFeedback.textContent = state.practice.spellingFeedback;
  elements.spellingInput.value = "";
  elements.previousSpellingButton.disabled = state.practice.spellingIndex === 0;
  elements.nextSpellingButton.disabled = state.practice.spellingIndex === total - 1;
}

function moveSpelling(direction) {
  state.practice.spellingIndex = Math.max(0, Math.min(PRACTICE_ITEMS.spelling.length - 1, state.practice.spellingIndex + direction));
  state.practice.spellingFeedback = "Press the audio button, listen carefully, and type your answer.";
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
    ? `Correct! “${item.word}” ${item.ipa} · ${item.meaning}`
    : "Not quite. You can replay the audio as many times as you need, then try again.";
  recordPractice({
    type: "practice-spelling",
    activityId: `theme2-practice-spelling-word-${item.id}`,
    exercise: "spelling",
    exerciseTitle: "Listen and spell",
    wordId: item.id,
    word: item.word,
    lesson: item.lesson,
    status: correct ? "correct" : "incorrect",
    score: correct ? 1 : 0,
    total: 1,
    coverageCount: state.practice.spellingCompleted.size
  });
  elements.spellingScore.textContent = `${state.practice.spellingCorrect.size} correct`;
  elements.spellingFeedback.className = `practice-feedback is-${state.practice.spellingFeedbackType}`;
  elements.spellingFeedback.textContent = state.practice.spellingFeedback;
  if (correct) {
    celebrate();
    elements.spellingInput.value = "";
  }
  updatePracticeProgress();
}

function distractorItems(item, count = 3, pool = VOCABULARY) {
  const sameForm = pool.filter(candidate => candidate.id !== item.id && candidate.pos === item.pos);
  const others = pool.filter(candidate => candidate.id !== item.id && candidate.pos !== item.pos);
  return shuffle([...sameForm, ...others]).slice(0, count);
}

function currentSituationItem() {
  const fallback = PRACTICE_ITEMS.situation[0];
  const id = state.practice.situationOrder[state.practice.situationIndex] || fallback.id;
  return VOCABULARY.find(item => item.id === id) || fallback;
}

function situationOptionIds(item) {
  if (!state.practice.situationOptions[item.id]) {
    state.practice.situationOptions[item.id] = shuffle([item, ...distractorItems(item, 3, PRACTICE_ITEMS.situation)]).map(option => option.id);
  }
  return state.practice.situationOptions[item.id];
}

function renderSituation() {
  const item = currentSituationItem();
  const position = state.practice.situationIndex + 1;
  const total = PRACTICE_ITEMS.situation.length;
  elements.situationPosition.textContent = `Question ${position}/${total}`;
  elements.situationProgressBar.style.width = `${Math.round((position / total) * 100)}%`;
  elements.situationScore.textContent = `${state.practice.situationCorrect.size} correct`;
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
    elements.situationFeedback.textContent = "Read the situation and choose the best answer.";
  }
  elements.nextSituationButton.disabled = !state.practice.situationLocked;
  elements.nextSituationButton.textContent = state.practice.situationIndex === total - 1 ? "Finish ✓" : "Next question →";
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
    ? `Correct! “${item.word}” is the best fit for this situation.`
    : `The correct answer is “${item.word}” — ${item.meaning}.`;
  recordPractice({
    type: "practice-situation",
    activityId: `theme2-practice-situation-word-${item.id}`,
    exercise: "situation",
    exerciseTitle: "Choose the word for the situation",
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
    ? `Correct! “${item.word}” is the best fit for this situation.`
    : `The correct answer is “${item.word}” — ${item.meaning}.`;
  updatePracticeProgress();
}

function nextSituation() {
  const total = PRACTICE_ITEMS.situation.length;
  if (!state.practice.situationLocked && state.practice.situationIndex < total - 1) return;
  if (state.practice.situationIndex === total - 1) {
    if (state.practice.situationCompleted.size === total) {
      celebrate();
      showToast(`You completed all ${total} situations with ${state.practice.situationCorrect.size} correct answers! 🌟`);
    } else {
      showToast(`You reached the end of the set and completed ${state.practice.situationCompleted.size}/${total} situations.`);
    }
    return;
  }
  state.practice.situationIndex += 1;
  state.practice.situationLocked = false;
  state.practice.situationSelectedId = null;
  renderSituation();
}

function speedMissionItems(mission) {
  return PRACTICE_ITEMS.speed;
}

function buildSpeedQuestion(item) {
  const mode = item.id % 3;
  const optionItems = shuffle([item, ...distractorItems(item, 3, PRACTICE_ITEMS.speed)]);
  if (mode === 0) {
    return {
      item,
      type: "MEANING CHALLENGE",
      prompt: `Which Vietnamese meaning matches “${item.word}”?`,
      audio: false,
      options: optionItems.map(option => ({ id: option.id, label: option.meaning, icon: option.icon }))
    };
  }
  if (mode === 1) {
    return {
      item,
      type: "WORD CHALLENGE",
      prompt: `Choose the word that means: “${item.meaning}”`,
      audio: false,
      options: optionItems.map(option => ({ id: option.id, label: option.word, icon: option.icon }))
    };
  }
  return {
    item,
    type: "AUDIO CHALLENGE",
    prompt: "Listen to the audio and choose the word you hear.",
    audio: true,
    options: optionItems.map(option => ({ id: option.id, label: option.word, icon: option.icon }))
  };
}

function selectSpeedMission(mission) {
  if (state.practice.speedActive) return;
  state.practice.speedMission = 0;
  state.practice.speedShowingResult = false;
  elements.speedMissionCards.forEach(card => card.classList.add("is-selected"));
  elements.startSpeedButton.textContent = "⚡ Start Speed Quiz";
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
  elements.speedQuestionCount.textContent = `${state.practice.speedIndex + 1}/${PRACTICE_ITEMS.speed.length}`;
  elements.speedLiveScore.textContent = state.practice.speedScore;
  elements.speedProgressBar.style.width = `${Math.round((state.practice.speedIndex / PRACTICE_ITEMS.speed.length) * 100)}%`;
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
  const missionKey = "mission1";
  const previousBest = Number(state.practice.speedBestScores[missionKey]) || 0;
  state.practice.speedBestScores[missionKey] = Math.max(previousBest, state.practice.speedScore);
  const duration = Math.min(90, Math.max(1, Math.round((Date.now() - state.practice.speedStartedAt) / 1000)));
  elements.speedGame.hidden = true;
  elements.speedResult.hidden = false;
  elements.speedResultScore.textContent = `${state.practice.speedScore}/${PRACTICE_ITEMS.speed.length}`;
  elements.speedResultTitle.textContent = state.practice.speedScore >= 13 ? "Lightning fast!" : state.practice.speedScore >= 9 ? "Great job!" : "Keep practising!";
  elements.speedResultMessage.textContent = timedOut
    ? `Time's up after 90 seconds · You answered ${state.practice.speedAnswered.size}/${PRACTICE_ITEMS.speed.length} questions.`
    : `Completed in ${duration} seconds · Your best score: ${state.practice.speedBestScores[missionKey]}/${PRACTICE_ITEMS.speed.length}.`;
  elements.nextSpeedMissionButton.hidden = true;
  recordPractice({
    type: "practice-speed",
    activityId: "theme2-practice-speed",
    exercise: "speed",
    exerciseTitle: "Speed Quiz",
    word: "Words 57–71 · 15 questions",
    lesson: "Theme 2",
    status: timedOut ? "timed-out" : "completed",
    score: state.practice.speedScore,
    total: PRACTICE_ITEMS.speed.length,
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
    showToast("This browser does not support speech playback. Please try Chrome, Edge, or Safari! 🎧");
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
    showToast(`Great! You remembered “${item.word}” 🎉`);
  } else {
    state.review.add(item.id);
    state.known.delete(item.id);
    showToast(`“${item.word}” was added to your review list 🔁`);
  }
  saveProgress({
    type: "flashcard",
    themeId: 2,
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
  elements.hubProgressLabel.textContent = `${practiced}/${total} cards`;
  elements.hubProgressBar.style.width = `${practicePercent}%`;
  elements.hubProgressTrack.setAttribute("aria-valuenow", String(practiced));
  elements.hubMasteryLabel.textContent = practiced
    ? `${learned} remembered · ${reviewed} to review`
    : "0 words remembered · Start now!";
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
  const firstMatchingRound = Array.from({ length: MATCHING_ROUND_COUNT }, (_, index) => index + 1).find(round => !state.practice.matchingRounds.has(round));
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
  saveProgress({ type: "reset", themeId: 2, status: "reset" });
  updateProgress();
  showToast("Progress cleared. Let's enjoy a fresh start! 🌱");
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
      showToast(`Theme ${theme.id} is being prepared. See you in the next update! ${theme.icon}`);
      return;
    }
    if (theme.id === 1) {
      window.location.href = "index.html";
      return;
    }
    document.querySelector("#theme2").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Theme 2 is ready — choose Vocabulary, Flashcards, or Practice Lab! 🚀");
  });
  elements.tabs.forEach(button => button.addEventListener("click", () => switchTab(button.dataset.tab)));
  elements.searchInput.addEventListener("input", renderVocabulary);
  elements.lessonFilter.addEventListener("change", renderVocabulary);
  elements.vocabTableBody.addEventListener("click", handleAudioClick);
  elements.vocabMobileList.addEventListener("click", handleAudioClick);

  elements.shuffleTableButton.addEventListener("click", () => {
    state.tableOrder = shuffle(state.tableOrder);
    renderVocabulary();
    showToast("Vocabulary order shuffled 🔀");
  });
  elements.resetTableButton.addEventListener("click", () => {
    state.tableOrder = [...VOCABULARY];
    renderVocabulary();
    showToast("Original lesson order restored ↩️");
  });

  elements.deckLessonFilter.addEventListener("change", () => rebuildDeck(false));
  elements.shuffleDeckButton.addEventListener("click", () => {
    rebuildDeck(true);
    showToast("Flashcards shuffled 🔀");
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
    showToast("Cards in this set have been shuffled 🔀");
  });
  elements.matchingWordBank.addEventListener("click", event => {
    const card = event.target.closest("[data-match-word]");
    if (!card) return;
    state.practice.matchingSelectedId = Number(card.dataset.matchWord);
    renderMatching();
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
    state.practice.spellingOrder = shuffle(PRACTICE_ITEMS.spelling.map(item => item.id));
    state.practice.spellingIndex = 0;
    state.practice.spellingFeedback = "The 19 words have been shuffled. Press the audio button to begin.";
    state.practice.spellingFeedbackType = "";
    renderSpelling();
  });

  elements.situationOptions.addEventListener("click", event => {
    const option = event.target.closest("[data-situation-answer]");
    if (option) answerSituation(option.dataset.situationAnswer);
  });
  elements.nextSituationButton.addEventListener("click", nextSituation);
  elements.shuffleSituationButton.addEventListener("click", () => {
    state.practice.situationOrder = shuffle(PRACTICE_ITEMS.situation.map(item => item.id));
    state.practice.situationIndex = 0;
    state.practice.situationOptions = {};
    state.practice.situationLocked = false;
    state.practice.situationSelectedId = null;
    renderSituation();
    showToast("The 18 situations have been shuffled 🔀");
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
  elements.nextSpeedMissionButton.addEventListener("click", () => selectSpeedMission(0));

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
