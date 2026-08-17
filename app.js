// ============================================================
//  LANGUAGE LEARNING APP — CLEAN REWRITE (PART 1)
//  Core configuration, state, and utilities
// ============================================================

// ----------------------------
// 1. Supported languages
// ----------------------------
const LANGUAGES = {
  es: { code: "es", name: "Spanish" },
  fr: { code: "fr", name: "French" },
  nl: { code: "nl", name: "Dutch" }
};

// ----------------------------
// 2. Wordbank registry
// ----------------------------
// Each language folder (wordbanks/<lang>/) must define its own
// CEFR_SENTENCE_CHOICES.js which exposes CEFR_SENTENCE_CHOICES.

const WORD_BANKS = {
  es: {
    sentences: CEFR_SENTENCE_CHOICES
  },
  fr: {
    sentences: {}   // placeholder for future French
  },
  nl: {
    sentences: {}   // placeholder for future Dutch
  }
};

// ----------------------------
// 3. Global app state
// ----------------------------
let currentLanguage = "es";      // default language
let currentLevel = "A1";         // default CEFR level
let currentMode = "sentences";   // later: "phrases", "conversation", etc.

let currentItems = [];           // active question set
let currentIndex = 0;            // index in currentItems
let currentItem = null;          // currently displayed item

// ----------------------------
// 4. DOM helper
// ----------------------------
function $(id) {
  return document.getElementById(id);
}

// ============================================================
//  LANGUAGE LEARNING APP — CLEAN REWRITE (PART 2)
//  Initialisation, selectors, and loading CEFR sets
// ============================================================

// ----------------------------
// 5. Initialise the app
// ----------------------------
function initApp() {
  setupLanguageSelector();
  setupLevelSelector();
  setupModeSelector();

  loadCurrentSet();
  renderCurrentItem();

  const nextBtn = $("nextButton");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      goToNextItem();
    });
  }
}

// ----------------------------
// 6. Language selector
// ----------------------------
function setupLanguageSelector() {
  const select = $("languageSelect");
  if (!select) return;

  select.innerHTML = "";

  Object.values(LANGUAGES).forEach(lang => {
    const opt = document.createElement("option");
    opt.value = lang.code;
    opt.textContent = lang.name;
    if (lang.code === currentLanguage) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener("change", e => {
    currentLanguage = e.target.value;
    loadCurrentSet();
  });
}

// ----------------------------
// 7. Level selector
// ----------------------------
function setupLevelSelector() {
  const select = $("levelSelect");
  if (!select) return;

  const levels = ["A1", "A2", "B1", "B2"];
  select.innerHTML = "";

  levels.forEach(level => {
    const opt = document.createElement("option");
    opt.value = level;
    opt.textContent = level;
    if (level === currentLevel) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener("change", e => {
    currentLevel = e.target.value;
    loadCurrentSet();
  });
}

// ----------------------------
// 8. Mode selector
// ----------------------------
function setupModeSelector() {
  const select = $("modeSelect");
  if (!select) return;

  const modes = [
    { id: "sentences", label: "Sentences" }
    // later: phrases, conversation, mining, etc.
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
    loadCurrentSet();
  });
}

// ----------------------------
// 9. Load CEFR items for current language + level
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

  if (currentMode === "sentences") {
    const pack = langBundle.sentences || {};
    const levelArray = pack[currentLevel] || [];
    currentItems = levelArray.slice(); // shallow copy
  } else {
    currentItems = [];
  }

  currentIndex = 0;
  currentItem = currentItems.length > 0 ? currentItems[0] : null;
  renderCurrentItem();
}

// ============================================================
//  LANGUAGE LEARNING APP — CLEAN REWRITE (PART 3)
//  Rendering questions, handling answers, navigation
// ============================================================

// ----------------------------
// 10. Render the current item
// ----------------------------
function renderCurrentItem() {
  const promptEl = $("promptText");
  const optionsEl = $("optionsContainer");
  const feedbackEl = $("feedbackText");

  if (!promptEl || !optionsEl || !feedbackEl) return;

  // Clear previous content
  optionsEl.innerHTML = "";
  feedbackEl.textContent = "";

  if (!currentItem) {
    promptEl.textContent = "No items available for this language and level.";
    return;
  }

  // Show English prompt
  promptEl.textContent = currentItem.english;

  // Build multiple-choice options
  const opts = currentItem.foreignOptions || [];

  opts.forEach(optionText => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "optionButton";
    btn.textContent = optionText;

    btn.addEventListener("click", () => {
      handleAnswer(optionText);
    });

    optionsEl.appendChild(btn);
  });
}

// ----------------------------
// 11. Handle answer selection
// ----------------------------
function handleAnswer(selectedText) {
  const feedbackEl = $("feedbackText");
  if (!feedbackEl || !currentItem) return;

  const correct = currentItem.foreignCorrect;
  const isCorrect = selectedText === correct;

  if (isCorrect) {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
  } else {
    feedbackEl.textContent = `Incorrect — correct answer: ${correct}`;
    feedbackEl.style.color = "red";
  }
}

// ----------------------------
// 12. Move to next item
// ----------------------------
function goToNextItem() {
  if (!currentItems || currentItems.length === 0) return;

  currentIndex++;

  // Loop back to start
  if (currentIndex >= currentItems.length) {
    currentIndex = 0;
  }

  currentItem = currentItems[currentIndex];
  renderCurrentItem();
}

// ============================================================
//  LANGUAGE LEARNING APP — CLEAN REWRITE (PART 4)
//  Speech synthesis, scoring, progress, mistake review
// ============================================================

// ----------------------------
// 13. Speech synthesis (optional)
// ----------------------------
function speak(text) {
  if (!window.speechSynthesis) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = currentLanguage === "es" ? "es-ES" :
               currentLanguage === "fr" ? "fr-FR" :
               currentLanguage === "nl" ? "nl-NL" : "en-US";

  window.speechSynthesis.speak(utter);
}

// ----------------------------
// 14. Scoring system (optional)
// ----------------------------
let score = 0;

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
// 15. Progress tracking (optional)
// ----------------------------
function updateProgress() {
  const progressEl = $("progressDisplay");
  if (!progressEl || currentItems.length === 0) return;

  const percent = Math.round((currentIndex + 1) / currentItems.length * 100);
  progressEl.textContent = `Progress: ${percent}%`;
}

// ----------------------------
// 16. Mistake review list (optional)
// ----------------------------
let mistakes = [];

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

  mistakes.forEach(m => {
    const div = document.createElement("div");
    div.className = "mistakeItem";
    div.textContent = `${m.english} → ${m.correct}`;
    listEl.appendChild(div);
  });
}

// ----------------------------
// 17. Integrate scoring + mistakes into answer handling
// ----------------------------
function handleAnswer(selectedText) {
  const feedbackEl = $("feedbackText");
  if (!feedbackEl || !currentItem) return;

  const correct = currentItem.foreignCorrect;
  const isCorrect = selectedText === correct;

  if (isCorrect) {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    speak(correct);
  } else {
    feedbackEl.textContent = `Incorrect — correct answer: ${correct}`;
    feedbackEl.style.color = "red";
    addMistake(currentItem);
    speak(correct);
  }

  updateScore(isCorrect);
  updateProgress();
}

// ============================================================
//  LANGUAGE LEARNING APP — CLEAN REWRITE (PART 5)
//  Boot sequence + final DOMContentLoaded hook
// ============================================================

// ----------------------------
// 18. Optional UI helpers
// ----------------------------
function showSection(id) {
  const sections = document.querySelectorAll(".appSection");
  sections.forEach(sec => sec.style.display = "none");

  const target = $(id);
  if (target) target.style.display = "block";
}

function flashElement(el) {
  if (!el) return;
  el.style.transition = "background-color 0.3s";
  el.style.backgroundColor = "#ffe9a8";
  setTimeout(() => {
    el.style.backgroundColor = "";
  }, 300);
}

// ----------------------------
// 19. End-to-end sanity check
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
// 20. Boot the entire app
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  sanityCheck();
});

// ============================================================
//  CONVERSATION ENGINE — PART 1
//  Core structure + state + wordbank registry
// ============================================================

// ----------------------------
// 1. Conversation state
// ----------------------------
let convoHistory = [];
let convoIndex = 0;
let convoItem = null;

// ----------------------------
// 2. Conversation wordbanks
// ----------------------------
// Each language folder will contain CEFR_CONVERSATION.js
// with structure:
// {
//   A1: [ { prompt: "...", replies: ["...", "..."] }, ... ],
//   A2: [...],
//   B1: [...],
//   B2: [...]
// }

const CONVO_BANKS = {
  es: {
    conversation: CEFR_CONVERSATION
  },
  fr: {
    conversation: {}
  },
  nl: {
    conversation: {}
  }
};

// ----------------------------
// 3. Switch mode to conversation
// ----------------------------
function loadConversationSet() {
  const langBundle = CONVO_BANKS[currentLanguage];
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

// ============================================================
//  CONVERSATION ENGINE — PART 2
//  Rendering conversation prompts + reply options
// ============================================================

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

  // Show the conversation prompt
  promptEl.textContent = convoItem.prompt;

  // Build reply buttons
  convoItem.replies.forEach(reply => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "replyButton";
    btn.textContent = reply;

    btn.addEventListener("click", () => {
      handleConversationReply(reply);
    });

    replyEl.appendChild(btn);
  });
}

// ============================================================
//  CONVERSATION ENGINE — PART 3
//  Handling replies + advancing conversation
// ============================================================

function handleConversationReply(reply) {
  const feedbackEl = $("conversationFeedback");
  if (!feedbackEl || !convoItem) return;

  // For now, all replies are valid — conversation is free-flowing
  feedbackEl.textContent = `You said: ${reply}`;
  feedbackEl.style.color = "blue";

  // Optional: speak the reply
  speak(reply);

  // Move to next conversation item
  convoIndex++;
  if (convoIndex >= convoHistory.length) {
    convoIndex = 0; // loop
  }

  convoItem = convoHistory[convoIndex];
  setTimeout(() => renderConversationItem(), 500);
}

// ============================================================
//  CONVERSATION ENGINE — PART 4
//  Integrating conversation mode into main app
// ============================================================

function switchToConversationMode() {
  currentMode = "conversation";
  loadConversationSet();
  showSection("conversationSection");
}

// Modify mode selector to include conversation
function setupModeSelector() {
  const select = $("modeSelect");
  if (!select) return;

  const modes = [
    { id: "sentences", label: "Sentences" },
    { id: "conversation", label: "Conversation" }
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
    }

    if (currentMode === "conversation") {
      switchToConversationMode();
    }
  });
}

// ============================================================
//  MINING TAB — PART 1
//  Core structure + mining state
// ============================================================

// Mining list stores user‑saved items
let miningList = [];

// Mining item structure:
// {
//   english: "...",
//   foreign: "...",
//   source: "sentence" | "conversation" | "manual"
// }

// ============================================================
//  MINING TAB — PART 2
//  Functions to add items to the mining list
// ============================================================

function mineSentence(item) {
  miningList.push({
    english: item.english,
    foreign: item.foreignCorrect,
    source: "sentence"
  });
  renderMiningList();
}

function mineConversation(prompt, reply) {
  miningList.push({
    english: prompt,
    foreign: reply,
    source: "conversation"
  });
  renderMiningList();
}

function mineManual(english, foreign) {
  miningList.push({
    english,
    foreign,
    source: "manual"
  });
  renderMiningList();
}

// ============================================================
//  MINING TAB — PART 3
//  Rendering the mining list
// ============================================================

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
    div.className = "minedItem";

    div.innerHTML = `
      <strong>${item.english}</strong><br>
      ${item.foreign}<br>
      <small>Source: ${item.source}</small>
    `;

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Remove";
    delBtn.className = "deleteMineButton";
    delBtn.addEventListener("click", () => {
      miningList.splice(index, 1);
      renderMiningList();
    });

    div.appendChild(delBtn);
    listEl.appendChild(div);
  });
}

// ============================================================
//  MINING TAB — PART 4
//  Integration with main app
// ============================================================

function switchToMiningTab() {
  showSection("miningSection");
  renderMiningList();
}

// Add mining buttons to sentence mode
function addMiningButtonToSentenceUI() {
  const mineBtn = $("mineSentenceButton");
  if (!mineBtn) return;

  mineBtn.addEventListener("click", () => {
    if (currentItem) {
      mineSentence(currentItem);
    }
  });
}

// Add mining buttons to conversation mode
function addMiningButtonToConversationUI() {
  const mineBtn = $("mineConversationButton");
  if (!mineBtn) return;

  mineBtn.addEventListener("click", () => {
    if (convoItem) {
      mineConversation(convoItem.prompt, "Your reply here");
    }
  });
}

// Modify mode selector to include mining
function setupModeSelector() {
  const select = $("modeSelect");
  if (!select) return;

  const modes = [
    { id: "sentences", label: "Sentences" },
    { id: "conversation", label: "Conversation" },
    { id: "mining", label: "Mining" }
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
    }

    if (currentMode === "conversation") {
      switchToConversationMode();
    }

    if (currentMode === "mining") {
      switchToMiningTab();
    }
  });
}

// ============================================================
//  DICTIONARY TAB — PART 1
//  Core structure + dictionary state
// ============================================================

// Dictionary entries stored by the user
let dictionaryEntries = [];

// Dictionary entry structure:
// {
//   word: "...",
//   definition: "...",
//   language: "es" | "fr" | "nl"
// }

// ============================================================
//  DICTIONARY TAB — PART 2
//  Lookup functions
// ============================================================

// Simple placeholder dictionary
// You can replace this with a real API later.
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
  renderDictionaryList();
}

// ============================================================
//  DICTIONARY TAB — PART 3
//  Rendering dictionary results + saved entries
// ============================================================

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
    div.className = "dictionaryEntry";

    div.innerHTML = `
      <strong>${entry.word}</strong><br>
      ${entry.definition}<br>
      <small>Language: ${entry.language}</small>
    `;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Remove";
    delBtn.className = "deleteDictionaryButton";
    delBtn.addEventListener("click", () => {
      dictionaryEntries.splice(index, 1);
      renderDictionaryList();
    });

    div.appendChild(delBtn);
    listEl.appendChild(div);
  });
}

// ============================================================
//  DICTIONARY TAB — PART 4
//  Integration with main app
// ============================================================

function switchToDictionaryTab() {
  showSection("dictionarySection");
  renderDictionaryList();
}

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

// Modify mode selector to include dictionary
function setupModeSelector() {
  const select = $("modeSelect");
  if (!select) return;

  const modes = [
    { id: "sentences", label: "Sentences" },
    { id: "conversation", label: "Conversation" },
    { id: "mining", label: "Mining" },
    { id: "dictionary", label: "Dictionary" }
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
    }

    if (currentMode === "conversation") {
      switchToConversationMode();
    }

    if (currentMode === "mining") {
      switchToMiningTab();
    }

    if (currentMode === "dictionary") {
      switchToDictionaryTab();
      setupDictionaryUI();
    }
  });
}

// ============================================================
//  REVIEW MODE — PART 1
//  Core structure + review state
// ============================================================

// Review list is derived from mistakes[] created earlier
let reviewIndex = 0;
let reviewItem = null;

// Review item structure:
// {
//   english: "...",
//   correct: "..."
// }

// ============================================================
//  REVIEW MODE — PART 2
//  Rendering review items
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

// ============================================================
//  REVIEW MODE — PART 3
//  Handling retry answers
// ============================================================

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

  // Move to next review item
  reviewIndex++;
  if (reviewIndex >= mistakes.length) {
    reviewIndex = 0; // loop
  }

  setTimeout(() => renderReviewItem(), 600);
}

// ============================================================
//  REVIEW MODE — PART 4
//  Integration with main app
// ============================================================

function switchToReviewMode() {
  showSection("reviewSection");
  reviewIndex = 0;
  renderReviewItem();
}

function setupReviewUI() {
  const retryBtn = $("reviewRetryButton");
  if (!retryBtn) return;

  retryBtn.addEventListener("click", () => {
    handleReviewAnswer();
  });
}

// Modify mode selector to include review mode
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
    }

    if (currentMode === "conversation") {
      switchToConversationMode();
    }

    if (currentMode === "mining") {
      switchToMiningTab();
    }

    if (currentMode === "dictionary") {
      switchToDictionaryTab();
      setupDictionaryUI();
    }

    if (currentMode === "review") {
      switchToReviewMode();
      setupReviewUI();
    }
  });
}

// ============================================================
//  BADGE SYSTEM — PART 1
//  Core structure + badge state
// ============================================================

// All earned badges
let badges = [];

// Badge structure:
// {
//   id: "first_correct",
//   name: "First Correct Answer",
//   description: "Awarded for getting your first correct answer.",
//   icon: "🏅"
// }

// ============================================================
//  BADGE SYSTEM — PART 2
//  Badge earning rules
// ============================================================

function awardBadge(id, name, description, icon) {
  // Prevent duplicates
  if (badges.some(b => b.id === id)) return;

  badges.push({ id, name, description, icon });
  renderBadges();
}

// Rule: first correct answer
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

// Rule: 10 correct answers total
let totalCorrectAnswers = 0;

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

// Rule: first mined item
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

// Rule: first dictionary save
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

// ============================================================
//  BADGE SYSTEM — PART 3
//  Rendering badges
// ============================================================

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
    div.className = "badgeItem";

    div.innerHTML = `
      <span class="badgeIcon">${b.icon}</span>
      <strong>${b.name}</strong><br>
      <small>${b.description}</small>
    `;

    badgeEl.appendChild(div);
  });
}

// ============================================================
//  BADGE SYSTEM — PART 4
//  Integration with main app
// ============================================================

// Hook into sentence answer handling
function handleAnswer(selectedText) {
  const feedbackEl = $("feedbackText");
  if (!feedbackEl || !currentItem) return;

  const correct = currentItem.foreignCorrect;
  const isCorrect = selectedText === correct;

  if (isCorrect) {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "green";
    speak(correct);
  } else {
    feedbackEl.textContent = `Incorrect — correct answer: ${correct}`;
    feedbackEl.style.color = "red";
    addMistake(currentItem);
    speak(correct);
  }

  // Scoring + progress
  updateScore(isCorrect);
  updateProgress();

  // Badge rules
  badgeRule_firstCorrect(isCorrect);
  badgeRule_tenCorrect(isCorrect);

  // Move to next item
  goToNextItem();
}

// Hook into mining
function mineSentence(item) {
  miningList.push({
    english: item.english,
    foreign: item.foreignCorrect,
    source: "sentence"
  });

  badgeRule_firstMine();
  renderMiningList();
}

// Hook into dictionary
function addDictionaryEntry(word, definition) {
  dictionaryEntries.push({
    word,
    definition,
    language: currentLanguage
  });

  badgeRule_firstDictionarySave();
  renderDictionaryList();
}

// ============================================================
//  LEVEL-UP SYSTEM — PART 1
//  Core structure + level-up state
// ============================================================

// CEFR order
const CEFR_LEVELS = ["A1", "A2", "B1", "B2"];

// Track user progress toward next level
let levelProgress = 0;

// How much progress is needed to level up
const LEVEL_UP_THRESHOLD = 100;

// Level-up notification queue
let levelUpNotifications = [];

// ============================================================
//  LEVEL-UP SYSTEM — PART 2
//  Level-up rules
// ============================================================

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

    // Reload content for new level
    if (currentMode === "sentences") loadCurrentSet();
    if (currentMode === "conversation") loadConversationSet();
  }
}

function renderLevelProgress() {
  const el = $("levelProgressDisplay");
  if (!el) return;

  el.textContent = `Level Progress: ${levelProgress}/${LEVEL_UP_THRESHOLD}`;
}

// ============================================================
//  LEVEL-UP SYSTEM — PART 3
//  Rendering level-up notifications
// ============================================================

function renderLevelUpNotifications() {
  const el = $("levelUpNotifications");
  if (!el) return;

  el.innerHTML = "";

  levelUpNotifications.forEach(msg => {
    const div = document.createElement("div");
    div.className = "levelUpMessage";
    div.textContent = msg;
    el.appendChild(div);
  });
}

// ============================================================
//  LEVEL-UP SYSTEM — PART 4
//  Integration with main app
// ============================================================

// Modify sentence answer handling to include level progress
function handleAnswer(selectedText) {
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

  goToNextItem();
}




// ============================================================
//  Language Learning App — JSON-driven core
//  app.js (Part 1)
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
// Each language’s JS wordbank file must define its own globals,
// e.g. CEFR_SENTENCE_CHOICES for sentences.

const WORD_BANKS = {
  es: {
    sentences: CEFR_SENTENCE_CHOICES
    // later: phrases, conversation, etc.
  },
  fr: {
    sentences: {} // placeholder for future French
  },
  nl: {
    sentences: {} // placeholder for future Dutch
  }
};

// ----------------------------
// 3. Global app state
// ----------------------------

let currentLanguage = "es";     // default language
let currentLevel = "A1";        // default CEFR level
let currentMode = "sentences";  // later: "phrases", "conversation", etc.

let currentItems = [];          // active question set
let currentIndex = 0;           // index in currentItems
let currentItem = null;         // currently displayed item

// ----------------------------
// 4. Simple DOM helper
// ----------------------------

function $(id) {
  return document.getElementById(id);
}
