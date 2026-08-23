// ============================================================
//  LANGUAGE LEARNING APP — FULL CONSOLIDATED JS (PART 1)
//  Core state, helpers, mode selector, certificate storage
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

// Certificates
let certificateHistory = [];

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
// 6. Section visibility
// ----------------------------
function showSection(id) {
  const sections = document.querySelectorAll(".appSection");
  sections.forEach(sec => sec.style.display = "none");

  const target = $(id);
  if (target) target.style.display = "block";
}

// ----------------------------
// 7. Mode selector (single source of truth)
// ----------------------------
function setupModeSelector() {
  const select = $("modeSelect");
  if (!select) return;

  const modes = [
    { id: "sentences", label: "Sentences" },
    { id: "conversation", label: "Conversation" },
    { id: "mining", label: "Mining" },
    { id: "dictionary", label: "Dictionary" },
    { id: "review", label: "Review" },
    { id: "certificates", label: "Certificates" }
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
    } else if (currentMode === "review") {
      switchToReviewMode();
    } else if (currentMode === "certificates") {
      switchToCertificatePage();
    }
  });
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

// ============================================================
//  SENTENCE MODE — FULL CONSOLIDATED (PART 2)
// ============================================================

// 1. Load CEFR items for current language + level
function loadCurrentSet() {
  const pack = window.LANG.modules.CEFR_SENTENCE_CHOICES?.default;
  if (!pack) {
    currentItems = [];
    currentIndex = 0;
    currentItem = null;
    renderCurrentItem();
    return;
  }

  const levelArray = pack[currentLevel] || [];
  currentItems = levelArray.slice();
  currentIndex = 0;
  currentItem = currentItems[0] || null;

  renderCurrentItem();
}


// 2. Render the current item
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

// 3. Unified sentence answer handler
function handleSentenceAnswer(selectedText) {
  const feedbackEl = $("feedbackText");
  if (!feedbackEl || !currentItem) return;

  const correct = currentItem.foreignCorrect;
  const isCorrect = selectedText === correct;

  if (isCorrect) {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    speak(correct);
    addLevelProgress(10);
  } else {
    feedbackEl.textContent = `Incorrect — correct answer: ${correct}`;
    feedbackEl.style.color = "red";
    addMistake(currentItem);
    speak(correct);
    addLevelProgress(2);
  }

  updateScore(isCorrect);
  updateProgress();

  badgeRule_firstCorrect(isCorrect);
  badgeRule_tenCorrect(isCorrect);

  goToNextSentenceItem();
}

// 4. Move to next item
function goToNextSentenceItem() {
  if (!currentItems || currentItems.length === 0) return;

  currentIndex++;
  if (currentIndex >= currentItems.length) {
    currentIndex = 0;
  }

  currentItem = currentItems[currentIndex];
  renderCurrentItem();
}

// 5. Scoring
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

// 6. Progress tracking
function updateProgress() {
  const progressEl = $("progressDisplay");
  if (!progressEl || currentItems.length === 0) return;

  const percent = Math.round((currentIndex + 1) / currentItems.length * 100);
  progressEl.textContent = `Progress: ${percent}%`;
}

// 7. Mistake tracking
function addMistake(item) {
  mistakes.push({
    english: item.english,
    correct: item.foreignCorrect
  });

  renderMistakeList();
}

function renderMistakeList() {
  const listEl = $("review-words-list");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (mistakeList.length === 0) {
    listEl.innerHTML = `<div class="ui-empty">No mistakes yet.</div>`;
    return;
  }

  mistakeList.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "ui-card";

    card.innerHTML = `
      <div class="mistake-word">${item.word}</div>
      <div class="mistake-correct">${item.correct}</div>
    `;

    const delBtn = document.createElement("button");
    delBtn.className = "ui-pill danger";
    delBtn.textContent = "Remove";

    delBtn.addEventListener("click", () => {
      mistakeList.splice(index, 1);
      renderMistakeList();
    });

    card.appendChild(delBtn);
    listEl.appendChild(card);
  });
}


// 8. Badge rules (sentence mode)
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

// 9. Level-up system
function addLevelProgress(amount) {
  levelProgress += amount;

  if (levelProgress >= LEVEL_UP_THRESHOLD) {
    levelProgress = 0;
    promoteUserLevel();
  }

  renderLevelProgress();
}

function promoteUserLevel() {
  const currentIdx = CEFR_LEVELS.indexOf(currentLevel);

  if (currentIdx < CEFR_LEVELS.length - 1) {
    const newLevel = CEFR_LEVELS[currentIdx + 1];
    currentLevel = newLevel;

    levelUpNotifications.push(`You advanced to ${newLevel}!`);
    renderLevelUpNotifications();

    // Auto-create certificate entry
    addCertificateToHistory("Auto", newLevel);

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
//  CONVERSATION MODE — FULL CONSOLIDATED (PART 3)
// ============================================================

// 1. Load conversation set
function loadConversationSet() {
  const pack = window.LANG.modules.CEFR_CONVERSATION?.default;
  if (!pack) {
    currentConversation = [];
    currentConversationIndex = 0;
    renderConversationItem();
    return;
  }

  const levelArray = pack[currentLevel] || [];
  currentConversation = levelArray.slice();
  currentConversationIndex = 0;

  renderConversationItem();
}


// 2. Render conversation item
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

// 3. Handle conversation reply
function handleConversationReply(reply) {
  const feedbackEl = $("conversationFeedback");
  if (!feedbackEl || !convoItem) return;

  feedbackEl.textContent = `You said: ${reply}`;
  feedbackEl.style.color = "blue";

  speak(reply);

  mineConversation(convoItem.prompt, reply);

  convoIndex++;
  if (convoIndex >= convoHistory.length) {
    convoIndex = 0;
  }

  convoItem = convoHistory[convoIndex];
  setTimeout(() => renderConversationItem(), 500);
}

// 4. Switch to conversation mode
function switchToConversationMode() {
  currentMode = "conversation";
  loadConversationSet();
  showSection("conversationSection");
}

// ============================================================
//  MINING — FULL CONSOLIDATED (PART 3)
// ============================================================

// 1. Render mining list
function renderMiningList() {
  const listEl = $("miningList");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (miningList.length === 0) {
    listEl.innerHTML = `<div class="ui-empty">No mined items yet.</div>`;
    return;
  }

  miningList.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "ui-card";

    card.innerHTML = `
      <div class="mine-word">${item.word}</div>
      <div class="mine-translation">${item.translation}</div>
      <div class="mine-source ui-badge">${item.source}</div>
    `;

    const delBtn = document.createElement("button");
    delBtn.className = "ui-pill danger";
    delBtn.textContent = "Delete";

    delBtn.addEventListener("click", () => {
      miningList.splice(index, 1);
      renderMiningList();
    });

    card.appendChild(delBtn);
    listEl.appendChild(card);
  });
}


// 2. Switch to mining tab
function switchToMiningTab() {
  showSection("miningSection");
  renderMiningList();
}

// 3. Mining buttons
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
//  DICTIONARY — FULL CONSOLIDATED (PART 3)
// ============================================================

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

function addDictionaryEntry(word, definition) {
  dictionaryEntries.push({
    word,
    definition,
    language: currentLanguage
  });

  badgeRule_firstDictionarySave();
  renderDictionaryList();
}

function renderDictionaryResult(word, definition) {
  const resultEl = $("dictionaryResult");
  if (!resultEl) return;

  resultEl.innerHTML = `
    <strong>${word}</strong><br>
    ${definition}
  `;
}

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

function switchToDictionaryTab() {
  showSection("dictionarySection");
  renderDictionaryList();
}

function setupDictionaryUI() {
  const input = $("dict-search-input");
  const result = $("dict-search-result");

  if (!input || !result) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      result.textContent = "";
      return;
    }

    const dict = window.LANG.modules.WORD_DICT?.default || {};
    const translation = dict[query];

    if (translation) {
      result.textContent = translation;
    } else {
      result.textContent = "Not found.";
    }
  });
}

}

// ============================================================
//  REVIEW MODE — FULL CONSOLIDATED (PART 3)
// ============================================================

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

function switchToReviewMode() {
  showSection("reviewSection");
  reviewIndex = 0;
  renderReviewItem();
}

function setupReviewUI() {
  const retryBtn = $("reviewRetryButton");
  if (!retryBtn) return;

  retryBtn.addEventListener("click", handleReviewAnswer);
}

// ============================================================
//  BADGES — FULL CONSOLIDATED (PART 3)
// ============================================================

function awardBadge(id, name, description, icon) {
  if (badges.some(b => b.id === id)) return;

  badges.push({ id, name, description, icon });
  renderBadges();
}

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
//  CERTIFICATES — FULL CONSOLIDATED (PART 4)
// ============================================================

// 1. Core certificate rendering (single design)
function renderCertificateHTML(name, level, date) {
  return `
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
          Awarded on: ${date}
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

// 2. Add certificate to history (no delete)
function addCertificateToHistory(name, level) {
  const date = new Date().toLocaleDateString();

  certificateHistory.push({
    name,
    level,
    date,
    html: renderCertificateHTML(name, level, date)
  });

  renderCertificateHistoryGallery();
}

// 3. Certificate gallery rendering
function renderCertificateHistoryGallery() {
  const listEl = $("certGalleryList");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (certificateHistory.length === 0) {
    listEl.textContent = "No certificates earned yet.";
    return;
  }

  certificateHistory.forEach((cert, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "ui-card";

    wrapper.innerHTML = `
      <strong>${cert.name}</strong><br>
      Level: ${cert.level}<br>
      Date: ${cert.date}
    `;

    const viewBtn = document.createElement("button");
    viewBtn.className = "ui-pill";
    viewBtn.textContent = "View";

    viewBtn.addEventListener("click", () => {
      renderCertificatePreviewFromHistory(index);
    });

    const downloadBtn = document.createElement("button");
    downloadBtn.className = "ui-pill ui-pill-glow";
    downloadBtn.textContent = "Download PDF";

    downloadBtn.addEventListener("click", () => {
      downloadCertificateFromHistory(index);
    });

    wrapper.appendChild(document.createElement("br"));
    wrapper.appendChild(viewBtn);
    wrapper.appendChild(downloadBtn);

    listEl.appendChild(wrapper);
  });
}

// 4. Render preview from history
function renderCertificatePreviewFromHistory(index) {
  const cert = certificateHistory[index];
  const previewEl = $("certGenPreview");
  if (!cert || !previewEl) return;

  previewEl.innerHTML = cert.html;
}

// 5. Download certificate from history
function downloadCertificateFromHistory(index) {
  const cert = certificateHistory[index];
  if (!cert) return;

  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = cert.html;

  exportCertificateAsPDF(tempContainer);
}

// 6. Certificate generator preview
function generateCertificatePreview() {
  const name = $("certGenNameInput").value.trim() || "Student";
  const level = $("certGenLevelSelect").value;
  const date = new Date().toLocaleDateString();

  const previewEl = $("certGenPreview");
  if (!previewEl) return;

  previewEl.innerHTML = renderCertificateHTML(name, level, date);
}

// 7. Download current generated certificate
function downloadGeneratedCertificate() {
  const previewEl = $("certGenPreview");
  if (!previewEl) return;

  exportCertificateAsPDF(previewEl);
}

// 8. Certificate generator + gallery UI setup
function setupCertificateGeneratorPage() {
  const genBtn = $("certGenGenerateButton");
  const dlBtn = $("certGenDownloadButton");

  if (genBtn) {
    genBtn.addEventListener("click", () => {
      const name = $("certGenNameInput").value.trim() || "Student";
      const level = $("certGenLevelSelect").value;

      generateCertificatePreview();
      addCertificateToHistory(name, level);
    });
  }

  if (dlBtn) {
    dlBtn.addEventListener("click", downloadGeneratedCertificate);
  }

  renderCertificateHistoryGallery();
}

// 9. Switch to certificate page
function switchToCertificatePage() {
  showSection("certificateGeneratorPage");
  renderCertificateHistoryGallery();
}

// ============================================================
//  UI HELPERS, THEME, TABS, FINAL GLUE — FULL CONSOLIDATED (PART 5)
// ============================================================

// 1. UI helpers
function flashElement(el) {
  if (!el) return;
  el.style.transition = "background-color 0.3s";
  el.style.backgroundColor = "#ffe9a8";
  setTimeout(() => {
    el.style.backgroundColor = "";
  }, 300);
}

function fadeIn(el) {
  if (!el) return;
  el.style.opacity = 0;
  el.style.transition = "opacity 0.4s ease";
  requestAnimationFrame(() => {
    el.style.opacity = 1;
  });
}

// 2. Theme system
function toggleTheme() {
  const root = document.documentElement;
  const current = root.dataset.theme;
  root.dataset.theme = current === "light" ? "dark" : "light";
}

function toggleContrast() {
  const root = document.documentElement;
  const current = root.dataset.theme;
  root.dataset.theme = current === "contrast" ? "dark" : "contrast";
}

function setupThemeButtons() {
  const themeBtn = $("themeToggleButton");
  const contrastBtn = $("contrastToggleButton");

  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
  if (contrastBtn) contrastBtn.addEventListener("click", toggleContrast);
}

// 3. Tabs
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

function setupTabs() {
  const tabs = document.querySelectorAll(".ui-tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      activateTab(target);

      currentMode = target;

      if (target === "sentenceSection" || target === "sentences") {
        currentMode = "sentences";
        loadCurrentSet();
        showSection("sentenceSection");
      } else if (target === "conversationSection" || target === "conversation") {
        currentMode = "conversation";
        switchToConversationMode();
      } else if (target === "miningSection" || target === "mining") {
        currentMode = "mining";
        switchToMiningTab();
      } else if (target === "dictionarySection" || target === "dictionary") {
        currentMode = "dictionary";
        switchToDictionaryTab();
      } else if (target === "reviewSection" || target === "review") {
        currentMode = "review";
        switchToReviewMode();
      } else if (target === "certificateGeneratorPage" || target === "certificates") {
        currentMode = "certificates";
        switchToCertificatePage();
      }
    });
  });
}

// 4. Sentence UI setup
function setupSentenceUI() {
  const nextBtn = $("nextButton");
  if (nextBtn) nextBtn.addEventListener("click", goToNextSentenceItem);

  addMiningButtonToSentenceUI();
}

function setupLevelSelector() {
  const select = $("levelSelect");
  if (!select) return;

  select.innerHTML = "";

  CEFR_LEVELS.forEach(level => {
    const opt = document.createElement("option");
    opt.value = level;
    opt.textContent = level;
    if (level === currentLevel) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener("change", e => {
    currentLevel = e.target.value;
    if (currentMode === "sentences") loadCurrentSet();
    if (currentMode === "conversation") loadConversationSet();
  });
}

// 6. Final init
function initApp() {
  initLanguageSelector();
  setupLevelSelector();
  setupModeSelector();
  setupTabs();
  setupThemeButtons();

  loadCurrentSet();
  renderCurrentItem();
  setupSentenceUI();
  setupDictionaryUI();
  setupReviewUI();
  setupCertificateGeneratorPage();

  renderBadges();
  renderMiningList();
  renderDictionaryList();
  renderMistakeList();
  renderCertificateHistoryGallery();
  renderLevelProgress();

  sanityCheck();
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadLanguagePack("es");

    const WORD_BANKS = {
      es: {
        sentences: window.LANG.modules.CEFR_SENTENCE_CHOICES.default,
        conversation: window.LANG.modules.CEFR_CONVERSATION.default
      },
      fr: { sentences: {}, conversation: {} },
      nl: { sentences: {}, conversation: {} }
    };

    initLanguageSelector();
    initApp();   // ⭐ THIS FIXES THE DASHBOARD
    activateTab("dashboard");
    initTabNavigation();
    initRateControl();
    initNameBox();
    initDictionarySearch();
    initFreePracticeSandbox();
    updateBadges();
    updateProgressMeters();
});

function initLanguageSelector() {
  const selector = document.getElementById("language-select");
  if (!selector) return;

  selector.addEventListener("change", async (e) => {
    const newLang = e.target.value;

    // Update global language state
    window.LANG.lang = newLang;

    // Reload all language modules
    await loadLanguagePack(newLang);

    // Refresh UI
    renderDashboard();
    loadCurrentSet();
    renderCurrentItem();
  });
}
