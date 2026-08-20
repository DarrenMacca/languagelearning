// ============================================================
// LANGUAGE PACK LOADER
// Loads ALL JS files inside wordbanks/<lang>/
// ============================================================

async function loadLanguagePack(lang) {
    const base = `wordbanks/${lang}`;

    const files = [
        "A1.js",
        "A2.js",
        "B1.js",
        "B2.js",
        "CEFR_CONVERSATION.js",
        "CEFR_CONVERSATION_AUDIO.js",
        "CEFR_LEVELS.js",
        "CEFR_PHRASES.js",
        "CEFR_SENTENCES.js",
        "CEFR_SENTENCE_CHOICES.js",
        "DISRUPTORS.js",
        "LISTEN_VOCAB.js",
        "WORD_DICT.js",
        "mining_references.js"
    ];

    const jsonData = {};   // stays empty unless you add JSON later
    const modules = {};

    // -------------------------------
    // Load JS modules
    // -------------------------------
    const jsFiles = files.filter(f => f.endsWith(".js"));

    for (const file of jsFiles) {
        try {
            modules[file.replace(".js", "")] = await import(`./${base}/${file}`);
        } catch (err) {
            console.error("JS module load error:", err);
        }
    }

    // -------------------------------
    // Build global language object
    // -------------------------------
    window.LANG = {
        lang,
        json: jsonData,
        modules: modules
    };

    console.log(`Language pack '${lang}' loaded:`, window.LANG);
}
