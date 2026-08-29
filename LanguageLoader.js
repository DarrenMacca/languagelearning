// ============================================================
// MULTI-LANGUAGE CEFR LOADER — FINAL VERSION (Matches new app.js)
// ============================================================

let activeLanguage = "es";   // default
let activeLevel = "A1";      // default

// ------------------------------------------------------------
// LANGUAGE + LEVEL SETTERS
// ------------------------------------------------------------
export function setLanguage(lang) {
    activeLanguage = lang;
}

export function setLevel(level) {
    activeLevel = level;
}

// ------------------------------------------------------------
// LOAD LEVEL WORD BANK (A1.js, A2.js, B1.js, B2.js)
// ------------------------------------------------------------
export async function loadModule(level = activeLevel) {
    const path = `./wordbanks/${activeLanguage}/${level}.js`;

    try {
        const raw = await import(path);
        return raw.default ?? raw;   // always return array of words
    } catch (err) {
        console.error(`❌ Failed to load level file: ${path}`, err);
        return [];
    }
}

// ------------------------------------------------------------
// LOAD DICTIONARY (WORD_DICT.js)
// ------------------------------------------------------------
export async function loadDictionary() {
    const path = `./wordbanks/${activeLanguage}/WORD_DICT.js`;

    try {
        const raw = await import(path);
        return raw.default ?? raw;
    } catch (err) {
        console.error(`❌ Failed to load dictionary: ${path}`, err);
        return {};
    }
}

// ------------------------------------------------------------
// LOAD MINING REFERENCES (mining_references.js)
// ------------------------------------------------------------
export async function loadMining() {
    const path = `./wordbanks/${activeLanguage}/mining_references.js`;

    try {
        const raw = await import(path);
        return raw.default ?? raw;
    } catch (err) {
        console.error(`❌ Failed to load mining references: ${path}`, err);
        return [];
    }
}

// ------------------------------------------------------------
// LOAD REPEAT BANK (repeat/A1.js etc.)
// ------------------------------------------------------------
export async function loadRepeat(level = activeLevel) {
    const path = `./wordbanks/${activeLanguage}/repeat/${level}.js`;

    try {
        const raw = await import(path);
        return raw.default ?? raw;
    } catch (err) {
        console.error(`❌ Failed to load repeat file: ${path}`, err);
        return [];
    }
}

// ------------------------------------------------------------
// LOAD CONVERSATION PROMPTS (CEFR_CONVERSATION.js)
// ------------------------------------------------------------
export async function loadConversation() {
    const path = `./wordbanks/${activeLanguage}/CEFR_CONVERSATION.js`;

    try {
        const raw = await import(path);
        return raw.default ?? raw;
    } catch (err) {
        console.error(`❌ Failed to load conversation file: ${path}`, err);
        return [];
    }
}

// ------------------------------------------------------------
// LOAD CONVERSATION AUDIO (CEFR_CONVERSATION_AUDIO.js)
// ------------------------------------------------------------
export async function loadConversationAudio() {
    const path = `./wordbanks/${activeLanguage}/CEFR_CONVERSATION_AUDIO.js`;

    try {
        const raw = await import(path);
        return raw.default ?? raw;
    } catch (err) {
        console.error(`❌ Failed to load conversation audio: ${path}`, err);
        return {};
    }
}

// ------------------------------------------------------------
// LOAD SENTENCE CHOICES (CEFR_SENTENCE_CHOICES.js)
// ------------------------------------------------------------
export async function loadSentenceChoices() {
    const path = `./wordbanks/${activeLanguage}/CEFR_SENTENCE_CHOICES.js`;

    try {
        const raw = await import(path);
        return raw.default ?? raw;
    } catch (err) {
        console.error(`❌ Failed to load sentence choices: ${path}`, err);
        return [];
    }
}
