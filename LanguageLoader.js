// ============================================================
// MULTI-LANGUAGE + MULTI-MODULE LOADER
// ============================================================

let activeLanguage = "es";   // default
let activeLevel = "A1";      // default

// Load CEFR level file (A1.js, A2.js, B1.js, B2.js)
async function loadLevelBank(level = activeLevel) {
    const path = `./wordbanks/${activeLanguage}/${level}.js`;
    const raw = await import(path);
    return raw.default ?? raw;   // normalize default export
}

// Load module file
async function loadModuleBank(moduleName) {
    // REVIEW MODE: no wordbank needed
    if (moduleName === "review") {
        return { reviewMode: true };
    }

    // REPEAT MODE: uses folder structure
    if (moduleName === "repeat") {
        const path = `./wordbanks/${activeLanguage}/repeat/${activeLevel}.js`;
        const raw = await import(path);
        return raw.default ?? raw;
    }

    // NORMAL MODE: load the CEFR level file (A1.js, A2.js, etc.)
    return loadLevelBank(activeLevel);
}

// Change language
function setLanguage(lang) {
    activeLanguage = lang;
}

// Change CEFR level
function setLevel(level) {
    activeLevel = level;
}

// Load everything needed for a module
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
