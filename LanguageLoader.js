// ============================================================
// MULTI-LANGUAGE + MULTI-MODULE LOADER
// ============================================================

let activeLanguage = "es";   // default
let activeLevel = "A1";      // default

// Map modules to their file names
const MODULE_FILES = {
    listen: "LISTEN_VOCAB.js",
    flashcards: "CEFR_PHRASES.js",
    quiz: "DISRUPTORS.js",
    build: "CEFR_SENTENCE_CHOICES.js",
    sentence: "CEFR_SENTENCES.js",
    conversation: "CEFR_CONVERSATION.js",
    conversationAudio: "CEFR_CONVERSATION_AUDIO.js",
    grammar: "CEFR_LEVELS.js",
    mining: "mining_references.js",
    dictionary: "WORD_DICT.js",
    review: "repeat",
    repeat: "repeat"
};

// Load CEFR level file (A1.js, A2.js, B1.js, B2.js)
async function loadLevelBank(level = activeLevel) {
    const path = `wordbanks/${activeLanguage}/${level}.js`;
    return import(`../${path}`);
}

// Load module file
async function loadModuleBank(moduleName) {
    const file = MODULE_FILES[moduleName];

    // Repeat practice uses folder structure
    if (moduleName === "repeat") {
        const path = `wordbanks/${activeLanguage}/repeat/${activeLevel}.js`;
        return import(`../${path}`);
    }

    const path = `wordbanks/${activeLanguage}/${file}`;
    return import(`../${path}`);
}

// Change language
function setLanguage(lang) {
    activeLanguage = lang;
    console.log("Language set to:", lang);
}

// Change CEFR level
function setLevel(level) {
    activeLevel = level;
    console.log("Level set to:", level);
}

// Load everything needed for a module
async function loadModule(moduleName) {
    const levelBank = await loadLevelBank(activeLevel);
    const moduleBank = await loadModuleBank(moduleName);

    return {
        levelBank,
        moduleBank
    };
}

export { setLanguage, setLevel, loadModule };
