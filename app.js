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

function getLangKey() {
  const map = { es: "spanish", fr: "french", nl: "dutch" };
  return map[appState.activeLanguage];
}

function speakText(text) {
  const utter = new SpeechSynthesisUtterance(text);
  const lang = getLangKey();

  utter.lang =
    lang === "spanish" ? "es-ES" :
    lang === "french" ? "fr-FR" :
    lang === "dutch" ? "nl-NL" :
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

function addIncorrectWord(mistakeString) {
  appState.mistakes.push(mistakeString);
}

// ============================================================
// TAB ROUTER
// ============================================================

let moduleBank = null;

async function initQuiz() {
  moduleBank = await loadModule(appState.activeLevel);
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
  if ($("dueReview")) $("dueReview").textContent = `${appState.mistakes.length} items`;
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
    const raw = await import(`./wordbanks/${appState.activeLanguage}/WORD_DICT.js`);
    dictBank = raw.default ?? raw;
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

    const langKey = getLangKey();
    const translation = entry[langKey] || entry.spanish || "";
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
  const langKey = getLangKey();
  utter.lang =
    langKey === "spanish" ? "es-ES" :
    langKey === "french" ? "fr-FR" :
    langKey === "dutch" ? "nl-NL" :
    "es-ES";

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

  let words;
  try {
    words = await loadListenBank();
  } catch (e) {
    container.innerHTML = "<p>Unable to load listening data.</p>";
    return;
  }

  if (!Array.isArray(words) || !words.length) {
    container.innerHTML = "<p>No listening data available for this level.</p>";
    return;
  }

  const categories = {};
  words.forEach(item => {
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
            <button class="ui-pill listen-pill" data-word="${w[getLangKey()]}">
              ${w.english} — ${w[getLangKey()]}
            </button>
          `).join("")}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  listenAutoPlay.list = words.map(w => w[getLangKey()]);

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

  let words;
  try {
    words = await loadFlashcardBank();
  } catch (e) {
    container.innerHTML = "<p>Unable to load flashcards.</p>";
    return;
  }

  if (!Array.isArray(words) || !words.length) {
    container.innerHTML = "<p>No flashcards available for this level.</p>";
    return;
  }

  flashcards = words.map(item => ({
    english: item.english,
    spanish: item.spanish,
    french: item.french,
    dutch: item.dutch
  }));

  renderFlashcardWordList(container);
}

function renderFlashcardWordList(container) {
  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Flashcards — Level ${appState.activeLevel}</h2>
      <p>Read the word, say it in the target language, then tap to flip and hear it.</p>
      <div id="flashcard-word-grid" class="listen-grid"></div>
    </div>
  `;

  const grid = $("flashcard-word-grid");

  grid.innerHTML = flashcards.map((fc, idx) => {
    const langKey = getLangKey();
    const backText = fc[langKey] || fc.spanish;

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
      const langKey = getLangKey();
      const backText = fc[langKey] || fc.spanish;

      const isFlipped = card.classList.toggle("flipped");
      if (isFlipped) {
        speakText(backText);
      }
    };
  });
}

/* ============================================================
   SHARED QUIZ STATE
   ============================================================ */

let quizState = {
  currentWord: null,
  options: [],
  harderMode: false,
  selected: null
};

function generateQuizOptions(words, correctWord) {
  const langKey = getLangKey();
  let opts = [correctWord[langKey]];
  const count = quizState.harderMode ? 5 : 3;

  while (opts.length < count) {
    const w = words[Math.floor(Math.random() * words.length)];
    const translated = w[langKey];
    if (!opts.includes(translated)) opts.push(translated);
  }

  return opts.sort(() => Math.random() - 0.5);
}

/* ============================================================
   QUIZ TAB — RENDER + EVENTS
   ============================================================ */

function renderQuizTab() {
  const container = document.getElementById("quiz-content");
  const words = moduleBank;

  if (!words || !words.length) {
    container.innerHTML = `<div class="glass-panel quiz-card">
      <p>No words found for level ${appState.activeLevel}.</p>
    </div>`;
    return;
  }

  const langKey = getLangKey();

  quizState.currentWord = words[Math.floor(Math.random() * words.length)];
  quizState.options = generateQuizOptions(words, quizState.currentWord);
  quizState.selected = null;

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Quiz — Level ${appState.activeLevel}</h2>
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

  const langKey = getLangKey();
  quizState.selected = null;

  grid.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      quizState.selected = btn.dataset.translation;
      answerBox.textContent = quizState.selected;
    });
  });

  function getEnglishForTranslation(translatedWord) {
    const levelWords = moduleBank;
    const match = levelWords.find(w => w[langKey] === translatedWord);
    return match ? match.english : "[no match]";
  }

  submitBtn.addEventListener("click", () => {
    if (!quizState.selected) {
      feedback.textContent = "Choose an answer first.";
      return;
    }

    const correct = quizState.currentWord[langKey];
    const learnerTranslated = quizState.selected;
    const learnerEnglish = getEnglishForTranslation(learnerTranslated);

    if (!appState.levelStats[appState.activeLevel].quizScore) {
      appState.levelStats[appState.activeLevel].quizScore = 0;
    }
    if (!appState.levelStats[appState.activeLevel].quizCompleted) {
      appState.levelStats[appState.activeLevel].quizCompleted = 0;
    }

    if (learnerTranslated === correct) {
      feedback.innerHTML = `
        <div class="quiz-correct">Correct!</div>
        <div class="quiz-selected"><strong>You selected:</strong> ${learnerTranslated} (${learnerEnglish})</div>
      `;

      appState.levelStats[appState.activeLevel].quizScore++;
      appState.levelStats[appState.activeLevel].quizCompleted++;
      addXP(10);
      addScore(5);
      updateProgressMeters();
    } else {
      feedback.innerHTML = `
        <div class="quiz-incorrect">Incorrect — correct answer: ${correct}</div>
        <div class="quiz-selected"><strong>You selected:</strong> ${learnerTranslated} (${learnerEnglish})</div>
      `;

      const mistakeString = `${quizState.currentWord.english} ➔ ${correct}`;
      addIncorrectWord(mistakeString);
    }

    setTimeout(() => speakText(correct), 50);
  });

  nextBtn.addEventListener("click", () => {
    renderQuizTab();
  });

  harderBtn.addEventListener("click", () => {
    quizState.harderMode = !quizState.harderMode;
    harderBtn.classList.toggle("active");
    renderQuizTab();
  });
}

// ============================================================
// BUILD MODULE — sentence builder (Spanish-site style)
// ============================================================

let buildState = {
  currentSentence: null,
  availableWords: [],
  chosenWords: []
};

async function initBuild() {
  const container = $("buildSection");
  if (!container) return;

  let sentences;
  try {
    const raw = await import(`./wordbanks/${appState.activeLanguage}/CEFR_SENTENCES.js`);
    sentences = raw.default ?? raw;
  } catch (e) {
    container.innerHTML = "<p>Unable to load build data.</p>";
    return;
  }

  if (!Array.isArray(sentences) || !sentences.length) {
    container.innerHTML = "<p>No build data available for this level.</p>";
    return;
  }

  buildState.currentSentence = sentences[0]; // you can randomize later
  buildState.availableWords = buildState.currentSentence.words || buildState.currentSentence.spanish.split(" ");
  buildState.chosenWords = [];

  renderBuildUI(container);
}

function renderBuildUI(container) {
  const s = buildState.currentSentence;

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Build — Level ${appState.activeLevel}</h2>
      <p>Duplicate this sentence in ${appState.activeLanguage.toUpperCase()}.</p>
      <div><strong>English:</strong> ${s.english}</div>

      <div class="listen-grid" id="build-word-bank">
        ${buildState.availableWords.map((w, i) => `
          <button class="ui-pill build-word" data-index="${i}">${w}</button>
        `).join("")}
      </div>

      <div class="build-output" id="build-output">
        ${buildState.chosenWords.join(" ")}
      </div>

      <div class="sb-controls">
        <button id="build-undo">Undo</button>
        <button id="build-reset">Reset</button>
        <button id="build-check">Check</button>
        <button id="build-next">Next</button>
      </div>

      <div id="build-feedback"></div>
    </div>
  `;

  document.querySelectorAll(".build-word").forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index, 10);
      const word = buildState.availableWords[idx];
      buildState.chosenWords.push(word);
      $("build-output").textContent = buildState.chosenWords.join(" ");
    };
  });

  $("build-undo").onclick = () => {
    buildState.chosenWords.pop();
    $("build-output").textContent = buildState.chosenWords.join(" ");
  };

  $("build-reset").onclick = () => {
    buildState.chosenWords = [];
    $("build-output").textContent = "";
    $("build-feedback").textContent = "";
  };

  $("build-check").onclick = () => {
    const learnerSentence = buildState.chosenWords.join(" ");
    const correctSentence = buildState.currentSentence.spanish;
    const feedbackEl = $("build-feedback");

    if (learnerSentence === correctSentence) {
      feedbackEl.innerHTML = `
        <div class="quiz-correct">Correct!</div>
        <div><strong>Your answer:</strong> ${learnerSentence}</div>
        <div><strong>Correct:</strong> ${correctSentence}</div>
      `;
      addXP(5);
      appState.levelStats[appState.activeLevel].sentences += 1;
    } else {
      feedbackEl.innerHTML = `
        <div class="quiz-incorrect">Not quite.</div>
        <div><strong>Your answer:</strong> ${learnerSentence}</div>
        <div><strong>Correct:</strong> ${correctSentence}</div>
      `;
      addIncorrectWord(`${buildState.currentSentence.english} ➔ ${correctSentence}`);
    }

    speakText(correctSentence);
    updateProgressMeters();
  };

  $("build-next").onclick = () => {
    // For now just reset same sentence; you can later randomize
    buildState.chosenWords = [];
    $("build-output").textContent = "";
    $("build-feedback").textContent = "";
  };
}

// ============================================================
// SENTENCE MODULE — 3-choice multiple choice with audio
// ============================================================

let sentenceState = {
  currentItem: null,
  options: []
};

async function initSentence() {
  const container = $("sentenceSection");
  if (!container) return;

  let choices;
  try {
    const raw = await import(`./wordbanks/${appState.activeLanguage}/CEFR_SENTENCE_CHOICES.js`);
    choices = raw.default ?? raw;
  } catch (e) {
    container.innerHTML = "<p>Unable to load sentence data.</p>";
    return;
  }

  if (!Array.isArray(choices) || !choices.length) {
    container.innerHTML = "<p>No sentence data available for this level.</p>";
    return;
  }

  sentenceState.currentItem = choices[0]; // you can randomize later
  const langKey = getLangKey();

  sentenceState.options = sentenceState.currentItem.options || sentenceState.currentItem[langKey + "_options"] || [];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Sentence — Level ${appState.activeLevel}</h2>
      <div><strong>English:</strong> ${sentenceState.currentItem.english}</div>

      <div class="sb-grid" id="sentence-options">
        ${sentenceState.options.map(opt => `
          <button class="pill sentence-opt" data-value="${opt}">${opt}</button>
        `).join("")}
      </div>

      <div class="sb-controls">
        <button id="sentence-check">Check</button>
        <button id="sentence-next">Next</button>
        <button id="sentence-reset">Reset</button>
      </div>

      <div id="sentence-feedback"></div>
    </div>
  `;

  let selected = null;

  document.querySelectorAll(".sentence-opt").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".sentence-opt").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selected = btn.dataset.value;
    };
  });

  $("sentence-check").onclick = () => {
    const feedbackEl = $("sentence-feedback");
    const langKey = getLangKey();
    const correct = sentenceState.currentItem[langKey];

    if (!selected) {
      feedbackEl.textContent = "Choose an answer first.";
      return;
    }

    if (selected === correct) {
      feedbackEl.innerHTML = `
        <div class="quiz-correct">Correct!</div>
        <div><strong>Your answer:</strong> ${selected}</div>
        <div><strong>Correct:</strong> ${correct}</div>
      `;
      addXP(3);
      appState.levelStats[appState.activeLevel].sentences += 1;
    } else {
      feedbackEl.innerHTML = `
        <div class="quiz-incorrect">Incorrect.</div>
        <div><strong>Your answer:</strong> ${selected}</div>
        <div><strong>Correct:</strong> ${correct}</div>
      `;
      addIncorrectWord(`${sentenceState.currentItem.english} ➔ ${correct}`);
    }

    speakText(correct);
    updateProgressMeters();
  };

  $("sentence-next").onclick = () => {
    // simple reset; you can randomize later
    $("sentence-feedback").textContent = "";
    document.querySelectorAll(".sentence-opt").forEach(b => b.classList.remove("active"));
    selected = null;
  };

  $("sentence-reset").onclick = () => {
    $("sentence-feedback").textContent = "";
    document.querySelectorAll(".sentence-opt").forEach(b => b.classList.remove("active"));
    selected = null;
  };
}

// ============================================================
// CONVERSATION MODULE — prompt + 5 options + audio
// ============================================================

let conversationState = {
  currentTurn: null,
  options: []
};

async function initConversation() {
  const container = $("conversationSection");
  if (!container) return;

  let convo;
  let audioBank;
  try {
    const rawConvo = await import(`./wordbanks/${appState.activeLanguage}/CEFR_CONVERSATION.js`);
    convo = rawConvo.default ?? rawConvo;

    const rawAudio = await import(`./wordbanks/${appState.activeLanguage}/CEFR_CONVERSATION_AUDIO.js`);
    audioBank = rawAudio.default ?? rawAudio;
  } catch (e) {
    container.innerHTML = "<p>Unable to load conversation data.</p>";
    return;
  }

  if (!Array.isArray(convo) || !convo.length) {
    container.innerHTML = "<p>No conversation data available for this level.</p>";
    return;
  }

  conversationState.currentTurn = convo[0]; // you can randomize later
  const langKey = getLangKey();

  conversationState.options = conversationState.currentTurn.options || conversationState.currentTurn[langKey + "_options"] || [];

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Conversation — Level ${appState.activeLevel}</h2>
      <p>Respond naturally in ${appState.activeLanguage.toUpperCase()}.</p>

      <div><strong>${appState.activeLanguage.toUpperCase()}:</strong> ${conversationState.currentTurn[langKey]}</div>
      <div><em>English:</em> ${conversationState.currentTurn.english}</div>

      <div class="sb-grid" id="conversation-options">
        ${conversationState.options.map(opt => `
          <button class="pill convo-opt" data-value="${opt}">${opt}</button>
        `).join("")}
      </div>

      <div class="sb-controls">
        <button id="conversation-check">Check</button>
        <button id="conversation-next">Next</button>
        <button id="conversation-reset">Reset</button>
      </div>

      <div id="conversation-feedback"></div>
    </div>
  `;

  let selected = null;

  document.querySelectorAll(".convo-opt").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".convo-opt").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selected = btn.dataset.value;
    };
  });

  $("conversation-check").onclick = () => {
    const feedbackEl = $("conversation-feedback");
    const langKey = getLangKey();
    const correct = conversationState.currentTurn.correct || conversationState.currentTurn[langKey + "_correct"];

    if (!selected) {
      feedbackEl.textContent = "Choose an answer first.";
      return;
    }

    if (selected === correct) {
      feedbackEl.innerHTML = `
        <div class="quiz-correct">Correct!</div>
        <div><strong>Your answer:</strong> ${selected}</div>
        <div><strong>Correct:</strong> ${correct}</div>
      `;
      addXP(4);
      addScore(2);
    } else {
      feedbackEl.innerHTML = `
        <div class="quiz-incorrect">Incorrect.</div>
        <div><strong>Your answer:</strong> ${selected}</div>
        <div><strong>Correct:</strong> ${correct}</div>
      `;
      addIncorrectWord(`Conversation: ${conversationState.currentTurn.english} ➔ ${correct}`);
    }

    const audioKey = conversationState.currentTurn.audioKey;
    const audioText = audioBank[audioKey] || correct;
    speakText(audioText);
    updateProgressMeters();
  };

  $("conversation-next").onclick = () => {
    $("conversation-feedback").textContent = "";
    document.querySelectorAll(".convo-opt").forEach(b => b.classList.remove("active"));
    selected = null;
  };

  $("conversation-reset").onclick = () => {
    $("conversation-feedback").textContent = "";
    document.querySelectorAll(".convo-opt").forEach(b => b.classList.remove("active"));
    selected = null;
  };
}

// ============================================================
// GRAMMAR MODULE — simple list from level words
// ============================================================

async function initGrammar() {
  const container = $("grammarSection");
  if (!container) return;

  let words;
  try {
    words = await loadModule(appState.activeLevel);
  } catch (e) {
    container.innerHTML = "<p>Unable to load grammar data.</p>";
    return;
  }

  if (!Array.isArray(words) || !words.length) {
    container.innerHTML = "<p>No grammar data available for this level.</p>";
    return;
  }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Grammar — Level ${appState.activeLevel}</h2>
      <ul>
        ${words.map(rule => `
          <li><strong>${rule.english}</strong><br>${rule[getLangKey()]}</li>
        `).join("")}
      </ul>
    </div>
  `;
}

// ============================================================
// MINING MODULE — wired to mining_references.js
// ============================================================

async function initMining() {
  const container = $("miningSection");
  if (!container) return;

  let miningBank;
  try {
    const raw = await import(`./wordbanks/${appState.activeLanguage}/mining_references.js`);
    miningBank = raw.default ?? raw;
  } catch (e) {
    container.innerHTML = "<p>Unable to load mining references.</p>";
    return;
  }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Mining — Level ${appState.activeLevel}</h2>
      <div id="mining-pill-grid" class="listen-grid">
        ${miningBank.map((item, i) => `
          <button class="ui-pill mining-pill" data-index="${i}">
            ${item.english} — ${item[getLangKey()]}
          </button>
        `).join("")}
      </div>
    </div>
  `;

  document.querySelectorAll(".mining-pill").forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index, 10);
      const item = miningBank[idx];
      const langKey = getLangKey();
      const word = item[langKey];
      speakText(word);
      appState.miningWords.push(`${item.english} ➔ ${word}`);
      updateProgressMeters();
    };
  });
}

// ============================================================
// DICTIONARY MODULE
// ============================================================

async function initDictionary() {
  const container = $("dictionarySection");
  if (!container) return;

  let dictBank;
  try {
    const raw = await import(`./wordbanks/${appState.activeLanguage}/WORD_DICT.js`);
    dictBank = raw.default ?? raw;
  } catch (e) {
    container.innerHTML = "<p>Unable to load dictionary.</p>";
    return;
  }

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

    const entry = dictBank[query];
    if (!entry) {
      outputEl.textContent = "No entry found.";
      return;
    }

    const langKey = getLangKey();
    const translation = entry[langKey] || entry.spanish || "";
    outputEl.textContent = translation ? translation : "No translation for this language.";
  };
}

// ============================================================
// REVIEW MODULE — Play + Got it!
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
      <ul id="review-list">
        ${appState.mistakes.map((w, i) => `
          <li data-index="${i}">
            ${w}
            <button class="pill review-play">Play</button>
            <button class="pill review-gotit">Got it!</button>
          </li>
        `).join("")}
      </ul>
    </div>
  `;

  document.querySelectorAll("#review-list li").forEach(li => {
    const idx = parseInt(li.dataset.index, 10);
    const text = appState.mistakes[idx];

    li.querySelector(".review-play").onclick = () => {
      speakText(text.split("➔")[1] || text);
    };

    li.querySelector(".review-gotit").onclick = () => {
      appState.mistakes.splice(idx, 1);
      initReview();
      updateProgressMeters();
    };
  });
}

// ============================================================
// REPEAT MODULE — repeat/A1.js etc.
// ============================================================

async function initRepeat() {
  const container = $("repeatSection");
  if (!container) return;

  let repeatBank;
  try {
    const raw = await import(`./wordbanks/${appState.activeLanguage}/repeat/${appState.activeLevel}.js`);
    repeatBank = raw.default ?? raw;
  } catch (e) {
    container.innerHTML = "<p>Unable to load repeat practice.</p>";
    return;
  }

  const items = Array.isArray(repeatBank) ? repeatBank : [];

  if (!items.length) {
    container.innerHTML = "<p>No repeat items available for this level.</p>";
    return;
  }

  container.innerHTML = `
    <div class="glass-panel quiz-card">
      <h2>Repeat Practice — Level ${appState.activeLevel}</h2>
      <div id="repeat-list">
        ${items.map(w => `
          <button class="pill repeat-pill" data-word="${w[getLangKey()]}">
            ${w.english} — ${w[getLangKey()]}
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

