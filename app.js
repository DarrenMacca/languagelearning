// ============================================================
//  LANGUAGE LEARNING APP — CONSOLIDATED CORE (PART 1)
//  State, helpers, mode selector, boot
// ============================================================

// ----------------------------
// 1. Language registry
// ----------------------------
const LANGUAGES = {
  es: { code: "es", name: "Spanish" },
  fr: { code: "fr", name: "French" },
  nl: { code: "nl", name: "Dutch" }
};

// ----------------------------
// 2. Wordbank registry
// ----------------------------
const WORD_BANKS = {
  es: {
    sentences: CEFR_SENTENCE_CHOICES,
    conversation: CEFR_CONVERSATION
  },
  fr: {
    sentences: {},
    conversation: {}
  },
  nl: {
    sentences: {},
    conversation: {}
  }
};

// ----------------------------
// 3. Global app state
// ----------------------------
let currentLanguage = "es";
let currentLevel = "A1";
let currentMode = "sentences";

let currentItems = [];
let currentIndex = 0;
let currentItem = null;

// Conversation
let convoHistory = [];
let convoIndex = 0;
let convoItem = null;

// Mining
let miningList = [];

// Dictionary
let dictionaryEntries = [];

// Review
let mistakes = [];
let reviewIndex = 0;
let reviewItem = null;

// Badges
let badges = [];
let totalCorrectAnswers = 0;

// Level-up
const CEFR_LEVELS = ["A1", "A2", "B1", "B2"];
let levelProgress = 0;
const LEVEL_UP_THRESHOLD = 100;
let levelUpNotifications = [];

// Scoring
let score = 0;

// ----------------------------
// 4. DOM helper
// ----------------------------
function $(id) {
  return document.getElementById(id);
}

// ----------------------------
// 5. Speech synthesis
// ----------------------------
function speak(text) {
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang =
    currentLanguage === "es" ? "es-ES" :
    currentLanguage === "fr" ? "fr-FR" :
    currentLanguage === "nl" ? "nl-NL" : "en-US";

  window.speechSynthesis.speak(utter);
}

// ----------------------------
// 6. Mode selector (single source of truth)
// ----------------------------
function setupModeSelector() {
  const select = $("modeSelect");
  if (!select) return;

  const modes = [
    { id: "sentences", label: "Sentences" },
    { id: "conversation", label: "Conversation" },
    { id: "mining", label: "Mining" },
    { id: "dictionary", label: "Dictionary" },
    { id: "review", label: "Review" }
  ];

  select.innerHTML = "";

  modes.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.label;
    if (m.id === currentMode) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener("change", e => {
    currentMode = e.target.value;

    if (currentMode === "sentences") {
      loadCurrentSet();
      showSection("sentenceSection");
    } else if (currentMode === "conversation") {
      switchToConversationMode();
    } else if (currentMode === "mining") {
      switchToMiningTab();
    } else if (currentMode === "dictionary") {
      switchToDictionaryTab();
      setupDictionaryUI();
    } else if (currentMode === "review") {
      switchToReviewMode();
      setupReviewUI();
    }
  });
}

// ----------------------------
// 7. Section visibility helper
// ----------------------------
function showSection(id) {
  const sections = document.querySelectorAll(".appSection");
  sections.forEach(sec => sec.style.display = "none");

  const target = $(id);
  if (target) target.style.display = "block";
}

// ----------------------------
// 8. Sanity check
// ----------------------------
function sanityCheck() {
  console.log("=== APP SANITY CHECK ===");
  console.log("Language:", currentLanguage);
  console.log("Level:", currentLevel);
  console.log("Mode:", currentMode);
  console.log("Items loaded:", currentItems.length);
  console.log("=========================");
}

// ----------------------------
// 9. Boot the app
// ----------------------------
function initApp() {
  setupLanguageSelector();
  setupLevelSelector();
  setupModeSelector();

  loadCurrentSet();
  renderCurrentItem();
  setupSentenceUI();
  setupDictionaryUI();
  setupReviewUI();

  sanityCheck();
}

document.addEventListener("DOMContentLoaded", initApp);

// ============================================================
//  SENTENCE MODE — CONSOLIDATED (PART 2)
// ============================================================

// ----------------------------
// 1. Load CEFR items for current language + level
// ----------------------------
function loadCurrentSet() {
  const langBundle = WORD_BANKS[currentLanguage];
  if (!langBundle) {
    currentItems = [];
    currentIndex = 0;
    currentItem = null;
    renderCurrentItem();
    return;
  }

  const pack = langBundle.sentences || {};
  const levelArray = pack[currentLevel] || [];

  currentItems = levelArray.slice();
  currentIndex = 0;
  currentItem = currentItems.length > 0 ? currentItems[0] : null;

  renderCurrentItem();
  updateProgress();
}

// ----------------------------
// 2. Render the current item
// ----------------------------
function renderCurrentItem() {
  const promptEl = $("promptText");
  const optionsEl = $("optionsContainer");
  const feedbackEl = $("feedbackText");

  if (!promptEl || !optionsEl || !feedbackEl) return;

  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";

  if (!currentItem) {
    promptEl.textContent = "No items available for this language and level.";
    return;
  }

  promptEl.textContent = currentItem.english;

  const opts = currentItem.foreignOptions || [];

  opts.forEach(optionText => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ui-pill";
    btn.textContent = optionText;

    btn.addEventListener("click", () => {
      handleSentenceAnswer(optionText);
    });

    optionsEl.appendChild(btn);
  });
}

// ----------------------------
// 3. Unified sentence answer handler
// ----------------------------
function handleSentenceAnswer(selectedText) {
  const feedbackEl = $("feedbackText");
  if (!feedbackEl || !currentItem) return;

  const correct = currentItem.foreignCorrect;
  const isCorrect = selectedText === correct;

  if (isCorrect) {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    speak(correct);

    // Level progress reward
    addLevelProgress(10);
  } else {
    feedbackEl.textContent = `Incorrect — correct answer: ${correct}`;
    feedbackEl.style.color = "red";
    addMistake(currentItem);
    speak(correct);

    // Small penalty
    addLevelProgress(2);
  }

  updateScore(isCorrect);
  updateProgress();

  badgeRule_firstCorrect(isCorrect);
  badgeRule_tenCorrect(isCorrect);

  goToNextSentenceItem();
}

// ----------------------------
// 4. Move to next item
// ----------------------------
function goToNextSentenceItem() {
  if (!currentItems || currentItems.length === 0) return;

  currentIndex++;
  if (currentIndex >= currentItems.length) {
    currentIndex = 0;
  }

  currentItem = currentItems[currentIndex];
  renderCurrentItem();
}

// ----------------------------
// 5. Scoring
// ----------------------------
function updateScore(isCorrect) {
  if (isCorrect) {
    score += 10;
  } else {
    score -= 2;
    if (score < 0) score = 0;
  }

  const scoreEl = $("scoreDisplay");
  if (scoreEl) {
    scoreEl.textContent = `Score: ${score}`;
  }
}

// ----------------------------
// 6. Progress tracking
// ----------------------------
function updateProgress() {
  const progressEl = $("progressDisplay");
  if (!progressEl || currentItems.length === 0) return;

  const percent = Math.round((currentIndex + 1) / currentItems.length * 100);
  progressEl.textContent = `Progress: ${percent}%`;
}

// ----------------------------
// 7. Mistake tracking
// ----------------------------
function addMistake(item) {
  mistakes.push({
    english: item.english,
    correct: item.foreignCorrect
  });

  renderMistakeList();
}

function renderMistakeList() {
  const listEl = $("mistakeList");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (mistakes.length === 0) {
    listEl.textContent = "No mistakes yet.";
    return;
  }

  mistakes.forEach(m => {
    const div = document.createElement("div");
    div.className = "ui-review-card";
    div.textContent = `${m.english} → ${m.correct}`;
    listEl.appendChild(div);
  });
}

// ----------------------------
// 8. Badge rules (sentence mode)
// ----------------------------
function badgeRule_firstCorrect(isCorrect) {
  if (isCorrect) {
    awardBadge(
      "first_correct",
      "First Correct Answer",
      "Awarded for getting your first correct answer.",
      "🥇"
    );
  }
}

function badgeRule_tenCorrect(isCorrect) {
  if (isCorrect) {
    totalCorrectAnswers++;
    if (totalCorrectAnswers === 10) {
      awardBadge(
        "ten_correct",
        "Ten Correct Answers",
        "Awarded for answering ten questions correctly.",
        "🏆"
      );
    }
  }
}

// ----------------------------
// 9. Level-up system
// ----------------------------
function addLevelProgress(amount) {
  levelProgress += amount;

  if (levelProgress >= LEVEL_UP_THRESHOLD) {
    levelProgress = 0;
    promoteUserLevel();
  }

  renderLevelProgress();
}

function promoteUserLevel() {
  const currentIndex = CEFR_LEVELS.indexOf(currentLevel);

  if (currentIndex < CEFR_LEVELS.length - 1) {
    const newLevel = CEFR_LEVELS[currentIndex + 1];
    currentLevel = newLevel;

    levelUpNotifications.push(`You advanced to ${newLevel}!`);
    renderLevelUpNotifications();

    if (currentMode === "sentences") loadCurrentSet();
    if (currentMode === "conversation") loadConversationSet();
  }
}

function renderLevelProgress() {
  const el = $("levelProgressDisplay");
  if (!el) return;

  el.textContent = `Level Progress: ${levelProgress}/${LEVEL_UP_THRESHOLD}`;
}

function renderLevelUpNotifications() {
  const el = $("levelUpNotifications");
  if (!el) return;

  el.innerHTML = "";

  levelUpNotifications.forEach(msg => {
    const div = document.createElement("div");
    div.className = "ui-badge";
    div.textContent = msg;
    el.appendChild(div);
  });
}

// ============================================================
//  CONVERSATION ENGINE — CONSOLIDATED (PART 3)
// ============================================================

// ----------------------------
// 1. Load conversation set
// ----------------------------
function loadConversationSet() {
  const langBundle = WORD_BANKS[currentLanguage];
  if (!langBundle) {
    convoHistory = [];
    convoIndex = 0;
    convoItem = null;
    renderConversationItem();
    return;
  }

  const pack = langBundle.conversation || {};
  const levelArray = pack[currentLevel] || [];

  convoHistory = levelArray.slice();
  convoIndex = 0;
  convoItem = convoHistory.length > 0 ? convoHistory[0] : null;

  renderConversationItem();
}

// ----------------------------
// 2. Render conversation item
// ----------------------------
function renderConversationItem() {
  const promptEl = $("conversationPrompt");
  const replyEl = $("conversationReplies");
  const feedbackEl = $("conversationFeedback");

  if (!promptEl || !replyEl || !feedbackEl) return;

  replyEl.innerHTML = "";
  feedbackEl.textContent = "";

  if (!convoItem) {
    promptEl.textContent = "No conversation items available.";
    return;
  }

  promptEl.textContent = convoItem.prompt;

  convoItem.replies.forEach(reply => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ui-pill";
    btn.textContent = reply;

    btn.addEventListener("click", () => {
      handleConversationReply(reply);
    });

    replyEl.appendChild(btn);
  });
}

// ----------------------------
// 3. Handle conversation reply
// ----------------------------
function handleConversationReply(reply) {
  const feedbackEl = $("conversationFeedback");
  if (!feedbackEl || !convoItem) return;

  feedbackEl.textContent = `You said: ${reply}`;
  feedbackEl.style.color = "blue";

  speak(reply);

  // Optional: mine this conversation turn
  mineConversation(convoItem.prompt, reply);

  // Advance conversation
  convoIndex++;
  if (convoIndex >= convoHistory.length) {
    convoIndex = 0;
  }

  convoItem = convoHistory[convoIndex];
  setTimeout(() => renderConversationItem(), 500);
}

// ----------------------------
// 4. Switch to conversation mode
// ----------------------------
function switchToConversationMode() {
  currentMode = "conversation";
  loadConversationSet();
  showSection("conversationSection");
}

// ----------------------------
// 5. Mining integration (conversation)
// ----------------------------
function mineConversation(prompt, reply) {
  miningList.push({
    english: prompt,
    foreign: reply,
    source: "conversation"
  });

  badgeRule_firstMine();
  renderMiningList();
}

// ============================================================
//  MINING — CONSOLIDATED (PART 4)
// ============================================================

// ----------------------------
// 1. Render mining list
// ----------------------------
function renderMiningList() {
  const listEl = $("miningList");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (miningList.length === 0) {
    listEl.textContent = "No mined items yet.";
    return;
  }

  miningList.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "ui-card";

    div.innerHTML = `
      <strong>${item.english}</strong><br>
      ${item.foreign}<br>
      <small>Source: ${item.source}</small>
    `;

    const delBtn = document.createElement("button");
    delBtn.className = "ui-pill";
    delBtn.textContent = "Remove";

    delBtn.addEventListener("click", () => {
      miningList.splice(index, 1);
      renderMiningList();
    });

    div.appendChild(delBtn);
    listEl.appendChild(div);
  });
}

// ----------------------------
// 2. Switch to mining tab
// ----------------------------
function switchToMiningTab() {
  showSection("miningSection");
  renderMiningList();
}

// ----------------------------
// 3. Mining buttons
// ----------------------------
function addMiningButtonToSentenceUI() {
  const mineBtn = $("mineSentenceButton");
  if (!mineBtn) return;

  mineBtn.addEventListener("click", () => {
    if (currentItem) {
      mineSentence(currentItem);
    }
  });
}

function mineSentence(item) {
  miningList.push({
    english: item.english,
    foreign: item.foreignCorrect,
    source: "sentence"
  });

  badgeRule_firstMine();
  renderMiningList();
}

function addMiningButtonToConversationUI() {
  const mineBtn = $("mineConversationButton");
  if (!mineBtn) return;

  mineBtn.addEventListener("click", () => {
    if (convoItem) {
      mineConversation(convoItem.prompt, "Your reply here");
    }
  });
}

// ============================================================
//  DICTIONARY — CONSOLIDATED (PART 4)
// ============================================================

// ----------------------------
// 1. Simple dictionary lookup
// ----------------------------
const SIMPLE_DICTIONARY = {
  es: {
    hola: "A greeting meaning 'hello'.",
    casa: "A building where people live.",
    comida: "Food; something you eat."
  },
  fr: {
    bonjour: "A greeting meaning 'hello'.",
    maison: "A building where people live."
  },
  nl: {
    hallo: "A greeting meaning 'hello'.",
    huis: "A building where people live."
  }
};

function lookupWord(word) {
  const dict = SIMPLE_DICTIONARY[currentLanguage] || {};
  return dict[word.toLowerCase()] || "No definition found.";
}

// ----------------------------
// 2. Add dictionary entry
// ----------------------------
function addDictionaryEntry(word, definition) {
  dictionaryEntries.push({
    word,
    definition,
    language: currentLanguage
  });

  badgeRule_firstDictionarySave();
  renderDictionaryList();
}

// ----------------------------
// 3. Render dictionary result
// ----------------------------
function renderDictionaryResult(word, definition) {
  const resultEl = $("dictionaryResult");
  if (!resultEl) return;

  resultEl.innerHTML = `
    <strong>${word}</strong><br>
    ${definition}
  `;
}

// ----------------------------
// 4. Render dictionary list
// ----------------------------
function renderDictionaryList() {
  const listEl = $("dictionaryList");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (dictionaryEntries.length === 0) {
    listEl.textContent = "No saved dictionary entries.";
    return;
  }

  dictionaryEntries.forEach((entry, index) => {
    const div = document.createElement("div");
    div.className = "ui-card";

    div.innerHTML = `
      <strong>${entry.word}</strong><br>
      ${entry.definition}<br>
      <small>Language: ${entry.language}</small>
    `;

    const delBtn = document.createElement("button");
    delBtn.className = "ui-pill";
    delBtn.textContent = "Remove";

    delBtn.addEventListener("click", () => {
      dictionaryEntries.splice(index, 1);
      renderDictionaryList();
    });

    div.appendChild(delBtn);
    listEl.appendChild(div);
  });
}

// ----------------------------
// 5. Switch to dictionary tab
// ----------------------------
function switchToDictionaryTab() {
  showSection("dictionarySection");
  renderDictionaryList();
}

// ----------------------------
// 6. Dictionary UI setup
// ----------------------------
function setupDictionaryUI() {
  const lookupBtn = $("dictionaryLookupButton");
  const input = $("dictionaryInput");

  if (!lookupBtn || !input) return;

  lookupBtn.addEventListener("click", () => {
    const word = input.value.trim();
    if (!word) return;

    const definition = lookupWord(word);
    renderDictionaryResult(word, definition);
  });

  const saveBtn = $("dictionarySaveButton");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const word = input.value.trim();
      if (!word) return;

      const definition = lookupWord(word);
      addDictionaryEntry(word, definition);
    });
  }
}

// ============================================================
//  REVIEW MODE — CONSOLIDATED (PART 4)
// ============================================================

// ----------------------------
// 1. Render review item
// ----------------------------
function renderReviewItem() {
  const promptEl = $("reviewPrompt");
  const inputEl = $("reviewInput");
  const feedbackEl = $("reviewFeedback");

  if (!promptEl || !inputEl || !feedbackEl) return;

  feedbackEl.textContent = "";
  inputEl.value = "";

  if (mistakes.length === 0) {
    promptEl.textContent = "No mistakes to review.";
    return;
  }

  reviewItem = mistakes[reviewIndex];
  promptEl.textContent = reviewItem.english;
}

// ----------------------------
// 2. Handle review answer
// ----------------------------
function handleReviewAnswer() {
  const inputEl = $("reviewInput");
  const feedbackEl = $("reviewFeedback");

  if (!inputEl || !feedbackEl || !reviewItem) return;

  const userAnswer = inputEl.value.trim();
  const correct = reviewItem.correct;

  if (userAnswer === correct) {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    speak(correct);
  } else {
    feedbackEl.textContent = `Incorrect — correct answer: ${correct}`;
    feedbackEl.style.color = "red";
    speak(correct);
  }

  reviewIndex++;
  if (reviewIndex >= mistakes.length) {
    reviewIndex = 0;
  }

  setTimeout(() => renderReviewItem(), 600);
}

// ----------------------------
// 3. Switch to review mode
// ----------------------------
function switchToReviewMode() {
  showSection("reviewSection");
  reviewIndex = 0;
  renderReviewItem();
}

// ----------------------------
// 4. Review UI setup
// ----------------------------
function setupReviewUI() {
  const retryBtn = $("reviewRetryButton");
  if (!retryBtn) return;

  retryBtn.addEventListener("click", handleReviewAnswer);
}

// ============================================================
//  BADGES — CONSOLIDATED (PART 4)
// ============================================================

// ----------------------------
// 1. Award badge
// ----------------------------
function awardBadge(id, name, description, icon) {
  if (badges.some(b => b.id === id)) return;

  badges.push({ id, name, description, icon });
  renderBadges();
}

// ----------------------------
// 2. Badge rules
// ----------------------------
function badgeRule_firstMine() {
  if (miningList.length === 1) {
    awardBadge(
      "first_mine",
      "First Mined Item",
      "Awarded for saving your first mined item.",
      "⛏️"
    );
  }
}

function badgeRule_firstDictionarySave() {
  if (dictionaryEntries.length === 1) {
    awardBadge(
      "first_dictionary",
      "First Dictionary Save",
      "Awarded for saving your first dictionary entry.",
      "📘"
    );
  }
}

// ----------------------------
// 3. Render badges
// ----------------------------
function renderBadges() {
  const badgeEl = $("badgeList");
  if (!badgeEl) return;

  badgeEl.innerHTML = "";

  if (badges.length === 0) {
    badgeEl.textContent = "No badges earned yet.";
    return;
  }

  badges.forEach(b => {
    const div = document.createElement("div");
    div.className = "ui-badge";

    div.innerHTML = `
      <span class="badgeIcon">${b.icon}</span>
      <strong>${b.name}</strong><br>
      <small>${b.description}</small>
    `;

    badgeEl.appendChild(div);
  });
}

// ============================================================
//  CERTIFICATE SYSTEM — CONSOLIDATED (PART 5)
// ============================================================

// ----------------------------
// 1. Certificate rendering
// ----------------------------
function renderCertificate(level, name) {
  const certEl = $("certificateContainer");
  if (!certEl) return;

  certEl.innerHTML = `
    <div class="ui-certificate">
      <div class="ui-cert-header">
        <div class="ui-cert-title">Certificate of Achievement</div>
        <div class="ui-cert-subtitle">CEFR Level ${level}</div>
      </div>

      <div class="ui-cert-layout">
        <div class="ui-cert-body">
          This certifies that <strong>${name}</strong> has successfully
          completed all requirements for CEFR Level ${level}.
          <br><br>
          Awarded on: ${new Date().toLocaleDateString()}
        </div>

        <div class="ui-cert-seal">CEFR</div>
      </div>

      <div class="ui-cert-signature">
        Instructor Signature<br>
        ______________________
      </div>
    </div>
  `;
}

// ----------------------------
// 2. Trigger certificate unlock
// ----------------------------
function unlockCertificate(level) {
  const name = $("studentNameInput")?.value || "Student";
  renderCertificate(level, name);
  showSection("certificateSection");
}

// ----------------------------
// 3. Auto-unlock when leveling up
// ----------------------------
function promoteUserLevel() {
  const currentIndex = CEFR_LEVELS.indexOf(currentLevel);

  if (currentIndex < CEFR_LEVELS.length - 1) {
    const newLevel = CEFR_LEVELS[currentIndex + 1];
    currentLevel = newLevel;

    levelUpNotifications.push(`You advanced to ${newLevel}!`);
    renderLevelUpNotifications();

    unlockCertificate(newLevel);

    if (currentMode === "sentences") loadCurrentSet();
    if (currentMode === "conversation") loadConversationSet();
  }
}

// ============================================================
//  UI HELPERS — CONSOLIDATED (PART 5)
// ============================================================

// ----------------------------
// 1. Flash highlight
// ----------------------------
function flashElement(el) {
  if (!el) return;
  el.style.transition = "background-color 0.3s";
  el.style.backgroundColor = "#ffe9a8";
  setTimeout(() => {
    el.style.backgroundColor = "";
  }, 300);
}

// ----------------------------
// 2. Smooth fade-in
// ----------------------------
function fadeIn(el) {
  if (!el) return;
  el.style.opacity = 0;
  el.style.transition = "opacity 0.4s ease";
  requestAnimationFrame(() => {
    el.style.opacity = 1;
  });
}

// ============================================================
//  THEME SYSTEM — CONSOLIDATED (PART 5)
// ============================================================

// ----------------------------
// 1. Toggle dark/light
// ----------------------------
function toggleTheme() {
  const root = document.documentElement;
  const current = root.dataset.theme;

  root.dataset.theme = current === "light" ? "dark" : "light";
}

// ----------------------------
// 2. Toggle high contrast
// ----------------------------
function toggleContrast() {
  const root = document.documentElement;
  const current = root.dataset.theme;

  root.dataset.theme = current === "contrast" ? "dark" : "contrast";
}

// ----------------------------
// 3. Theme buttons
// ----------------------------
function setupThemeButtons() {
  const themeBtn = $("themeToggleButton");
  const contrastBtn = $("contrastToggleButton");

  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  if (contrastBtn) contrastBtn.addEventListener("click", toggleContrast);
}

// ============================================================
//  TAB SYSTEM — CONSOLIDATED (PART 5)
// ============================================================

// ----------------------------
// 1. Activate tab
// ----------------------------
function activateTab(tabId) {
  const tabs = document.querySelectorAll(".ui-tab");
  const sections = document.querySelectorAll(".appSection");

  tabs.forEach(t => t.classList.remove("is-active"));
  sections.forEach(s => s.style.display = "none");

  const activeTab = document.querySelector(`.ui-tab[data-tab="${tabId}"]`);
  const activeSection = $(tabId);

  if (activeTab) activeTab.classList.add("is-active");
  if (activeSection) {
    activeSection.style.display = "block";
    fadeIn(activeSection);
  }
}

// ----------------------------
// 2. Setup tab listeners
// ----------------------------
function setupTabs() {
  const tabs = document.querySelectorAll(".ui-tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      activateTab(target);

      currentMode = target;

      if (target === "sentences") {
        loadCurrentSet();
      } else if (target === "conversation") {
        switchToConversationMode();
      } else if (target === "mining") {
        switchToMiningTab();
      } else if (target === "dictionary") {
        switchToDictionaryTab();
      } else if (target === "review") {
        switchToReviewMode();
      } else if (target === "certificateSection") {
        unlockCertificate(currentLevel);
      }
    });
  });
}

// ============================================================
//  FINAL GLUE — CONSOLIDATED (PART 5)
// ============================================================

function setupSentenceUI() {
  const nextBtn = $("nextButton");
  if (nextBtn) nextBtn.addEventListener("click", goToNextSentenceItem);

  addMiningButtonToSentenceUI();
}

function initApp() {
  setupLanguageSelector();
  setupLevelSelector();
  setupModeSelector();
  setupTabs();
  setupThemeButtons();

  loadCurrentSet();
  renderCurrentItem();
  setupSentenceUI();
  setupDictionaryUI();
  setupReviewUI();

  sanityCheck();
}

document.addEventListener("DOMContentLoaded", initApp);
