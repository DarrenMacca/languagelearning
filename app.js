/* ============================================================
   CEFR PERCENTAGE PROGRESSION ENGINE (85% PASSING CRITERIA)
   ============================================================ */

// 1. Initial State Profile Trackers (Saves completed item fingerprints to prevent scoring duplicates)
let cefrUserProgressMatrix = {
    currentScore: parseInt(localStorage.getItem("cefr_user_score")) || 0,
    correctStreak: parseInt(localStorage.getItem("cefr_user_streak")) || 0,
    
    // Arrays holding the unique IDs of questions answered correctly
    masteredItems: JSON.parse(localStorage.getItem("cefr_mastered_fingerprints")) || {
        A1: [],
        A2: [],
        B1: [],
        B2: []
    }
};

// 🎯 TARGET CRITERIA: A level requires an 85% completion rate to unlock the next block
const PASSING_PERCENTAGE_CRITERIA = 85;

/**
 * Dynamic Percentage Calculator: Computes active completion rates per milestone bracket
 */
function calculateLevelPercentage(levelKey) {
    // 🔍 Under the hood, this counts total items available inside your main data structures
    let totalAvailableQueries = 0;
    
    if (typeof CEFR_LEVELS !== "undefined" && CEFR_LEVELS[levelKey]) {
        totalAvailableQueries += CEFR_LEVELS[levelKey].length; // Vocabulary-backed items
    }
    if (typeof CEFR_SENTENCES !== "undefined" && CEFR_SENTENCES[levelKey]) {
        totalAvailableQueries += CEFR_SENTENCES[levelKey].length; // Context items
    }
    if (typeof CEFR_CONVERSATION_PROMPTS !== "undefined" && CEFR_CONVERSATION_PROMPTS[levelKey]) {
        totalAvailableQueries += CEFR_CONVERSATION_PROMPTS[levelKey].length; // Dialogues
    }

    // Baseline fallback protection against zero-division loops
    if (totalAvailableQueries === 0) return 100;

    const correctUniqueCount = cefrUserProgressMatrix.masteredItems[levelKey].length;
    const currentPercent = Math.min(100, Math.round((correctUniqueCount / totalAvailableQueries) * 100));
    
    return currentPercent;
}

/**
 * Gatekeeper Engine Check: Determines if a level tier is legally open for the user
 */
function isLevelUnlocked(levelKey) {
    if (levelKey === "A1") return true; // A1 is wide open by default
    if (levelKey === "A2") return calculateLevelPercentage("A1") >= PASSING_PERCENTAGE_CRITERIA;
    if (levelKey === "B1") return isLevelUnlocked("A2") && calculateLevelPercentage("A2") >= PASSING_PERCENTAGE_CRITERIA;
    if (levelKey === "B2") return isLevelUnlocked("B1") && calculateLevelPercentage("B1") >= PASSING_PERCENTAGE_CRITERIA;
    return true;
}

/**
 * Activity Evaluator: Logs successful module tasks and awards cosmetic score increments
 */
function registerSuccessfulModuleTask(levelKey, itemId, sourceModule) {
    // 🛡️ SECURITY FILTER: Restrict scoring strictly to authorized activity tabs
    const approvedTabs = ["Quiz", "Build", "Sentence", "Conversation"];
    if (!approvedTabs.includes(sourceModule)) return;

    // Create a unique compound tracking fingerprint identifier
    const itemFingerprint = `${sourceModule}_${itemId}`;

    // If they haven't answered this specific question correctly before, save it!
    if (!cefrUserProgressMatrix.masteredItems[levelKey].includes(itemFingerprint)) {
        cefrUserProgressMatrix.masteredItems[levelKey].push(itemFingerprint);
        cefrUserProgressMatrix.currentScore += 10; // Award cosmetic score points
        cefrUserProgressMatrix.correctStreak += 1;
        
        // Save changes permanently to device memory profiles
        localStorage.setItem("cefr_user_score", cefrUserProgressMatrix.currentScore);
        localStorage.setItem("cefr_user_streak", cefrUserProgressMatrix.correctStreak);
        localStorage.setItem("cefr_mastered_fingerprints", JSON.stringify(cefrUserProgressMatrix.masteredItems));
        
        // Live UI rendering checks for milestones
        evaluateMilestoneThresholds(levelKey);
    } else {
        cefrUserProgressMatrix.correctStreak += 1;
        localStorage.setItem("cefr_user_streak", cefrUserProgressMatrix.correctStreak);
    }

    renderScoreDashboardUI();
}

/**
 * Milestone Review Tracker: Monitors percentages and pops up promotion modals
 */
function evaluateMilestoneThresholds(currentLevel) {
    const currentPercent = calculateLevelPercentage(currentLevel);
    console.log(`📊 Progress Matrix: Level ${currentLevel} is currently at ${currentPercent}% completion.`);

    // Check if the current level just satisfied the 85% requirement to reveal the next gate
    if (currentPercent >= PASSING_PERCENTAGE_CRITERIA) {
        let nextLvlMap = { "A1": "A2", "A2": "B1", "B1": "B2" };
        let nextLevelName = nextLvlMap[currentLevel];
        
        if (nextLevelName) {
            // Check if we already popped this level up during this lifecycle
            const alreadyNotified = localStorage.getItem(`notified_pass_${currentLevel}`) === "true";
            if (!alreadyNotified) {
                localStorage.setItem(`notified_pass_${currentLevel}`, "true");
                triggerLevelPassModal(currentLevel, nextLevelName);
            }
        }
    }

    enforceMobileNavigationLocks();
}









/* ============================================================
   AUTO‑EXPAND DICTIONARY FROM CEFR LEVELS
   ============================================================ */
function autoExpandDictionary() {
    const allWords = Object.values(CEFR_LEVELS).flat();

    allWords.forEach(item => {
        if (!item || !item.spanish || !item.english) return;
        const key = item.spanish.toLowerCase().trim();
        const value = item.english.trim();
        WORD_DICT[key] = value; // Hydrates real vocabulary mappings natively
    });
}

autoExpandDictionary();
  


/* ============================================================
   TRANSLATION ENGINE — CEFR Phrases + Word Dictionary
   ============================================================ */
function translateToEnglish(spanishText) {
    const normalized = spanishText.toLowerCase().trim();

    // 1. Phrase detection
    if (CEFR_PHRASES[normalized]) {
        return CEFR_PHRASES[normalized];
    }

    // 2. Word-by-word fallback
    return normalized
        .split(/\s+/)
        .map(w => WORD_DICT[w] || `[${w}]`)
        .join(" ");
}

/* ============================================================
   CLEAN MISSING WORD VALIDATOR — NO AUTO-TRANSLATION
   ============================================================ */

function validateMissingWords() {
    const missing = new Set();

    function scan(sentence) {
        sentence.toLowerCase()
            .split(/\s+/)
            .forEach(tok => {
                if (!WORD_DICT[tok]) missing.add(tok);
            });
    }

    // 1. CEFR sentences
    Object.values(CEFR_SENTENCES).forEach(levelArr => {
        levelArr.forEach(item => scan(item.spanish));
    });

    // 2. Build disruptors
    [
        "rápido","lento","siempre","nunca","ayer","mañana",
        "porque","pero","muy","también","solo","entonces"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 3. Grammar helpers
    [
        "yo","tú","él","ella","ellos","ellas","nosotros","ustedes",
        "soy","eres","es","somos","son",
        "estoy","estás","está","estamos","están"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 4. Conversation fillers
    [
        "hola","adiós","gracias","por","favor","lo","siento",
        "qué","quién","dónde","cuándo","cómo","cuál",
        "porque","pero","también","entonces"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // 5. Quiz distractors
    [
        "bueno","malo","grande","pequeño","fácil","difícil",
        "coche","calle","ciudad"
    ].forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    console.group("=== CLEAN MISSING WORD REPORT ===");

    if (missing.size === 0) {
        console.log("✔ No missing words! Dictionary is complete.");
    } else {
        console.log("❌ Missing words (" + missing.size + "):");
        missing.forEach(w => console.log(" - " + w));
    }

    console.groupEnd();
}

/* ============================================================
   SUPER VALIDATOR — AUTO-TRANSLATE + AUTO-CATEGORIZE + AUTO-FIX
   ============================================================ */

function validateAndEnhanceDictionary() {

    const missing = new Set();
    const added = [];

    // === CATEGORY DETECTORS ===
    const isArticle = w => ["el","la","los","las","un","una"].includes(w);
    const isPronoun = w => ["me","te","le","nos","les","lo","la","los","las"].includes(w);
    const isPreposition = w => ["a","de","por","para","con","sin","al","del","en"].includes(w);
    const isConnector = w => ["y","o","pero","porque","también","entonces"].includes(w);
    const isAdverb = w => ["hoy","ayer","mañana","ahora","pronto","temprano","tarde","claramente"].includes(w);
    const isMultiWord = w => w.includes(" ");

    // === SMART TRANSLATION RULES ===
    function inferTranslation(word) {
        if (isArticle(word)) return "the";
        if (isPronoun(word)) return "it / him / her / them";
        if (isPreposition(word)) return "to / from / for / by / with";
        if (isConnector(word)) return "and / or / but / because / also / then";
        if (isAdverb(word)) return "time-related adverb";

        if (isMultiWord(word)) return "multi-word phrase";

        if (word.endsWith("ar")) return "to " + word.slice(0, -2);
        if (word.endsWith("er")) return "to " + word.slice(0, -2);
        if (word.endsWith("ir")) return "to " + word.slice(0, -2);

        if (word.endsWith("ó")) return word + " (past tense)";
        if (word.endsWith("aron")) return word + " (they past tense)";
        if (word.endsWith("ieron")) return word + " (they past tense)";
        if (word.endsWith("aba")) return word + " (imperfect)";
        if (word.endsWith("ía")) return word + " (imperfect)";

        if (word.match(/(o|a|os|as)$/)) return word + " (adjective)";

        return word + " (unclassified)";
    }

    // === TOKEN SCANNER ===
    function scanSentence(sentence) {
        sentence.toLowerCase()
            .split(/\s+/)
            .forEach(tok => {
                if (!WORD_DICT[tok]) missing.add(tok);
            });
    }

    // === 1. Scan CEFR sentences ===
    Object.values(CEFR_SENTENCES).forEach(levelArr => {
        levelArr.forEach(item => scanSentence(item.spanish));
    });

    // === 2. Scan disruptors ===
    const BUILD_DISRUPTORS = [
        "rápido","lento","siempre","nunca","ayer","mañana",
        "porque","pero","muy","también","solo","entonces"
    ];
    BUILD_DISRUPTORS.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 3. Scan grammar helpers ===
    const SENTENCE_GRAMMAR = [
        "yo","tú","él","ella","ellos","ellas","nosotros","ustedes",
        "soy","eres","es","somos","son",
        "estoy","estás","está","estamos","están"
    ];
    SENTENCE_GRAMMAR.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 4. Scan conversation fillers ===
    const CONVERSATION_FILLERS = [
        "hola","adiós","gracias","por","favor","lo","siento",
        "qué","quién","dónde","cuándo","cómo","cuál",
        "porque","pero","también","entonces"
    ];
    CONVERSATION_FILLERS.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 5. Scan quiz distractors ===
    const QUIZ_DISTRACTORS = [
        "bueno","malo","grande","pequeño","fácil","difícil",
        "coche","calle","ciudad"
    ];
    QUIZ_DISTRACTORS.forEach(tok => {
        if (!WORD_DICT[tok]) missing.add(tok);
    });

    // === 6. Auto-add missing words with inferred translations ===
    missing.forEach(w => {
        if (!WORD_DICT[w]) {
            WORD_DICT[w] = inferTranslation(w);
            added.push({ word: w, translation: WORD_DICT[w] });
        }
    });

    // === 7. Diagnostic report ===
    console.group("=== SUPER VALIDATOR REPORT ===");

    console.log("Missing words found:", missing.size);
    console.log("Auto-added:", added.length);

    if (added.length > 0) {
        console.log("=== Added Entries ===");
        added.forEach(entry => {
            console.log(`+ ${entry.word} → ${entry.translation}`);
        });
    }

    console.log("New dictionary size:", Object.keys(WORD_DICT).length);

    console.groupEnd();
}


/* ============================================================
   GRAMMAR ERROR EXPLAINER
   ============================================================ */
function explainGrammarError(user, correct) {
    const u = user.toLowerCase().trim();
    const c = correct.toLowerCase().trim();

    // Missing pronoun "te"
    if (c.includes("te gusta") && !u.includes("te") && u.includes("gusta")) {
        return "You forgot the pronoun “te”. Spanish requires “Te gusta…” to mean “You like…”.";
    }

    // Missing article
    if ((c.includes("el ") || c.includes("la ")) &&
        !u.includes("el ") && !u.includes("la ")) {
        return "You missed the article (el/la). Spanish usually needs an article before nouns.";
    }

    // Wrong adverb vs frequency
    if (c.includes("a menudo") && u.includes("lento")) {
        return "You used “lento” (slow) instead of a frequency word like “a menudo” (often).";
    }

    // Wrong verb form
    if (c.split(" ")[0] !== u.split(" ")[0]) {
        return "Your verb form doesn’t match the target sentence. Check the conjugation.";
    }

    return "Your sentence is understandable, but the grammar or word choice doesn’t match the target answer.";
}

function getCEFRGrammarHint(level, user, correct) {
    const u = user.toLowerCase().trim();
    const c = correct.toLowerCase().trim();

    /* ============================
       A1 HINTS
       ============================ */
    if (level === "A1") {
        if (!u.includes("el") && !u.includes("la") && (c.includes("el") || c.includes("la"))) {
            return "A1 hint: Remember to include articles (el/la) before nouns.";
        }
        if (!u.includes("te") && c.includes("te gusta")) {
            return "A1 hint: Use “te gusta” to say “you like”.";
        }
        return "A1 hint: Focus on simple present tense and basic sentence structure.";
    }

    /* ============================
       A2 HINTS
       ============================ */
    if (level === "A2") {
        if (u.includes("lento") && c.includes("a menudo")) {
            return "A2 hint: Use frequency words like “a menudo” instead of speed words like “lento”.";
        }
        if (!u.includes("ayer") && c.includes("ayer")) {
            return "A2 hint: Practice past-time markers like “ayer”.";
        }
        return "A2 hint: Practice common past tense verbs and daily routine vocabulary.";
    }

    /* ============================
       B1 HINTS
       ============================ */
    if (level === "B1") {
        if (!u.includes("porque") && c.includes("porque")) {
            return "B1 hint: Use connectors like “porque” to explain reasons.";
        }
        if (!u.includes("que") && c.includes("que")) {
            return "B1 hint: Multi‑clause sentences often require “que”.";
        }
        return "B1 hint: Try adding connectors (porque, aunque, cuando) to build longer sentences.";
    }

    /* ============================
       B2 HINTS
       ============================ */
    if (level === "B2") {
        if (!u.includes("aunque") && c.includes("aunque")) {
            return "B2 hint: Use contrast connectors like “aunque” for complex ideas.";
        }
        if (!u.includes("para") && c.includes("para")) {
            return "B2 hint: Use “para” to express purpose or intention.";
        }
        return "B2 hint: Aim for abstract vocabulary and multi‑clause structures.";
    }

    return "";
}




/* ============================================================
   CEFR TRAINER — CLEAN APP.JS (PART 1)
   ============================================================ */

function groupByCategory(words) {
    const out = {};
    words.forEach(w => {
        if (!out[w.category]) out[w.category] = [];
        out[w.category].push(w);
    });
    return out;
}
 
    
const STORAGE_KEY = "cefr_trainer_state_v2";

let appState = {
    currentLevel: "A1",
    speechRate: 1.0,
    studentName: "",
    badges: [],
    totalXP: 0,
    globalScore: 0,
    levelStats: {
        A1: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        },
        A2: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        },
        B1: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        },
        B2: { 
            listens: 0, 
            flashSeen: 0, 
            quizScore: 0, 
            quizCompleted: 0, 
            buildCompleted: 0, 
            sentenceCompleted: 0, 
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        }
    }
};


/* ============================================================
   CATEGORY AUTO‑ASSIGNER — PLACE HERE
   ============================================================ */

function autoAssignCategory(word) {
    const w = word.spanish.toLowerCase();

    // Verbs (infinitives)
    if (w.endsWith("ar") || w.endsWith("er") || w.endsWith("ir"))
        return "verbs";

    // Adjectives
    if (w.endsWith("o") || w.endsWith("a") || w.endsWith("os") || w.endsWith("as"))
        return "adjectives";

    // Numbers
    if (!isNaN(parseInt(w)))
        return "numbers";

    // Food & drink
    if (["manzana","pan","agua","carne","café","té","huevo","cerveza","vino","arroz","pollo","pescado","ensalada","verdura","fruta"].includes(w))
        return "food-drink";

    // Travel
    if (["aeropuerto","hotel","taxi","tren","avión","billete","mapa","ciudad","país","viaje","turista"].includes(w))
        return "travel";

    // Daily life
    if (["mañana","tarde","noche","casa","trabajo","escuela","día","semana","mes"].includes(w))
        return "Daily Life";

    // Family
    if (["madre","padre","hermano","hermana","abuelo","abuela","tío","tía","primo","prima","familia"].includes(w))
        return "family";

    // Shopping
    if (["dinero","precio","tienda","comprar","vender","mercado","producto"].includes(w))
        return "shopping";

    // Emergency
    if (["ayuda","policía","hospital","ambulancia","fuego","emergencia"].includes(w))
        return "emergency";

    // Work
    if (["trabajo","oficina","jefe","empleado","empresa","reunión"].includes(w))
        return "work";

    // Places / objects
    if (["casa","escuela","parque","calle","puerta","mesa","silla","coche","habitacion","baño"].includes(w))
        return "places-objects";

    // Connectors
    if (["y","pero","porque","aunque","cuando","si","o","entonces","luego","después","antes"].includes(w))
        return "connectors";

    // Grammar words
    if (["el","la","los","las","un","una","unos","unas","yo","tú","él","ella","nosotros","vosotros","ellos"].includes(w))
        return "grammar";

    return "Daily Life";
}

/* ============================================================
   APPLY CATEGORIES TO ALL CEFR LEVELS — PLACE HERE
   ============================================================ */

Object.keys(CEFR_LEVELS).forEach(level => {
    CEFR_LEVELS[level] = CEFR_LEVELS[level].map(w => ({
        ...w,
        category: w.category || autoAssignCategory(w)
    }));
});

/* ============================================================
   STATE LOAD / SAVE
   ============================================================ */
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) Object.assign(appState, JSON.parse(raw));
    } catch (e) {
        console.error("State load error:", e);
    }
}

function setLearnerName(name) {

    // If this is a different learner, reset everything
    if (appState.learnerName !== name) {
        resetAllProgress();
    }

    appState.learnerName = name;
    saveState();
    renderDashboard();
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
        console.error("State save error:", e);
    }
}

/* ============================================================
   FULL RESET — ALL LEVELS, ALL SCORES, ALL XP
   ============================================================ */

// Ensure this property exists on your global appState object
appState.lastActiveDate = appState.lastActiveDate || null;

/* ============================================================
   CALENDAR DAY STREAK ENGINE
   ============================================================ */

// Safely ensure this property exists on your global state when app initializes
if (typeof appState !== "undefined" && !appState.hasOwnProperty("lastActiveDate")) {
    appState.lastActiveDate = null;
}

function checkAndAdvanceStreak() {
    const todayStr = new Date().toLocaleDateString('en-CA'); // Formats cleanly as YYYY-MM-DD
    const lastActive = appState.lastActiveDate;
    
    // Fallback: Ensure active level stats object has a numeric streak parameter initialized
    if (typeof appState.levelStats[appState.currentLevel].streak !== "number") {
        appState.levelStats[appState.currentLevel].streak = 0;
    }

    // Case 1: First time playing, or progress was just reset
    if (!lastActive) {
        appState.levelStats[appState.currentLevel].streak = 1;
        appState.lastActiveDate = todayStr;
        saveState();
        return;
    }

    // Case 2: Already played today, do nothing to the count
    if (lastActive === todayStr) {
        return;
    }

    // Calculate the difference in calendar days
    const lastDateObj = new Date(lastActive);
    const todayDateObj = new Date(todayStr);
    const timeDiff = todayDateObj.getTime() - lastDateObj.getTime();
    const dayDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
        // Case 3: Played yesterday! Increment the consecutive day count
        appState.levelStats[appState.currentLevel].streak++;
    } else if (dayDiff > 1) {
        // Case 4: Skipped a day or more. Reset streak back to 1
        appState.levelStats[appState.currentLevel].streak = 1;
    }

    // Update the last active date milestone to today
    appState.lastActiveDate = todayStr;
    saveState();
}

/* ============================================================
   FULL RESET — ALL LEVELS, ALL SCORES, ALL XP
   ============================================================ */
function resetAllProgress() {
    Object.keys(appState.levelStats).forEach(level => {
        appState.levelStats[level] = {
            listens: 0,
            flashSeen: 0,
            quizScore: 0,
            quizCompleted: 0, // Zeroes completion fields alongside standard rating stats
            buildCompleted: 0,
            sentenceCompleted: 0,
            conversationCompleted: 0,
            streak: 0,
            reviewDue: 0
        };
    });

    // ⭐ FIXED: Completely zeroes global metrics memory data structures
    appState.totalXP = 0;
    appState.globalScore = 0;
    appState.badges = [];
    appState.currentLevel = "A1";
    appState.lastActiveDate = null; 

    // ⭐ FIXED: Clears your live review list array and local tracking storage
    reviewList = [];
    localStorage.removeItem('reviewList');

    // Save changes to disk memory
    saveState();

    // ⭐ FIXED: Instantly redraws the entire interface so everything clicks down to 0% right away
    updateBadges();
    updateProgressMeters();
    renderReviewList();
    
    // Optional: Take the user back to the clean dashboard overview tab
    activateTab("dashboard");
    
    console.log("🧼 Application data successfully cleared back to baseline!");
}


/* ============================================================
   SABINA VOICE (Spanish TTS for explanations)
   ============================================================ */

function speak(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";        // Sabina Spanish voice
    u.rate = appState.speechRate;
    u.pitch = 1.0;

    window.speechSynthesis.speak(u);
}

/* ============================================================
   SPEECH SYNTHESIS — Spanish word pronunciation
   ============================================================ */
function speakSpanish(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = appState.speechRate;

    window.speechSynthesis.speak(u);
}


/* ============================================================
   QUIZ AUDIO — Sabina (correct + incorrect)
   ============================================================ */
function speakQuiz(correctAnswer) {
    const message = `La respuesta correcta es: ${correctAnswer}`;
    speak(message); // Sabina voice
}

/* ============================================================
   LEVEL SELECTOR
   ============================================================ */
function setLevel(level) {
    if (!CEFR_LEVELS[level]) return;

    appState.currentLevel = level;
    saveState();

    document.querySelectorAll(".level-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.level === level);
    });

    activateTab(currentTab);
}

/* ============================================================
   TAB SYSTEM — FINAL CLEAN VERSION
   ============================================================ */

const TABS = [
    "dashboard",
    "listen",
    "flash",
    "quiz",
    "build",
    "sentence",
    "conversation",
    "grammar",
    "mining",
    "review" // ⭐ ADDED: Tells the routing loop your review panel exists
];

let currentTab = "dashboard";

/* ============================================================
   ACTIVATE TAB
   ============================================================ */
function activateTab(tabName) {
    if (!TABS.includes(tabName)) return;
    currentTab = tabName;

    // Hide all tabs
    TABS.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) panel.classList.add("hidden");
    });

    // Show active tab
    const activePanel = document.getElementById(tabName);
    if (activePanel) activePanel.classList.remove("hidden");

    // Update nav button highlight
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    // Load dynamic content
    switch (tabName) {
        case "listen":
            renderListenTab();
            break;

        case "flash":
            renderFlashcardsTab();
            break;

        case "quiz":
            renderQuizTab();
            break;

        case "build":
            renderBuildTab();
            break;

        case "sentence":
            renderSentenceTab();
            break;

        case "conversation":
            renderConversationTab();
            break;

        case "grammar":
            renderGrammarTab();
            break;

         // ⭐ INTEGRATION: Populates mining references whenever this tab is opened
        case "mining":
            renderMiningReferencesTab();
            break;
          
        // ⭐ INTEGRATION: Populates your mistake cards list whenever this tab is opened
        case "review":
            renderReviewList();
            break;

        case "dashboard":
            // static
            break;
    }
}


/* ============================================================
   TAB NAVIGATION WIRING
   ============================================================ */
function initTabNavigation() {
    const buttons = document.querySelectorAll(".tab-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            activateTab(tab);
        });
    });
}

// Initialize navigation + default tab
initTabNavigation();
activateTab("dashboard");

function initDashboardResetButtons() {
    const resetAllBtn = document.getElementById("resetAllLevelsBtn");

    if (resetAllBtn) {
        resetAllBtn.addEventListener("click", () => {

            if (!confirm("Reset ALL levels and scores? This cannot be undone.")) return;

            resetAllProgress();
            saveState();
            updateProgressMeters();
            updateBadges();
            renderDashboard();

            alert("All levels reset. You are back to A1!");
        });
    }
}

/* ============================================================
   LISTEN TAB — CATEGORY + AUDIO PLAYER + CLEAN UI
   ============================================================ */

let listenAutoPlay = {
    active: false,
    paused: false,
    index: 0,
    list: []
};

function renderListenTab() {
    const container = document.getElementById("listen-content");
    if (!container) return;

    // Pull the correct CEFR level vocabulary (already categorized)
    const levelData = LISTEN_VOCAB[appState.currentLevel];

    let html = `
        <div class="glass-panel quiz-card">
            <h2>Listen — Level ${appState.currentLevel}</h2>
            <p>Tap a category, then click a word pill to hear it.</p>

            <div class="listen-player-controls" style="
                display:flex;
                gap:6px;
                flex-wrap:wrap;
                margin-top:6px;
                justify-content:flex-start;
            ">
                <button class="pill" id="listen-playall">Play All</button>
                <button class="pill" id="listen-pause">Pause</button>
                <button class="pill" id="listen-resume">Resume</button>
                <button class="pill" id="listen-stop">Stop</button>
            </div>
        </div>
    `;

    /* ============================================================
       CATEGORY LIST (already grouped in LISTEN_VOCAB)
       ============================================================ */
    Object.keys(levelData).forEach(categoryName => {
        const words = levelData[categoryName];

       html += `
<div class="glass-panel">
    <div class="listen-category-header" data-cat="${categoryName}">
       <span class="listen-category-title">${categoryName}</span>
       <span class="listen-arrow">▶</span>
    </div>


            <div class="listen-category-content" data-cat="${categoryName}">
                <div class="listen-grid" style="
                    display:grid;
                    grid-template-columns:repeat(auto-fill, minmax(120px, 1fr));
                    gap:6px;
                    margin-top:8px;
                ">
                    ${words.map(spanish => {
                         const entry = CEFR_LEVELS[appState.currentLevel].find(w => w.spanish === spanish);
                         const english = entry ? entry.english : "";
                         return `
                           <button class="pill listen-pill" data-spanish="${spanish}">
                             <div class="listen-pill-en">${english}</div>
                             <div class="listen-pill-es">${spanish}</div>
                           </button>
                       `;
                   }).join("")}

                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    /* ============================================================
       CATEGORY COLLAPSE
       ============================================================ */
    container.querySelectorAll(".listen-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(
                `.listen-category-content[data-cat="${cat}"]`
            );
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    /* ============================================================
       SINGLE WORD PLAYBACK
       ============================================================ */
    container.querySelectorAll(".pill[data-spanish]").forEach(btn => {
        btn.addEventListener("click", () => {
            speakSpanish(btn.dataset.spanish);
            appState.levelStats[appState.currentLevel].listens++;
            saveState();
            updateBadges();
            updateProgressMeters();
        });
    });

    /* ============================================================
       AUTO PLAY — PLAY ALL WORDS
       ============================================================ */

    // Flatten all categories into one list
    listenAutoPlay.list = Object.values(levelData).flat();

    document.getElementById("listen-playall").onclick = () => {
        listenAutoPlay.active = true;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        playNextListenWord();
    };

    document.getElementById("listen-pause").onclick = () => {
        listenAutoPlay.paused = true;
        if (speechSynthesis.pause) speechSynthesis.pause();
    };

    document.getElementById("listen-resume").onclick = () => {
        listenAutoPlay.paused = false;
        if (speechSynthesis.resume) speechSynthesis.resume();
        playNextListenWord();
    };

    document.getElementById("listen-stop").onclick = () => {
        listenAutoPlay.active = false;
        listenAutoPlay.paused = false;
        listenAutoPlay.index = 0;
        if (speechSynthesis.cancel) speechSynthesis.cancel();
    };
}


/* ============================================================
   AUTO PLAY ENGINE
   ============================================================ */
function playNextListenWord() {
    if (!listenAutoPlay.active || listenAutoPlay.paused) return;

    const list = listenAutoPlay.list;
    if (listenAutoPlay.index >= list.length) {
        listenAutoPlay.active = false;
        return;
    }

    const word = list[listenAutoPlay.index];
    const utter = new SpeechSynthesisUtterance(word);
    utter.lang = "es-ES";
    utter.rate = appState.speechRate;

    utter.onend = () => {
        if (!listenAutoPlay.paused) {
            listenAutoPlay.index++;
            setTimeout(playNextListenWord, 50);
        }
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
}

/* ============================================================
   FLASHCARDS — CATEGORY GROUPED + FLIP + AUDIO (STABLE VERSION)
   ============================================================ */

function renderFlashcardsTab() {
    const container = document.getElementById("flash-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    /* ------------------------------------------------------------
       NORMALIZE CATEGORY KEYS (MERGES DUPLICATES)
       ------------------------------------------------------------ */
    const normalized = {};

    Object.keys(grouped).forEach(cat => {
        const cleanKey = cat.trim().toLowerCase();   // canonical key

        if (!normalized[cleanKey]) normalized[cleanKey] = {
            display: cat.trim(),   // preserve original display name
            items: []
        };

        normalized[cleanKey].items = normalized[cleanKey].items.concat(grouped[cat]);
    });

    /* ------------------------------------------------------------
       HEADER
       ------------------------------------------------------------ */
    let html = `
        <div class="glass-panel">
            <h2>Flashcards — Level ${appState.currentLevel}</h2>
            <p>Translate the word then tap the card to flip it over and see if your correct. Spanish side plays audio.</p>
        </div>
    `;

    /* ------------------------------------------------------------
       RENDER MERGED CATEGORIES
       ------------------------------------------------------------ */
    Object.keys(normalized).forEach(cleanKey => {
        const catDisplay = normalized[cleanKey].display.toUpperCase();
        const items = normalized[cleanKey].items;

        html += `
        <div class="glass-panel">
            <div class="flash-category-header" data-cat="${cleanKey}">
                <span class="listen-category-title">${catDisplay}</span>
                <span class="listen-arrow">▶</span>
            </div>

            <div class="flash-category-content" data-cat="${cleanKey}">
                <div class="fc-grid">
                    ${items.map(item => `
                        <div class="fc-card">
                            <div class="fc-inner">
                                <div class="fc-front pill">${item.english}</div>
                                <div class="fc-back pill">${item.spanish}</div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;

    /* ------------------------------------------------------------
       CATEGORY COLLAPSE
       ------------------------------------------------------------ */
    container.querySelectorAll(".flash-category-header").forEach(header => {
        header.addEventListener("click", () => {
            const cat = header.dataset.cat;
            const content = container.querySelector(`.flash-category-content[data-cat="${cat}"]`);
            const arrow = header.querySelector(".listen-arrow");
            const open = content.classList.toggle("open");
            arrow.classList.toggle("open", open);
        });
    });

    /* ------------------------------------------------------------
       FLASHCARD FLIP + AUDIO
       ------------------------------------------------------------ */
    container.querySelectorAll(".fc-card").forEach(card => {
        card.addEventListener("click", () => {
            const inner = card.querySelector(".fc-inner");
            const flipped = inner.classList.toggle("fc-flipped");
            const spanish = inner.querySelector(".fc-back").textContent.trim();

            if (flipped) {
                speakSpanish(spanish);
                appState.levelStats[appState.currentLevel].flashSeen++;
                saveState();
                updateBadges();
                updateProgressMeters();
            } else {
                speechSynthesis.cancel();
            }
        });
    });
}



/* ============================================================
   SHARED QUIZ / BUILD / SENTENCE / CONVERSATION STATE
   ============================================================ */

let quizState = {
    currentWord: null,
    options: [],
    harderMode: false,
    selected: null
};

let buildState = {
    currentWord: null,
    tokens: []
};

let sentenceState = {
    currentSentence: null,
    tokens: []
};

let convoState = {
    currentPrompt: null,
    tokens: []
};

function generateQuizOptions(words, correctWord) {
    let opts = [correctWord.spanish];
    const count = quizState.harderMode ? 5 : 3;

    while (opts.length < count) {
        const w = words[Math.floor(Math.random() * words.length)];
        if (!opts.includes(w.spanish)) opts.push(w.spanish);
    }

    return opts.sort(() => Math.random() - 0.5);
}

/* ============================================================
   QUIZ TAB — RENDER + EVENTS
   ============================================================ */

function renderQuizTab() {
    const container = document.getElementById("quiz-content");
    const words = CEFR_LEVELS[appState.currentLevel];

    if (!words || !words.length) {
        container.innerHTML = `<div class="glass-panel quiz-card">
            <p>No words found for level ${appState.currentLevel}.</p>
        </div>`;
        return;
    }

    quizState.currentWord = words[Math.floor(Math.random() * words.length)];
    quizState.options = generateQuizOptions(words, quizState.currentWord);
    quizState.selected = null;

    container.innerHTML = `
    <div class="glass-panel quiz-card">
        <h2>Quiz — Level ${appState.currentLevel}</h2>
        <p>Select the correct Spanish for the English word.</p>

        <div id="qb-meta"><strong>English:</strong> ${quizState.currentWord.english}</div>

        <div id="qb-grid" class="sb-grid">
            ${quizState.options.map(opt => `
                <button class="pill" data-spanish="${opt}">${opt}</button>
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

    quizState.selected = null;

    // Pill selection
    grid.querySelectorAll(".pill").forEach(btn => {
        btn.addEventListener("click", () => {
            grid.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            quizState.selected = btn.dataset.spanish;
            answerBox.textContent = quizState.selected;
        });
    });

    // Helper: translate Spanish → English
    function getEnglishForSpanish(spanishWord) {
        const levelWords = CEFR_LEVELS[appState.currentLevel];
        const match = levelWords.find(w => w.spanish === spanishWord);
        return match ? match.english : "[no match]";
    }

    // Check button
    submitBtn.addEventListener("click", () => {
        if (!quizState.selected) {
            feedback.textContent = "Choose an answer first.";
            return;
        }

        const correct = quizState.currentWord.spanish;
        const learnerSpanish = quizState.selected;
        const learnerEnglish = getEnglishForSpanish(learnerSpanish);

        // Ensure quizScore is not null before incrementing
        if (appState.levelStats[appState.currentLevel].quizScore === null) {
            appState.levelStats[appState.currentLevel].quizScore = 0;
        }

        // Correct / Incorrect feedback + NEW "You selected:"
        if (learnerSpanish === correct) {
            feedback.innerHTML = `
                <div class="quiz-correct">Correct! 🎉</div>
                <div class="quiz-selected"><strong>You selected:</strong> ${learnerSpanish} (${learnerEnglish})</div>
            `;

            appState.levelStats[appState.currentLevel].quizScore++;
            appState.levelStats[appState.currentLevel].quizCompleted++;

            // Increments global state stats when answers match perfectly
            appState.totalXP = (appState.totalXP || 0) + 10; 
            appState.globalScore = (appState.globalScore || 0) + 5;
            
            // ⭐ UPDATED: Invokes calendar comparison check engine for daily streak increments
            checkAndAdvanceStreak();

            updateBadges();
            updateProgressMeters();

        } else {
            feedback.innerHTML = `
                <div class="quiz-incorrect">Incorrect — correct answer: ${correct}</div>
                <div class="quiz-selected"><strong>You selected:</strong> ${learnerSpanish} (${learnerEnglish})</div>
            `;

            // INTEGRATION: Formats the phrase "English ➔ Spanish" and adds it to your review tracking list
            const mistakeString = `${quizState.currentWord.english} ➔ ${correct}`;
            addIncorrectWord(mistakeString);
        }

        // Sabina audio
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

/* ============================================================
   KEYBOARD NORMALIZATION UTILITY (MULTI-WORD VERSION)
   ============================================================ */
function cleanStringForKeyboard(text) {
    if (!text) return "";
    return text
        .trim()
        .toLowerCase()
        // 1. Convert explicit character variants first to protect all browser engines
        .replace(/ñ/g, "n")
        .replace(/ü/g, "u")
        // 2. Splits remaining accented characters into base letters + standalone accents
        .normalize("NFD")
        // 3. Erases all those standalone accent marks cleanly
        .replace(/[\u0300-\u036f]/g, "")
        // 4. Erases Spanish punctuation marks like ¿ and ¡
        .replace(/[¿¡!?.–—,;:]/g, "")
        // ⭐ FIXED: Keeps spaces normal so multi-word queries remain split words
        .replace(/\s+/g, " ");
}



/* ============================================================
   BUILD TAB — English → Spanish Builder (with disruptors + feedback)
   ============================================================ */
function renderBuildTab() {
    const container = document.getElementById("build-content");

    const pool = CEFR_SENTENCES[appState.currentLevel];
    const sentence = pool[Math.floor(Math.random() * pool.length)];

    const english = sentence.english;
    const spanish = sentence.spanish;

    const coreTokens = spanish.split(" ");

    const disruptors = [
        "rápido","lento","siempre","nunca","ayer","mañana",
        "porque","pero","muy","también","solo","entonces"
    ];

    let bank = [...coreTokens];

    while (bank.length < coreTokens.length + 5) {
        const d = disruptors[Math.floor(Math.random() * disruptors.length)];
        if (!bank.includes(d)) bank.push(d);
    }

    bank = bank.sort(() => Math.random() - 0.5);

    buildState.tokens = bank;
    buildState.answer = [];

    container.innerHTML = `
        <div class="glass-panel build-card">
            <h2>Duplicate this sentence in Spanish</h2>
            <p class="build-english"><strong>English:</strong> ${english}</p>

            <div id="build-selected" class="build-selected"></div>

            <div id="build-words" class="sb-grid">
                ${bank.map(w => `<button class="pill build-opt" data-token="${w}">${w}</button>`).join("")}
            </div>

            <input id="build-input" class="input-field" placeholder="Or type the Spanish sentence…">

            <div id="build-feedback"></div>

            <div class="sb-controls">
                <button id="build-undo">Undo</button>
                <button id="build-reset">Reset</button>
                <button id="build-check">Check</button>
                <button id="build-next">Next</button>
            </div>
        </div>
    `;

    setupBuildEvents(sentence);
}

function setupBuildEvents(sentence) {
    const selectedArea = document.getElementById("build-selected");
    const grid = document.getElementById("build-words");
    const input = document.getElementById("build-input");
    const feedback = document.getElementById("build-feedback");

    const undoBtn = document.getElementById("build-undo");
    const resetBtn = document.getElementById("build-reset");
    const checkBtn = document.getElementById("build-check");
    const nextBtn = document.getElementById("build-next");

    buildState.answer = [];

    grid.querySelectorAll(".build-opt").forEach(btn => {
        btn.addEventListener("click", () => {
            buildState.answer.push(btn.dataset.token);
            btn.classList.add("used");
            btn.disabled = true;
            selectedArea.textContent = buildState.answer.join(" ");
        });
    });

    input.addEventListener("input", () => {
        buildState.answer = input.value.trim().split(" ");
        selectedArea.textContent = buildState.answer.join(" ");
    });

    undoBtn.addEventListener("click", () => {
        buildState.answer.pop();
        selectedArea.textContent = buildState.answer.join(" ");

        grid.querySelectorAll(".build-opt").forEach(btn => {
            if (!buildState.answer.includes(btn.dataset.token)) {
                btn.classList.remove("used");
                btn.disabled = false;
            }
        });
    });

    resetBtn.addEventListener("click", () => {
        buildState.answer = [];
        selectedArea.textContent = "";
        input.value = "";
        grid.querySelectorAll(".build-opt").forEach(btn => {
            btn.classList.remove("used");
            btn.disabled = false;
        });
    });

       checkBtn.addEventListener("click", () => {
        const correct = sentence.spanish.trim();
        const user = buildState.answer.join(" ").trim();

        // Translate learner answer to English
        const learnerEnglish = translateToEnglish(user);

        // ⭐ INTEGRATION: Normalize both strings to bypass accent/punctuation keyboard mismatches
        const cleanCorrect = cleanStringForKeyboard(correct);
        const cleanUser = cleanStringForKeyboard(user);

        // Check against the cleaned, keyboard-forgiving values
        if (cleanUser === cleanCorrect) {
            feedback.innerHTML = `
                <span style="color:#4ade80;font-weight:600;">Correct! 🎉</span><br><br>
                <strong>Your Translated Response is:</strong><br>${learnerEnglish}
            `;
            appState.levelStats[appState.currentLevel].buildCompleted++;

            appState.totalXP = (appState.totalXP || 0) + 20; 
            appState.globalScore = (appState.globalScore || 0) + 15;

            checkAndAdvanceStreak();

            updateBadges();
            updateProgressMeters();
            setTimeout(() => speakQuiz(correct), 50);
        } else {
            const correctTokens = correct.split(" ");
            const userTokens = buildState.answer;

            let html = `<strong>The correct answer is:</strong><br>${correct}<br><br>`;
            html += `<strong>Your Answer:</strong><br>${user}<br><br>`;
            html += `<strong>Your Translated Response is:</strong><br>${learnerEnglish}<br><br>`;
            html += `<strong>Word-by-word feedback:</strong><br>`;

            userTokens.forEach((t, i) => {
                // Fuzzy check each single token for individual word correctness indicators
                if (cleanStringForKeyboard(correctTokens[i]) === cleanStringForKeyboard(t)) {
                    html += `<span style="color:#4ade80;">${t} ✔</span> `;
                } else {
                    html += `<span style="color:#f87171;">${t} ✖</span> `;
                }
            });

            feedback.innerHTML = html;
            setTimeout(() => speakQuiz(correct), 50);

            const mistakeSentenceString = `${sentence.english} ➔ ${correct}`;
            addIncorrectWord(mistakeSentenceString);
        }

        saveState();
    });

    nextBtn.addEventListener("click", () => {
        renderBuildTab();
    });
}

/* ============================================================
   SENTENCE TAB — CEFR MULTIPLE‑CHOICE (FINAL MASTER VERSION)
   ============================================================ */

function generateSentenceForLevel(level) {
    const pool = CEFR_SENTENCE_CHOICES[level];
    const item = pool[Math.floor(Math.random() * pool.length)];

    const shuffled = [...item.options]
    .filter(Boolean)
    .sort(() => Math.random() - 0.5);

    return {
        english: item.english,
        correct: item.correct,
        options: shuffled
    };
}

function renderSentenceTab() {
    const container = document.getElementById("sentence-content");
    const level = appState.currentLevel;

    // SAFETY CHECK — prevents crashes if level has no sentences
    if (!CEFR_SENTENCE_CHOICES[level]) {
        container.innerHTML = "<p>No sentences available for this level.</p>";
        return;
    }

    const q = generateSentenceForLevel(level);

    container.innerHTML = `
        <div class="glass-panel sentence-card">
            <h2>Sentence — Level ${level}</h2>
            <p>Select the correct Spanish translation.</p>

            <div class="sentence-english">
                <strong>English:</strong> ${q.english}
            </div>

            <div id="sentence-options" class="sentence-options">
                ${q.options.map(opt => `
                    <button class="pill" data-opt="${opt.es}">
                        ${opt.es}
                    </button>
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
    // FIX: only select answer pills, not the Next button
    const buttons = document.querySelectorAll("#sentence-options .pill");
    const feedback = document.getElementById("sentence-feedback");
    const nextBtn = document.getElementById("sentence-next");

    // Translate Spanish → English using the current sentence item
    function getEnglishForSpanish(spanishWord) {
        const match = q.options.find(opt => opt.es === spanishWord);
        return match ? match.en : "[no match]";
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const chosen = btn.dataset.opt;
            const chosenEnglish = getEnglishForSpanish(chosen);

            if (chosen === q.correct.es) {
                feedback.innerHTML = `
                    <span style="color:#4ade80;font-weight:600;">
                        Correct! 🎉
                    </span><br>
                    <div class="sentence-selected">
                        <strong>You selected:</strong> ${chosen} (${chosenEnglish})
                    </div>
                `;

                appState.levelStats[appState.currentLevel].sentenceCompleted++;

                // Increments global progress metrics on success
                appState.totalXP = (appState.totalXP || 0) + 15; 
                appState.globalScore = (appState.globalScore || 0) + 10;
                
                // ⭐ UPDATED: Invokes calendar comparison check engine for daily streak increments
                checkAndAdvanceStreak();

                updateBadges();
                updateProgressMeters();
                speakQuiz(q.correct.es);

            } else {
                feedback.innerHTML = `
                    <span style="color:#f87171;font-weight:600;">
                        Incorrect.
                    </span><br>
                    Correct answer: <strong>${q.correct.es}</strong><br>
                    <div class="sentence-selected">
                        <strong>You selected:</strong> ${chosen} (${chosenEnglish})
                    </div>
                `;

                // INTEGRATION: Formats sentence mistake path and updates tracking engine
                const mistakeSentenceString = `${q.english} ➔ ${q.correct.es}`;
                addIncorrectWord(mistakeSentenceString);

                speakQuiz(q.correct.es);
            }

            // Disable only answer buttons
            buttons.forEach(b => b.disabled = true);
            saveState();
        });
    });

    nextBtn.addEventListener("click", () => {
        renderSentenceTab();
    });
}




/* ============================================================
   REDUCED DISRUPTOR SET — 5 PER LEVEL (FIXED DOUBLE-NESTING)
   ============================================================ */
function getDisruptorResponses(level) {
    const disruptors = DISRUPTOR_WORDS[level] || [];
    return disruptors.slice(0, 3).map(d => {
        if (d && typeof d === 'object' && d.es) {
            return { es: d.es, en: d.en || "Incorrect response" };
        }
        return { es: String(d), en: "Incorrect response" };
    });
}


const DISRUPTOR_WORDS = {
    A1: DISRUPTORS_A1,
    A2: DISRUPTORS_A2,
    B1: DISRUPTORS_B1,
    B2: DISRUPTORS_B2
};


/* ============================================================
   GLOBAL ALL-BANKS DICTIONARY & CONVERSATIONAL PHRASE SEARCH
   ============================================================ */

function globalLookup(word) {
    const w = word.toLowerCase();
    const levelsList = ["A1", "A2", "B1", "B2"];

    for (const level of levelsList) {
        const vocab = CEFR_LEVELS[level];
        if (!vocab) continue;

        const match = vocab.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (match) {
            return { spanish: match.spanish, source: "CEFR Vocabulary", level };
        }
    }

    for (const level of levelsList) {
        const bank = CEFR_SENTENCES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (match) {
            return { spanish: match.spanish, source: "CEFR Sentences", level };
        }
    }

    for (const level of levelsList) {
        const bank = CEFR_SENTENCE_CHOICES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (match) {
            return { spanish: match.correct.es, source: "Dialogue Choices", level };
        }
    }

    if (typeof CEFR_PHRASES !== "undefined") {
        const phraseMatch = CEFR_PHRASES.find(p =>
            p.english && p.english.toLowerCase() === w
        );
        if (phraseMatch) {
            return { spanish: phraseMatch.spanish, source: "CEFR Phrases", level: phraseMatch.level || "GLOBAL" };
        }
    }

    if (typeof LISTEN_VOCAB !== "undefined") {
        const lvMatch = LISTEN_VOCAB.find(item =>
            item.english && item.english.toLowerCase() === w
        );
        if (lvMatch) {
            return { spanish: lvMatch.spanish, source: "Listen Vocab", level: lvMatch.level || "GLOBAL" };
        }
    }

    if (typeof WORD_DICT !== "undefined" && WORD_DICT[w]) {
        return { spanish: WORD_DICT[w], source: "Word Dictionary", level: "GLOBAL" };
    }

    if (typeof CEFR_CONVERSATION_PROMPTS !== "undefined") {
        for (const levelKey of Object.keys(CEFR_CONVERSATION_PROMPTS)) {
            const prompts = CEFR_CONVERSATION_PROMPTS[levelKey];
            const convoMatch = prompts.find(p =>
                p.english && p.english.toLowerCase() === w
            );
            if (convoMatch) {
                return {
                    spanish: convoMatch.spanish,
                    source: "Conversation Prompt",
                    level: convoMatch.level || levelKey
                };
            }
        }
    }

    const convoAudioBanks = [
        CEFR_CONVERSATION_AUDIO_A1,
        CEFR_CONVERSATION_AUDIO_A2,
        CEFR_CONVERSATION_AUDIO_B1,
        CEFR_CONVERSATION_AUDIO_B2
    ];

    for (const bank of convoAudioBanks) {
        if (!bank) continue;
        const audioMatch = bank.find(a =>
            a.english && a.english.toLowerCase() === w
        );
        if (audioMatch) {
            return {
                spanish: audioMatch.spanish,
                source: "Conversation Audio",
                level: audioMatch.level || "GLOBAL"
            };
        }
    }

    return null;
}

function globalLookupSpanish(spanishText) {
    const s = cleanStringForKeyboard(spanishText.toLowerCase().trim());
    const banks = [];

    if (CEFR_LEVELS?.A1) banks.push(...CEFR_LEVELS.A1);
    if (CEFR_LEVELS?.A2) banks.push(...CEFR_LEVELS.A2);
    if (CEFR_LEVELS?.B1) banks.push(...CEFR_LEVELS.B1);
    if (CEFR_LEVELS?.B2) banks.push(...CEFR_LEVELS.B2);

    if (Array.isArray(CEFR_PHRASES)) banks.push(...CEFR_PHRASES);
    if (Array.isArray(LISTEN_VOCAB)) banks.push(...LISTEN_VOCAB);

    if (Array.isArray(CEFR_CONVERSATION_AUDIO_A1)) banks.push(...CEFR_CONVERSATION_AUDIO_A1);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_A2)) banks.push(...CEFR_CONVERSATION_AUDIO_A2);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_B1)) banks.push(...CEFR_CONVERSATION_AUDIO_B1);
    if (Array.isArray(CEFR_CONVERSATION_AUDIO_B2)) banks.push(...CEFR_CONVERSATION_AUDIO_B2);

    // 1. Gather all standard expected responses
    Object.values(CEFR_CONVERSATION_PROMPTS || {}).forEach(levelArray => {
        if (Array.isArray(levelArray)) {
            levelArray.forEach(prompt => {
                if (Array.isArray(prompt.expected_responses)) {
                    banks.push(...prompt.expected_responses);
                }
            });
        }
    });

    // 2. FIXED: Inject disruptor bank entries so incorrect pill selections resolve their English translation values cleanly
    const levelsList = ["A1", "A2", "B1", "B2"];
    levelsList.forEach(level => {
        if (typeof getDisruptorResponses === 'function') {
            const levelDisruptors = getDisruptorResponses(level);
            if (Array.isArray(levelDisruptors)) {
                banks.push(...levelDisruptors);
            }
        }
    });

    for (const item of banks) {
        if (!item) continue;
        const spanishString = typeof item === 'object' ? item.es || item.spanish : item;
        if (!spanishString) continue;

        if (cleanStringForKeyboard(spanishString.toLowerCase()) === s) {
            return item.en || item.english || "[Unknown translation]";
        }
    }
    return "[Unknown translation]";
}


/**
 * Universal Text Extractor Helper
 * Safely removes multi-nested tracking array patterns to clear all pill errors.
 */
function extractSpanishText(item) {
    if (!item) return "";
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
        if (item.es && typeof item.es === 'object') return extractSpanishText(item.es);
        if (item.spanish && typeof item.spanish === 'object') return extractSpanishText(item.spanish);
        
        if (item.es) return item.es;
        if (item.spanish) return item.spanish;
        if (item.text) return item.text;
        
        const properties = Object.values(item);
        for (const value of properties) {
            if (typeof value === 'string' && !value.includes('[object')) return value;
            if (typeof value === 'object' && value !== null) {
                const nestedString = extractSpanishText(value);
                if (nestedString) return nestedString;
            }
        }
    }
    return String(item);
}


/* ============================================================
   CONVERSATION TAB — MAIN RENDER PIPELINE (PART 2A)
   ============================================================ */

function shuffle(array) {
    return array
        .map(x => ({ x, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(o => o.x);
}

function generateConversationPrompt(level) {
    const pool = CEFR_CONVERSATION_PROMPTS[level];
    const item = pool[Math.floor(Math.random() * pool.length)];

    return {
        prompt_es: item.prompt_es,
        prompt_en: item.prompt_en,
        expected: item.expected_responses
    };
}

function renderConversationTab() {
    const container = document.getElementById("conversation-content");
    const level = appState.currentLevel;

    if (!CEFR_CONVERSATION_PROMPTS[level]) {
        container.innerHTML = "<p>No conversation prompts available for this level.</p>";
        return;
    }

    // Isolate conversation variables cleanly inside state
    convoState.currentPrompt = generateConversationPrompt(level);

    const correctButtons = (convoState.currentPrompt.expected || []).map(exp => {
        const text = extractSpanishText(exp);
        return {
            html: `<button class="pill preset-response correct" data-response="${text}">${text}</button>`
        };
    });

    const rawDisruptors = typeof getDisruptorResponses === 'function' ? getDisruptorResponses(level) : [];
    const disruptorButtons = (Array.isArray(rawDisruptors) ? rawDisruptors : []).map(exp => {
        const text = extractSpanishText(exp);
        return {
            html: `<button class="pill preset-response disruptor" data-response="${text}">${text}</button>`
        };
    });

    const allButtons = shuffle([...correctButtons, ...disruptorButtons]);
    const presetButtons = allButtons.map(b => b && b.html ? b.html : "").join("");

    container.innerHTML = `
        <div class="glass-panel convo-card">
            <h2>Conversation — Level ${level}</h2>
            <p>Respond naturally using Spanish.</p>

            <div class="convo-prompt">
                <strong>Spanish:</strong> ${convoState.currentPrompt.prompt_es}<br>
                <strong>English:</strong> ${convoState.currentPrompt.prompt_en}
            </div>

            <div class="preset-box">
                ${presetButtons}
            </div>

            <textarea id="convo-input" class="convo-input" placeholder="Type your response here..."></textarea>
            
            <div class="sb-controls quiz-controls-tight" style="margin-top:15px; display:flex; gap:8px;">
                <button id="convo-submit" class="pill" style="padding:10px 20px;">Check</button>
                <button id="convo-next" class="pill" style="padding:10px 20px;">Next</button>
                <button id="convo-reset" class="pill" style="padding:10px 20px;">Reset</button>
            </div>

            <div id="convo-feedback" class="convo-feedback-box"></div>
        </div>
    `;

    setupConversationEvents(convoState.currentPrompt);
}

/* ============================================================
   CONVERSATION EVENTS — SAFETY INSULATED GRADING ENGINE (PART 2B - A)
   ============================================================ */
function setupConversationEvents(convo) {
    const submitBtn = document.getElementById("convo-submit");
    const nextBtn = document.getElementById("convo-next");
    const resetBtn = document.getElementById("convo-reset");
    const feedback = document.getElementById("convo-feedback");
    const textarea = document.getElementById("convo-input");

    if (!submitBtn || !nextBtn || !resetBtn || !feedback || !textarea) {
        console.warn("Required conversation elements are missing from the DOM.");
        return;
    }

    // Bind selection pills
    document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
        btn.onclick = () => {
            if (btn.disabled) return;
            textarea.value = btn.getAttribute("data-response") || btn.dataset.response;
            feedback.innerHTML = ""; 
        };
    });

    // RESET — Reload current prompt
    resetBtn.onclick = () => {
        document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
        });
        reloadSameConversation(convo);
    };

    // SUBMIT — Insulated from all potential data-bank crashes
    submitBtn.onclick = () => {
        const userText = textarea.value.trim();

        if (!userText) {
            feedback.innerHTML = `<span style="color:#f87171; display:block; margin-top:10px;">Please enter or select a response first.</span>`;
            return;
        }

        // Initialize defensive fallbacks
        let finalScore = 0;
        let expectedEs = "No reference text found";
        let expectedEn = "Translation unavailable";
        let learnerEnglishTranslation = "[Unknown translation]";

        /* ------------------------------------------------------------
           CRASH-PROOF EVALUATION ENGINE (TRY-CATCH BUNKER)
           ------------------------------------------------------------ */
        try {
            // Safe extraction of the correct answers object
            let targetSource = convo.expected;
            if (Array.isArray(targetSource) && targetSource.length > 0) {
                targetSource = targetSource[0];
            }

            if (targetSource) {
                expectedEs = typeof targetSource === 'object' ? (targetSource.es || targetSource.spanish || "") : String(targetSource);
                expectedEn = typeof targetSource === 'object' ? (targetSource.en || targetSource.english || "Translation unavailable") : "Translation unavailable";
            }

            // Attempt translation using global lookup
            if (typeof globalLookupSpanish === "function") {
                learnerEnglishTranslation = globalLookupSpanish(userText);
            }

            // Short-circuit: Force 0% immediately if user picked an active disruptor
            let isDisruptor = false;
            if (typeof getDisruptorResponses === 'function') {
                const disruptors = getDisruptorResponses(appState.currentLevel || "A1");
                isDisruptor = disruptors.some(d => {
                    const dText = typeof d === 'object' ? (d.es || d.spanish || "") : String(d);
                    return dText.toLowerCase().trim() === userText.toLowerCase().trim();
                });
            }

            if (isDisruptor) {
                finalScore = 0;
            } else {
                // Safely evaluate score using core engine
                if (typeof scoreConversationResponse === "function") {
                    const correctResponsesOnly = Array.isArray(convo.expected) ? convo.expected : [convo.expected];
                    const result = scoreConversationResponse(userText, correctResponsesOnly);
                    finalScore = result && typeof result.score === "number" ? result.score : 0;
                } else {
                    // EMERGENCY FALLBACK SCORER: If the external engine is broken or missing, evaluate keywords manually
                    const userWords = userText.toLowerCase().split(/\s+/);
                    const matchWords = expectedEs.toLowerCase().split(/\s+/);
                    const matches = userWords.filter(w => matchWords.includes(w)).length;
                    finalScore = matchWords.length > 0 ? Math.round((matches / matchWords.length) * 100) : 0;
                }
            }

        } catch (error) {
            console.error("The evaluation loop caught a crash, deploying emergency fallbacks:", error);
            // Emergency fallback logic on calculation crash to guarantee execution completes
            const userWords = userText.toLowerCase().split(/\s+/);
            const matches = userWords.filter(w => expectedEs.toLowerCase().includes(w)).length;
            finalScore = userWords.length > 0 ? Math.min(Math.round((matches / userWords.length) * 100), 100) : 0;
        }

        /* ------------------------------------------------------------
           RENDER ENGINE — GUARANTEED VISUAL INJECTION
           ------------------------------------------------------------ */
        let verdictHTML = "";
        let borderGradientColor = "rgba(148, 163, 184, 0.2)";
        let matchStatus = "incorrect";
        let baseXP = 0;
        let baseScore = 0;
        let bonusText = "";

        if (finalScore >= 70 && learnerEnglishTranslation !== "[Unknown translation]") {
            matchStatus = "correct";
            borderGradientColor = "rgba(74, 222, 128, 0.4)"; // Green outline
            
            if (finalScore === 100) {
                baseXP = 40; 
                baseScore = 30; 
                bonusText = " — 💎 100% Perfect Match! ⚡";
            } else {
                baseXP = 25;
                baseScore = 20;
            }
            verdictHTML = `<span style="color:#4ade80; font-weight:600; font-size:1.1rem;">Correct! 🎉 (+${baseXP} XP)${bonusText}</span>`;
            
            if (typeof speakSpanish === "function") speakSpanish(userText);
        } else if (finalScore >= 40 && finalScore < 70) {
            matchStatus = "partial";
            borderGradientColor = "rgba(251, 146, 60, 0.5)"; // Orange outline
            baseXP = 10;
            baseScore = 5;
            verdictHTML = `<span style="color:#fb923c; font-weight:600; font-size:1.1rem;">Partial Match! ⚠️ (+10 XP)</span>`;
            
            if (typeof audioContextPlayback === "function") audioContextPlayback("partial");
        } else {
            matchStatus = "incorrect";
            borderGradientColor = "rgba(248, 113, 113, 0.4)"; // Red outline
            verdictHTML = `<span style="color:#f87171; font-weight:600; font-size:1.1rem;">Incorrect. ✖ (0 XP)</span>`;
            
            if (typeof audioContextPlayback === "function") audioContextPlayback("incorrect");
        }

        // Lock options post submission
        document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = "0.6";
        });

        // Safe HTML print command 
        feedback.innerHTML = `
            <div class="convo-result" style="margin-top: 15px; padding: 12px; background: rgba(15, 23, 42, 0.4); border-radius: 12px; border: 1px solid ${borderGradientColor};">
                ${verdictHTML}
                <br><br>
                <strong>Your response:</strong> ${userText}<br>
                <strong>Your Translated Response is:</strong> <span style="color: #a5f3fc;">"${learnerEnglishTranslation}"</span><br><br>
                <strong>Score:</strong> <span style="color: ${matchStatus === 'correct' ? '#4ade80' : (matchStatus === 'partial' ? '#fb923c' : '#f87171')}">${finalScore}%</span><br>
                <strong>Expected Spanish:</strong> ${expectedEs} (${expectedEn})
            </div>
        `;

        // Safe accounting execution forwarding
        if (typeof processConversationRewards === "function") {
            try {
                processConversationRewards(matchStatus, baseXP, baseScore, expectedEs, convo.prompt_es);
            } catch (e) {
                console.error("Error updating scores/badges storage counters:", e);
            }
        }
    };

    nextBtn.onclick = () => renderConversationTab();
}



/* ============================================================
   CONVERSATION RUNTIME — STORAGE MANAGEMENT & SCENE RELOADS (PART 2B - B)
   ============================================================ */

function processConversationRewards(matchStatus, baseXP, baseScore, expectedEs, promptEsRaw) {
    if (!appState.levelStats[appState.currentLevel]) {
        appState.levelStats[appState.currentLevel] = { conversationCompleted: 0 };
    }
    
    appState.levelStats[appState.currentLevel].conversationCompleted++;

    // Process metric awards safely inside application memory blocks
    if (matchStatus === "correct") {
        appState.totalXP = (appState.totalXP || 0) + baseXP;
        appState.globalScore = (appState.globalScore || 0) + baseScore;
        if (typeof checkAndAdvanceStreak === "function") checkAndAdvanceStreak();
    } else if (matchStatus === "partial") {
        appState.totalXP = (appState.totalXP || 0) + baseXP;
        appState.globalScore = (appState.globalScore || 0) + baseScore;
    } else {
        const promptEsClean = promptEsRaw || "Conversation Prompt";
        const mistakeString = `${promptEsClean} ➔ ${expectedEs}`;
        
        // DEDUPLICATION FILTER: Verifies mistake is completely unique before writing to review lists
        const cleanMistakeEntry = mistakeString.trim();
        const alreadyLogged = Array.isArray(window.reviewList) && window.reviewList.some(item => item.trim() === cleanMistakeEntry);
        
        if (!alreadyLogged && typeof addIncorrectWord === "function") {
            addIncorrectWord(cleanMistakeEntry);
        }
    }

    if (typeof updateBadges === "function") updateBadges();
    if (typeof updateProgressMeters === "function") updateProgressMeters();
    saveState();
}

function reloadSameConversation(convo) {
    const presetBox = document.querySelector("#conversation-content .preset-box");
    const inputBox = document.querySelector("#conversation-content #convo-input");
    const feedbackBox = document.querySelector("#conversation-content #convo-feedback");

    if (!presetBox || !inputBox || !feedbackBox) {
        console.warn("Conversation UI elements missing — aborting scene reset.");
        return;
    }

    const correct = convo.expected.map(exp => {
        const text = extractSpanishText(exp);
        return { html: `<button class="pill preset-response correct" data-response="${text}">${text}</button>` };
    });

    const disruptors = getDisruptorResponses(appState.currentLevel).map(exp => {
        const text = extractSpanishText(exp);
        return { html: `<button class="pill preset-response disruptor" data-response="${text}">${text}</button>` };
    });

    const allButtons = shuffle([...correct, ...disruptors]);
    const presetButtons = allButtons.map(b => b && b.html ? b.html : "").join("");

    presetBox.innerHTML = presetButtons;
    inputBox.value = "";
    feedbackBox.innerHTML = "";

    document.querySelectorAll("#conversation-content .preset-response").forEach(btn => {
        btn.onclick = () => {
            if (btn.disabled) return;
            inputBox.value = btn.getAttribute("data-response") || btn.dataset.response;
        };
    });
}

// Low-level synthesizer fallback note generation anchor node
function audioContextPlayback(type) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === "partial") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(330, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.stop(ctx.currentTime + 0.3);
        } else {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(120, ctx.currentTime);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            osc.start();
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.stop(ctx.currentTime + 0.4);
        }
    } catch (e) {
        console.warn("WebAudio player stalled:", e);
    }
}









/* ============================================================
   GRAMMAR TAB
   ============================================================ */

function renderGrammarTab() {
    const container = document.getElementById("grammar-content");
    const words = CEFR_LEVELS[appState.currentLevel];
    const grouped = groupByCategory(words);

    container.innerHTML = `
        <div class="glass-panel quiz-card">
            <h2>Grammar — Level ${appState.currentLevel}</h2>
            <p>Breakdown of word types you're training.</p>
        </div>

        <div class="glass-panel quiz-card">
            <ul>
                ${Object.keys(grouped).map(cat => `
                    <li><strong>${cat}</strong>: ${grouped[cat].length} items</li>
                `).join("")}
            </ul>
            <p style="margin-top:10px;opacity:0.8;">
                Notice how connectors, verbs, adjectives and nouns combine.
            </p>
        </div>
    `;
}

/* ============================================================
   MINING REFERENCES TAB (FIXED AUDIO INTEGRATION)
   ============================================================ */
function renderMiningReferencesTab() {
  const tabContainer = document.getElementById("mining-content");
  if (!tabContainer) return;

  const miningData = typeof MINING_REFERENCES !== 'undefined' ? MINING_REFERENCES : null;
  if (!miningData) {
    tabContainer.innerHTML = `<div class="mining-references-container"><h2>Mining Terminology</h2><p>No mining data found.</p></div>`;
    return;
  }

  const categories = Object.keys(miningData);
  
  if (!window.currentMiningCategory) {
    window.currentMiningCategory = categories[0];
  }

  let htmlContent = `
    <div class="mining-references-container">
      <div class="tab-header-section" style="margin-bottom: 20px;">
        <h2>Mining Terminology / Terminología Minera</h2>
        <p class="section-subtitle" style="color: #94a3b8;">Explore key mining concepts with individual or sequential audio playback.</p>
      </div>
  `;

  // 1. Category Filter Buttons
  htmlContent += `<div class="category-selector-container" style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">`;
  categories.forEach(cat => {
    const isActive = cat === window.currentMiningCategory ? 'active' : '';
    htmlContent += `
      <button class="category-btn ${isActive}" onclick="switchMiningCategory('${cat}')" 
        style="padding: 10px 18px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.2); background: ${isActive === 'active' ? 'var(--accent-color, #3b82f6)' : 'rgba(255,255,255,0.05)'}; color: white; cursor: pointer; font-weight: 600; transition: all 0.2s;">
        ${cat}
      </button>
    `;
  });
  htmlContent += `</div>`;

  // 2. Master Audio Control Bar
  htmlContent += `
    <div class="master-audio-controls" style="display: flex; gap: 10px; margin-bottom: 25px; align-items: center; flex-wrap: wrap; background: rgba(255,255,255,0.03); padding: 12px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <button onclick="playAllMiningAudio()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 6px;">
        ▶ Play All
      </button>
      <button onclick="pauseMiningAudio()" style="background: #f59e0b; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
        ⏸ Pause
      </button>
      <button onclick="resumeMiningAudio()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
        ▶ Resume
      </button>
      <button onclick="stopMiningAudio()" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
        ⏹ Stop
      </button>
    </div>
  `;

  // 3. Term Pills Grid Container (using speakSpanish)
  htmlContent += `<div class="mining-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">`;
  
  const currentTerms = miningData[window.currentMiningCategory] || [];
  currentTerms.forEach((item) => {
    const safeEs = item.spanish.replace(/'/g, "\\'");
    
    htmlContent += `
      <div class="word-pill" style="background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.12); padding: 14px 18px; border-radius: 12px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div class="pill-text-content">
          <div class="term-es" style="font-weight: 700; font-size: 1.05rem; color: #ffffff; margin-bottom: 3px;">${item.spanish}</div>
          <div class="term-en" style="font-size: 0.9rem; color: #94a3b8;">${item.english}</div>
        </div>
        <button class="audio-btn" onclick="speakSpanish('${safeEs}')" title="Listen" style="background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #60a5fa; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s;">
          🔊
        </button>
      </div>
    `;
  });

  htmlContent += `</div></div>`;
  tabContainer.innerHTML = htmlContent;
}

// Category Switcher Helper
window.switchMiningCategory = function(categoryName) {
  window.currentMiningCategory = categoryName;
  renderMiningReferencesTab();
};

// Sequential Audio Engine State & Controls
let miningAudioQueueIndex = 0;
let isMiningAudioPlaying = false;
let miningQueueTimeout = null;

window.playAllMiningAudio = function() {
  const miningData = MINING_REFERENCES[window.currentMiningCategory];
  if (!miningData || miningData.length === 0) return;

  // Reset or start from current index
  if (miningAudioQueueIndex >= miningData.length) {
    miningAudioQueueIndex = 0;
  }
  
  isMiningAudioPlaying = true;
  playNextInMiningQueue();
};

function playNextInMiningQueue() {
  if (!isMiningAudioPlaying) return;
  const miningData = MINING_REFERENCES[window.currentMiningCategory];
  
  if (!miningData || miningAudioQueueIndex >= miningData.length) {
    isMiningAudioPlaying = false;
    miningAudioQueueIndex = 0;
    return;
  }

  const item = miningData[miningAudioQueueIndex];
  miningAudioQueueIndex++;

  speakSpanish(item.spanish);

  miningQueueTimeout = setTimeout(() => {
    if (isMiningAudioPlaying) {
      playNextInMiningQueue();
    }
  }, 2200);
}

window.pauseMiningAudio = function() {
  isMiningAudioPlaying = false;
  if (miningQueueTimeout) {
    clearTimeout(miningQueueTimeout);
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Cleans up current voice output safely
  }
};

window.resumeMiningAudio = function() {
  if (isMiningAudioPlaying) return; // Already playing
  
  const miningData = MINING_REFERENCES[window.currentMiningCategory];
  if (!miningData || miningData.length === 0) return;

  // If we were partway through, step back one index so it plays the paused word immediately
  if (miningAudioQueueIndex > 0) {
    miningAudioQueueIndex = Math.max(0, miningAudioQueueIndex - 1);
  }

  isMiningAudioPlaying = true;
  playNextInMiningQueue();
};

window.stopMiningAudio = function() {
  isMiningAudioPlaying = false;
  miningAudioQueueIndex = 0;
  if (miningQueueTimeout) {
    clearTimeout(miningQueueTimeout);
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/* ============================================================
   BADGES (UPGRADED VISUAL EDITION)
   ============================================================ */
function updateBadges() {
    const list = document.getElementById("badge-list");
    if (!list) return;
    
    const badges = new Set(appState.badges);
    const currentReviewCount = typeof reviewList !== "undefined" ? reviewList.length : 0;

    Object.keys(appState.levelStats).forEach(level => {
        const s = appState.levelStats[level];
        if (s.listens >= 20) badges.add(`${level} Listener`);
        if (s.flashSeen >= 30) badges.add(`${level} Flash Master`);
        if (s.quizScore !== null && s.quizScore >= 80) badges.add(`${level} Quiz Ace`);
        if (s.buildCompleted >= 10) badges.add(`${level} Builder`);

        // CONVERSATION AND SENTENCE UPDATES
        if (s.sentenceCompleted >= 10) badges.add(`${level} Sentence Pro`);
        if (s.conversationCompleted >= 10) badges.add(`${level} Conversationalist`);
        
        // STREAK MILESTONES — Level Specific
        if (s.streak >= 3) badges.add(`${level} 🔥 Consistent Start`);
        if (s.streak >= 7) badges.add(`${level} 👑 Habitual Hero`);
        if (s.streak >= 14) badges.add(`${level} 🔮 Unstoppable Force`);

        // COMBINED TRACKING (5-Day Streak + Clean Review Slate)
        if (s.streak >= 5 && currentReviewCount === 0) {
            badges.add(`${level} 🧹 Clean Slate Savvy`);
        }
    });

    appState.badges = Array.from(badges);
    saveState();

    if (appState.badges.length === 0) {
        list.innerHTML = `<li style="list-style: none; text-align: center; color: rgba(255,255,255,0.4); padding: 10px;">No badges yet. Keep training!</li>`;
        return;
    }

    // Maps text strings into highly visual glass cards
    list.innerHTML = appState.badges.map(badgeText => {
        // Assign dynamic visual anchors (icons) depending on the badge text contents
        let icon = "🎖️"; // Default fallback badge icon
        let desc = "Completed a major training target.";

        if (badgeText.includes("Listener")) { icon = "🎧"; desc = "Listened to over 20 core level items."; }
        else if (badgeText.includes("Flash Master")) { icon = "🎴"; desc = "Reviewed over 30 interactive cards."; }
        else if (badgeText.includes("Quiz Ace")) { icon = "🎯"; desc = "Scored an amazing 80%+ on vocabulary checks."; }
        else if (badgeText.includes("Builder")) { icon = "🧱"; desc = "Successfully constructed 10 full translations."; }
        else if (badgeText.includes("Sentence Pro")) { icon = "📝"; desc = "Passed 10 complex grammatical sentences."; }
        else if (badgeText.includes("Conversationalist")) { icon = "💬"; desc = "Maintained a conversation score above 70%."; }
        else if (badgeText.includes("Consistent Start")) { icon = "🔥"; desc = "Logged in and completed lessons 3 days in a row!"; }
        else if (badgeText.includes("Habitual Hero")) { icon = "👑"; desc = "Built an incredible 7-day learning routine!"; }
        else if (badgeText.includes("Unstoppable Force")) { icon = "🔮"; desc = "Two whole weeks of language study consistency!"; }
        else if (badgeText.includes("Clean Slate Savvy")) { icon = "🧹"; desc = "Kept a 5-day streak alive with zero review errors."; }

        // Clean out any extra emojis present inside raw text titles
        const cleanTitle = badgeText.replace(/[🔥👑🔮🧹]/g, '').trim();

        // Returns an elegant HTML card template reusing your dashboard theme variables
        return `
            <li class="review-card" style="display: flex; align-items: center; gap: 16px; margin: 10px 0; list-style: none;">
                <div style="font-size: 2rem; min-width: 45px; text-align: center; filter: drop-shadow(0 0 8px rgba(0,255,255,0.4));">
                    ${icon}
                </div>
                <div>
                    <strong class="review-word-text" style="font-size: 15px;">${cleanTitle}</strong>
                    <div style="font-size: 12px; color: #a5f3fc; margin-top: 2px; opacity: 0.85;">${desc}</div>
                </div>
            </li>
        `;
    }).join("");
}



/* ============================================================
   STUDENT NAME BOX
   ============================================================ */

function initNameBox() {
    const input = document.getElementById("student-name");
    const btn = document.getElementById("save-name-btn");
    const status = document.getElementById("name-status");

    if (!input || !btn || !status) return;

    input.value = appState.studentName || "";

    btn.onclick = () => {
        const name = input.value.trim();
        if (!name) {
            status.textContent = "Please enter a name.";
            return;
        }
        appState.studentName = name;
        saveState();
        status.textContent = `Saved as "${name}".`;
    };
}

/* ============================================================
   SPEECH RATE CONTROL
   ============================================================ */

function initRateControl() {
    const slider = document.getElementById("rate");
    if (!slider) return;
    
    slider.value = appState.speechRate;

    slider.oninput = () => {
        appState.speechRate = parseFloat(slider.value);
        saveState();
    };
}


/* ============================================================
   PROGRESS METER CONTROLLER
   ============================================================ */

// Animates numbers seamlessly to prevent sudden UI jumps
function animateNumber(id, target, suffix = "%") {
    const el = document.getElementById(id);
    if (!el) return;
    
    let current = 0;
    if (target === 0) {
        el.textContent = "0" + suffix;
        return;
    }
    const step = target / 40;

    const interval = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = Math.round(current) + suffix;
    }, 20);
}

function updateProgressMeters() {
    const stats = appState.levelStats[appState.currentLevel];
    if (!stats) return;

    // Defensive defaults so undefined never becomes NaN
    const streak = typeof stats.streak === "number" ? stats.streak : 0;
    const reviewDue = Array.isArray(window.reviewList) ? window.reviewList.length : 0;

    // Helper to safely assign style width targets without breaking layout pipelines
    const setWidth = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.style.width = val + "%";
    };

    // Bar widths (percentages based on level completions)
    setWidth("quiz-progress", stats.quizScore || 0);
    setWidth("build-progress", stats.buildCompleted || 0);
    setWidth("sentence-progress", stats.sentenceCompleted || 0);

    // Converts totals into relative visual widths out of realistic milestones
    const xpPercent = Math.min(((appState.totalXP || 0) / 1000) * 100, 100); 
    setWidth("xp-progress", xpPercent);

    const streakPercent = Math.min((streak / 7) * 100, 100); 
    setWidth("streak-progress", streakPercent);

    const scorePercent = Math.min(((appState.globalScore || 0) / 500) * 100, 100); 
    setWidth("score-progress", scorePercent);

    // Fills the review bar based on density (caps full layout visualization at 10 items)
    const reviewBarPercentage = Math.min((reviewDue / 10) * 100, 100);
    setWidth("review-progress", reviewBarPercentage);

    // Animated numbers (Passing specific suffix units to match format goals)
    animateNumber("quiz-number", stats.quizScore || 0);
    animateNumber("build-number", stats.buildCompleted || 0);
    animateNumber("sentence-number", stats.sentenceCompleted || 0);

    // Displays clear point trackers instead of confusing percentage markers
    animateNumber("xp-number", appState.totalXP || 0, " XP");
    animateNumber("streak-number", streak, streak === 1 ? " day" : " days");
    animateNumber("score-number", appState.globalScore || 0, " Pts");
    animateNumber("review-number", reviewDue, reviewDue === 1 ? " word" : " words");

    // Pulse animations
    pulseTile("quiz-tile");
    pulseTile("build-tile");
    pulseTile("sentence-tile");
    pulseTile("xp-tile");
    pulseTile("streak-tile");
    pulseTile("score-tile");
    pulseTile("review-tile");
}

/* ============================================================
   TILE PULSE ANIMATION
   ============================================================ */
function pulseTile(id) {
    const tile = document.getElementById(id);
    if (!tile) return;

    tile.classList.remove("pulse");
    void tile.offsetWidth; // Forces layout recalculation to re-trigger transition rules safely
    tile.classList.add("pulse");
}
/**
 * ==========================================================================
 * MASTER LESSON PLATFORM & TRANSLATION ENGINE
 * Core Unified Runtime Application Pipeline Script (Chunk 1 of 3)
 * ==========================================================================
 */

/* ============================================================
   CERTIFICATE SYSTEM — CEFR LEVEL COMPLETION
   ============================================================ */

let certificates = {
    a1: false,
    a2: false,
    b1: false,
    b2: false
};

function saveCertificates() {
    localStorage.setItem("certificates", JSON.stringify(certificates));
}

function loadCertificates() {
    const saved = localStorage.getItem("certificates");
    if (saved) {
        try {
            certificates = JSON.parse(saved);
        } catch (e) {
            console.error("Error reading certificate collection state flags:", e);
        }
    }
}
loadCertificates();

function unlockCertificate(levelKey) {
    if (!levelKey) return;
    const lowerKey = levelKey.toLowerCase();
    if (lowerKey in certificates) {
        certificates[lowerKey] = true;
        saveCertificates();
    }
}

function renderCertificates() {
    const container = document.getElementById("certificates-container");
    if (!container) return;

    container.style.display = "block";

    const studentInputField = document.getElementById("student-name");
    const name = (typeof appState !== "undefined" && appState.studentName) || (studentInputField ? studentInputField.value : "") || "Learner";

    const today = new Date().toLocaleDateString();

    const setCertFields = (prefix, isActive) => {
        const nameEl = document.getElementById(`cert-${prefix}-name`);
        const dateEl = document.getElementById(`cert-${prefix}-date`);
        if (isActive && nameEl && dateEl) {
            nameEl.innerText = name;
            dateEl.innerText = today;
        }
    };

    setCertFields("a1", certificates.a1);
    setCertFields("a2", certificates.a2);
    setCertFields("b1", certificates.b1);
    setCertFields("b2", certificates.b2);
}

/* ============================================================
   LOAD PDF LIBRARIES (html2canvas + jsPDF)
   ============================================================ */
function loadPDFLibraries(callback) {
    if (window.html2canvas && window.jspdf) {
        callback();
        return;
    }

    const html2canvasScript = document.createElement("script");
    html2canvasScript.src = "https://cloudflare.com";

    const jsPDFScript = document.createElement("script");
    jsPDFScript.src = "https://cloudflare.com";

    let loaded = 0;
    function checkLoaded() {
        loaded++;
        if (loaded === 2) callback();
    }

    html2canvasScript.onload = checkLoaded;
    jsPDFScript.onload = checkLoaded;

    document.body.appendChild(html2canvasScript);
    document.body.appendChild(jsPDFScript);
}

function downloadCertificate(certId) {
    const element = document.getElementById(certId);
    if (!element) {
        alert("Certificate not found.");
        return;
    }

    loadPDFLibraries(() => {
        html2canvas(element, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            
            const { jsPDF } = window.jspdf || jspdf;
            const pdf = new jsPDF("p", "mm", "a4");

            const pageWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pageWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
            pdf.save(certId + ".pdf");
        }).catch(err => {
            console.error("PDF engine blueprint generation error:", err);
            alert("Error downloading certificate. Please check connection and try again.");
        });
    });
}

/* ============================================================
   GLOBAL TEXT NORMALIZATION LAYER
   ============================================================ */

function normalizeSpanish(str) {
    if (!str) return '';
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/-/g, "")               // remove hyphens
        .replace(/\s+/g, " ")            // normalize spaces
        .trim()
        .toLowerCase();
}

function normalizeEnglish(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[-_.,?!¡¿]/g, " ")     // convert punctuation to safe gaps
        .replace(/\s+/g, " ")            // reduce to single spaces
        .trim();
}

function cleanStringForKeyboard(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, " ").replace(/\s+/g, " ").trim();
}

function extractSpanishText(obj) {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    if (obj.es) return obj.es;
    if (obj.spanish) return obj.spanish;
    return Object.values(obj)[0] || "";
}
/* ============================================================
   GLOBAL ALL-BANKS DICTIONARY SEARCH ENGINE (BIDIRECTIONAL)
   ============================================================ */

function globalLookup(word) {
    const queryCleanEng = normalizeEnglish(word);
    const queryCleanEsp = normalizeSpanish(word);
    if (!queryCleanEng && !queryCleanEsp) return null;

    const levelsList = ["A1", "A2", "B1", "B2"];

    // 1. CEFR Vocabulary (A1–B2) — CEFR_LEVELS
    for (const level of levelsList) {
        if (typeof CEFR_LEVELS === "undefined" || !CEFR_LEVELS) continue;
        const vocab = CEFR_LEVELS[level];
        if (!vocab) continue;

        const match = vocab.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (item.spanish && normalizeSpanish(item.spanish) === queryCleanEsp)
        );
        if (match) {
            const isSpanishInput = match.spanish && normalizeSpanish(match.spanish) === queryCleanEsp;
            return {
                translation: isSpanishInput ? match.english : match.spanish,
                label: isSpanishInput ? "English" : "Spanish",
                speakText: match.spanish,
                source: "CEFR Vocabulary",
                level
            };
        }
    }

    // 2. CEFR Sentences — CEFR_SENTENCES
    for (const level of levelsList) {
        if (typeof CEFR_SENTENCES === "undefined" || !CEFR_SENTENCES) continue;
        const bank = CEFR_SENTENCES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (item.spanish && normalizeSpanish(item.spanish) === queryCleanEsp)
        );
        if (match) {
            const isSpanishInput = match.spanish && normalizeSpanish(match.spanish) === queryCleanEsp;
            return {
                translation: isSpanishInput ? match.english : match.spanish,
                label: isSpanishInput ? "English" : "Spanish",
                speakText: match.spanish,
                source: "CEFR Sentences",
                level
            };
        }
    }

    // 3. CEFR Sentence Choices — CEFR_SENTENCE_CHOICES
    for (const level of levelsList) {
        if (typeof CEFR_SENTENCE_CHOICES === "undefined" || !CEFR_SENTENCE_CHOICES) continue;
        const bank = CEFR_SENTENCE_CHOICES[level];
        if (!bank) continue;

        const match = bank.find(item =>
            (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
            (item.correct && item.correct.es && normalizeSpanish(item.correct.es) === queryCleanEsp)
        );
        if (match) {
            const isSpanishInput = match.correct && match.correct.es && normalizeSpanish(match.correct.es) === queryCleanEsp;
            return {
                translation: isSpanishInput ? match.english : match.correct.es,
                label: isSpanishInput ? "English" : "Spanish",
                speakText: match.correct.es,
                source: "Dialogue Choices",
                level
            };
        }
    }

    // 4. CEFR Phrases — CEFR_PHRASES (OBJECT MODEL)
    if (typeof CEFR_PHRASES !== "undefined" && CEFR_PHRASES !== null && !Array.isArray(CEFR_PHRASES)) {
        const matchingKey = Object.keys(CEFR_PHRASES).find(spanishKey => {
            const englishValue = CEFR_PHRASES[spanishKey];
            return (englishValue && normalizeEnglish(englishValue) === queryCleanEng) || 
                   (normalizeSpanish(spanishKey) === queryCleanEsp);
        });

        if (matchingKey) {
            const englishValue = CEFR_PHRASES[matchingKey];
            const isSpanishInput = normalizeSpanish(matchingKey) === queryCleanEsp;
            return { 
                translation: isSpanishInput ? englishValue : matchingKey, 
                label: isSpanishInput ? "English" : "Spanish",
                speakText: matchingKey,
                source: "CEFR Phrases", 
                level: "A1" 
            };
        }
    }

    // 5. Listen Vocab — LISTEN_VOCAB (COMPATIBLE WITH ORIGINAL NESTED STRUCTURE)
    if (typeof LISTEN_VOCAB !== "undefined" && LISTEN_VOCAB !== null) {
        for (const lvlKey of Object.keys(LISTEN_VOCAB)) {
            const levelData = LISTEN_VOCAB[lvlKey];
            if (!levelData) continue;

            for (const catKey of Object.keys(levelData)) {
                const wordArray = levelData[catKey];
                if (!Array.isArray(wordArray)) continue;

                const matchSpan = wordArray.find(spanWord => normalizeSpanish(spanWord) === queryCleanEsp);
                
                if (matchSpan) {
                    const primaryRef = (typeof CEFR_LEVELS !== "undefined" && CEFR_LEVELS[lvlKey]) 
                        ? CEFR_LEVELS[lvlKey].find(item => normalizeSpanish(item.spanish) === queryCleanEsp)
                        : null;

                    const englishTranslation = primaryRef ? primaryRef.english : "Vocabulary item";
                    
                    return {
                        translation: englishTranslation,
                        label: "English",
                        speakText: matchSpan,
                        source: `Listen Vocab (${catKey})`,
                        level: lvlKey
                    };
                }
            }
        }
    }

    // 6. Word-by-word dictionary — WORD_DICT (KEY-VALUE DIRECTORY)
    if (typeof WORD_DICT !== "undefined") {
        if (WORD_DICT[queryCleanEng]) {
            return { translation: WORD_DICT[queryCleanEng], label: "Spanish", speakText: WORD_DICT[queryCleanEng], source: "Word Dictionary", level: "GLOBAL" };
        }
        const reverseKeyMatch = Object.keys(WORD_DICT).find(k => normalizeSpanish(WORD_DICT[k]) === queryCleanEsp);
        if (reverseKeyMatch) {
            return { translation: reverseKeyMatch, label: "English", speakText: WORD_DICT[reverseKeyMatch], source: "Word Dictionary", level: "GLOBAL" };
        }
    }

    // ⭐ 6.5 MINING TERMINOLOGY SEARCH SUPPORT
    if (typeof MINING_REFERENCES !== "undefined" && MINING_REFERENCES !== null) {
        for (const categoryKey of Object.keys(MINING_REFERENCES)) {
            const miningCategory = MINING_REFERENCES[categoryKey];
            if (!Array.isArray(miningCategory)) continue;

            const match = miningCategory.find(item =>
                (item.english && normalizeEnglish(item.english) === queryCleanEng) ||
                (item.spanish && normalizeSpanish(item.spanish) === queryCleanEsp)
            );

            if (match) {
                const isSpanishInput = match.spanish && normalizeSpanish(match.spanish) === queryCleanEsp;
                return {
                    translation: isSpanishInput ? match.english : match.spanish,
                    label: isSpanishInput ? "English" : "Spanish",
                    speakText: match.spanish,
                    source: `Mining Terminology (${categoryKey})`,
                    level: "GLOBAL"
                };
            }
        }
    }

    // 7. Conversation Prompts — CEFR_CONVERSATION_PROMPTS
    if (typeof CEFR_CONVERSATION_PROMPTS !== "undefined" && CEFR_CONVERSATION_PROMPTS !== null) {
        for (const levelKey of Object.keys(CEFR_CONVERSATION_PROMPTS)) {
            const prompts = CEFR_CONVERSATION_PROMPTS[levelKey];
            if (!Array.isArray(prompts)) continue;
            
            const convoMatch = prompts.find(p => {
                const spanTxt = typeof p.spanish === 'object' ? extractSpanishText(p.spanish) : p.spanish;
                return (p.english && normalizeEnglish(p.english) === queryCleanEng) ||
                       (spanTxt && normalizeSpanish(spanTxt) === queryCleanEsp);
            });
            
            if (convoMatch) {
                const targetSpanishText = typeof convoMatch.spanish === 'object' ? extractSpanishText(convoMatch.spanish) : convoMatch.spanish;
                const isSpanishInput = targetSpanishText && normalizeSpanish(targetSpanishText) === queryCleanEsp;
                return { 
                    translation: isSpanishInput ? convoMatch.english : targetSpanishText, 
                    label: isSpanishInput ? "English" : "Spanish",
                    speakText: targetSpanishText,
                    source: "Conversation Prompt", 
                    level: levelKey 
                };
            }
        }
    }

    // 8. Conversation Audio — A1–B2
    const convoAudioBanks = [];
    if (typeof CEFR_CONVERSATION_AUDIO_A1 !== "undefined") convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_A1);
    if (typeof CEFR_CONVERSATION_AUDIO_A2 !== "undefined") convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_A2);
    if (typeof CEFR_CONVERSATION_AUDIO_B1 !== "undefined") convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_B1);
    if (typeof CEFR_CONVERSATION_AUDIO_B2 !== "undefined") convoAudioBanks.push(CEFR_CONVERSATION_AUDIO_B2);

    for (const bank of convoAudioBanks) {
        if (!bank || !Array.isArray(bank)) continue;
        const audioMatch = bank.find(a =>
            (a.english && normalizeEnglish(a.english) === queryCleanEng) ||
            (a.spanish && normalizeSpanish(a.spanish) === queryCleanEsp)
        );
        if (audioMatch) {
            const isSpanishInput = audioMatch.spanish && normalizeSpanish(audioMatch.spanish) === queryCleanEsp;
            return {
                translation: isSpanishInput ? audioMatch.english : audioMatch.spanish,
                label: isSpanishInput ? "English" : "Spanish",
                speakText: audioMatch.spanish,
                source: "Conversation Audio",
                level: audioMatch.level || "GLOBAL"
            };
        }
    }

    return null;
}

/* ============================================================
   DYNAMIC EVERYDAY PHRASE TEMPLATE BLUEPRINTS (SUB-PARSER)
   ============================================================ */
const EVERYDAY_PHRASE_TEMPLATES = [
    {
        // Matches: "I would like to order [a steak / the coffee / beer...]"
        pattern: /^i would like to order (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `Me gustaría pedir ${parsedTarget}`, label: "Spanish", speakText: `Me gustaría pedir ${parsedTarget}`, source: "Dynamic Order Template" };
        }
    },
    {
        // Matches: "I want to buy [new shoes / a ticket...]"
        pattern: /^i want to buy (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `Quiero comprar ${parsedTarget}`, label: "Spanish", speakText: `Quiero comprar ${parsedTarget}`, source: "Dynamic Purchase Template" };
        }
    },
       {
        // Matches: "Can I buy [a beer / shoes / tickets / a book...]"
        pattern: /^can i buy (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            // Swaps the literal "un/una" split directly for smooth native output phrasing
            let cleanSegment = parsedTarget.replace("to", "un"); 
            return { translation: `¿Puedo comprar ${cleanSegment}?`, label: "Spanish", speakText: `Puedo comprar ${cleanSegment}`, source: "Dynamic Transaction Template" };
        }
    },
    {
        // Matches: "Can I order [a coffee / tea / food...]"
        pattern: /^can i order (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            let cleanSegment = parsedTarget.replace("to", "un");
            return { translation: `¿Puedo pedir ${cleanSegment}?`, label: "Spanish", speakText: `Puedo pedir ${cleanSegment}`, source: "Dynamic Transaction Template" };
        }
    },

    {
        // Matches: "Where can I find [the bathroom / a hotel...]"
        pattern: /^where can i find (.+)$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `¿Dónde puedo encontrar ${parsedTarget}?`, label: "Spanish", speakText: `Dónde puedo encontrar ${parsedTarget}`, source: "Dynamic Location Template" };
        }
    },
    {
        // Matches: "Is the [hotel / station] far"
        pattern: /^is the (.+) far$/i,
        translate: (targetWord) => {
            const parsedTarget = parseSubPhrase(targetWord);
            return { translation: `¿Está lejos el ${parsedTarget}?`, label: "Spanish", speakText: `Está lejos el ${parsedTarget}`, source: "Dynamic Distance Template" };
        }
    }
];

/**
 * Helper Sub-Parser Function: Breaks down compound template inputs (e.g. "a steak")
 * and cross-references them word-by-word against your massive single word dictionary map.
 */
function parseSubPhrase(phraseText) {
    if (!phraseText) return "";
    const cleanText = phraseText.trim().toLowerCase();
    const bits = cleanText.split(/\s+/).filter(b => b.length > 0);
    const translatedBits = [];

    bits.forEach(bit => {
        // Try looking up the word inside your global dictionaries first
        const look = globalLookup(bit);
        if (look) {
            // If the dictionary returns a complex multi-translation mapping string like "el/la" or "un/una",
            // we safely pick the first option as a default baseline for conversational simplicity.
            const cleanTrans = (look.translation || look.spanish).split('/');
            translatedBits.push(cleanTrans[0].trim());
        } else if (typeof WORD_DICT !== "undefined" && WORD_DICT[bit]) {
            const dictTrans = WORD_DICT[bit].split('/');
            translatedBits.push(dictTrans[0].trim());
        } else {
            // Keep unknown components safe inside standard error brackets
            translatedBits.push(`[${bit}]`);
        }
    });

    return translatedBits.join(" ");
}

/* ============================================================
   DICTIONARY SEARCH INITIALIZER SYSTEM (PATTERN INTERCEPTOR)
   ============================================================ */

function initDictionarySearch() {
    const searchInput = document.getElementById("dict-search-input");
    const resultBox = document.getElementById("dict-search-result");

    if (!searchInput || !resultBox) return;

    let clearBtn = document.getElementById("dict-clear-btn");
    if (!clearBtn) {
        clearBtn = document.createElement("button");
        clearBtn.id = "dict-clear-btn";
        clearBtn.className = "pill";
        clearBtn.innerText = "✕ Clear";
        clearBtn.style.cssText = "padding: 6px 12px; font-size: 11px; margin-left: 8px; cursor: pointer; display: none; background: rgba(248,113,113,0.15); border: 1px solid rgba(248,113,113,0.3); color: #f87171;";
        searchInput.parentNode.insertBefore(clearBtn, searchInput.nextSibling);

        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            resultBox.innerHTML = "";
            clearBtn.style.display = "none";
            searchInput.focus();
        });
    }

    searchInput.addEventListener("input", () => {
        const rawValue = searchInput.value;
        const normalizedQuery = normalizeEnglish(rawValue);

        if (!rawValue.trim()) {
            resultBox.innerHTML = "";
            clearBtn.style.display = "none";
            return;
        }

        clearBtn.style.display = "inline-block";

        // B. INTERCEPT: Safe Array Destructuring Capture Group Reader
        for (const template of EVERYDAY_PHRASE_TEMPLATES) {
            const matchArray = normalizedQuery.match(template.pattern);
            if (matchArray && matchArray.length > 1) {
                const fullMatchText = matchArray[0];
                const capturedWordGroup = matchArray[1];
                const dynamicResult = template.translate(capturedWordGroup);
                renderPhraseBox(dynamicResult);
                return;
            }
        }

        // C. FALLBACK 1: Standard Static Phrase Match
        const phraseResult = globalLookup(rawValue);
        if (phraseResult) {
            renderPhraseBox(phraseResult);
            return;
        }

        // D. FALLBACK 2: Greedy Word-by-Word Split Layer
        const words = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
        if (words.length > 1) {
            const translatedSegments = [];
            const unknownWords = [];
            let i = 0;

            while (i < words.length) {
                let matched = false;

                for (let len = Math.min(4, words.length - i); len >= 2; len--) {
                    const chunk = words.slice(i, i + len).join(" ");
                    const chunkResult = globalLookup(chunk);

                    if (chunkResult) {
                        translatedSegments.push(chunkResult.translation || chunkResult.spanish);
                        i += len;
                        matched = true;
                        break;
                    }
                }

                if (!matched) {
                    const word = words[i];
                    // Manual baseline injection filters for clean literal rendering fallbacks
                    if (word === "the") {
                        translatedSegments.push("el/la");
                        i++;
                        continue;
                    }
                    if (word === "far") {
                        translatedSegments.push("lejos");
                        i++;
                        continue;
                    }

                    const wordResult = globalLookup(word);
                    if (wordResult) {
                        translatedSegments.push(wordResult.translation || wordResult.spanish);
                    } else {
                        unknownWords.push(word);
                        translatedSegments.push(`[${word}]`);
                    }
                    i++;
                }
            }

            const spanishSentence = translatedSegments.join(" ");
            renderPhraseBox({
                translation: spanishSentence,
                label: "Spanish",
                speakText: spanishSentence.replace(/[\[\]]/g, ""),
                source: "Sentence Split Fallback Mode",
                level: unknownWords.length === 0 ? "ALL FOUND" : "MISSING: " + unknownWords.join(", ")
            });
            return;
        }

        resultBox.innerHTML = `
            <div style="color: #f87171; font-style: italic; font-size: 13px; margin-top: 8px;">
                Term or everyday conversational pattern not found in database.
            </div>
        `;
    });

    function renderPhraseBox(res) {
        const outputText = res.translation || res.spanish;
        const outputLabel = res.label || "Spanish";
        const speechTarget = res.speakText || res.spanish;
        const cleanSpeechText = speechTarget.replace(/'/g, "\\'");

        resultBox.innerHTML = `
            <div style="padding: 10px; background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.3); border-radius: 10px; margin-top: 5px; display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span style="color: #a5f3fc; font-weight: bold;">${outputLabel}:</span>
                    <span style="color: #4ade80; font-size: 1.1rem; font-weight: 600; text-shadow: 0 0 6px rgba(74,222,128,0.45);">
                        ${outputText}
                    </span>
                    <button id="dict-speak-btn" class="pill" style="padding: 4px 10px; font-size: 11px; max-width: 50px; cursor: pointer;">🔊</button>
                </div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px;">
                    Matched via ${res.source} (${res.level || "GLOBAL"})
                </div>
            </div>
        `;

        const speakBtn = document.getElementById("dict-speak-btn");
        if (speakBtn) {
            speakBtn.onclick = () => {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
                utterance.lang = 'es-ES';
                const speedSlider = document.getElementById('rate');
                if (speedSlider) utterance.rate = parseFloat(speedSlider.value);
                window.speechSynthesis.speak(utterance);
            };
        }
    }
}

/* ============================================================
   STARTUP & EVENT INITIALIZATION
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    if (typeof loadState === "function") loadState();
    if (typeof initTabNavigation === "function") initTabNavigation();     
    if (typeof activateTab === "function") activateTab("dashboard"); 
    if (typeof initRateControl === "function") initRateControl();       
    if (typeof initNameBox === "function") initNameBox();           
    if (typeof initDictionarySearch === "function") initDictionarySearch();  
    if (typeof initFreePracticex === "function") initFreePracticex();  

    const resetBtn = document.getElementById("resetAllLevelsBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            const confirmReset = confirm("Are you completely sure you want to delete everything? This will permanently wipe your scores, XP, streaks, and review list tracking.");
            if (confirmReset) {
                if (typeof resetAllProgress === "function") {
                    resetAllProgress();
                } else {
                    localStorage.clear();
                    location.reload();
                }
            }
        });
    }

    if (typeof updateBadges === "function") updateBadges();
    if (typeof updateProgressMeters === "function") updateProgressMeters();
});

/* ============================================================
   MISTAKEN AREAS — REVIEW SYSTEM ENGINE
   ============================================================ */

window.reviewList = [];
try {
    const savedReview = localStorage.getItem('reviewList');
    if (savedReview) window.reviewList = JSON.parse(savedReview);
} catch (e) {
    console.error("Error reading saved mistake logs:", e);
    window.reviewList = [];
}

function findAudioForSpanish(spanishText) {
    if (!spanishText) return null;
    const clean = cleanStringForKeyboard(spanishText.toLowerCase());
    const banks = [];

    if (typeof CEFR_CONVERSATION_AUDIO_A1 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_A1)) banks.push(...CEFR_CONVERSATION_AUDIO_A1);
    if (typeof CEFR_CONVERSATION_AUDIO_A2 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_A2)) banks.push(...CEFR_CONVERSATION_AUDIO_A2);
    if (typeof CEFR_CONVERSATION_AUDIO_B1 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_B1)) banks.push(...CEFR_CONVERSATION_AUDIO_B1);
    if (typeof CEFR_CONVERSATION_AUDIO_B2 !== "undefined" && Array.isArray(CEFR_CONVERSATION_AUDIO_B2)) banks.push(...CEFR_CONVERSATION_AUDIO_B2);

    for (const item of banks) {
        if (!item || !item.es || !item.audio) continue;
        if (cleanStringForKeyboard(item.es.toLowerCase()) === clean) {
            return item.audio;
        }
    }
    return null;
}

function playReviewAudio(spanishText) {
    const audioFile = findAudioForSpanish(spanishText);
    if (!audioFile) {
        if (typeof speakSpanish === "function") speakSpanish(spanishText);
        return;
    }
    try {
        const audio = new Audio(`audio/${audioFile}`);
        audio.play().catch(e => console.warn("Native file play stalled. Audio folder missing assets.", e));
    } catch (e) {
        console.error("Audio engine failed to load instance:", e);
    }
}

function addIncorrectWord(word) {
    if (!word) return;
    if (!window.reviewList.includes(word)) {
        window.reviewList.push(word);
        localStorage.setItem('reviewList', JSON.stringify(window.reviewList));
        renderReviewList();
        if (typeof updateProgressMeters === "function") updateProgressMeters();
    }
}

function clearWordFromReview(word) {
    window.reviewList = window.reviewList.filter(item => item !== word);
    localStorage.setItem('reviewList', JSON.stringify(window.reviewList));
    renderReviewList();
    if (typeof updateProgressMeters === "function") updateProgressMeters();
}

function renderReviewList() {
    const listContainer = document.getElementById('review-words-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (window.reviewList.length === 0) {
        listContainer.innerHTML = '<p class="review-empty-msg">🎉 Great job! No words to review.</p>';
        return;
    }

    window.reviewList.forEach(word => {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.style.display = 'flex';
        card.style.alignItems = 'center';
        card.style.margin = '10px 0';
        
        let spanishText = word;
        if (word.includes('➔')) {
            const parts = word.split('➔');
            spanishText = (parts && parts[1]) ? parts[1].trim() : word.trim();
        } else if (word.includes('→')) {
            const parts = word.split('→');
            spanishText = (parts && parts[1]) ? parts[1].trim() : word.trim();
        }

        card.innerHTML = `
            <span class="review-word-text">${word}</span>
            <div class="review-card-actions" style="display: flex; align-items: center; gap: 12px; margin-left: auto;">
                <button class="pill review-play-btn" style="min-width: 45px; padding: 10px 14px;">🔊 Play</button>
                <button class="pill got-it-btn">Got it!</button>
            </div>
        `;

        card.querySelector('.review-play-btn').addEventListener('click', () => {
            playReviewAudio(spanishText);
        });

        card.querySelector('.got-it-btn').addEventListener('click', () => {
            clearWordFromReview(word);
        });

        listContainer.appendChild(card);
    });
}
/* ============================================================
   GLOBAL FREE PRACTICE SANDBOX (UNSCORED)
   ============================================================ */
let currentPracticeWord = null;

function initFreePracticeSandbox() {
    const checkBtn = document.getElementById("practice-check-btn");
    const nextBtn = document.getElementById("practice-next-btn");
    const inputField = document.getElementById("practice-user-input");

    if (!checkBtn || !nextBtn || !inputField) return;

    getNewPracticeWord();

    checkBtn.addEventListener("click", evaluatePracticeAnswer);

    inputField.addEventListener("keypress", (e) => {
        if (e.key === "Enter") evaluatePracticeAnswer();
    });

    nextBtn.addEventListener("click", () => {
        getNewPracticeWord();
    });
}

function getNewPracticeWord() {
    const inputField = document.getElementById("practice-user-input");
    const feedbackBox = document.getElementById("practice-feedback");
    const wordPlaceholder = document.getElementById("practice-english-word");

    if (!wordPlaceholder || !inputField || !feedbackBox) return;

    inputField.value = "";
    feedbackBox.innerHTML = "";

    // 🌟 SMART FALLBACK LOGIC: Auto-detect whichever name your vocabulary variable is using
    let masterPool = null;
    if (typeof CEFR_LEVELS !== "undefined" && CEFR_LEVELS !== null) {
        masterPool = CEFR_LEVELS;
    } else if (typeof vocabularyData !== "undefined" && vocabularyData !== null) {
        masterPool = vocabularyData;
    } else if (typeof dictData !== "undefined" && dictData !== null) {
        masterPool = dictData;
    }

    if (!masterPool) {
        wordPlaceholder.textContent = "Error: Vocabulary database not found.";
        return;
    }
    
    const levels = Object.keys(masterPool).filter(lvl => Array.isArray(masterPool[lvl]) && masterPool[lvl].length > 0);
    if (levels.length === 0) {
        wordPlaceholder.textContent = "Error: Level arrays are empty.";
        return;
    }
    
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    const wordPool = masterPool[randomLevel];
    
    currentPracticeWord = wordPool[Math.floor(Math.random() * wordPool.length)];
    wordPlaceholder.textContent = `${currentPracticeWord.english} (${randomLevel})`;
}


function evaluatePracticeAnswer() {
    const inputField = document.getElementById("practice-user-input");
    const feedbackBox = document.getElementById("practice-feedback");

    if (!inputField || !feedbackBox || !currentPracticeWord) return;

    const userTyped = inputField.value.trim();
    
    if (!userTyped) {
        feedbackBox.innerHTML = `<span style="color: #f87171;">Type an answer first!</span>`;
        return;
    }

    // 🌟 THE CRITICAL HOTFIX: Swap cleanStringForKeyboard for normalizeSpanish
    const cleanUser = normalizeSpanish(userTyped);
    const cleanCorrect = normalizeSpanish(currentPracticeWord.spanish);

    if (cleanUser === cleanCorrect) {
        const cleanSpeechText = currentPracticeWord.spanish.replace(/'/g, "\\'");
        
        feedbackBox.innerHTML = `
            <div style="color: #4ade80; font-weight: 600; padding: 6px; background: rgba(74,222,128,0.1); border-radius: 8px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span>Correct! 🎉 (${currentPracticeWord.spanish})</span>
                <button id="practice-speak-btn" class="pill" style="padding: 2px 8px; font-size: 10px; max-width: 40px; cursor: pointer;">🔊</button>
            </div>
        `;
        
        const speakBtn = document.getElementById("practice-speak-btn");
        if (speakBtn) {
            speakBtn.onclick = () => {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
                utterance.lang = 'es-ES';
                const speedSlider = document.getElementById('rate');
                if (speedSlider) utterance.rate = parseFloat(speedSlider.value);
                window.speechSynthesis.speak(utterance);
            };
        }
        
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentPracticeWord.spanish);
        utterance.lang = 'es-ES';
        const speedSlider = document.getElementById('rate');
        if (speedSlider) utterance.rate = parseFloat(speedSlider.value);
        window.speechSynthesis.speak(utterance);
        
    } else {
        feedbackBox.innerHTML = `
            <div style="color: #f87171; font-weight: 500; padding: 6px; background: rgba(248,113,113,0.1); border-radius: 8px;">
                Not quite! "<strong>${currentPracticeWord.english}</strong>" translates to "<strong>${currentPracticeWord.spanish}</strong>". Try again, or click Skip.
            </div>
        `;
    }
}
/* ============================================================
   UNIFIED SECURE LIFECYCLE DEPLOYMENT HOOK
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    // 1. First, make sure the automatic vocabulary hydration expander loop compiles cleanly
    if (typeof autoExpandDictionary === "function") {
        console.log("🔄 Step 1: Hydrating Master Vocabulary Matrix...");
        autoExpandDictionary();
    }

    // 2. Second, boot up your floating scoring indicators and responsive iPhone lockouts
    if (typeof renderScoreDashboardUI === "function") {
        renderScoreDashboardUI();
    }
    if (typeof enforceMobileNavigationLocks === "function") {
        enforceMobileNavigationLocks();
    }

    // 3. Final Step: Safe delayed timeout execution to force synchronous sandbox database binding
    setTimeout(() => {
        console.log("🎯 Step 2: Binding Safe Vocabulary Links to Practice Sandbox...");
        if (typeof initFreePracticeSandbox === "function") {
            initFreePracticeSandbox();
        } else {
            console.error("❌ Fatal Error: initFreePracticeSandbox initialization function block is missing.");
        }
    }, 150); // 150ms delay provides ample breathing track space for long level data arrays to initialize
});
