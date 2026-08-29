// ============================================================
// MULTI-LANGUAGE CEFR LOADER (Unified CEFR System)
// ============================================================

let activeLanguage = "es";   // default
let activeLevel = "A1";      // default

// All modules now use CEFR_LEVELS.js
const MODULE_FILES = {
    listen: null,
    flashcards: null,
    quiz: null,
    build: null,
    sentence: null,
    conversation: null,
    conversationAudio: null,
    grammar: null,

    mining: "mining_references.js",
    dictionary: "WORD_DICT.js",

    review: null,
    repeat: "repeat"
};


// Load unified CEFR file
async function loadLevelBank() {
    const path = `./wordbanks/${activeLanguage}/CEFR_LEVELS.js`;
    const raw = await import(path);
    return raw.default ?? raw;
}

// Load module file
async function loadModuleBank(moduleName) {
    const file = MODULE_FILES[moduleName];

    if (moduleName === "review") {
        return { reviewMode: true };
    }

    if (moduleName === "repeat") {
        const path = `./wordbanks/${activeLanguage}/repeat/${activeLevel}.js`;
        const raw = await import(path);
        return raw.default ?? raw;
    }

    // All other modules use CEFR_LEVELS.js
    const path = `./wordbanks/${activeLanguage}/${file}`;
    const raw = await import(path);
    return raw.default ?? raw;
}

function setLanguage(lang) {
    activeLanguage = lang;
}

function setLevel(level) {
    activeLevel = level;
}

async function loadModule(moduleName) {
    const levelBank = await loadLevelBank();
    const moduleBank = await loadModuleBank(moduleName);

    return {
        levelBank,
        moduleBank
    };
}

export { setLanguage, setLevel, loadModule };
