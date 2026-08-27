// ============================================================
// MULTI-LANGUAGE CEFR LOADER (Unified CEFR System)
// ============================================================

let activeLanguage = "es";   // default
let activeLevel = "A1";      // default

// All modules now use CEFR_LEVELS.js
const MODULE_FILES = {
    listen: "CEFR_LEVELS.js",
    flashcards: "CEFR_LEVELS.js",
    quiz: "CEFR_LEVELS.js",
    build: "CEFR_LEVELS.js",
    sentence: "CEFR_LEVELS.js",
    conversation: "CEFR_LEVELS.js",
    conversationAudio: "CEFR_LEVELS.js",
    grammar: "CEFR_LEVELS.js",
    mining: "CEFR_LEVELS.js",
    dictionary: "CEFR_LEVELS.js",
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
