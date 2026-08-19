// ============================================================
// LANGUAGE PACK LOADER
// Loads ALL JS + JSON files inside wordbanks/<lang>/
// ============================================================

async function loadLanguagePack(lang) {
    const base = `wordbanks/${lang}`;

    // List of all files in the folder (from your screenshot)
    const files = [
        "A1.json",
        "A2.json",
        "B1.json",
        "B2.json",
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

    const jsonData = {};
    const modules = {};

    // -------------------------------
    // Load JSON files
    // -------------------------------
    const jsonFiles = files.filter(f => f.endsWith(".json"));

    for (const file of jsonFiles) {
        try {
            const res = await fetch(`${base}/${file}`);
            if (!res.ok) throw new Error(`Failed to load ${file}`);
            jsonData[file.replace(".json", "")] = await res.json();
        } catch (err) {
            console.error("JSON load error:", err);
        }
    }

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
