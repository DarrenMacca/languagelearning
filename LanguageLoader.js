// ============================================================
// MULTI-LANGUAGE + MULTI-MODULE LOADER
// ============================================================

let activeLanguage = "es";   // default
let activeLevel = "A1";      // default

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
    review: null,
    repeat: "repeat"
};

// Load CEFR level file (A1.js, A2.js, B1.js, B2.js)
async function loadLevelBank(level = activeLevel) {
    const path = `./wordbanks/${activeLanguage}/${level}.js`;
    const raw = await import(path);
    return raw.default ?? raw;   // normalize default export
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

    const path = `./wordbanks/${activeLanguage}/${file}`;
    const raw = await import(path);
    return raw.default ?? raw;   // normalize default export
}

function setLanguage(lang) {
    activeLanguage = lang;
}

function setLevel(level) {
    activeLevel = level;
}

async function loadModule(moduleName) {
    const levelBankRaw = await loadLevelBank(activeLevel);
    const moduleBankRaw = await loadModuleBank(moduleName);

    const levelBank = levelBankRaw.default ?? levelBankRaw;
    const moduleBank = moduleBankRaw.default ?? moduleBankRaw;

    return {
        levelBank,
        moduleBank
    };
}

export { setLanguage, setLevel, loadModule };
