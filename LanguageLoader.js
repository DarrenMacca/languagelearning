// ============================================================
// MULTI-LANGUAGE + CEFR LEVEL LOADER (Stable Version)
// ============================================================

let activeLanguage = "es";   // default
let activeLevel = "A1";      // default

// Change language
export function setLanguage(lang) {
    activeLanguage = lang;
}

// Change CEFR level
export function setLevel(level) {
    activeLevel = level;
}

// Load CEFR level file (A1.js, A2.js, B1.js, B2.js)
export async function loadLevelBank(level = activeLevel) {
    const path = `./wordbanks/${activeLanguage}/${level}.js`;

    try {
        const raw = await import(path);
        return raw.default ?? raw;
    } catch (err) {
        console.error(`❌ Failed to load CEFR level file: ${path}`, err);
        return [];   // fail-safe empty array
    }
}

// Load module file (repeat, review, or normal CEFR level)
export async function loadModuleBank(moduleName) {

    // REVIEW MODE — no wordbank needed
    if (moduleName === "review") {
        return { reviewMode: true };
    }

    // REPEAT MODE — loads repeat/A1.js etc.
    if (moduleName === "repeat") {
        const path = `./wordbanks/${activeLanguage}/repeat/${activeLevel}.js`;

        try {
            const raw = await import(path);
            return raw.default ?? raw;
        } catch (err) {
            console.error(`❌ Failed to load repeat file: ${path}`, err);
            return { repeatMode: true, words: [] };
        }
    }

    // NORMAL MODE — load CEFR level file (A1.js, A2.js, etc.)
    return loadLevelBank(activeLevel);
}

// Load everything needed for a module
export async function loadModule(moduleName) {
    const levelBank = await loadLevelBank(activeLevel);
    const moduleBank = await loadModuleBank(moduleName);

    return {
        levelBank,
        moduleBank
    };
}
