// ===============================
// GLOBAL APP STATE
// ===============================
let appState = {
  currentLevel: "A1",
  activeLanguage: localStorage.getItem("activeLanguage") || "es",
  levelStats: {},
  totalXP: 0,
  globalScore: 0,
  badges: [],
  speechRate: 1.0,
  studentName: ""
};

// Filled by loadLanguagePack()
let LANG = {
  levels: {},           // CEFR_LEVELS
  sentences: {},        // CEFR_SENTENCES
  sentenceChoices: {},  // CEFR_SENTENCE_CHOICES
  convoPrompts: {},     // CEFR_CONVERSATION_PROMPTS
  convoAudio: [],       // CEFR_CONVERSATION_AUDIO
  phrases: {},          // CEFR_PHRASES
  disruptors: {},       // DISRUPTORS
  listenVocab: {},      // LISTEN_VOCAB
  wordDict: {},         // WORD_DICT
  mining: {},           // MINING_REFERENCES
  rules: {              // rules.json
    languageName: "Spanish",
    ttsLang: "es-ES",
    normalize: { stripAccents: true },
    fallbackWords: { the: "el/la", far: "lejos" }
  }
};

// ===============================
// PERSISTENCE
// ===============================
function saveState() {
  localStorage.setItem("appState", JSON.stringify(appState));
}

function loadState() {
  const raw = localStorage.getItem("appState");
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    appState = { ...appState, ...parsed };
  } catch (e) {
    console.error("Error loading appState:", e);
  }
}

// ===============================
// LANGUAGE PACK LOADER
// ===============================
async function loadLanguagePack(lang) {
  const base = `wordbanks/${lang}`;

  const [
    levelsModule,
    sentencesModule,
    sentenceChoicesModule,
    convoPromptsModule,
    convoAudioModule,
    phrasesModule,
    disruptorsModule,
    listenVocabModule,
    wordDictModule,
    miningModule,
    rules
  ] = await Promise.all([
    import(`./${base}/CEFR_LEVELS.js`),
    import(`./${base}/CEFR_SENTENCES.js`),
    import(`./${base}/CEFR_SENTENCE_CHOICES.js`),
    import(`./${base}/CEFR_CONVERSATION_PROMPTS.js`),
    import(`./${base}/CEFR_CONVERSATION_AUDIO.js`),
    import(`./${base}/CEFR_PHRASES.js`),
    import(`./${base}/DISRUPTORS.js`),
    import(`./${base}/LISTEN_VOCAB.js`),
    import(`./${base}/WORD_DICT.js`),
    import(`./${base}/mining_references.js`),
    fetch(`${base}/rules.json`).then(r => r.json())
  ]);

  LANG = {
    levels: levelsModule.CEFR_LEVELS,
    sentences: sentencesModule.CEFR_SENTENCES,
    sentenceChoices: sentenceChoicesModule.CEFR_SENTENCE_CHOICES,
    convoPrompts: convoPromptsModule.CEFR_CONVERSATION_PROMPTS,
    convoAudio: convoAudioModule.CEFR_CONVERSATION_AUDIO,
    phrases: phrasesModule.CEFR_PHRASES,
    disruptors: disruptorsModule.DISRUPTORS,
    listenVocab: listenVocabModule.LISTEN_VOCAB,
    wordDict: wordDictModule.WORD_DICT,
    mining: miningModule.MINING_REFERENCES,
    rules
  };
}

// ===============================
// NORMALIZATION & TTS
// ===============================
function normalizeEnglish(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[-_.,?!¡¿]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeForeign(str) {
  if (!str) return "";
  const cfg = LANG.rules.normalize || {};
  let s = str.normalize("NFD");
  if (cfg.stripAccents !== false) s = s.replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/-/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  return s;
}

function speak(text) {
  if (!text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LANG.rules.ttsLang || "es-ES";
  u.rate = appState.speechRate;
  window.speechSynthesis.speak(u);
}

// ===============================
// GLOBAL LOOKUP (English ↔ Foreign)
// ===============================
function globalLookup(word) {
  const qEng = normalizeEnglish(word);
  const qFor = normalizeForeign(word);
  if (!qEng && !qFor) return null;

  const levels = ["A1", "A2", "B1", "B2"];

  // 1. CEFR Vocabulary
  for (const lvl of levels) {
    const vocab = LANG.levels[lvl];
    if (!vocab) continue;

    const match = vocab.find(item =>
      (item.english && normalizeEnglish(item.english) === qEng) ||
      (item.foreign && normalizeForeign(item.foreign) === qFor)
    );
    if (match) {
      const isForeignInput = match.foreign && normalizeForeign(match.foreign) === qFor;
      return {
        translation: isForeignInput ? match.english : match.foreign,
        label: isForeignInput ? "English" : LANG.rules.languageName,
        speakText: match.foreign,
        source: "CEFR Vocabulary",
        level: lvl
      };
    }
  }

  // You can extend this pattern to sentences, sentenceChoices, phrases, mining, etc.
  return null;
}

// ===============================
// LANGUAGE SELECTOR
// ===============================
async function initLanguageSelector() {
  const select = document.getElementById("language-select");
  if (!select) return;

  select.value = appState.activeLanguage;

  select.addEventListener("change", async () => {
    appState.activeLanguage = select.value;
    localStorage.setItem("activeLanguage", appState.activeLanguage);
    await loadLanguagePack(appState.activeLanguage);
    renderAllTabs();
    updateBadges();
    updateProgressMeters();
  });
}

// ===============================
// FLASHCARDS (EXAMPLE TAB)
// ===============================
function groupByCategory(words) {
  const out = {};
  words.forEach(w => {
    const cat = w.category || "Other";
    if (!out[cat]) out[cat] = [];
    out[cat].push(w);
  });
  return out;
}

function renderFlashcardsTab() {
  const container = document.getElementById("flash-content");
  if (!container) return;

  const words = LANG.levels[appState.currentLevel] || [];
  const grouped = groupByCategory(words);

  let html = `
    <div class="glass-panel">
      <h2>Flashcards — Level ${appState.currentLevel}</h2>
      <p>Translate the English word, then flip to see and hear the ${LANG.rules.languageName} word.</p>
    </div>
  `;

  Object.keys(grouped).forEach(cat => {
    html += `
      <div class="glass-panel">
        <div class="flash-category-header">
          <span class="listen-category-title">${cat.toUpperCase()}</span>
          <span class="listen-arrow">▶</span>
        </div>
        <div class="flash-category-content">
          <div class="fc-grid">
            ${grouped[cat].map(item => `
              <div class="fc-card">
                <div class="fc-inner">
                  <div class="fc-front pill">${item.english}</div>
                  <div class="fc-back pill">${item.foreign}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll(".flash-category-header").forEach(header => {
    const content = header.nextElementSibling;
    const arrow = header.querySelector(".listen-arrow");
    header.addEventListener("click", () => {
      const open = content.classList.toggle("open");
      arrow.classList.toggle("open", open);
    });
  });

  container.querySelectorAll(".fc-card").forEach(card => {
    card.addEventListener("click", () => {
      const inner = card.querySelector(".fc-inner");
      const flipped = inner.classList.toggle("fc-flipped");
      const foreign = inner.querySelector(".fc-back").textContent.trim();
      if (flipped) {
        speak(foreign);
        const stats = appState.levelStats[appState.currentLevel] || (appState.levelStats[appState.currentLevel] = {});
        stats.flashSeen = (stats.flashSeen || 0) + 1;
        saveState();
        updateBadges();
        updateProgressMeters();
      } else {
        window.speechSynthesis.cancel();
      }
    });
  });
}

// ===============================
// QUIZ (English → Foreign, condensed)
// ===============================
const quizState = { currentWord: null, options: [], harderMode: false };

function generateQuizOptions(words, correctWord) {
  const opts = [correctWord.foreign];
  const count = quizState.harderMode ? 5 : 3;

  while (opts.length < count) {
    const w = words[Math.floor(Math.random() * words.length)];
    if (!opts.includes(w.foreign)) opts.push(w.foreign);
  }

  return opts.sort(() => Math.random() - 0.5);
}

function renderQuizTab() {
  const container = document.getElementById("quiz-content");
  if (!container) return;

  const words = LANG.levels[appState.currentLevel] || [];
  if (!words.length) {
    container.innerHTML = `<div class="glass-panel quiz-card"><p>No words found for this level.</p></div>`;
    return;
  }

  quizState.currentWord = words[Math.floor(Math.random() * words.length)];
  quizState.options = generateQuizOptions(words, quizState.currentWord);

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Quiz — Level ${appState.currentLevel}</h2>
      <p>Select the correct ${LANG.rules.languageName} word.</p>

      <div><strong>English:</strong> ${quizState.currentWord.english}</div>

      <div id="qb-grid" class="sb-grid">
        ${quizState.options.map(opt => `<button class="pill" data-foreign="${opt}">${opt}</button>`).join("")}
      </div>

      <div id="qb-answer"></div>
      <div class="sb-controls quiz-controls-tight">
        <button id="qb-submit">Check</button>
        <button id="qb-next">Next</button>
        <button id="qb-harder" class="${quizState.harderMode ? "active" : ""}">Harder</button>
      </div>
      <div id="qb-feedback"></div>
    </div>
  `;

  setupQuizEvents();
}

function setupQuizEvents() {
  const grid = document.getElementById("qb-grid");
  const submitBtn = document.getElementById("qb-submit");
  const nextBtn = document.getElementById("qb-next");
  const harderBtn = document.getElementById("qb-harder");
  const feedback = document.getElementById("qb-feedback");
  const answerBox = document.getElementById("qb-answer");

  let selected = null;

  grid.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selected = btn.dataset.foreign;
      answerBox.textContent = selected;
    });
  });

  submitBtn.addEventListener("click", () => {
    if (!selected) {
      feedback.textContent = "Choose an answer first.";
      return;
    }

    const correct = quizState.currentWord.foreign;
    const stats = appState.levelStats[appState.currentLevel] || (appState.levelStats[appState.currentLevel] = {});

    if (selected === correct) {
      feedback.innerHTML = `<div class="quiz-correct">Correct! 🎉</div>`;
      stats.quizScore = (stats.quizScore || 0) + 1;
      stats.quizCompleted = (stats.quizCompleted || 0) + 1;
      appState.totalXP += 10;
      appState.globalScore += 5;
      updateBadges();
      updateProgressMeters();
      speak(correct);
    } else {
      feedback.innerHTML = `<div class="quiz-incorrect">Incorrect — correct answer: ${correct}</div>`;
      const mistakeString = `${quizState.currentWord.english} ➔ ${correct}`;
      addIncorrectWord(mistakeString);
      speak(correct);
    }

    saveState();
  });

  nextBtn.addEventListener("click", () => renderQuizTab());

  harderBtn.addEventListener("click", () => {
    quizState.harderMode = !quizState.harderMode;
    harderBtn.classList.toggle("active");
    renderQuizTab();
  });
}

// ===============================
// SENTENCE TAB — Multiple Choice
// ===============================

function generateSentenceForLevel(level) {
  const bank = LANG.sentenceChoices[level];
  if (!bank || !bank.length) return null;

  const item = bank[Math.floor(Math.random() * bank.length)];

  // Expected structure in wordbanks/es/CEFR_SENTENCE_CHOICES.js:
  // {
  //   english: "I am going to the store.",
  //   foreignCorrect: "Voy a la tienda.",
  //   foreignOptions: ["Voy a la tienda.", "Voy al parque.", "Voy a la escuela."],
  //   level: "A1"
  // }

  const options = [...item.foreignOptions].sort(() => Math.random() - 0.5);

  return {
    english: item.english,
    correct: item.foreignCorrect,
    options,
    level: item.level || level
  };
}

function renderSentenceTab() {
  const container = document.getElementById("sentence-content");
  if (!container) return;

  const level = appState.currentLevel;
  const q = generateSentenceForLevel(level);

  if (!q) {
    container.innerHTML = `
      <div class="glass-panel sentence-card">
        <p>No sentence choices found for level ${level}.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="glass-panel sentence-card">
      <h2>Sentence — Level ${level}</h2>
      <p>Select the correct ${LANG.rules.languageName} translation.</p>

      <div class="sentence-english">
        <strong>English:</strong> ${q.english}
      </div>

      <div id="sentence-options" class="sentence-options">
        ${q.options.map(opt => `
          <button class="pill" data-opt="${opt}">${opt}</button>
        `).join("")}
      </div>

      <div id="sentence-feedback"></div>

      <div class="sentence-controls">
        <button id="sentence-next" class="pill">Next</button>
      </div>
    </div>
  `;

  setupSentenceEvents(q);
}

function setupSentenceEvents(q) {
  const buttons = document.querySelectorAll("#sentence-options .pill");
  const feedback = document.getElementById("sentence-feedback");
  const nextBtn = document.getElementById("sentence-next");

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const chosen = btn.dataset.opt;

      if (chosen === q.correct) {
        feedback.innerHTML = `
          <span style="color:#4ade80;font-weight:600;">Correct! 🎉</span><br>
          <div class="sentence-selected">
            <strong>You selected:</strong> ${chosen}
          </div>
        `;

        const stats = appState.levelStats[appState.currentLevel] || (appState.levelStats[appState.currentLevel] = {});
        stats.sentenceCompleted = (stats.sentenceCompleted || 0) + 1;

        appState.totalXP += 15;
        appState.globalScore += 10;

        updateBadges();
        updateProgressMeters();
        speak(q.correct);
      } else {
        feedback.innerHTML = `
          <span style="color:#f87171;font-weight:600;">Incorrect.</span><br>
          Correct answer: <strong>${q.correct}</strong><br>
          <div class="sentence-selected">
            <strong>You selected:</strong> ${chosen}
          </div>
        `;

        const mistakeSentenceString = `${q.english} ➔ ${q.correct}`;
        addIncorrectWord(mistakeSentenceString);
        speak(q.correct);
      }

      buttons.forEach(b => b.disabled = true);
      saveState();
    });
  });

  nextBtn.addEventListener("click", () => {
    renderSentenceTab();
  });
}


// ===============================
// REVIEW LIST (condensed)
// ===============================
window.reviewList = [];
try {
  const savedReview = localStorage.getItem("reviewList");
  if (savedReview) window.reviewList = JSON.parse(savedReview);
} catch (e) {
  console.error("Error reading saved mistake logs:", e);
  window.reviewList = [];
}

function addIncorrectWord(word) {
  if (!word) return;
  if (!window.reviewList.includes(word)) {
    window.reviewList.push(word);
    localStorage.setItem("reviewList", JSON.stringify(window.reviewList));
    renderReviewList();
    updateProgressMeters();
  }
}

function clearWordFromReview(word) {
  window.reviewList = window.reviewList.filter(w => w !== word);
  localStorage.setItem("reviewList", JSON.stringify(window.reviewList));
  renderReviewList();
  updateProgressMeters();
}

function renderReviewList() {
  const listContainer = document.getElementById("review-words-list");
  if (!listContainer) return;

  listContainer.innerHTML = "";

  if (!window.reviewList.length) {
    listContainer.innerHTML = '<p class="review-empty-msg">🎉 Great job! No words to review.</p>';
    return;
  }

  window.reviewList.forEach(word => {
    const card = document.createElement("div");
    card.className = "review-card";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.margin = "10px 0";

    let foreignText = word;
    if (word.includes("➔") || word.includes("→")) {
      const parts = word.split(/➔|→/);
      foreignText = (parts[1] || "").trim();
    }

    card.innerHTML = `
      <span class="review-word-text">${word}</span>
      <div class="review-card-actions" style="display:flex;align-items:center;gap:12px;margin-left:auto;">
        <button class="pill review-play-btn" style="min-width:45px;padding:10px 14px;">🔊 Play</button>
        <button class="pill got-it-btn">Got it!</button>
      </div>
    `;

    card.querySelector(".review-play-btn").addEventListener("click", () => {
      speak(foreignText);
    });

    card.querySelector(".got-it-btn").addEventListener("click", () => {
      clearWordFromReview(word);
    });

    listContainer.appendChild(card);
  });
}

// ===============================
// BADGES & PROGRESS (you can keep your existing logic)
// ===============================
function updateBadges() {
  // reuse your existing badge logic, but based on appState.levelStats
}

function updateProgressMeters() {
  // reuse your existing progress logic, but based on appState.levelStats, totalXP, globalScore, reviewList.length
}

// ===============================
// RENDER ALL TABS (helper)
// ===============================
function renderAllTabs() {
  renderFlashcardsTab();
  renderQuizTab();
  renderSentenceTab();
  renderReviewList();
}


// ===============================
// STARTUP
// ===============================
document.addEventListener("DOMContentLoaded", async () => {
  loadState();
  await loadLanguagePack(appState.activeLanguage);

  initLanguageSelector();
  // initTabNavigation(); // your existing tab system
  // activateTab("dashboard");
  // initRateControl();
  // initNameBox();
  // initDictionarySearch();
  // initFreePracticeSandbox();

  renderAllTabs();
  updateBadges();
  updateProgressMeters();
});
