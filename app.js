// ============================================================
//  APP CORE — MULTI-LANGUAGE CEFR PLATFORM
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
  dueReviewCount: 0,
  mistakes: [],
  miningWords: [],
  certificateName: ""
};

// ============================================================
//  PART 1 — CORE STATE + HELPERS
// ============================================================

// ---------- BASIC DOM HELPER ----------

function $(id) {
  return document.getElementById(id);
}

// ---------- SPEECH SYNTHESIS HELPER ----------

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

// ---------- XP / SCORE / STREAK HELPERS ----------

function addXP(amount = 1) {
  appState.levelStats[appState.activeLevel].xp += amount;
}

function addScore(amount = 1) {
  appState.scoreRating += amount;
}

function incrementStreak() {
  appState.streakDays += 1;
}

function totalXP() {
  return Object.values(appState.levelStats)
    .reduce((sum, lvl) => sum + lvl.xp, 0);
}

// ============================================================
//  PART 2 — TAB ROUTER + LANGUAGE + CEFR CONTROLS
// ============================================================

// ---------- TAB SWITCHER ----------

function switchTab(tabId) {
  appState.activeTab = tabId;

  document.querySelectorAll(".appSection").forEach(sec => {
    sec.style.display = sec.id === tabId ? "block" : "none";
  });

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
}

// ---------- TAB BUTTONS ----------

function initTabs() {
  document.querySelectorAll("[data-tab-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tabTarget;
      switchTab(target);
    });
  });
}

// ---------- LANGUAGE SWITCHING (es, fr, nl) ----------

function initLanguageControls() {
  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;

      appState.activeLanguage = lang;
      setLanguage(lang);

      switchTab(appState.activeTab);
    });
  });
}

// ---------- CEFR LEVEL SWITCHING (A1–B2) ----------

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

// ---------- AUDIO SPEED SLIDER ----------

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
//  PART 3 — DASHBOARD + PROGRESS SYSTEM + CERTIFICATE NAME
// ============================================================

// ---------- DASHBOARD INITIALIZER ----------

function initDashboard() {
  switchTab("dashboard");

  initAudioSpeed();
  initLanguageControls();
  initLevelControls();
  initCertificateName();

  updateProgressMeters();
}

// ---------- CERTIFICATE NAME SAVING ----------

function initCertificateName() {
  const input = $("certificateNameInput");
  const btn = $("saveCertificateName");

  if (!input || !btn) return;

  if (appState.certificateName.trim() !== "") {
    input.value = appState.certificateName;
  }

  btn.addEventListener("click", () => {
    const name = input.value.trim();
    appState.certificateName = name;
  });
}

// ---------- PROGRESS METER UPDATES ----------

function updateProgressMeters() {
  if ($("quizProgress")) {
    $("quizProgress").textContent =
      `${appState.levelStats[appState.activeLevel].quizzes}%`;
  }

  if ($("buildProgress")) {
    $("buildProgress").textContent =
      `${appState.levelStats[appState.activeLevel].sentences}%`;
  }

  if ($("sentenceProgress")) {
    $("sentenceProgress").textContent =
      `${appState.levelStats[appState.activeLevel].sentences}%`;
  }

  if ($("xpProgress")) {
    $("xpProgress").textContent = `${totalXP()} XP`;
  }

  if ($("streakCount")) {
    $("streakCount").textContent = `${appState.streakDays} days`;
  }

  if ($("scoreRating")) {
    $("scoreRating").textContent = `${appState.scoreRating} pts`;
  }

  if ($("dueReview")) {
    $("dueReview").textContent = `${appState.mistakes.length} words`;
  }
}

// ============================================================
//  PART 4 — LISTEN MODULE (FULLY WIRED)
// ============================================================

let listenAutoPlay = {
  active: false,
  paused: false,
  index: 0,
  list: []
};

function speakWord(word) {
  const utter = new SpeechSynthesisUtterance(word);

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

function playNextListenWord() {
  if (!listenAutoPlay.active || listenAutoPlay.paused) return;

  const list = listenAutoPlay.list;

  if (listenAutoPlay.index >= list.length) {
    listenAutoPlay.active = false;
    return;
  }

  const word = list[listenAutoPlay.index];
  speakWord(word);

  listenAutoPlay.index++;

  setTimeout(() => playNextListenWord(), 200);
}

async function initListen() {
  const { moduleBank } = await loadModule("listen");
  const LISTEN_VOCAB = moduleBank.LISTEN_VOCAB;

  const container = $("listenSection");
  if (!container || !LISTEN_VOCAB) return;

  const levelData = LISTEN_VOCAB[appState.activeLevel];
  if (!levelData) {
    container.innerHTML = "<p>No listening data available for this level.</p>";
    return;
  }

  let html = `
    <div class="glass-panel quiz-card">
      <h2>Listen — Level ${appState.activeLevel}</h2>
      <p>Tap a word to hear it, or use the global controls.</p>
      <div class="listen-player-controls" style="
        display:flex;
        gap:6px;
        flex-wrap:wrap;
        margin-top:6px;
      ">
        <button class="pill" id="listen-playall">Play All</button>
        <button class="pill" id="listen-pause">Pause</button>
        <button class="pill" id="listen-resume">Resume</button>
        <button class="pill" id="listen-stop">Stop</button>
      </div>
    </div>
  `;

  Object.keys(levelData).forEach(categoryName => {
    const words = levelData[categoryName];

    html += `
      <div class="glass-panel">
        <h3>${categoryName}</h3>
        <div class="listen-grid" style="
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));
          gap:6px;
          margin-top:8px;
        ">
          ${words.map(word => `
            <button class="pill listen-pill" data-word="${word}">
              ${word}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  listenAutoPlay.list = Object.values(levelData).flat();

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
    btn.addEventListener("click", () => {
      const word = btn.dataset.word;
      speakWord(word);

      appState.levelStats[appState.activeLevel].listens++;
      updateProgressMeters();
    });
  });
}

// ============================================================
//  PART 5 — FLASHCARDS MODULE (FULLY WIRED)
// ============================================================

let flashcards = [];
let flashIndex = 0;

function renderFlashcardUI(container) {
  if (!flashcards.length) {
    container.innerHTML = "<p>No flashcards available for this level.</p>";
    return;
  }

  const card = flashcards[flashIndex];

  container.innerHTML = `
    <div class="glass-panel quiz-card" style="text-align:center;">
      <h2>Flashcards — Level ${appState.activeLevel}</h2>
      <p>Tap the card to flip it.</p>

      <div id="flashcard" class="flashcard">
        <div class="flashcard-inner">
          <div class="flashcard-front">
            <span>${card.english}</span>
          </div>
          <div class="flashcard-back">
            <span>${card[appState.activeLanguage]}</span>
          </div>
        </div>
      </div>

      <div class="flashcard-controls" style="
        display:flex;
        justify-content:center;
        gap:10px;
        margin-top:15px;
      ">
        <button class="pill" id="flash-prev">Previous</button>
        <button class="pill" id="flash-next">Next</button>
      </div>
    </div>
  `;

  setupFlashcardEvents();
}

function setupFlashcardEvents() {
  const card = $("flashcard");
  const prevBtn = $("flash-prev");
  const nextBtn = $("flash-next");

  if (!card || !prevBtn || !nextBtn) return;

  card.addEventListener("click", () => {
    card.classList.toggle("flipped");
  });

  prevBtn.addEventListener("click", () => {
    flashIndex = (flashIndex - 1 + flashcards.length) % flashcards.length;
    updateFlashcard();
  });

  nextBtn.addEventListener("click", () => {
    flashIndex = (flashIndex + 1) % flashcards.length;
    updateFlashcard();
  });
}

function updateFlashcard() {
  const container = $("flashcardsSection");
  if (!container) return;
  renderFlashcardUI(container);

  addXP(1);
  addScore(1);
  updateProgressMeters();
}

async function initFlashcards() {
  const { moduleBank } = await loadModule("flashcards");
  const PHRASES = moduleBank.CEFR_PHRASES;

  const container = $("flashcardsSection");
  if (!container || !PHRASES) return;

  const levelData = PHRASES[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData)) {
    container.innerHTML = "<p>No flashcards found for this level.</p>";
    return;
  }

  flashcards = levelData.map(entry => ({
    english: entry.english,
    es: entry.spanish,
    fr: entry.french,
    nl: entry.dutch
  }));

  flashIndex = 0;

  renderFlashcardUI(container);
}

// ============================================================
//  PART 6 — QUIZ + BUILD + SENTENCE MODULES
// ============================================================

async function initQuiz() {
  const { moduleBank } = await loadModule("quiz");
  const DISRUPTORS = moduleBank.DISRUPTORS;

  const container = $("quizSection");
  if (!container || !DISRUPTORS) return;

  const levelData = DISRUPTORS[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData)) {
    container.innerHTML = "<p>No quiz data for this level.</p>";
    return;
  }

  const question = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Quiz — Level ${appState.activeLevel}</h2>
      <p>Select the correct answer.</p>

      <div class="quiz-question">
        <strong>${question.prompt}</strong>
      </div>

      <div class="quiz-options">
        ${question.options.map((opt, idx) => `
          <button class="pill quiz-option" data-index="${idx}">
            ${opt}
          </button>
        `).join("")}
      </div>

      <div id="quiz-feedback" style="margin-top:10px;"></div>
    </div>
  `;

  document.querySelectorAll(".quiz-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index, 10);
      const feedback = $("quiz-feedback");

      if (idx === question.correctIndex) {
        feedback.textContent = "Correct!";
        addXP(2);
        addScore(2);
        appState.levelStats[appState.activeLevel].quizzes += 10;
      } else {
        feedback.textContent = "Try again.";
        appState.mistakes.push(question.prompt);
      }

      updateProgressMeters();
    });
  });
}

async function initBuild() {
  const { moduleBank } = await loadModule("build");
  const CHOICES = moduleBank.CEFR_SENTENCE_CHOICES;

  const container = $("buildSection");
  if (!container || !CHOICES) return;

  const levelData = CHOICES[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData)) {
    container.innerHTML = "<p>No build data for this level.</p>";
    return;
  }

  const item = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Build — Level ${appState.activeLevel}</h2>
      <p>Choose the correct sentence.</p>

      <div class="build-prompt">
        <strong>${item.prompt}</strong>
      </div>

      <div class="build-options">
        ${item.options.map((opt, idx) => `
          <button class="pill build-option" data-index="${idx}">
            ${opt}
          </button>
        `).join("")}
      </div>

      <div id="build-feedback" style="margin-top:10px;"></div>
    </div>
  `;

  document.querySelectorAll(".build-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index, 10);
      const feedback = $("build-feedback");

      if (idx === item.correctIndex) {
        feedback.textContent = "Correct sentence!";
        addXP(2);
        addScore(2);
        appState.levelStats[appState.activeLevel].sentences += 10;
      } else {
        feedback.textContent = "Not quite. Try again.";
        appState.mistakes.push(item.prompt);
      }

      updateProgressMeters();
    });
  });
}

async function initSentence() {
  const { moduleBank } = await loadModule("sentence");
  const SENTENCES = moduleBank.CEFR_SENTENCES;

  const container = $("sentenceSection");
  if (!container || !SENTENCES) return;

  const levelData = SENTENCES[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData)) {
    container.innerHTML = "<p>No sentence data for this level.</p>";
    return;
  }

  const sentence = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Sentence Trainer — Level ${appState.activeLevel}</h2>
      <p>Read and listen to the sentence.</p>

      <div class="sentence-block">
        <strong>${sentence.target}</strong>
      </div>

      <div class="sentence-translation">
        <em>${sentence.english}</em>
      </div>

      <div class="sentence-controls" style="margin-top:10px;">
        <button class="pill" id="sentence-play">Play</button>
      </div>
    </div>
  `;

  $("sentence-play").onclick = () => {
    speakText(sentence.target);
    addXP(1);
    appState.levelStats[appState.activeLevel].sentences += 5;
    updateProgressMeters();
  };
}

// ============================================================
//  PART 7 — CONVERSATION + GRAMMAR + MINING + DICTIONARY
// ============================================================

async function initConversation() {
  const { moduleBank } = await loadModule("conversation");
  const CONVO = moduleBank.CEFR_CONVERSATION;

  const container = $("conversationSection");
  if (!container || !CONVO) return;

  const levelData = CONVO[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData)) {
    container.innerHTML = "<p>No conversation data for this level.</p>";
    return;
  }

  const turn = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Conversation — Level ${appState.activeLevel}</h2>
      <p>Listen and repeat the dialogue.</p>

      <div class="conversation-line">
        <strong>${turn.speaker}:</strong> ${turn.text}
      </div>

      <div class="conversation-controls" style="margin-top:10px;">
        <button class="pill" id="conversation-play">Play</button>
      </div>
    </div>
  `;

  $("conversation-play").onclick = () => {
    speakText(turn.text);
    addXP(2);
    addScore(1);
    updateProgressMeters();
  };
}

async function initGrammar() {
  const { moduleBank } = await loadModule("grammar");
  const LEVELS = moduleBank.CEFR_LEVELS;

  const container = $("grammarSection");
  if (!container || !LEVELS) return;

  const levelData = LEVELS[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData)) {
    container.innerHTML = "<p>No grammar data for this level.</p>";
    return;
  }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Grammar — Level ${appState.activeLevel}</h2>
      <ul class="grammar-list">
        ${levelData.map(rule => `
          <li>
            <strong>${rule.title}</strong><br>
            <span>${rule.explanation}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  `;
}

async function initMining() {
  const { moduleBank } = await loadModule("mining");
  const MINING = moduleBank.mining_references;

  const container = $("miningSection");
  if (!container || !MINING) return;

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Mining — Level ${appState.activeLevel}</h2>
      <p>Save interesting words or phrases for later review.</p>

      <div class="mining-controls" style="margin-top:10px;">
        <input id="mining-input" class="pill" placeholder="Type a word or phrase">
        <button class="pill" id="mining-add">Add to Mining</button>
      </div>

      <div id="mining-list" style="margin-top:15px;"></div>
    </div>
  `;

  const input = $("mining-input");
  const addBtn = $("mining-add");
  const list = $("mining-list");

  addBtn.onclick = () => {
    const text = (input.value || "").trim();
    if (!text) return;

    appState.miningWords.push(text);
    input.value = "";
    renderMiningList(list);
  };

  renderMiningList(list);
}

function renderMiningList(listEl) {
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

async function initDictionary() {
  const { moduleBank } = await loadModule("dictionary");
  const DICT = moduleBank.WORD_DICT;

  const container = $("dictionarySection");
  if (!container || !DICT) return;

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Dictionary</h2>
      <p>Search for a word.</p>

      <div class="dictionary-controls" style="margin-top:10px;">
        <input id="dict-input" class="pill" placeholder="Enter word">
        <button class="pill" id="dict-search">Search</button>
      </div>

      <div id="dict-result" style="margin-top:15px;"></div>
    </div>
  `;

  const input = $("dict-input");
  const btn = $("dict-search");
  const result = $("dict-result");

  btn.onclick = () => {
    const query = (input.value || "").trim().toLowerCase();
    if (!query) {
      result.innerHTML = "<p>Please enter a word.</p>";
      return;
    }

    const entry = DICT[query];
    if (!entry) {
      result.innerHTML = "<p>No entry found.</p>";
      return;
    }

    result.innerHTML = `
      <p><strong>${query}</strong><br>
      <em>${entry.definition}</em></p>
    `;
  };
}

// ============================================================
//  PART 8 — REVIEW + REPEAT PRACTICE + CERTIFICATES + APP INIT
// ============================================================

async function initReview() {
  const container = $("reviewSection");
  if (!container) return;

  if (appState.mistakes.length === 0) {
    container.innerHTML = `
      <div class="glass-panel quiz-card">
        <h2>Review</h2>
        <p>No mistakes yet. Great job!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Review Mistakes</h2>
      <p>Retry the words or phrases you missed.</p>

      <ul id="review-list" class="review-list">
        ${appState.mistakes.map((m, i) => `
          <li>
            ${m}
            <button class="pill review-retry" data-index="${i}">
              Retry
            </button>
          </li>
        `).join("")}
      </ul>
    </div>
  `;

  document.querySelectorAll(".review-retry").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index, 10);
      const word = appState.mistakes[idx];

      speakText(word);

      appState.mistakes.splice(idx, 1);
      updateProgressMeters();
      initReview();
    });
  });
}

async function initRepeat() {
  const { moduleBank } = await loadModule("repeat");
  const REPEAT_BANK = moduleBank.default || moduleBank;

  const container = $("repeatSection");
  if (!container || !REPEAT_BANK) return;

  const levelData = REPEAT_BANK[appState.activeLevel];
  if (!levelData || !Array.isArray(levelData)) {
    container.innerHTML = "<p>No repeat practice data for this level.</p>";
    return;
  }

  const phrase = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Repeat Practice — Level ${appState.activeLevel}</h2>
      <p>Listen and repeat aloud.</p>

      <div class="repeat-line">
        <strong>${phrase}</strong>
      </div>

      <div class="repeat-controls" style="margin-top:10px;">
        <button class="pill" id="repeat-play">Play</button>
      </div>
    </div>
  `;

  $("repeat-play").onclick = () => {
    speakText(phrase);
    addXP(1);
    addScore(1);
    updateProgressMeters();
  };
}

function initCertificates() {
  const container = $("certificatesSection");
  if (!container) return;

  const name = appState.certificateName || "Learner";

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Certificate</h2>
      <p>Preview your CEFR certificate.</p>

      <div class="certificate-preview" style="
        margin-top:15px;
        padding:20px;
        border:2px solid #fff;
        border-radius:10px;
        text-align:center;
      ">
        <h3>Certificate of Achievement</h3>
        <p>This certifies that</p>
        <h2>${name}</h2>
        <p>has completed CEFR Level</p>
        <h2>${appState.activeLevel}</h2>
        <p>Total XP: ${totalXP()}</p>
      </div>
    </div>
  `;
}

// ---------- FINAL APP INITIALIZATION ----------

window.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initDashboard();
});
