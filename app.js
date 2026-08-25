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
  mistakes: [],
  miningWords: [],
  certificateName: ""
};

// ============================================================
//  BASIC HELPERS
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
//  TAB ROUTER
// ============================================================

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
//  LANGUAGE + LEVEL + AUDIO
// ============================================================

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
//  DASHBOARD
// ============================================================

function initDashboard() {
  initAudioSpeed();
  initLanguageControls();
  initLevelControls();
  initCertificateName();
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
  $("quizProgress").textContent =
    `${appState.levelStats[appState.activeLevel].quizzes}%`;

  $("buildProgress").textContent =
    `${appState.levelStats[appState.activeLevel].sentences}%`;

  $("sentenceProgress").textContent =
    `${appState.levelStats[appState.activeLevel].sentences}%`;

  $("xpProgress").textContent = `${totalXP()} XP`;
  $("streakCount").textContent = `${appState.streakDays} days`;
  $("scoreRating").textContent = `${appState.scoreRating} pts`;
  $("dueReview").textContent = `${appState.mistakes.length} words`;
}

// ============================================================
//  LISTEN MODULE
// ============================================================

let listenAutoPlay = {
  active: false,
  paused: false,
  index: 0,
  list: []
};

function speakWord(word) {
  speakText(word);
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
  const LISTEN_VOCAB = moduleBank;

  const container = $("listenSection");
  if (!container || !LISTEN_VOCAB) return;

  const levelData = LISTEN_VOCAB[appState.activeLevel];
  if (!levelData) {
    container.innerHTML = "<p>No listening data available.</p>";
    return;
  }

  let html = `
    <div class="glass-panel quiz-card">
      <h2>Listen — Level ${appState.activeLevel}</h2>
      <div class="listen-player-controls">
        <button class="pill" id="listen-playall">Play All</button>
        <button class="pill" id="listen-pause">Pause</button>
        <button class="pill" id="listen-resume">Resume</button>
        <button class="pill" id="listen-stop">Stop</button>
      </div>
    </div>
  `;

  Object.keys(levelData).forEach(category => {
    const words = levelData[category];
    html += `
      <div class="glass-panel">
        <h3>${category}</h3>
        <div class="listen-grid">
          ${words.map(w => `
            <button class="pill listen-pill" data-word="${w}">${w}</button>
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
      speakWord(btn.dataset.word);
      appState.levelStats[appState.activeLevel].listens++;
      updateProgressMeters();
    });
  });
}

// ============================================================
//  FLASHCARDS MODULE
// ============================================================

let flashcards = [];
let flashIndex = 0;

async function initFlashcards() {
  const { moduleBank } = await loadModule("flashcards");
  const PHRASES = moduleBank;

  const container = $("flashcardsSection");
  if (!container || !PHRASES) return;

  const levelData = PHRASES[appState.activeLevel];
  if (!levelData) {
    container.innerHTML = "<p>No flashcards available.</p>";
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

function renderFlashcardUI(container) {
  const card = flashcards[flashIndex];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Flashcards — Level ${appState.activeLevel}</h2>
      <div id="flashcard" class="flashcard">
        <div class="flashcard-inner">
          <div class="flashcard-front">${card.english}</div>
          <div class="flashcard-back">${card[appState.activeLanguage]}</div>
        </div>
      </div>
      <div class="flashcard-controls">
        <button class="pill" id="flash-prev">Previous</button>
        <button class="pill" id="flash-next">Next</button>
      </div>
    </div>
  `;

  $("flashcard").onclick = () => {
    $("flashcard").classList.toggle("flipped");
  };

  $("flash-prev").onclick = () => {
    flashIndex = (flashIndex - 1 + flashcards.length) % flashcards.length;
    renderFlashcardUI(container);
  };

  $("flash-next").onclick = () => {
    flashIndex = (flashIndex + 1) % flashcards.length;
    renderFlashcardUI(container);
  };
}

// ============================================================
//  QUIZ MODULE
// ============================================================

async function initQuiz() {
  const { moduleBank } = await loadModule("quiz");
  const DISRUPTORS = moduleBank;

  const container = $("quizSection");
  if (!container || !DISRUPTORS) return;

  const levelData = DISRUPTORS[appState.activeLevel];
  if (!levelData) {
    container.innerHTML = "<p>No quiz data available.</p>";
    return;
  }

  const question = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Quiz — Level ${appState.activeLevel}</h2>
      <strong>${question.prompt}</strong>
      <div class="quiz-options">
        ${question.options.map((opt, idx) => `
          <button class="pill quiz-option" data-index="${idx}">${opt}</button>
        `).join("")}
      </div>
      <div id="quiz-feedback"></div>
    </div>
  `;

  document.querySelectorAll(".quiz-option").forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index);
      const feedback = $("quiz-feedback");

      if (idx === question.correctIndex) {
        feedback.textContent = "Correct!";
        addXP(2);
        addScore(2);
        appState.levelStats[appState.activeLevel].quizzes += 10;
      } else {
        feedback.textContent = "Incorrect.";
        appState.mistakes.push(question.prompt);
      }

      updateProgressMeters();
    };
  });
}

// ============================================================
//  BUILD MODULE
// ============================================================

async function initBuild() {
  const { moduleBank } = await loadModule("build");
  const CHOICES = moduleBank;

  const container = $("buildSection");
  if (!container || !CHOICES) return;

  const levelData = CHOICES[appState.activeLevel];
  if (!levelData) {
    container.innerHTML = "<p>No build data available.</p>";
    return;
  }

  const item = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Build — Level ${appState.activeLevel}</h2>
      <strong>${item.prompt}</strong>
      <div class="build-options">
        ${item.options.map((opt, idx) => `
          <button class="pill build-option" data-index="${idx}">${opt}</button>
        `).join("")}
      </div>
      <div id="build-feedback"></div>
    </div>
  `;

  document.querySelectorAll(".build-option").forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index);
      const feedback = $("build-feedback");

      if (idx === item.correctIndex) {
        feedback.textContent = "Correct!";
        addXP(2);
        addScore(2);
        appState.levelStats[appState.activeLevel].sentences += 10;
      } else {
        feedback.textContent = "Incorrect.";
        appState.mistakes.push(item.prompt);
      }

      updateProgressMeters();
    };
  });
}

// ============================================================
//  SENTENCE MODULE
// ============================================================

async function initSentence() {
  const { moduleBank } = await loadModule("sentence");
  const SENTENCES = moduleBank;

  const container = $("sentenceSection");
  if (!container || !SENTENCES) return;

  const levelData = SENTENCES[appState.activeLevel];
  if (!levelData) {
    container.innerHTML = "<p>No sentence data available.</p>";
    return;
  }

  const sentence = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Sentence Trainer — Level ${appState.activeLevel}</h2>
      <strong>${sentence.target}</strong>
      <em>${sentence.english}</em>
      <button class="pill" id="sentence-play">Play</button>
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
//  CONVERSATION MODULE
// ============================================================

async function initConversation() {
  const { moduleBank } = await loadModule("conversation");
  const CONVO = moduleBank;

  const container = $("conversationSection");
  if (!container || !CONVO) return;

  const levelData = CONVO[appState.activeLevel];
  if (!levelData) {
    container.innerHTML = "<p>No conversation data available.</p>";
    return;
  }

  const turn = levelData[0];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Conversation — Level ${appState.activeLevel}</h2>
      <strong>${turn.speaker}:</strong> ${turn.text}
      <button class="pill" id="conversation-play">Play</button>
    </div>
  `;

  $("conversation-play").onclick = () => {
    speakText(turn.text);
    addXP(2);
    addScore(1);
    updateProgressMeters();
  };
}

// ============================================================
//  GRAMMAR MODULE
// ============================================================

async function initGrammar() {
  const { moduleBank } = await loadModule("grammar");
  const LEVELS = moduleBank;

  const container = $("grammarSection");
  if (!container || !LEVELS) return;

  const levelData = LEVELS[appState.activeLevel];
  if (!levelData) {
    container.innerHTML = "<p>No grammar data available.</p>";
    return;
  }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Grammar — Level ${appState.activeLevel}</h2>
      <ul>
        ${levelData.map(rule => `
          <li><strong>${rule.title}</strong><br>${rule.explanation}</li>
        `).join("")}
      </ul>
    </div>
  `;
}

// ============================================================
//  MINING MODULE
// ============================================================

async function initMining() {
  const { moduleBank } = await loadModule("mining");
  const MINING = moduleBank;

  const container = $("miningSection");
  if (!container || !MINING) return;

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Mining — Level ${appState.activeLevel}</h2>
      <input id="mining-input" class="pill" placeholder="Type a word">
      <button class="pill" id="mining-add">Add</button>
      <div id="mining-list"></div>
    </div>
  `;

  $("mining-add").onclick = () => {
    const text = $("mining-input").value.trim();
    if (!text) return;

    appState.miningWords.push(text);
    $("mining-input").value = "";
    renderMiningList();
  };

  renderMiningList();
}

function renderMiningList() {
  const listEl = $("mining-list");

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
//  DICTIONARY MODULE
// ============================================================

async function initDictionary() {
  const { moduleBank } = await loadModule
