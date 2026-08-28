// ============================================================
// APP CORE — MULTI-LANGUAGE CEFR PLATFORM
// ============================================================

import { setLanguage, setLevel, loadModule } from "./LanguageLoader.js";

// ---------- GLOBAL STATE ----------

const appState = {
  activeTab: "dashboard",
  activeLanguage: "es",
  activeLevel: "A1",
  speechRate: 1.0,
  levelStats: {
    A1: { xp: 0, quizzes: 0, sentences: 0, listens: 0 },
    A2: { xp: 0, quizzes: 0, sentences: 0, listens: 0 },
    B1: { xp: 0, quizzes: 0, sentences: 0, listens: 0 },
    B2: { xp: 0, quizzes: 0, sentences: 0, listens: 0 }
  },
  streakDays: 0,
  scoreRating: 0,
  mistakes: [],
  miningWords: [],
  certificateName: ""
};

// ============================================================
// BASIC HELPERS
// ============================================================

function $(id) {
  return document.getElementById(id);
}

function speakText(text) {
  const utter = new SpeechSynthesisUtterance(text);
  const lang = appState.activeLanguage;

  utter.lang =
    lang === "es" ? "es-ES" :
    lang === "fr" ? "fr-FR" :
    lang === "nl" ? "nl-NL" :
    "es-ES";

  utter.rate = appState.speechRate;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function addXP(amount = 1) {
  appState.levelStats[appState.activeLevel].xp += amount;
}

function addScore(amount = 1) {
  appState.scoreRating += amount;
}

function totalXP() {
  return Object.values(appState.levelStats)
    .reduce((sum, lvl) => sum + lvl.xp, 0);
}

// ============================================================
// TAB ROUTER
// ============================================================
let moduleBank = null;

async function initQuiz() {
    const loaded = await loadModule("listen");
    moduleBank = loaded.moduleBank;
    renderQuizTab();
}



function switchTab(tabId) {
  appState.activeTab = tabId;

  document.querySelectorAll(".appSection").forEach(sec => {
    sec.style.display = sec.id === tabId ? "block" : "none";
  });

  if (tabId === "dashboard") initDashboard();
  if (tabId === "listenSection") initListen();
  if (tabId === "flashcardsSection") initFlashcards();
  if (tabId === "quizSection") initQuiz();
  if (tabId === "buildSection") initBuild();
  if (tabId === "sentenceSection") initSentence();
  if (tabId === "conversationSection") initConversation();
  if (tabId === "grammarSection") initGrammar();
  if (tabId === "miningSection") initMining();
  if (tabId === "dictionarySection") initDictionary();
  if (tabId === "reviewSection") initReview();
  if (tabId === "repeatSection") initRepeat();
  if (tabId === "certificatesSection") initCertificates();
  if (tabId === "certificateGeneratorPage") initCertificatePage();
}

function initTabs() {
  document.querySelectorAll("[data-tab-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tabTarget;
      switchTab(target);
    });
  });
}

// ============================================================
// LANGUAGE + LEVEL + AUDIO
// ============================================================

function initLanguageControls() {
  const selector = $("language-select");
  if (!selector) return;

  selector.value = appState.activeLanguage;

  selector.addEventListener("change", (e) => {
    const newLang = e.target.value;
    appState.activeLanguage = newLang;
    setLanguage(newLang);
    switchTab(appState.activeTab);
  });
}

function initLevelControls() {
  document.querySelectorAll("[data-level]").forEach(btn => {
    btn.addEventListener("click", () => {
      const level = btn.dataset.level;
      appState.activeLevel = level;
      setLevel(level);
      switchTab(appState.activeTab);
    });
  });
}

function initAudioSpeed() {
  const slider = $("audioSpeed");
  const label = $("audioSpeedValue");
  if (!slider || !label) return;

  slider.addEventListener("input", () => {
    appState.speechRate = parseFloat(slider.value);
    label.textContent = slider.value;
  });
}

// ============================================================
// DASHBOARD
// ============================================================

function initDashboard() {
  initAudioSpeed();
  initLanguageControls();
  initLevelControls();
  initCertificateName();
  initSandbox();
  initDictionaryQuickSearch();
  initResetAll();
  updateProgressMeters();
}

function initCertificateName() {
  const input = $("certificateNameInput");
  const btn = $("saveCertificateName");
  if (!input || !btn) return;

  if (appState.certificateName.trim() !== "") {
    input.value = appState.certificateName;
  }

  btn.addEventListener("click", () => {
    appState.certificateName = input.value.trim();
  });
}

function updateProgressMeters() {
  const stats = appState.levelStats[appState.activeLevel];

  if ($("quizProgress")) $("quizProgress").textContent = `${stats.quizzes}%`;
  if ($("buildProgress")) $("buildProgress").textContent = `${stats.sentences}%`;
  if ($("sentenceProgress")) $("sentenceProgress").textContent = `${stats.sentences}%`;
  if ($("xpProgress")) $("xpProgress").textContent = `${totalXP()} XP`;
  if ($("streakCount")) $("streakCount").textContent = `${appState.streakDays} days`;
  if ($("scoreRating")) $("scoreRating").textContent = `${appState.scoreRating} pts`;
  if ($("dueReview")) $("dueReview").textContent = `${appState.mistakes.length} words`;
}

function initResetAll() {
  const btn = $("resetAll");
  if (!btn) return;

  btn.addEventListener("click", () => {
    Object.keys(appState.levelStats).forEach(level => {
      appState.levelStats[level] = { xp: 0, quizzes: 0, sentences: 0, listens: 0 };
    });
    appState.streakDays = 0;
    appState.scoreRating = 0;
    appState.mistakes = [];
    appState.miningWords = [];
    updateProgressMeters();
    const badgeList = $("badge-list");
    if (badgeList) badgeList.textContent = "No badges yet. Keep training!";
  });
}

// ============================================================
// SANDBOX + QUICK DICTIONARY SEARCH
// ============================================================

function initSandbox() {
  const promptEl = $("sandboxPrompt");
  const inputEl = $("sandboxInput");
  const checkBtn = $("sandboxCheck");
  const skipBtn = $("sandboxSkip");
  const outputEl = $("sandboxOutput");

  if (!promptEl || !inputEl || !checkBtn || !skipBtn || !outputEl) return;

  let currentPrompt = { word: "likes", level: "A1", lang: "es", answer: "gusta" };

  promptEl.textContent = `${currentPrompt.word} (${currentPrompt.level})`;

  checkBtn.addEventListener("click", () => {
    const val = inputEl.value.trim().toLowerCase();
    if (!val) return;

    if (val === currentPrompt.answer.toLowerCase()) {
      outputEl.textContent = "Correct!";
      addXP(1);
      addScore(1);
    } else {
      outputEl.textContent = `Not quite. Expected: ${currentPrompt.answer}`;
      appState.mistakes.push(currentPrompt.word);
    }
    updateProgressMeters();
  });

  skipBtn.addEventListener("click", () => {
    outputEl.textContent = "Skipped. Try another one!";
  });
}

async function initDictionaryQuickSearch() {
  const inputEl = $("dictionarySearchInput");
  const outputEl = $("dictionarySearchOutput");
  if (!inputEl || !outputEl) return;

  let dictBank = null;
  try {
    const { moduleBank } = await loadModule("dictionary");
    dictBank = moduleBank;
  } catch (e) {
    outputEl.textContent = "Dictionary not available.";
    return;
  }

  inputEl.addEventListener("input", () => {
    const query = inputEl.value.trim().toLowerCase();
    if (!query) {
      outputEl.textContent = "";
      return;
    }

    const entry = dictBank[query];
    if (!entry) {
      outputEl.textContent = "No match found.";
      return;
    }

    const lang = appState.activeLanguage;
    const translation = entry[lang] || entry.es || "";
    outputEl.textContent = translation ? translation : "No translation for this language.";
  });
}

// ============================================================
// LISTEN MODULE
// ============================================================

let listenAutoPlay = {
  active: false,
  paused: false,
  index: 0,
  list: []
};

function playNextListenWord() {
  if (!listenAutoPlay.active || listenAutoPlay.paused) return;

  const list = listenAutoPlay.list;
  if (listenAutoPlay.index >= list.length) {
    listenAutoPlay.active = false;
    return;
  }

  const word = list[listenAutoPlay.index];

  speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(word);
  utter.lang =
    appState.activeLanguage === "es" ? "es-ES" :
    appState.activeLanguage === "fr" ? "fr-FR" :
    appState.activeLanguage === "nl" ? "nl-NL" : "es-ES";
  utter.rate = appState.speechRate;

  utter.onend = () => {
    if (!listenAutoPlay.paused) {
      listenAutoPlay.index++;
      setTimeout(playNextListenWord, 200);
    }
  };

  speechSynthesis.speak(utter);
}

async function initListen() {
  const container = $("listenSection");
  if (!container) return;

  let moduleBank;
  try {
    const loaded = await loadModule("listen");
    moduleBank = loaded.moduleBank;
  } catch (e) {
    container.innerHTML = "<p>Unable to load listening data.</p>";
    return;
  }

  const LEVELS = moduleBank;
  const levelData = LEVELS[appState.activeLevel];

  if (!levelData || !Array.isArray(levelData)) {
    container.innerHTML = "<p>No listening data available for this level.</p>";
    return;
  }

  const categories = {};
  levelData.forEach(item => {
    const cat = item.category || "General";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(item);
  });

  let html = `
    <div class="ui-panel">
      <h2 class="ui-section-title">Listen — Level ${appState.activeLevel}</h2>
      <p>Tap a word pill to hear it.</p>
      <div class="u-row u-gap-sm">
        <button class="ui-pill" id="listen-playall">Play All</button>
        <button class="ui-pill" id="listen-pause">Pause</button>
        <button class="ui-pill" id="listen-resume">Resume</button>
        <button class="ui-pill" id="listen-stop">Stop</button>
      </div>
    </div>
  `;

  Object.keys(categories).forEach(cat => {
    html += `
      <div class="ui-panel">
        <h3>${cat}</h3>
        <div class="listen-grid">
          ${categories[cat].map(w => `
            <button class="ui-pill listen-pill" data-word="${w.spanish}">
              ${w.english} — ${w.spanish}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  listenAutoPlay.list = levelData.map(w => w.spanish);

  $("listen-playall").onclick = () => {
    listenAutoPlay.active = true;
    listenAutoPlay.paused = false;
    listenAutoPlay.index = 0;
    playNextListenWord();
  };

  $("listen-pause").onclick = () => {
    listenAutoPlay.paused = true;
    speechSynthesis.pause();
  };

  $("listen-resume").onclick = () => {
    listenAutoPlay.paused = false;
    speechSynthesis.resume();
    playNextListenWord();
  };

  $("listen-stop").onclick = () => {
    listenAutoPlay.active = false;
    listenAutoPlay.paused = false;
    listenAutoPlay.index = 0;
    speechSynthesis.cancel();
  };

  document.querySelectorAll(".listen-pill").forEach(btn => {
    btn.onclick = () => {
      speakText(btn.dataset.word);
    };
  });
}

// ============================================================
// FLASHCARDS MODULE — Pills flip in place (English → Translation)
// ============================================================

let flashcards = [];

async function initFlashcards() {
  const container = $("flashcardsSection");
  if (!container) return;

  let moduleBank;
  try {
    const loaded = await loadModule("listen");   // loads CEFR_LEVELS.js
    moduleBank = loaded.moduleBank;
  } catch (e) {
    container.innerHTML = "<p>Unable to load flashcards.</p>";
    return;
  }

  const LEVELS = moduleBank;
  const levelData = LEVELS[appState.activeLevel];

  if (!levelData || !Array.isArray(levelData)) {
    container.innerHTML = "<p>No flashcards available for this level.</p>";
    return;
  }

  // Build flashcards
  flashcards = levelData.map(item => ({
    english: item.english,
    es: item.spanish,
    fr: item.french,
    nl: item.dutch
  }));

  renderFlashcardWordList(container);
}

function renderFlashcardWordList(container) {
  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Flashcards — Level ${appState.activeLevel}</h2>
      <p>Read the words and say it out loud in the translated language. Tap the word to flip it and hear its pronunciation to confirm if your correct.</p>
      <div id="flashcard-word-grid" class="listen-grid"></div>
    </div>
  `;

  const grid = $("flashcard-word-grid");

  grid.innerHTML = flashcards.map((fc, idx) => {
    const backText =
      fc[appState.activeLanguage] ||
      fc.es;

    return `
      <div class="flashcard flashcard-pill" data-index="${idx}">
        <div class="flashcard-inner">
          <div class="flashcard-front">${fc.english}</div>
          <div class="flashcard-back">${backText}</div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".flashcard-pill").forEach(card => {
    card.onclick = () => {
      const idx = parseInt(card.dataset.index, 10);
      const fc = flashcards[idx];

      const backText =
        fc[appState.activeLanguage] ||
        fc.es;

      // Flip the pill
      const isFlipped = card.classList.toggle("flipped");

      // Play audio only on first flip
      if (isFlipped) {
        speakText(backText);
      }
    };
  });
}


/* ============================================================
   SHARED QUIZ STATE
   ============================================================ */
let moduleBank = null;

let quizState = {
    currentWord: null,
    options: [],
    harderMode: false,
    selected: null
};

/* ============================================================
   GENERATE OPTIONS (supports ES / FR / NL)
   ============================================================ */

function generateQuizOptions(words, correctWord) {
    const lang = appState.activeLanguage;

    let opts = [correctWord[lang]];
    const count = quizState.harderMode ? 5 : 3;

    while (opts.length < count) {
        const w = words[Math.floor(Math.random() * words.length)];
        const translated = w[lang] || w.spanish;   // fallback to Spanish
        if (!opts.includes(translated)) opts.push(translated);
    }

    return opts.sort(() => Math.random() - 0.5);
}

/* ============================================================
   QUIZ TAB — RENDER + EVENTS
   ============================================================ */

function renderQuizTab() {
    const container = document.getElementById("quiz-content");
    const words = moduleBank[appState.currentLevel];



    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel quiz-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    const lang = appState.activeLanguage;

    quizState.currentWord = words[Math.floor(Math.random() * words.length)];
    quizState.options = generateQuizOptions(words, quizState.currentWord);
    quizState.selected = null;

    container.innerHTML = `
    <div class="glass-panel quiz-card">
        <h2>Quiz — Level ${appState.currentLevel}</h2>
        <p>Select the correct translation for the English word.</p>

        <div id="qb-meta"><strong>English:</strong> ${quizState.currentWord.english}</div>

        <div id="qb-grid" class="sb-grid">
            ${quizState.options.map(opt => `
                <button class="pill" data-translation="${opt}">${opt}</button>
            `).join("")}
        </div>

        <div id="qb-answer" class="qb-answer"></div>

        <div class="sb-controls quiz-controls-tight">
            <button id="qb-submit">Check</button>
            <button id="qb-next">Next</button>
            <button id="qb-harder" class="${quizState.harderMode ? "active" : ""}">Harder</button>
        </div>

        <div id="qb-feedback" class="qb-feedback"></div>
    </div>
    `;

    setupQuizEvents();
}

/* ============================================================
   QUIZ EVENTS
   ============================================================ */

function setupQuizEvents() {
    const grid = document.getElementById("qb-grid");
    const submitBtn = document.getElementById("qb-submit");
    const nextBtn = document.getElementById("qb-next");
    const harderBtn = document.getElementById("qb-harder");
    const feedback = document.getElementById("qb-feedback");
    const answerBox = document.getElementById("qb-answer");

    const lang = appState.activeLanguage;

    quizState.selected = null;

    // Pill selection
    grid.querySelectorAll(".pill").forEach(btn => {
        btn.addEventListener("click", () => {
            grid.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            quizState.selected = btn.dataset.translation;
            answerBox.textContent = quizState.selected;
        });
    });

    // Helper: translate selected → English
    function getEnglishForTranslation(translatedWord) {
        const levelWords = CEFR_LEVELS[appState.currentLevel];
        const match = levelWords.find(w =>
            (w[lang] || w.spanish) === translatedWord
        );
        return match ? match.english : "[no match]";
    }

    // Check button
    submitBtn.addEventListener("click", () => {
        if (!quizState.selected) {
            feedback.textContent = "Choose an answer first.";
            return;
        }

        const correct = quizState.currentWord[lang] || quizState.currentWord.spanish;
        const learnerTranslated = quizState.selected;
        const learnerEnglish = getEnglishForTranslation(learnerTranslated);

        // Ensure quizScore is not null before incrementing
        if (appState.levelStats[appState.currentLevel].quizScore === null) {
            appState.levelStats[appState.currentLevel].quizScore = 0;
        }

        // Correct / Incorrect feedback
        if (learnerTranslated === correct) {
            feedback.innerHTML = `
                <div class="quiz-correct">Correct! 🎉</div>
                <div class="quiz-selected"><strong>You selected:</strong> ${learnerTranslated} (${learnerEnglish})</div>
            `;

            appState.levelStats[appState.currentLevel].quizScore++;
            appState.levelStats[appState.currentLevel].quizCompleted++;

            appState.totalXP = (appState.totalXP || 0) + 10; 
            appState.globalScore = (appState.globalScore || 0) + 5;

            checkAndAdvanceStreak();
            updateBadges();
            updateProgressMeters();

        } else {
            feedback.innerHTML = `
                <div class="quiz-incorrect">Incorrect — correct answer: ${correct}</div>
                <div class="quiz-selected"><strong>You selected:</strong> ${learnerTranslated} (${learnerEnglish})</div>
            `;

            const mistakeString = `${quizState.currentWord.english} ➔ ${correct}`;
            addIncorrectWord(mistakeString);
        }

        // Audio
        setTimeout(() => speakQuiz(correct), 50);

        saveState();
    });

    // Next button
    nextBtn.addEventListener("click", () => {
        renderQuizTab();
    });

    // Harder mode toggle
    harderBtn.addEventListener("click", () => {
        quizState.harderMode = !quizState.harderMode;
        harderBtn.classList.toggle("active");
        renderQuizTab();
    });
}


// ============================================================
// BUILD MODULE — simple “play Spanish” sentence
// ============================================================

async function initBuild() {
  const container = $("buildSection");
  if (!container) return;

  let moduleBank;
  try {
    const loaded = await loadModule("listen");
    moduleBank = loaded.moduleBank;
  } catch (e) {
    container.innerHTML = "<p>Unable to load build data.</p>";
    return;
  }

  const LEVELS = moduleBank;
  const levelData = LEVELS[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData) || !levelData.length) {
    container.innerHTML = "<p>No build data available for this level.</p>";
    return;
  }

  const item = levelData[0]; // { english, spanish }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Build — Level ${appState.activeLevel}</h2>
      <strong>${item.english}</strong>
      <p>Click play, then try to say the Spanish aloud.</p>
      <button class="pill" id="build-play">Play Spanish</button>
    </div>
  `;

  const playBtn = $("build-play");
  if (playBtn) {
    playBtn.onclick = () => {
      speakText(item.spanish);
      addXP(2);
      appState.levelStats[appState.activeLevel].sentences += 10;
      updateProgressMeters();
    };
  }
}

// ============================================================
// SENTENCE MODULE — uses LEVELS
// ============================================================

async function initSentence() {
  const container = $("sentenceSection");
  if (!container) return;

  let moduleBank;
  try {
    const loaded = await loadModule("listen");
    moduleBank = loaded.moduleBank;
  } catch (e) {
    container.innerHTML = "<p>Unable to load sentence data.</p>";
    return;
  }

  const LEVELS = moduleBank;
  const levelData = LEVELS[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData) || !levelData.length) {
    container.innerHTML = "<p>No sentence data available for this level.</p>";
    return;
  }

  const sentence = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Sentence Trainer — Level ${appState.activeLevel}</h2>
      <strong>${sentence.spanish}</strong>
      <em>${sentence.english}</em>
      <button class="pill" id="sentence-play">Play</button>
    </div>
  `;

  const playBtn = $("sentence-play");
  if (playBtn) {
    playBtn.onclick = () => {
      speakText(sentence.spanish);
      addXP(1);
      appState.levelStats[appState.activeLevel].sentences += 5;
      updateProgressMeters();
    };
  }
}

// ============================================================
// CONVERSATION MODULE — placeholder using LEVELS
// ============================================================

async function initConversation() {
  const container = $("conversationSection");
  if (!container) return;

  let moduleBank;
  try {
    const loaded = await loadModule("listen");
    moduleBank = loaded.moduleBank;
  } catch (e) {
    container.innerHTML = "<p>Unable to load conversation data.</p>";
    return;
  }

  const LEVELS = moduleBank;
  const levelData = LEVELS[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData) || !levelData.length) {
    container.innerHTML = "<p>No conversation data available for this level.</p>";
    return;
  }

  const turn = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Conversation — Level ${appState.activeLevel}</h2>
      <strong>Speaker:</strong> ${turn.spanish}
      <button class="pill" id="conversation-play">Play</button>
    </div>
  `;

  const playBtn = $("conversation-play");
  if (playBtn) {
    playBtn.onclick = () => {
      speakText(turn.spanish);
      addXP(2);
      addScore(1);
      updateProgressMeters();
    };
  }
}

// ============================================================
// GRAMMAR MODULE — uses LEVELS as rules
// ============================================================

async function initGrammar() {
  const container = $("grammarSection");
  if (!container) return;

  let moduleBank;
  try {
    const loaded = await loadModule("listen");
    moduleBank = loaded.moduleBank;
  } catch (e) {
    container.innerHTML = "<p>Unable to load grammar data.</p>";
    return;
  }

  const LEVELS = moduleBank;
  const levelData = LEVELS[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData) || !levelData.length) {
    container.innerHTML = "<p>No grammar data available for this level.</p>";
    return;
  }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Grammar — Level ${appState.activeLevel}</h2>
      <ul>
        ${levelData.map(rule => `
          <li><strong>${rule.english}</strong><br>${rule.spanish}</li>
        `).join("")}
      </ul>
    </div>
  `;
}

// ============================================================
// MINING MODULE
// ============================================================

async function initMining() {
  const container = $("miningSection");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Mining — Level ${appState.activeLevel}</h2>
      <input id="mining-input" class="pill" placeholder="Type a word">
      <button class="pill" id="mining-add">Add</button>
      <div id="mining-list"></div>
    </div>
  `;

  const inputEl = $("mining-input");
  const addBtn = $("mining-add");

  if (addBtn && inputEl) {
    addBtn.onclick = () => {
      const text = inputEl.value.trim();
      if (!text) return;

      appState.miningWords.push(text);
      inputEl.value = "";
      renderMiningList();
    };
  }

  renderMiningList();
}

function renderMiningList() {
  const listEl = $("mining-list");
  if (!listEl) return;

  if (!appState.miningWords.length) {
    listEl.innerHTML = "<p>No mined items yet.</p>";
    return;
  }

  listEl.innerHTML = `
    <ul>
      ${appState.miningWords.map(w => `<li>${w}</li>`).join("")}
    </ul>
  `;
}

// ============================================================
// DICTIONARY MODULE
// ============================================================

async function initDictionary() {
  const container = $("dictionarySection");
  if (!container) return;

  let moduleBank;
  try {
    const loaded = await loadModule("dictionary");
    moduleBank = loaded.moduleBank;
  } catch (e) {
    container.innerHTML = "<p>Unable to load dictionary.</p>";
    return;
  }

  const DICT = moduleBank;

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Dictionary — Level ${appState.activeLevel}</h2>
      <input id="dict-input" class="ui-input" placeholder="Type a word (English or target language)">
      <button class="pill" id="dict-search">Search</button>
      <div id="dict-output"></div>
    </div>
  `;

  const inputEl = $("dict-input");
  const searchBtn = $("dict-search");
  const outputEl = $("dict-output");

  if (!inputEl || !searchBtn || !outputEl) return;

  searchBtn.onclick = () => {
    const query = inputEl.value.trim().toLowerCase();
    if (!query) {
      outputEl.textContent = "";
      return;
    }

    const entry = DICT[query];
    if (!entry) {
      outputEl.textContent = "No entry found.";
      return;
    }

    const lang = appState.activeLanguage;
    const translation = entry[lang] || entry.es || "";
    outputEl.textContent = translation ? translation : "No translation for this language.";
  };
}

// ============================================================
// REVIEW MODULE
// ============================================================

function initReview() {
  const container = $("reviewSection");
  if (!container) return;

  if (!appState.mistakes.length) {
    container.innerHTML = `
      <div class="glass-panel quiz-card">
        <h2>Review — Level ${appState.activeLevel}</h2>
        <p>No mistakes yet. Keep training!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Review — Level ${appState.activeLevel}</h2>
      <ul>
        ${appState.mistakes.map(w => `<li>${w}</li>`).join("")}
      </ul>
    </div>
  `;
}

// ============================================================
// REPEAT MODULE
// ============================================================

async function initRepeat() {
  const container = $("repeatSection");
  if (!container) return;

  let moduleBank;
  try {
    const loaded = await loadModule("repeat");
    moduleBank = loaded.moduleBank;
  } catch (e) {
    container.innerHTML = "<p>Unable to load repeat practice.</p>";
    return;
  }

  const REPEAT_BANK = moduleBank;
  const items = REPEAT_BANK[appState.activeLevel] || REPEAT_BANK;

  if (!items || !Array.isArray(items) || !items.length) {
    container.innerHTML = "<p>No repeat items available for this level.</p>";
    return;
  }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Repeat Practice — Level ${appState.activeLevel}</h2>
      <div id="repeat-list">
        ${items.map(w => `
          <button class="pill repeat-pill" data-word="${w.spanish}">
            ${w.english} — ${w.spanish}
          </button>
        `).join("")}
      </div>
    </div>
  `;

  document.querySelectorAll(".repeat-pill").forEach(btn => {
    btn.onclick = () => {
      const word = btn.dataset.word;
      speakText(word);
      addXP(1);
      updateProgressMeters();
    };
  });
}

// ============================================================
// CERTIFICATES MODULE
// ============================================================

function initCertificates() {
  const container = $("certificatesSection");
  if (!container) return;

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Certificates</h2>
      <p>Generate a certificate for your current level.</p>
      <button class="pill" id="generate-cert">Generate Certificate</button>
    </div>
  `;

  const btn = $("generate-cert");
  if (btn) {
    btn.onclick = () => {
      switchTab("certificateGeneratorPage");
    };
  }
}

function initCertificatePage() {
  const nameEl = $("certStudentName");
  const levelBadgeEl = $("certLevelBadge");
  const descriptorEl = $("certDescriptor");
  const dateEl = $("certDate");
  const idEl = $("certID");

  if (!nameEl || !levelBadgeEl || !descriptorEl || !dateEl || !idEl) return;

  const name = appState.certificateName || "[Student Name]";
  const level = appState.activeLevel;

  nameEl.textContent = name;
  levelBadgeEl.textContent = level;

  const descriptors = {
    A1: "Can understand and use very basic everyday expressions to satisfy concrete needs. Can introduce themselves and ask simple questions about personal details.",
    A2: "Can understand frequently used sentences related to direct areas of relevance like shopping, work, and local geography. Can communicate in simple, routine tasks.",
    B1: "Can deal with most situations likely to arise while traveling in an area where the language is spoken. Can produce simple connected text on familiar topics and describe experiences, hopes, and ambitions.",
    B2: "Can understand the main ideas of complex text on concrete and abstract topics. Can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite easy."
  };

  descriptorEl.textContent = descriptors[level] || "Level descriptor not available.";

  const today = new Date();
  dateEl.textContent = today.toLocaleDateString();

  const randomId = `LLT-${Math.floor(Math.random() * 900000 + 100000)}`;
  idEl.textContent = randomId;
}

// ============================================================
// INIT APP
// ============================================================

function initApp() {
  initTabs();
  switchTab("dashboard");
}

document.addEventListener("DOMContentLoaded", initApp);
