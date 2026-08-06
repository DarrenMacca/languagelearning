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
   MINING REFERENCES — Open Cut & Underground Vocabulary (Spanish → English)
   ============================================================ */

const MINING_REFERENCES = {
    "Open Cut Mining": [
        { spanish: "rampa de acceso", english: "access ramp", category: "Open Cut Mining" },
        { spanish: "ángulo de reposo", english: "angle of repose", category: "Open Cut Mining" },
        { spanish: "minería con barreno", english: "auger mining", category: "Open Cut Mining" },
        { spanish: "excavadora de cuchara frontal", english: "backhoe excavator", category: "Open Cut Mining" },
        { spanish: "banco", english: "bench", category: "Open Cut Mining" },
        { spanish: "berma", english: "berm", category: "Open Cut Mining" },
        { spanish: "malla de perforación", english: "blast pattern", category: "Open Cut Mining" },
        { spanish: "corte de caja", english: "box cut", category: "Open Cut Mining" },
        { spanish: "minería masiva", english: "bulk mining", category: "Open Cut Mining" },
        { spanish: "banco de contención", english: "catch bench", category: "Open Cut Mining" },
        { spanish: "cresta", english: "crest", category: "Open Cut Mining" },
        { spanish: "tolva de bulldozer", english: "dozer trap", category: "Open Cut Mining" },
        { spanish: "dragalina", english: "dragline", category: "Open Cut Mining" },
        { spanish: "perforadora de pozos de voladura", english: "drill rig (rotary blasthole)", category: "Open Cut Mining" },
        { spanish: "botadero", english: "dump / waste dump", category: "Open Cut Mining" },
        { spanish: "pala eléctrica de cables", english: "electric rope shovel", category: "Open Cut Mining" },
        { spanish: "botadero externo", english: "ex-pit dump", category: "Open Cut Mining" },
        { spanish: "frente de explotación", english: "face", category: "Open Cut Mining" },
        { spanish: "control de leyes", english: "grade control", category: "Open Cut Mining" },
        { spanish: "camino de acarreo", english: "haul road", category: "Open Cut Mining" },
        { spanish: "talud alto", english: "highwall", category: "Open Cut Mining" },
        { spanish: "sistema de chancado y transportadores en pit", english: "in-pit crushing and conveying (IPCC)", category: "Open Cut Mining" },
        { spanish: "botadero interno", english: "in-pit dump", category: "Open Cut Mining" },
        { spanish: "altura de banco", english: "lift", category: "Open Cut Mining" },
        { spanish: "carga y acarreo", english: "load-and-haul", category: "Open Cut Mining" },
        { spanish: "talud bajo", english: "lowwall", category: "Open Cut Mining" },
        { spanish: "vida útil de la mina", english: "mine life", category: "Open Cut Mining" },
        { spanish: "plan de minado", english: "mine plan", category: "Open Cut Mining" },
        { spanish: "chancadora móvil", english: "mobile crusher", category: "Open Cut Mining" },
        { spanish: "pila de material volado", english: "muckpile", category: "Open Cut Mining" },
        { spanish: "minería a cielo abierto", english: "open-cut / open-pit", category: "Open Cut Mining" },
        { spanish: "recubrimiento", english: "overburden", category: "Open Cut Mining" },
        { spanish: "talud perimetral", english: "perimeter bund", category: "Open Cut Mining" },
        { spanish: "piso del tajo", english: "pit floor", category: "Open Cut Mining" },
        { spanish: "límite final del tajo", english: "pit limit / ultimate pit limit", category: "Open Cut Mining" },
        { spanish: "cantera", english: "quarry", category: "Open Cut Mining" },
        { spanish: "remanejo", english: "rehandle", category: "Open Cut Mining" },
        { spanish: "rehabilitación ambiental", english: "rehabilitation", category: "Open Cut Mining" },
        { spanish: "perforadora rotativa", english: "rotary blasthole drill", category: "Open Cut Mining" },
        { spanish: "cancha rom", english: "run-of-mine (rom) pad", category: "Open Cut Mining" },
        { spanish: "pretil de seguridad", english: "safety bund", category: "Open Cut Mining" },
        { spanish: "retiro de gruesos", english: "scalping", category: "Open Cut Mining" },
        { spanish: "estabilidad de taludes", english: "slope stability", category: "Open Cut Mining" },
        { spanish: "relación de stripping", english: "stripping ratio", category: "Open Cut Mining" },
        { spanish: "minador de superficie", english: "surface miner", category: "Open Cut Mining" },
        { spanish: "pata de talud", english: "toe", category: "Open Cut Mining" },
        { spanish: "retiro de capa vegetal", english: "topsoil stripping", category: "Open Cut Mining" },
        { spanish: "plan de gestión de tráfico", english: "traffic management plan", category: "Open Cut Mining" },
        { spanish: "tajo final", english: "ultimate pit", category: "Open Cut Mining" },
        { spanish: "cargador frontal de neumáticos", english: "wheel loader", category: "Open Cut Mining" }
    ],
    "Underground Mining": [
        { spanish: "socavón", english: "adit", category: "Underground Mining" },
        { spanish: "relleno", english: "backfill", category: "Underground Mining" },
        { spanish: "hundimiento por bloques", english: "block caving", category: "Underground Mining" },
        { spanish: "pilar de bloque", english: "block pillar", category: "Underground Mining" },
        { spanish: "tolva de extracción", english: "drawbell", category: "Underground Mining" },
        { spanish: "punto de extracción", english: "drawpoint", category: "Underground Mining" },
        { spanish: "hundimiento masivo", english: "caving", category: "Underground Mining" },
        { spanish: "crucero", english: "crosscut", category: "Underground Mining" },
        { spanish: "galería", english: "drift", category: "Underground Mining" },
        { spanish: "muro", english: "footwall", category: "Underground Mining" },
        { spanish: "techo", english: "hanging wall", category: "Underground Mining" },
        { spanish: "explotación por minas largas", english: "longwall mining", category: "Underground Mining" },
        { spanish: "nivel de producción", english: "production level", category: "Underground Mining" },
        { spanish: "chimenea", english: "raise", category: "Underground Mining" },
        { spanish: "pique", english: "shaft", category: "Underground Mining" },
        { spanish: "tajeo", english: "stope", category: "Underground Mining" },
        { spanish: "subsidencia", english: "subsidence", category: "Underground Mining" },
        { spanish: "socavación", english: "undercut", category: "Underground Mining" },
        { spanish: "nivel de socavación", english: "undercut level", category: "Underground Mining" },
        { spanish: "contrapique", english: "winze", category: "Underground Mining" }
    ]
};


/* ============================================================
   CEFR SENTENCE BANKS (for Build tab)
   ============================================================ */

const CEFR_SENTENCES = {
        A1: [
        // Simple Greetings & Formal Introductions
        { english: "Hello, how are you?", spanish: "hola cómo estás" },
        { english: "Good morning, sir.", spanish: "buenos días señor" },
        { english: "Good afternoon, ma'am.", spanish: "buenas tardes señora" },
        { english: "Good night, family.", spanish: "buenas noches familia" },
        { english: "Goodbye, my friend.", spanish: "adiós mi amigo" },
        { english: "I am very happy today.", spanish: "es muy feliz hoy" },
        { english: "How is he?", spanish: "cómo está el" },
        { english: "How is she?", spanish: "cómo está ella" },
        { english: "Hello, good morning.", spanish: "hola buenos días" },
        { english: "Goodbye, sir.", spanish: "adiós señor" },

        // Travel, Transit & Essential Needs
        { english: "I would like water, please.", spanish: "me gustaría agua por favor" },
        { english: "I would like beer, please.", spanish: "me gustaría cerveza por favor" },
        { english: "Where is the bathroom?", spanish: "dónde está el baño" },
        { english: "Where is the hotel?", spanish: "dónde está el hotel" },
        { english: "The hotel is near.", spanish: "el hotel está cerca" },
        { english: "Where is the station?", spanish: "dónde está la estación" },
        { english: "Where is the train?", spanish: "dónde está el tren" },
        { english: "Where is the bus?", spanish: "dónde está el autobús" },
        { english: "Where is the airport?", spanish: "dónde está el aeropuerto" },
        { english: "Where is the ticket?", spanish: "dónde está el boleto" },
        // Daily Routines, Work & Study
        { english: "I want a coffee.", spanish: "quiero un café" },
        { english: "The coffee is hot.", spanish: "el café es caliente" },
        { english: "I want to study more.", spanish: "estudiar más" },
        { english: "I want to work more.", spanish: "trabajar más" },
        { english: "I want to read books.", spanish: "leer libros" },
        { english: "I want to write books.", spanish: "escribir libros" },
        { english: "I want to go home.", spanish: "ir a casa" },
        { english: "I want to rest.", spanish: "descansar" },
        { english: "I want to clean the house.", spanish: "limpiar casa" },
        { english: "I want to cook today.", spanish: "cocinar hoy" },
        { english: "I am learning.", spanish: "aprendiendo" },
        { english: "He is fixing the television.", spanish: "el arreglando la televisión" },
        { english: "We are ready.", spanish: "listos" },
        { english: "The hour is near.", spanish: "hora es cerca" },

        // Family, Home Life & Food Transactions
        { english: "She is my sister.", spanish: "ella es mi hermana" },
        { english: "I have two brothers.", spanish: "tengo dos hermanos" },
        { english: "My friend is very happy.", spanish: "mi amigo es muy feliz" },
        { english: "We have hunger.", spanish: "tenemos hambre" },
        { english: "They have a big house.", spanish: "ellos tienen una casa grande" },
        { english: "The food is good.", spanish: "la comida es buena" },
        { english: "I want bread and milk.", spanish: "quiero pan y leche" },
        { english: "Steak with french fries, please.", spanish: "filete con papas fritas por favor" },
        { english: "Rice without beans.", spanish: "arroz sin frijoles" },
        { english: "I like cold tea.", spanish: "gusta té frío" },
        { english: "They like cheese and eggs.", spanish: "gustan queso y huevo" },
        { english: "We like this place.", spanish: "gusta lugar" }
    ],

        A2: [
        // Time Sequences, Indicators, and Routines
        { english: "Normally I get up early.", spanish: "normalmente levantarse temprano" },
        { english: "I want to cook dinner now.", spanish: "quiero cocinar cena ahora" },
        { english: "She is learning fast now.", spanish: "ella aprendiendo rápido ahora" },
        { english: "He wants to finish homework early.", spanish: "el terminar tarea temprano" },
        { english: "They want information now.", spanish: "ellos quieren información ahora" },
        { english: "The movie finishes in ten minutes.", spanish: "película terminar en diez minutos" },
        { english: "I have fifteen minutes now.", spanish: "tengo quince minutos ahora" },
        { english: "Anoche I was happy.", spanish: "anoche feliz" },
        { english: "Before, I want breakfast.", spanish: "antes quiero desayuno" },
        { english: "She already finished homework.", spanish: "ella ya terminar tarea" },
        { english: "I still have problems.", spanish: "todavía tengo problemas" },

        // Household Actions, Cooking, and Spaces
        { english: "The kitchen is clean now.", spanish: "cocina es clara ahora" },
        { english: "Open the kitchen window, please.", spanish: "abrir ventana cocina por favor" },
        { english: "I want to try a new breakfast today.", spanish: "quiero probar un nuevo desayuno hoy" },
        { english: "I want to fix the window now.", spanish: "quiero arreglar ventana ahora" },
        { english: "He is fixing the television in the house.", spanish: "el arreglando televisión en casa" },
        { english: "We have food for lunch and dinner.", spanish: "tenemos comida para almuerzo y cena" },

        // Family Transactions & Travel Contexts
        { english: "We want to visit parents today.", spanish: "visitar padres hoy" },
        { english: "Where is my friend? I want to wait.", spanish: "dónde es mi amigo quiero esperar" },
        { english: "I want to drive to the airport.", spanish: "conducir a aeropuerto" },
        // Messages, Information & Communication Loops
        { english: "I want to read the message now.", spanish: "quiero leer mensaje ahora" },
        { english: "She wants to write a message.", spanish: "ella escribir un mensaje" },
        { english: "He wants more information, please.", spanish: "el más información por favor" },
        { english: "Don't forget the message.", spanish: "no olvidar mensaje" },

        // Travel Logistics, Apparel, & Social Scenarios
        { english: "Where is the plane? It is late.", spanish: "dónde es avión es tarde" },
        { english: "The plane arrives in twenty minutes.", spanish: "avión llegar en veinte minutos" },
        { english: "I need transport to the station.", spanish: "necesito transporte a estación" },
        { english: "They want to leave the hotel early.", spanish: "ellos irse hotel temprano" },
        { english: "We arrived near the new place.", spanish: "llegar cerca nuevo lugar" },
        { english: "I want new shoes for the trip.", spanish: "quiero nuevos zapatos para viaje" },
        { english: "She likes her small shoes.", spanish: "ella gusta su pequeños zapatos" },
        { english: "Often, he likes this clean house.", spanish: "a menudo el gusta casa" },

        // Number Assemblies & Quantities
        { english: "I have eleven new books.", spanish: "tengo once nuevos libros" },
        { english: "There are twelve buses in the station.", spanish: "hay doce autobuses en estación" },
        { english: "Thirteen minutes to finish.", spanish: "trece minutos para terminar" },
        { english: "Fourteen fish and rice, please.", spanish: "catorce pescado y arroz por favor" },
        { english: "We have fifteen eggs for breakfast.", spanish: "tenemos quince huevos para desayuno" },
        { english: "She has sixteen apples.", spanish: "ella tiene dieciséis manzanas" },
        { english: "Seventeen train tickets, please.", spanish: "diecisiete boletos tren por favor" },
        { english: "Eighteen beers for the house.", spanish: "dieciocho cervezas para casa" },
        { english: "Nineteen people study here.", spanish: "diecinueve estudiar" },
        { english: "Twenty minutes to rest.", spanish: "veinte minutos para descansar" }
    ],

        B1: [
        // Present Perfect & Continuous Actions (The Core B1 Milestone)
        { english: "I have been here for a month.", spanish: "he estado aquí un mes" },
        { english: "You have learned fast during the trip.", spanish: "has aprendido rápido durante el viaje" },
        { english: "He has worked hard today.", spanish: "el ha trabajado más hoy" },
        { english: "We have studied the past experiences.", spanish: "hemos estudiado las experiencias pasadas" },
        { english: "They have lived here for two years.", spanish: "ellos han vivido aquí dos años" },
        { english: "She is working in the kitchen now.", spanish: "ella trabajando en la cocina ahora" },
        { english: "We are studying to improve our skills.", spanish: "estudiando para mejorar su habilidades" },
        { english: "He is reading a new book while waiting.", spanish: "el leyendo un nuevo libro mientras esperar" },
        { english: "They are living in a small place near school.", spanish: "ellos viviendo en un pequeño lugar cerca escuela" },

        // Daily Life Management, Communication & Improvement
        { english: "I want to improve my communication skills.", spanish: "quiero mejorar mi comunicación habilidades" },
        { english: "We need to continue the conversations today.", spanish: "necesitamos continuar las conversaciones hoy" },
        { english: "I want to understand the past experiences.", spanish: "quiero entender las experiencias pasadas" },
        { english: "She wants to review the information now.", spanish: "ella quiere revisar la información ahora" },
        { english: "He needs to prepare the daily homework.", spanish: "el necesita preparar la tarea diarias" },
        { english: "They want to follow the rules after lunch.", spanish: "ellos quieren seguir las reglas después de almuerzo" },
        { english: "I want to get a ticket for the trip.", spanish: "quiero conseguir un boleto para el viaje" },
        { english: "We need to change the daily routine.", spanish: "necesitamos cambiar la hora diarias" },
        { english: "However, I understand your problems.", spanish: "sin embargo quiero entender su problemas" },

        // Restaurant Transactions & Food Contexts
        { english: "Where is the new restaurant?", spanish: "dónde es el nuevo restaurante" },
        { english: "Bring the menu, please.", spanish: "traer el menú por favor" },
        // Restaurant Billings, Logistics & Connections
        { english: "Bring the bill to the table, please.", spanish: "traer la cuenta por favor" },
        { english: "The bill is big after dinner.", spanish: "la cuenta es grande después de cena" },
        { english: "I want to understand the restaurant menu.", spanish: "quiero entender el menú del restaurante" },

        // Travel Logistics, Planning & Household Shifting
        { english: "I want to plan a new trip.", spanish: "quiero planear un nuevo viaje" },
        { english: "They want to find a hotel near the station.", spanish: "ellos quieren encontrar un hotel cerca estación" },
        { english: "She needs to cancel her train ticket.", spanish: "ella necesita cancelar su boleto tren" },
        { english: "He wants to bring his parents on the trip.", spanish: "el quiere traer a su padres en el viaje" },
        { english: "We plan to move house this month.", spanish: "planeamos mudarse de casa este mes" },
        { english: "They want to join our trip today.", spanish: "ellos quieren unirse a su viaje hoy" },
        { english: "Where can I find transport now?", spanish: "dónde encontrar transporte ahora" },
        { english: "The plane was canceled last night.", spanish: "el avión cancelar anoche" },

        // Timeline Scales, Numbers & Duration Indicators
        { english: "He studied for an hour during lunch.", spanish: "el estudiar una hora durante almuerzo" },
        { english: "She has been working here for a month.", spanish: "ella ha trabajando aquí un mes" },
        { english: "They have lived in this house for ten years.", spanish: "ellos han vivido en esta casa diez años" },
        { english: "I need to review everything after this month.", spanish: "necesito revisar todo después de este mes" },
        { english: "We want to prepare the trip during the month.", spanish: "queremos preparar el viaje durante el mes" },
        { english: "He has learned a lot about skills this year.", spanish: "el ha aprendido sobre habilidades este año" },
        { english: "She wants to get information about the hotel before.", spanish: "ella quiere conseguir información sobre el hotel antes" },
        { english: "They will continue studying after two years.", spanish: "ellos continuar estudiando después de dos años" },
        { english: "While studying, I want to improve daily.", spanish: "mientras estudiar quiero mejorar diarias" }
    ],
    B2: [
        // Professional Strategies, Abstract Processes, and Analysis
        { english: "They want to analyze the situation.", spanish: "quieren analizar la situación" },
        { english: "We need to evaluate the risks carefully.", spanish: "necesitamos evaluar los riesgos cuidadosamente" },
        { english: "Although it was difficult, she finished the task.", spanish: "aunque difícil ella terminar la tarea" },
        { english: "They argued that the plan was not realistic.", spanish: "ellos argumentaron que el plan no bueno" },
        { english: "The strategy has increased our performance results.", spanish: "la estrategia ha aumentado su resultados de rendimiento" },
        { english: "Therefore, it is necessary to analyze the risk concept.", spanish: "por lo tanto es necesario analizar el concepto de riesgo" },
        { english: "We need to coordinate a positive strategy to achieve results.", spanish: "necesitamos coordinar una estrategia positiva para lograr resultados" },
        { english: "She has clarified her innovative approach during the discussion.", spanish: "ella ha aclarado su enfoque innovadora durante la discusión" },
        { english: "I want to update the system to strengthen our skills.", spanish: "quiero actualizar el sistema para fortalecer habilidades" },
        { english: "He has explored every possibility to optimize the task.", spanish: "el ha explorado otra posibilidad para optimizar la tarea" },
        { english: "They argued that a professional approach is necessary.", spanish: "ellos han argumentado que un enfoque profesional es necesario" },
        { english: "We have analyzed the complicated situation again.", spanish: "hemos analizado la situación complicado otra vez" },
        { english: "She has adapted the strategy to improve performance.", spanish: "ella ha adaptado la estrategia para mejorar rendimiento" },
        { english: "I want to try a positive approach now.", spanish: "quiero probar un enfoque positivo ahora" },
        { english: "He forgot to check the results of the process.", spanish: "el olvidar revisar los resultados del proceso" },
        { english: "We must analyze the results carefully.", spanish: "debemos analizar los resultados cuidadosamente" },
        { english: "She wants to improve her performance.", spanish: "ella quiere mejorar su rendimiento" },
        { english: "We need to update the system.", spanish: "necesitamos actualizar el sistema" },
        { english: "He explained the strategy clearly.", spanish: "el ha aclarado la estrategia clara" },
        { english: "They want to optimize the process.", spanish: "ellos quieren optimizar el proceso" },
        // Abstract Milestones, Culture, and Challenges
        { english: "We will continue even if there are challenges.", spanish: "continuaremos incluso si hay desafíos" },
        { english: "Despite the problems, they finished the trip.", spanish: "a pesar de los problemas terminaron el viaje" },
        { english: "We need to adapt to the new situation.", spanish: "necesitamos adaptarse a la nueva situación" },
        { english: "She wants to expand her professional experience.", spanish: "ella quiere ampliar su experiencia profesional" },
        { english: "He insisted on reviewing the data again.", spanish: "el ha insistido revisar la información otra vez" },
        { english: "They hope to achieve better results.", spanish: "ellos esperan lograr buenos resultados" },
        { english: "We need to clarify the instructions.", spanish: "necesitamos aclarar la información" },
        { english: "Although it seems easy, it is complicated.", spanish: "aunque fácil es complicado" },
        { english: "She argued that the change was necessary.", spanish: "ella ha argumentado que el cambio es necesario" },
        { english: "They want to strengthen the communication process.", spanish: "ellos quieren fortalecer la comunicación" },
        { english: "They discussed the situation for an hour during lunch.", spanish: "ellos han discutido la situación una hora durante almuerzo" },
        { english: "She wants to learn about our society and culture.", spanish: "ella quiere aprender sobre nuestra sociedad y cultura" },
        { english: "In addition, motivation is necessary to achieve goals.", spanish: "además motivación es necesario para lograr resultados" },
        { english: "Expectations are high for the future long term trip.", spanish: "expectativas altas para el futuro viaje a largo plazo" },
        { english: "They live in a remote place, however they study daily.", spanish: "viven en un lugar remoto sin embargo estudiar diarias" },

        // Final Verification Loops & Resource Management
        { english: "I want to understand this abstract concept better.", spanish: "quiero entender este concepto mejor" },
        { english: "We must prepare for possible system changes.", spanish: "debemos preparar para posible cambio del sistema" },
        { english: "They want to increase information access in society.", spanish: "ellos quieren aumentar la información en la sociedad" },
        { english: "He has reduced the risk of the strategy.", spanish: "el ha reducido el riesgo de la estrategia" }
    ]
};

/* ============================================================
   CEFR LEVELS — A1 → B2 Vocabulary (Spanish → English)
   ============================================================ */

const CEFR_LEVELS = {
        A1: [
        // Daily Life
        { spanish: "vivir", english: "to live", category: "Daily Life" },
        { spanish: "trabajar", english: "to work", category: "Daily Life" },
        { spanish: "estudiar", english: "to study", category: "Daily Life" },
        { spanish: "leer", english: "to read", category: "Daily Life" },
        { spanish: "libros", english: "books", category: "Daily Life" },
        { spanish: "hora", english: "hour", category: "Daily Life" },
        { spanish: "levantarse", english: "to get up", category: "Daily Life" },
        { spanish: "música", english: "music", category: "Daily Life" },
        { spanish: "televisión", english: "television", category: "Daily Life" },
        { spanish: "limpiar", english: "to clean", category: "Daily Life" },
        { spanish: "cocinar", english: "to cook", category: "Daily Life" },
        { spanish: "abrir", english: "to open", category: "Daily Life" },
        { spanish: "terminar", english: "to finish", category: "Daily Life" },
        { spanish: "escribir", english: "to write", category: "Daily Life" },
        { spanish: "aprender", english: "to learn", category: "Daily Life" },
        { spanish: "ir", english: "to go", category: "Daily Life" },
        { spanish: "hacer", english: "to do", category: "Daily Life" },
        { spanish: "ver", english: "to see", category: "Daily Life" },
        { spanish: "escuchar", english: "to listen", category: "Daily Life" },
        { spanish: "salir", english: "to go out", category: "Daily Life" },
        { spanish: "descansar", english: "to rest", category: "Daily Life" },
        { spanish: "caliente", english: "hot", category: "Daily Life" },
        { spanish: "frío", english: "cold", category: "Daily Life" },
        { spanish: "feliz", english: "happy", category: "Daily Life" },
        { spanish: "nuevo", english: "new", category: "Daily Life" },
        { spanish: "hola", english: "hello", category: "Daily Life" },
        { spanish: "adiós", english: "goodbye", category: "Daily Life" },
        { spanish: "gracias", english: "thank you", category: "Daily Life" },
        { spanish: "siento", english: "sorry / I feel", category: "Daily Life" },
        { spanish: "estás", english: "you are", category: "Daily Life" },
        { spanish: "listos", english: "ready", category: "Daily Life" },
        { spanish: "despierto", english: "awake", category: "Daily Life" },
        { spanish: "tiempo", english: "time", category: "Daily Life" },
        { spanish: "problemas", english: "problems", category: "Daily Life" },
        { spanish: "cambio", english: "change", category: "Daily Life" },
        { spanish: "buenos días", english: "good morning", category: "Daily Life" },
        { spanish: "buenas tardes", english: "good afternoon", category: "Daily Life" },
        { spanish: "buenas noches", english: "good night", category: "Daily Life" },
        { spanish: "bien", english: "well / good", category: "Daily Life" },
        { spanish: "señor", english: "sir", category: "Daily Life" },
        { spanish: "señora", english: "ma'am", category: "Daily Life" },

        // Family
        { spanish: "familia", english: "family", category: "Family" },
        { spanish: "madre", english: "mother", category: "Family" },
        { spanish: "padre", english: "father", category: "Family" },
        { spanish: "hijo", english: "son", category: "Family" },
        { spanish: "hija", english: "daughter", category: "Family" },
        { spanish: "amigo", english: "friend", category: "Family" },
        { spanish: "amiga", english: "friend (female)", category: "Family" },
        { spanish: "hermana", english: "sister", category: "Family" },
        { spanish: "hermanos", english: "brothers", category: "Family" },
        { spanish: "hermanas", english: "sisters", category: "Family" },
        { spanish: "abuela", english: "grandmother", category: "Family" },
        { spanish: "hambre", english: "hunger", category: "Family" },
        { spanish: "tenemos", english: "we have", category: "Family" },
        { spanish: "tienen", english: "they have", category: "Family" },

        // Food & Drink
        { spanish: "agua", english: "water", category: "Food & Drink" },
        { spanish: "comida", english: "food", category: "Food & Drink" },
        { spanish: "café", english: "coffee", category: "Food & Drink" },
        { spanish: "té", english: "tea", category: "Food & Drink" },
        { spanish: "leche", english: "milk", category: "Food & Drink" },
        { spanish: "filete", english: "steak", category: "Food & Drink" },
        { spanish: "papas fritas", english: "french fries", category: "Food & Drink" },
        { spanish: "pan", english: "bread", category: "Food & Drink" },
        { spanish: "cerveza", english: "beer", category: "Food & Drink" },
        { spanish: "huevo", english: "egg", category: "Food & Drink" },
        { spanish: "fruta", english: "fruit", category: "Food & Drink" },
        { spanish: "manzana", english: "apple", category: "Food & Drink" },
        { spanish: "naranja", english: "orange", category: "Food & Drink" },
        { spanish: "plátano", english: "banana", category: "Food & Drink" },
        { spanish: "pollo", english: "chicken", category: "Food & Drink" },
        { spanish: "pescado", english: "fish", category: "Food & Drink" },
        { spanish: "sopa", english: "soup", category: "Food & Drink" },
        { spanish: "ensalada", english: "salad", category: "Food & Drink" },
        { spanish: "arroz", english: "rice", category: "Food & Drink" },
        { spanish: "frijoles", english: "beans", category: "Food & Drink" },
        { spanish: "queso", english: "cheese", category: "Food & Drink" },
        { spanish: "sal", english: "salt", category: "Food & Drink" },

        // Travel
        { spanish: "autobús", english: "bus", category: "Travel" },
        { spanish: "tren", english: "train", category: "Travel" },
        { spanish: "boleto", english: "ticket", category: "Travel" },
        { spanish: "estación", english: "station", category: "Travel" },
        { spanish: "aeropuerto", english: "airport", category: "Travel" },
        { spanish: "casa", english: "house", category: "Travel" },
        { spanish: "escuela", english: "school", category: "Travel" },
        { spanish: "hotel", english: "hotel", category: "Travel" },
        { spanish: "baño", english: "bathroom", category: "Travel" },
        { spanish: "lugar", english: "place", category: "Travel" },

        // Connectors & Pronouns
        { spanish: "y", english: "and", category: "Connectors" },
        { spanish: "o", english: "or", category: "Connectors" },
        { spanish: "con", english: "with", category: "Connectors" },
        { spanish: "sin", english: "without", category: "Connectors" },
        { spanish: "más", english: "more", category: "Connectors" },
        { spanish: "poco", english: "little", category: "Connectors" },
        { spanish: "solo", english: "only", category: "Connectors" },
        { spanish: "muy", english: "very", category: "Connectors" },
        { spanish: "cerca", english: "near", category: "Connectors" },
        { spanish: "para", english: "for", category: "Connectors" },
        { spanish: "a", english: "to", category: "Connectors" },
        { spanish: "en", english: "in", category: "Connectors" },
        { spanish: "ella", english: "she", category: "Connectors" },
        { spanish: "el", english: "he", category: "Connectors" },
        { spanish: "ellos", english: "they", category: "Connectors" },
        { spanish: "su", english: "his / her / their", category: "Connectors" },
        { spanish: "qué", english: "what", category: "Connectors" },
        { spanish: "quién", english: "who", category: "Connectors" },
        { spanish: "cuándo", english: "when", category: "Connectors" },
        { spanish: "cómo", english: "how", category: "Connectors" },
        { spanish: "cuál", english: "which", category: "Connectors" },
        { spanish: "dónde", english: "where", category: "Connectors" },
        { spanish: "no", english: "no / not", category: "Connectors" },
        { spanish: "si", english: "yes", category: "Connectors" },
        { spanish: "hay", english: "there is / there are", category: "Connectors" },
        { spanish: "otra", english: "other / another", category: "Connectors" },
        { spanish: "pesar", english: "despite", category: "Connectors" },
        { spanish: "por favor", english: "please", category: "Connectors" },
        { spanish: "me", english: "myself / to me", category: "Connectors" },
        { spanish: "mi", english: "my", category: "Connectors" },
        { spanish: "un", english: "a / an (masculine)", category: "Connectors" },
        { spanish: "una", english: "a / an (feminine)", category: "Connectors" },
        { spanish: "el", english: "the (masculine)", category: "Connectors" },
        { spanish: "la", english: "the (feminine)", category: "Connectors" },

        // Verbs & Participles
        { spanish: "es", english: "is", category: "Verbs" },
        { spanish: "gusta", english: "likes", category: "Verbs" },
        { spanish: "gustan", english: "they like", category: "Verbs" },
        { spanish: "gustaría", english: "would like", category: "Verbs" },
        { spanish: "aprendiendo", english: "learning", category: "Verbs" },
        { spanish: "arreglando", english: "fixing", category: "Verbs" },
        { spanish: "está", english: "is / you are (formal)", category: "Verbs" },
        { spanish: "quiero", english: "I want", category: "Verbs" },
        { spanish: "tengo", english: "I have", category: "Verbs" },
        { spanish: "necesito", english: "I need", category: "Verbs" },

        // Adjectives
        { spanish: "bueno", english: "good", category: "Adjectives" },
        { spanish: "difícil", english: "difficult", category: "Adjectives" },
        { spanish: "clara", english: "clear", category: "Adjectives" },
        { spanish: "fácil", english: "easy", category: "Adjectives" },
        { spanish: "malo", english: "bad", category: "Adjectives" },
        { spanish: "pequeño", english: "small", category: "Adjectives" },

        // Numbers
        { spanish: "uno", english: "one", category: "Numbers" },
        { spanish: "dos", english: "two", category: "Numbers" },
        { spanish: "tres", english: "three", category: "Numbers" },
        { spanish: "cuatro", english: "four", category: "Numbers" },
        { spanish: "cinco", english: "five", category: "Numbers" },
        { spanish: "seis", english: "six", category: "Numbers" },
        { spanish: "siete", english: "seven", category: "Numbers" },
        { spanish: "ocho", english: "eight", category: "Numbers" },
        { spanish: "nueve", english: "nine", category: "Numbers" },
        { spanish: "diez", english: "ten", category: "Numbers" }
    ],

    A2: [
        // Daily Life
        { spanish: "desayuno", english: "breakfast", category: "Daily Life" },
        { spanish: "almuerzo", english: "lunch", category: "Daily Life" },
        { spanish: "cena", english: "dinner", category: "Daily Life" },
        { spanish: "temprano", english: "early", category: "Daily Life" },
        { spanish: "tarde", english: "late", category: "Daily Life" },
        { spanish: "anoche", english: "last night", category: "Daily Life" },
        { spanish: "ahora", english: "now", category: "Daily Life" },
        { spanish: "minutos", english: "minutes", category: "Daily Life" },
        { spanish: "tarea", english: "homework", category: "Daily Life" },
        { spanish: "mensaje", english: "message", category: "Daily Life" },
        { spanish: "información", english: "information", category: "Daily Life" },
        { spanish: "película", english: "movie", category: "Daily Life" },
        { spanish: "ventana", english: "window", category: "Daily Life" },
        { spanish: "cocina", english: "kitchen", category: "Daily Life" },
        { spanish: "zapatos", english: "shoes", category: "Daily Life" },
        { spanish: "viaje", english: "trip", category: "Daily Life" },
        { spanish: "probar", english: "to try", category: "Daily Life" },
        { spanish: "olvidar", english: "to forget", category: "Daily Life" },
        { spanish: "esperar", english: "to wait", category: "Daily Life" },
        { spanish: "conducir", english: "to drive", category: "Daily Life" },
        { spanish: "arreglar", english: "to fix", category: "Daily Life" },
        { spanish: "irse", english: "to leave", category: "Daily Life" },
        { spanish: "llegar", english: "to arrive", category: "Daily Life" },

        // Family
        { spanish: "padres", english: "parents", category: "Family" },

        // Travel
        { spanish: "avión", english: "plane", category: "Travel" },
        { spanish: "visitar", english: "to visit", category: "Travel" },
        { spanish: "transporte", english: "transport", category: "Travel" },

        // Connectors
        { spanish: "a menudo", english: "often", category: "Connectors" },
        { spanish: "antes", english: "before", category: "Connectors" },
        { spanish: "ya", english: "already", category: "Connectors" },
        { spanish: "todavía", english: "still", category: "Connectors" },
        { spanish: "normalmente", english: "normally", category: "Connectors" },
        { spanish: "porque", english: "because", category: "Connectors" },

        // Numbers
        { spanish: "once", english: "eleven", category: "Numbers" },
        { spanish: "doce", english: "twelve", category: "Numbers" },
        { spanish: "trece", english: "thirteen", category: "Numbers" },
        { spanish: "catorce", english: "fourteen", category: "Numbers" },
        { spanish: "quince", english: "fifteen", category: "Numbers" },
        { spanish: "dieisiete", english: "sixteen", category: "Numbers" },
        { spanish: "diecisiete", english: "seventeen", category: "Numbers" },
        { spanish: "dieciocho", english: "eighteen", category: "Numbers" },
        { spanish: "diecinueve", english: "nineteen", category: "Numbers" },
        { spanish: "veinte", english: "twenty", category: "Numbers" }
    ],

    B1: [
        // Daily Life — auxiliary verbs
        { spanish: "he", english: "I have (auxiliary)", category: "Daily Life" },
        { spanish: "has", english: "you have (auxiliary)", category: "Daily Life" },
        { spanish: "ha", english: "he/she has (auxiliary)", category: "Daily Life" },
        { spanish: "hemos", english: "we have (auxiliary)", category: "Daily Life" },
        { spanish: "habéis", english: "you (plural) have (auxiliary)", category: "Daily Life" },
        { spanish: "han", english: "they have (auxiliary)", category: "Daily Life" },

        // Daily Life — participles
        { spanish: "estado", english: "been", category: "Daily Life" },
        { spanish: "aprendido", english: "learned", category: "Daily Life" },
        { spanish: "trabajando", english: "working", category: "Daily Life" },
        { spanish: "estudiando", english: "studying", category: "Daily Life" },
        { spanish: "leyendo", english: "reading", category: "Daily Life" },
        { spanish: "viviendo", english: "living", category: "Daily Life" },
        { spanish: "diarias", english: "daily", category: "Daily Life" },

        // Daily Life — verbs & nouns
        { spanish: "comunicación", english: "communication", category: "Daily Life" },
        { spanish: "conversaciones", english: "conversations", category: "Daily Life" },
        { spanish: "mejorar", english: "to improve", category: "Daily Life" },
        { spanish: "habilidades", english: "skills", category: "Daily Life" },
        { spanish: "revisar", english: "to review", category: "Daily Life" },
        { spanish: "continuar", english: "to continue", category: "Daily Life" },
        { spanish: "seguir", english: "to follow", category: "Daily Life" },
        { spanish: "preparar", english: "to prepare", category: "Daily Life" },
        { spanish: "conseguir", english: "to get", category: "Daily Life" },
        { spanish: "entender", english: "to understand", category: "Daily Life" },

        // Family & Personal Experience
        { spanish: "experiencias", english: "experiences", category: "Family" },
        { spanish: "pasadas", english: "past", category: "Family" },

        // Food & Drink
        { spanish: "restaurante", english: "restaurant", category: "Food & Drink" },
        { spanish: "menú", english: "menu", category: "Food & Drink" },
        { spanish: "cuenta", english: "bill", category: "Food & Drink" },

        // Travel & Planning Logistics
        { spanish: "encontrar", english: "to find", category: "Travel" },
        { spanish: "cancelar", english: "to cancel", category: "Travel" },
        { spanish: "traer", english: "to bring", category: "Travel" },
        { spanish: "planear", english: "to plan", category: "Travel" },
        { spanish: "mudarse", english: "to move (house)", category: "Travel" },
        { spanish: "unirse", english: "to join", category: "Travel" },

        // Connectors
        { spanish: "mientras", english: "while", category: "Connectors" },
        { spanish: "sin embargo", english: "however", category: "Connectors" },
        { spanish: "sobre", english: "about", category: "Connectors" },
        { spanish: "después", english: "after", category: "Connectors" },
        { spanish: "durante", english: "during", category: "Connectors" },

        // Numbers & Time Scales
        { spanish: "mes", english: "month", category: "Numbers" },
        { spanish: "años", english: "years", category: "Numbers" }
    ],
    B2: [
        // Daily Life — abstract nouns & professional vocabulary
        { spanish: "proceso", english: "process", category: "Daily Life" },
        { spanish: "resultados", english: "results", category: "Daily Life" },
        { spanish: "rendimiento", english: "performance", category: "Daily Life" },
        { spanish: "estrategia", english: "strategy", category: "Daily Life" },
        { spanish: "sistema", english: "system", category: "Daily Life" },
        { spanish: "enfoque", english: "approach", category: "Daily Life" },
        { spanish: "concepto", english: "concept", category: "Daily Life" },
        { spanish: "riesgo", english: "risk", category: "Daily Life" },
        { spanish: "posibilidad", english: "possibility", category: "Daily Life" },
        { spanish: "situación", english: "situation", category: "Daily Life" },

        // Daily Life — advanced verbs
        { spanish: "optimizar", english: "to optimize", category: "Daily Life" },
        { spanish: "coordinar", english: "to coordinate", category: "Daily Life" },
        { spanish: "aumentar", english: "to increase", category: "Daily Life" },
        { spanish: "actualizar", english: "to update", category: "Daily Life" },
        { spanish: "analizar", english: "to analyze", category: "Daily Life" },
        { spanish: "evaluar", english: "to evaluate", category: "Daily Life" },
        { spanish: "discutir", english: "to discuss", category: "Daily Life" },
        { spanish: "aclarar", english: "to clarify", category: "Daily Life" },
        { spanish: "fortalecer", english: "to strengthen", category: "Daily Life" },
        { spanish: "adaptarse", english: "to adapt", category: "Daily Life" },
        { spanish: "lograr", english: "to achieve", category: "Daily Life" },

        // Daily Life — B2 adjectives
        { spanish: "complicado", english: "complicated", category: "Daily Life" },
        { spanish: "necesario", english: "necessary", category: "Daily Life" },
        { spanish: "posible", english: "possible", category: "Daily Life" },
        { spanish: "efectivo", english: "effective", category: "Daily Life" },
        { spanish: "realista", english: "realistic", category: "Daily Life" },
        { spanish: "innovadora", english: "innovative", category: "Daily Life" },
        { spanish: "profesional", english: "professional", category: "Daily Life" },
        { spanish: "positivo", english: "positive", category: "Daily Life" },

        // Daily Life — participles used in B2 sentences
        { spanish: "analizado", english: "analyzed", category: "Daily Life" },
        { spanish: "evaluado", english: "evaluated", category: "Daily Life" },
        { spanish: "argumentado", english: "argued", category: "Daily Life" },
        { spanish: "ampliado", english: "expanded", category: "Daily Life" },
        { spanish: "adaptado", english: "adapted", category: "Daily Life" },
        { spanish: "reducido", english: "reduced", category: "Daily Life" },
        { spanish: "insistido", english: "insisted", category: "Daily Life" },
        { spanish: "explorado", english: "explored", category: "Daily Life" },
        { spanish: "aclarado", english: "clarified", category: "Daily Life" },
        { spanish: "fortalecido", english: "strengthened", category: "Daily Life" },
        { spanish: "discutido", english: "discussed", category: "Daily Life" },
        { spanish: "actualizado", english: "updated", category: "Daily Life" },
        { spanish: "optimizado", english: "optimized", category: "Daily Life" },

        // Family — abstract B2 concepts
        { spanish: "sociedad", english: "society", category: "Family" },
        { spanish: "cultura", english: "culture", category: "Family" },
        { spanish: "motivación", english: "motivation", category: "Family" },
        { spanish: "desafíos", english: "challenges", category: "Family" },
        { spanish: "expectativas", english: "expectations", category: "Family" },

        // Travel — B2 abstract travel concepts
        { spanish: "remoto", english: "remote", category: "Travel" },
        { spanish: "futuro", english: "future", category: "Travel" },
        { spanish: "largo plazo", english: "long term", category: "Travel" },

        // Connectors — B2 logical connectors
        { spanish: "además", english: "in addition", category: "Connectors" },
        { spanish: "por lo tanto", english: "therefore", category: "Connectors" },
        { spanish: "a pesar de", english: "despite", category: "Connectors" },
        { spanish: "aunque", english: "although", category: "Connectors" },
        { spanish: "incluso", english: "even", category: "Connectors" },
        { spanish: "otra vez", english: "again", category: "Connectors" },
        { spanish: "cuidadosamente", english: "carefully", category: "Connectors" }
    ],
};

  

/* ============================================================
   LISTEN VOCAB — A1 → B2 (Category → Word List)
   ============================================================ */
const LISTEN_VOCAB = {
    A1: {
        "Daily Life": [
            "vivir","trabajar","estudiar","leer","libros","hora",
            "levantarse","música","televisión","limpiar","cocinar",
            "abrir","terminar","escribir","aprender","ir","hacer",
            "ver","escuchar","salir","descansar","caliente","frío",
            "feliz","nuevo","hola","adiós","gracias","siento",
            "estás","listos","despierto","tiempo","problemas","cambio",
            "buenos días","buenas tardes","buenas noches","bien","señor","señora"
        ],
        "Family": [
            "familia","madre","padre","hijo","hija","amigo","amiga",
            "hermana","hermanos","hermanas","abuela","hambre",
            "tenemos","tienen"
        ],
        "Food & Drink": [
            "agua","comida","café","té","leche","filete","papas fritas",
            "pan","cerveza","huevo","fruta","manzana","naranja",
            "plátano","pollo","pescado","sopa","ensalada","arroz",
            "frijoles","queso","sal"
        ],
        "Travel": [
            "autobús","tren","boleto","estación","aeropuerto",
            "casa","escuela","hotel","baño","lugar"
        ],
        "Connectors": [
            "y","o","con","sin","más","poco","solo","muy",
            "cerca","para","a","en","qué","quién","cuándo",
            "cómo","cuál","dónde","no","si","hay","otra",
            "pesar","por favor","me","mi","un","una","el","la",
            "ellos","su"
        ],
        "Verbs": [
            "es","gusta","gustan","gustaría","aprendiendo","arreglando",
            "está","quiero","tengo","necesito"
        ],
        "Adjectives": [
            "bueno","difícil","clara","fácil","malo","pequeño"
        ],
        "Numbers": [
            "uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez"
        ]
    },

    A2: {
        "Daily Life": [
            "desayuno","almuerzo","cena","temprano","tarde","anoche",
            "ahora","minutos","tarea","mensaje","información",
            "película","ventana","cocina","zapatos","viaje","probar",
            "olvidar","esperar","conducir","arreglar","irse","llegar"
        ],
        "Family": [],
        "Travel": [
            "avión","visitar","transporte"
        ],
        "Connectors": [
            "a menudo","antes","ya","todavía","normalmente","porque"
        ],
        "Numbers": [
            "once","doce","trece","catorce","quince","dieisiete","diecisiete","dieciocho","diecinueve","veinte"
        ]
    },
    B1: {
        "Daily Life": [
            "he","has","ha","hemos","habéis","han",
            "estado","aprendido","trabajando","estudiando",
            "leyendo","viviendo","diarias",
            "comunicación","conversaciones","mejorar",
            "habilidades","revisar","continuar",
            "seguir","preparar","conseguir","entender"
        ],
        "Family": [
            "experiencias","pasadas"
        ],
        "Food & Drink": [
            "restaurante","menú","cuenta"
        ],
        "Travel": [
            "encontrar","cancelar","traer","planear",
            "mudarse","unirse"
        ],
        "Connectors": [
            "mientras","sin embargo","sobre",
            "después","durante"
        ],
        "Numbers": [
            "mes","años"
        ]
    },

    B2: {
        "Daily Life": [
            "proceso","resultados","rendimiento",
            "estrategia","sistema","enfoque","concepto",
            "riesgo","posibilidad","situación",
            "optimizar","coordinar","aumentar","actualizar",
            "analizar","evaluar","discutir","aclarar",
            "fortalecer","adaptarse","lograr",
            "complicado","necesario","posible","efectivo",
            "realista","innovadora","profesional","positivo",
            "analizado","evaluado","argumentado","ampliado",
            "adaptado","reducido","insistido","explorado",
            "aclarado","fortalecido","discutido","actualizado",
            "optimizado"
        ],
        "Family": [
            "sociedad","cultura","motivación",
            "desafíos","expectativas"
        ],
        "Food & Drink": [],
        "Travel": [
            "remoto","futuro","largo plazo"
        ],
        "Connectors": [
            "además","por lo tanto","a pesar de",
            "aunque","incluso","otra vez","cuidadosamente"
        ],
        "Numbers": []
    }
};

/* ============================================================
   WORD-BY-WORD DICTIONARY — CEFR A1 → B2 (Categorized)
   ============================================================ */

const WORD_DICT = {
    /* ============================================================
       FOUNDATIONAL CONVERSATIONAL ARCHITECTURE (STRUCTURAL TOKENS)
       ============================================================ */
    /* ============================================================
       ENGLISH DIRECT ANCHORS & FUNCTIONAL OVERRIDES
       ============================================================ */
    "can": "puedo / puedes / puede",
    "buy": "comprar",
    "order": "pedir",
    "the": "el / la / los / las",
    "a": "un / una",
    "an": "un / una",
    "is": "es / está",
    "are": "son / están",
    "want": "quiero / quiere / queremos / quieren",
    "need": "necesito / necesita / necesitamos / necesitan",

    /* ============================================================
       VERB INFLECTION MATRIX (SUBJECT LOOPS)
       ============================================================ */
    "puedo": "I can",
    "puedes": "you can (informal)",
    "puede": "he / she / you (formal) can",
    "podemos": "we can",
    "pueden": "they / you all can",
    "quieres": "you want (informal)",
    "necesitas": "you need (informal)",
    "tienes": "you have (informal)",
    "haces": "you do / you make",
    "compro": "I buy",
    "compras": "you buy",
    "pido": "I order / I request",
    "pides": "you order",

    /* ============================================================
       ADJECTIVE AGREEMENT AGREEMENTS (GENDER & PLURAL)
       ============================================================ */
    "buena": "good (fem.)",
    "buenos": "good (plural)",
    "buenas": "good (fem. plural)",
    "mala": "bad (fem.)",
    "malos": "bad (plural)",
    "malas": "bad (fem. plural)",
    "nueva": "new (fem.)",
    "nuevos": "new (plural)",
    "nuevas": "new (fem. plural)",
    "pequeña": "small (fem.)",
    "pequeños": "small (plural)",
    "pequeñas": "small (fem. plural)",
    "fría": "cold (fem.)",
    "fríos": "cold (plural)",
    "frías": "cold (fem. plural)",
    "grandes": "big / large (plural)",
    "altos": "tall (plural)",
    "altas": "tall (fem. plural)",
    "limpia": "clean (fem.)",
    "limpios": "clean (plural)",

    /* ============================
       Functional Connectors
       ============================ */
    "y": "and",
    "o": "or",
    "con": "with",
    "sin": "without",
    "más": "more",
    "poco": "little",
    "solo": "only / alone",
    "muy": "very",
    "cerca": "near",
    "para": "for",
    "a": "to",
    "en": "in / on",
    "por": "for / by",
    "de": "of / from",
    "al": "to the",
    "del": "of the",
    "pero": "but",
    "porque": "because",
    "también": "also",
    "entonces": "then",
    "si": "yes / if",
    "hay": "there is / there are",
    "otra": "other / another",
    "otro": "other / another (masc.)",
    "otras": "other / another (plural)",
    "otros": "other / another (masc. plural)",
    "pesar": "despite",
    "a pesar de": "despite",
    "favor": "favor",
    "por favor": "please",
    "mientras": "while",
    "sin embargo": "however",
    "sobre": "about / on top of",
    "después": "after",
    "durante": "during",
    "además": "in addition / furthermore",
    "por lo tanto": "therefore",
    "aunque": "although",
    "incluso": "even",
    "otra vez": "again",

    /* ============================
       Question Roots & Interrogatives
       ============================ */
    "qué": "what",
    "quién": "who",
    "cuándo": "when",
    "cómo": "how",
    "cuál": "which",
    "dónde": "where",
    "por qué": "why",

    /* ============================
       Grammatical Definite & Indefinite Articles
       ============================ */
    "el": "the",
    "la": "the",
    "los": "the (plural)",
    "las": "the (fem. plural)",
    "un": "a / an",
    "una": "a / an (fem.)",
    "unos": "some",
    "unas": "some (fem.)",
    /* ============================
       Pronouns & Object Markers
       =========================== */
    "me": "me / myself",
    "te": "you / yourself",
    "le": "to him / to her",
    "nos": "us / ourselves",
    "les": "to them",
    "lo": "it / him",
    "la_pronoun": "it / her",
    "los_pronoun": "them (masc.)",
    "las_pronoun": "them (fem.)",
    "que": "that / which",
    "él": "he",
    "ella": "she",
    "yo": "I",
    "tú": "you (informal)",
    "nosotros": "we",
    "nosotras": "we (fem.)",
    "ellos": "they",
    "ellas": "they (fem.)",
    "ustedes": "you all",
    "mi": "my",
    "mis": "my (plural)",
    "su": "his / her / their / your",
    "sus": "his / her / their / your (plural)",
    "tu": "your (possessive)",
    "tus": "your (possessive plural)",
    "esto": "this (neutral)",
    "este": "this (masc.)",
    "esta": "this (fem.)",
    "ese": "that (masc.)",
    "esa": "that (fem.)",
    "algo": "something",
    "todo": "everything / all",
    "todas": "all (fem. plural)",
    "todos": "all (masc. plural)",

    /* ============================
       High-Frequency Verb Inflections (A1-B2)
       ============================ */
    "es": "is",
    "soy": "I am",
    "eres": "you are",
    "somos": "we are",
    "son": "they are / you all are",
    "estoy": "I am (state/location)",
    "está": "is / you are (formal)",
    "estás": "you are (informal)",
    "estamos": "we are (state/location)",
    "están": "they are / you all are (state/location)",
    "fue": "was / went (past)",
    "era": "was (descriptive past)",
    "quiero": "I want",
    "quiere": "he / she wants",
    "queremos": "we want",
    "quieren": "they want / you all want",
    "necesito": "I need",
    "necesita": "he / she needs",
    "necesitamos": "we need",
    "necesitan": "they need",
    "tengo": "I have",
    "tiene": "he / she has",
    "tenemos": "we have",
    "tienen": "they have",
    "hambre": "hunger (as in 'tengo hambre')",
    "gusta": "likes / pleasing to",
    "gustan": "they like / pleasing to (plural)",
    "gustaría": "would like",
    "me gustaría": "I would like",
    "vivo": "I live",
    "viven": "they live",
    "trabaja": "he / she works",
    "trabajando": "working",
    "estudiando": "studying",
    "aprendiendo": "learning",
    "arreglando": "fixing",
    "leyendo": "reading",
    "viviendo": "living",
    "esperando": "waiting",
    "viendo": "watching / seeing",
    "hablando": "talking / speaking",
    "cocinando": "cooking",
    "conduciendo": "driving",
    "planeando": "planning",
    "desayunando": "eating breakfast",
    "llega": "arrives / he or she arrives",
    "llegamos": "we arrived",
    "llegarán": "they will arrive",
    "llegue": "I arrive / he or she arrives (subjunctive)",
    "abre": "opens",
    "sugirió": "suggested",
    "argumentaron": "argued",
    "terminaron": "they finished",
    "insistió": "insisted",
    "explicó": "explained",
    "pidió": "asked for / requested",
    "ayudara": "helped / would help (subjunctive)",
    "planean": "they plan",
    "adaptarnos": "to adapt ourselves",
    "prepararnos": "to prepare ourselves",
    "tendrá": "he / she will have",
    "serán": "they will be",
    "completó": "completed",
    "visitó": "visited",
    "olvidó": "forgot",
    "llamó": "called",
    "compré": "I bought",
    "limpié": "I cleaned",
    "escribí": "I wrote",
    "estudiaré": "I will study",
    "ayudaré": "I will help",
    "continuaremos": "we will continue",
    "comeremos": "we will eat",
    "irnos": "to leave / to go away",

    /* ============================
       Time, Chronology & Adverbs
       ============================ */
    "hoy": "today",
    "mañana": "tomorrow / morning",
    "ayer": "yesterday",
    "anoche": "last night",
    "ahora": "now",
    "siempre": "always",
    "nunca": "never",
    "ya": "already / now",
    "todavía": "still / yet",
    "normalmente": "normally",
    "pronto": "soon",
    "tarde": "late / afternoon",
    "temprano": "early",
    "a menudo": "often",
    "más tarde": "later",
    "esta noche": "tonight",
    "a las nueve": "at nine",
    "claramente": "clearly",
    "lentamente": "slowly",
    /* ============================
       Gender & Plural Adjective Maps
       ============================ */
    "bueno": "good",
    "buena": "good (fem.)",
    "buenos": "good (plural)",
    "buenas": "good (fem. plural)",
    "malo": "bad",
    "mala": "bad (fem.)",
    "malos": "bad (plural)",
    "malas": "bad (fem. plural)",
    "nuevo": "new",
    "nueva": "new (fem.)",
    "nuevos": "new (plural)",
    "nuevas": "new (fem. plural)",
    "pequeño": "small",
    "pequeña": "small (fem.)",
    "pequeños": "small (plural)",
    "pequeña_plural": "small (fem. plural)",
    "caliente": "hot",
    "calientes": "hot (plural)",
    "frío": "cold",
    "fría": "cold (fem.)",
    "fríos": "cold (plural)",
    "frías": "cold (fem. plural)",
    "feliz": "happy",
    "felices": "happy (plural)",
    "difícil": "difficult",
    "difíciles": "difficult (plural)",
    "fácil": "easy",
    "fáciles": "easy (plural)",
    "clara": "clear / bright (fem.)",
    "claro": "clear / bright (masc.)",
    "claros": "clear (plural)",
    "claras": "clear (fem. plural)",
    "grande": "big / large",
    "grandes": "big / large (plural)",
    "alto": "tall / high",
    "alta": "tall (fem.)",
    "altos": "tall (plural)",
    "altas": "tall (fem. plural)",
    "deliciosa": "delicious (fem.)",
    "delicioso": "delicious (masc.)",
    "amable": "kind / nice",
    "amables": "kind / nice (plural)",
    "limpia": "clean (fem.)",
    "limpio": "clean (masc.)",
    "roja": "red (fem.)",
    "rojo": "red (masc.)",
    "retrasado": "delayed / late",
    "retrasada": "delayed (fem.)",
    "realista": "realistic",
    "realistas": "realistic (plural)",
    "profesional": "professional",
    "profesionales": "professional (plural)",
    "innovadora": "innovative (fem.)",
    "innovador": "innovative (masc.)",
    "innecesarios": "unnecessary (plural)",
    "innecesario": "unnecessary",
    "arriesgada": "risky (fem.)",
    "arriesgado": "risky (masc.)",
    "capaz": "capable",
    "capaces": "capable (plural)",
    "efectivo": "effective",
    "efectiva": "effective (fem.)",
    "positivo": "positive",
    "positiva": "positive (fem.)",
    "positivos": "positive (plural)",
    "complicado": "complicated",
    "complicada": "complicated (fem.)",
    "importante": "important",
    "importantes": "important (plural)",
    "diferente": "different",
    "diferentes": "different (plural)",
    "mejor": "better",
    "mejores": "better / best (plural)",
    "excelente": "excellent",
    "excelentes": "excellent (plural)",
    "posible": "possible",
    "posibles": "possible (plural)",
    "próximo": "next",
    "próxima": "next (fem.)",

    /* ============================
       A2 Intermediate Core Numbers
       ============================ */
    "once": "eleven",
    "doce": "twelve",
    "trece": "thirteen",
    "catorce": "fourteen",
    "quince": "fifteen",
    "dieisiete": "sixteen",
    "diecisiete": "seventeen",
    "dieciocho": "eighteen",
    "diecinueve": "nineteen",
    "veinte": "twenty"
}; // ✔ Safely closes the master WORD_DICT map shell container

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
   MULTI-WORD PHRASES (CEFR-aligned)
   ============================================================ */
const CEFR_PHRASES = {
    // A1
    "cómo estás": "how are you",
    "dónde vives": "where do you live",
    "qué hora es": "what time is it",
    "te gusta el café": "you like coffee",
    "me gusta la música": "I like music",
    "vivo en la ciudad": "I live in the city",
    "trabajo en un hotel": "I work in a hotel",
    "quiero comer": "I want to eat",
    "quiero beber": "I want to drink",
    "dónde está el baño": "where is the bathroom",
    "ella corre rápido": "she runs fast",
    "ella es rápida": "she is fast",
    "ella va rápido": "she goes fast",

    // A2
    "qué hiciste ayer": "what did you do yesterday",
    "fuiste al supermercado": "did you go to the supermarket",
    "viajas a menudo": "you travel often",
    "qué compraste": "what did you buy",
    "qué estás haciendo": "what are you doing",
    "sueles comer temprano": "you usually eat early",
    "necesito ayuda": "I need help",
    "quiero hacer una reserva": "I want to make a reservation",
    "dónde está la estación": "where is the station",

    // B1
    "he estado aprendiendo español": "I have been learning Spanish",
    "disfruto viajar": "I enjoy traveling",
    "quiero mejorar mis habilidades": "I want to improve my skills",
    "qué piensas de la ciudad": "what do you think of the city",
    "cómo mantienes una vida saludable": "how do you maintain a healthy life",
    "qué aprendiste recientemente": "what did you learn recently",
    "cuáles son tus metas": "what are your goals",
    "qué experiencias pasadas tienes": "what past experiences do you have",

    // B2
    "cómo manejas situaciones estresantes": "how do you handle stressful situations",
    "cuál es tu opinión sobre la tecnología": "what is your opinion on technology",
    "cómo ha cambiado tu vida": "how has your life changed",
    "qué desafíos enfrentas": "what challenges do you face",
    "qué esperas lograr": "what do you hope to achieve",
    "qué piensas del futuro": "what do you think about the future",
    "cómo ves la sociedad actual": "how do you see modern society",
    "cuál es tu perspectiva": "what is your perspective"
};

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
   CEFR SENTENCE CHOICES — FULL PACK (A1 → B2)
   ============================================================ */

const CEFR_SENTENCE_CHOICES = {

    /* ============================
       A1 — Beginner
       ============================ */

    A1: [    {
        english: "I’m a bit tired today.",
        correct: { es: "estoy un poco cansado hoy", en: "I’m a bit tired today." },
        options: [
            { es: "estoy un poco cansado hoy", en: "I’m a bit tired today." },
            { es: "estoy muy ocupado hoy", en: "I’m really busy today." },
            { es: "estoy muy contento hoy", en: "I’m really happy today." }
        ]
    },
    {
        english: "The room’s nice and clean.",
        correct: { es: "la habitación está limpia", en: "The room’s nice and clean." },
        options: [
            { es: "la habitación está limpia", en: "The room’s nice and clean." },
            { es: "la habitación está sucia", en: "The room’s dirty." },
            { es: "la habitación está vacía", en: "The room’s empty." }
        ]
    },
    {
        english: "She’s my mum.",
        correct: { es: "ella es mi madre", en: "She’s my mum." },
        options: [
            { es: "ella es mi madre", en: "She’s my mum." },
            { es: "ella es mi hermana", en: "She’s my sister." },
            { es: "ella es mi amiga", en: "She’s my friend." }
        ]
    },
    {
        english: "We’re at home right now.",
        correct: { es: "estamos en casa ahora", en: "We’re at home right now." },
        options: [
            { es: "estamos en casa ahora", en: "We’re at home right now." },
            { es: "estamos en el trabajo ahora", en: "We’re at work right now." },
            { es: "estamos en la tienda ahora", en: "We’re at the shop right now." }
        ]
    },
    {
        english: "He likes his water cold.",
        correct: { es: "a él le gusta el agua fría", en: "He likes his water cold." },
        options: [
            { es: "a él le gusta el agua fría", en: "He likes his water cold." },
            { es: "a él le gusta el agua caliente", en: "He likes his water hot." },
            { es: "a él le gusta el agua dulce", en: "He likes sweet water." }
        ]
    },
    {
        english: "The bus is running late.",
        correct: { es: "el autobús llega tarde", en: "The bus is running late." },
        options: [
            { es: "el autobús llega tarde", en: "The bus is running late." },
            { es: "el autobús llega temprano", en: "The bus is arriving early." },
            { es: "el autobús no funciona", en: "The bus isn’t working." }
        ]
    },
    {
        english: "My mate is really nice.",
        correct: { es: "mi amigo es muy amable", en: "My mate is really nice." },
        options: [
            { es: "mi amigo es muy amable", en: "My mate is really nice." },
            { es: "mi amigo es muy serio", en: "My mate is very serious." },
            { es: "mi amigo es muy ruidoso", en: "My mate is very loud." }
        ]
    },
    {
        english: "The shop is close by.",
        correct: { es: "la tienda está cerca", en: "The shop is close by." },
        options: [
            { es: "la tienda está cerca", en: "The shop is close by." },
            { es: "la tienda está lejos", en: "The shop is far away." },
            { es: "la tienda está cerrada", en: "The shop is closed." }
        ]
    },
    {
        english: "The food tastes really good.",
        correct: { es: "la comida sabe muy bien", en: "The food tastes really good." },
        options: [
            { es: "la comida sabe muy bien", en: "The food tastes really good." },
            { es: "la comida sabe mal", en: "The food tastes bad." },
            { es: "la comida está fría", en: "The food is cold." }
        ]
    },
    {
        english: "I’m learning Spanish.",
        correct: { es: "estoy aprendiendo español", en: "I’m learning Spanish." },
        options: [
            { es: "estoy aprendiendo español", en: "I’m learning Spanish." },
            { es: "estoy aprendiendo inglés", en: "I’m learning English." },
            { es: "estoy aprendiendo francés", en: "I’m learning French." }
        ]
    },
    {
        english: "The weather’s pretty warm today.",
        correct: { es: "el clima está cálido hoy", en: "The weather’s pretty warm today." },
        options: [
            { es: "el clima está cálido hoy", en: "The weather’s pretty warm today." },
            { es: "el clima está frío hoy", en: "The weather’s cold today." },
            { es: "el clima está lluvioso hoy", en: "The weather’s rainy today." }
        ]
    },
    {
        english: "She’s at the park.",
        correct: { es: "ella está en el parque", en: "She’s at the park." },
        options: [
            { es: "ella está en el parque", en: "She’s at the park." },
            { es: "ella está en la escuela", en: "She’s at school." },
            { es: "ella está en casa", en: "She’s at home." }
        ]
    },
    {
        english: "I need a bit of help.",
        correct: { es: "necesito un poco de ayuda", en: "I need a bit of help." },
        options: [
            { es: "necesito un poco de ayuda", en: "I need a bit of help." },
            { es: "necesito un poco de agua", en: "I need a bit of water." },
            { es: "necesito un poco de tiempo", en: "I need a bit of time." }
        ]
    },
    {
        english: "The dog is very friendly.",
        correct: { es: "el perro es muy amigable", en: "The dog is very friendly." },
        options: [
            { es: "el perro es muy amigable", en: "The dog is very friendly." },
            { es: "el perro es muy ruidoso", en: "The dog is very loud." },
            { es: "el perro es muy pequeño", en: "The dog is very small." }
        ]
    },
    {
        english: "We’re having dinner now.",
        correct: { es: "estamos cenando ahora", en: "We’re having dinner now." },
        options: [
            { es: "estamos cenando ahora", en: "We’re having dinner now." },
            { es: "estamos desayunando ahora", en: "We’re having breakfast now." },
            { es: "estamos trabajando ahora", en: "We’re working now." }
        ]
    },
    {
        english: "The car is very new.",
        correct: { es: "el coche es muy nuevo", en: "The car is very new." },
        options: [
            { es: "el coche es muy nuevo", en: "The car is very new." },
            { es: "el coche es muy viejo", en: "The car is very old." },
            { es: "el coche es muy rápido", en: "The car is very fast." }
        ]
    },
    {
        english: "I’m going to the shop.",
        correct: { es: "voy a la tienda", en: "I’m going to the shop." },
        options: [
            { es: "voy a la tienda", en: "I’m going to the shop." },
            { es: "voy a la escuela", en: "I’m going to school." },
            { es: "voy al parque", en: "I’m going to the park." }
        ]
    },
    {
        english: "She’s drinking coffee.",
        correct: { es: "ella está tomando café", en: "She’s drinking coffee." },
        options: [
            { es: "ella está tomando café", en: "She’s drinking coffee." },
            { es: "ella está tomando té", en: "She’s drinking tea." },
            { es: "ella está tomando agua", en: "She’s drinking water." }
        ]
    },
    {
        english: "The house is pretty big.",
        correct: { es: "la casa es bastante grande", en: "The house is pretty big." },
        options: [
            { es: "la casa es bastante grande", en: "The house is pretty big." },
            { es: "la casa es bastante pequeña", en: "The house is pretty small." },
            { es: "la casa es bastante vieja", en: "The house is pretty old." }
        ]
    },
    {
            english: "I’m feeling really good today.",
            correct: { es: "me siento muy bien hoy", en: "I’m feeling really good today." },
            options: [
                { es: "me siento muy bien hoy", en: "I’m feeling really good today." },
                { es: "me siento muy mal hoy", en: "I’m feeling really bad today." },
                { es: "me siento muy cansado hoy", en: "I’m feeling really tired today." }
            ]
        },

        /* ===== A1 PART 2 (joined cleanly) ===== */

        {
            english: "She’s reading a book.",
            correct: { es: "ella está leyendo un libro", en: "She’s reading a book." },
            options: [
                { es: "ella está leyendo un libro", en: "She’s reading a book." },
                { es: "ella está escribiendo un libro", en: "She’s writing a book." },
                { es: "ella está comprando un libro", en: "She’s buying a book." }
            ]
        },
    {
        english: "I’m cooking dinner.",
        correct: { es: "estoy cocinando la cena", en: "I’m cooking dinner." },
        options: [
            { es: "estoy cocinando la cena", en: "I’m cooking dinner." },
            { es: "estoy comiendo la cena", en: "I’m eating dinner." },
            { es: "estoy preparando el desayuno", en: "I’m making breakfast." }
        ]
    },
    {
        english: "The street is very quiet.",
        correct: { es: "la calle está muy tranquila", en: "The street is very quiet." },
        options: [
            { es: "la calle está muy tranquila", en: "The street is very quiet." },
            { es: "la calle está muy ruidosa", en: "The street is very noisy." },
            { es: "la calle está muy ocupada", en: "The street is very busy." }
        ]
    },
    {
        english: "We’re watching a movie.",
        correct: { es: "estamos viendo una película", en: "We’re watching a movie." },
        options: [
            { es: "estamos viendo una película", en: "We’re watching a movie." },
            { es: "estamos haciendo una película", en: "We’re making a movie." },
            { es: "estamos comprando una película", en: "We’re buying a movie." }
        ]
    },
    {
        english: "The water is really cold.",
        correct: { es: "el agua está muy fría", en: "The water is really cold." },
        options: [
            { es: "el agua está muy fría", en: "The water is really cold." },
            { es: "el agua está muy caliente", en: "The water is really hot." },
            { es: "el agua está muy sucia", en: "The water is really dirty." }
        ]
    },
    {
        english: "I’m walking to the park.",
        correct: { es: "estoy caminando al parque", en: "I’m walking to the park." },
        options: [
            { es: "estoy caminando al parque", en: "I’m walking to the park." },
            { es: "estoy caminando a la tienda", en: "I’m walking to the shop." },
            { es: "estoy caminando a casa", en: "I’m walking home." }
        ]
    },
    {
        english: "He’s talking to his mate.",
        correct: { es: "él está hablando con su amigo", en: "He’s talking to his mate." },
        options: [
            { es: "él está hablando con su amigo", en: "He’s talking to his mate." },
            { es: "él está hablando con su madre", en: "He’s talking to his mum." },
            { es: "él está hablando con su jefe", en: "He’s talking to his boss." }
        ]
    },
    {
        english: "The coffee smells great.",
        correct: { es: "el café huele muy bien", en: "The coffee smells great." },
        options: [
            { es: "el café huele muy bien", en: "The coffee smells great." },
            { es: "el café huele mal", en: "The coffee smells bad." },
            { es: "el café está frío", en: "The coffee is cold." }
        ]
    },
    {
        english: "I’m buying some fruit.",
        correct: { es: "estoy comprando fruta", en: "I’m buying some fruit." },
        options: [
            { es: "estoy comprando fruta", en: "I’m buying some fruit." },
            { es: "estoy comprando pan", en: "I’m buying bread." },
            { es: "estoy comprando leche", en: "I’m buying milk." }
        ]
    },
    {
        english: "She’s wearing a red shirt.",
        correct: { es: "ella lleva una camisa roja", en: "She’s wearing a red shirt." },
        options: [
            { es: "ella lleva una camisa roja", en: "She’s wearing a red shirt." },
            { es: "ella lleva una camisa azul", en: "She’s wearing a blue shirt." },
            { es: "ella lleva una camisa blanca", en: "She’s wearing a white shirt." }
        ]
    },
    {
        english: "The kids are playing outside.",
        correct: { es: "los niños están jugando afuera", en: "The kids are playing outside." },
        options: [
            { es: "los niños están jugando afuera", en: "The kids are playing outside." },
            { es: "los niños están durmiendo", en: "The kids are sleeping." },
            { es: "los niños están comiendo", en: "The kids are eating." }
        ]
    },
    {
        english: "I’m cleaning the kitchen.",
        correct: { es: "estoy limpiando la cocina", en: "I’m cleaning the kitchen." },
        options: [
            { es: "estoy limpiando la cocina", en: "I’m cleaning the kitchen." },
            { es: "estoy limpiando el baño", en: "I’m cleaning the bathroom." },
            { es: "estoy limpiando mi habitación", en: "I’m cleaning my room." }
        ]
    },
    {
        english: "The sun is shining.",
        correct: { es: "el sol está brillando", en: "The sun is shining." },
        options: [
            { es: "el sol está brillando", en: "The sun is shining." },
            { es: "el sol está escondido", en: "The sun is hidden." },
            { es: "el sol está bajando", en: "The sun is going down." }
        ]
    },
    {
        english: "We’re waiting for the bus.",
        correct: { es: "estamos esperando el autobús", en: "We’re waiting for the bus." },
        options: [
            { es: "estamos esperando el autobús", en: "We’re waiting for the bus." },
            { es: "estamos esperando el tren", en: "We’re waiting for the train." },
            { es: "estamos esperando a un amigo", en: "We’re waiting for a mate." }
        ]
    },
    {
        english: "I’m writing a message.",
        correct: { es: "estoy escribiendo un mensaje", en: "I’m writing a message." },
        options: [
            { es: "estoy escribiendo un mensaje", en: "I’m writing a message." },
            { es: "estoy leyendo un mensaje", en: "I’m reading a message." },
            { es: "estoy borrando un mensaje", en: "I’m deleting a message." }
        ]
    },
    {
        english: "The shop is open now.",
        correct: { es: "la tienda está abierta ahora", en: "The shop is open now." },
        options: [
            { es: "la tienda está abierta ahora", en: "The shop is open now." },
            { es: "la tienda está cerrada ahora", en: "The shop is closed now." },
            { es: "la tienda está muy ocupada", en: "The shop is really busy." }
        ]
    },
    {
        english: "She’s listening to music.",
        correct: { es: "ella está escuchando música", en: "She’s listening to music." },
        options: [
            { es: "ella está escuchando música", en: "She’s listening to music." },
            { es: "ella está cantando música", en: "She’s singing music." },
            { es: "ella está bailando", en: "She’s dancing." }
        ]
    },
    {
        english: "I’m drinking some juice.",
        correct: { es: "estoy tomando jugo", en: "I’m drinking some juice." },
        options: [
            { es: "estoy tomando jugo", en: "I’m drinking some juice." },
            { es: "estoy tomando agua", en: "I’m drinking water." },
            { es: "estoy tomando café", en: "I’m drinking coffee." }
        ]
    },
    {
        english: "The bag is very heavy.",
        correct: { es: "la bolsa es muy pesada", en: "The bag is very heavy." },
        options: [
            { es: "la bolsa es muy pesada", en: "The bag is very heavy." },
            { es: "la bolsa es muy ligera", en: "The bag is very light." },
            { es: "la bolsa es muy pequeña", en: "The bag is very small." }
        ]
    },
       {
        english: "We’re walking together.",
        correct: { es: "estamos caminando juntos", en: "We’re walking together." },
        options: [
            { es: "estamos caminando juntos", en: "We’re walking together." },
            { es: "estamos corriendo juntos", en: "We’re running together." },
            { es: "estamos hablando juntos", en: "We’re talking together." }
        ]
    }
],   // ← CLEAN END OF A1 ARRAY

/* ============================
   A2 — Elementary
   ============================ */

A2: [
    {
        english: "We’re planning a trip next week.",
        correct: { es: "estamos planeando un viaje la próxima semana", en: "We’re planning a trip next week." },
        options: [
            { es: "estamos planeando un viaje la próxima semana", en: "We’re planning a trip next week." },
            { es: "estamos cancelando un viaje la próxima semana", en: "We’re cancelling a trip next week." },
            { es: "estamos recordando un viaje la próxima semana", en: "We’re remembering a trip next week." }
        ]
    },

    {
        english: "I forgot my keys at home.",
        correct: { es: "olvidé mis llaves en casa", en: "I forgot my keys at home." },
        options: [
            { es: "olvidé mis llaves en casa", en: "I forgot my keys at home." },
            { es: "perdí mis llaves en casa", en: "I lost my keys at home." },
            { es: "dejé mis llaves en el coche", en: "I left my keys in the car." }
        ]
    },
    {
        english: "They’re cooking dinner together.",
        correct: { es: "ellos están cocinando la cena juntos", en: "They’re cooking dinner together." },
        options: [
            { es: "ellos están cocinando la cena juntos", en: "They’re cooking dinner together." },
            { es: "ellos están comiendo la cena juntos", en: "They’re eating dinner together." },
            { es: "ellos están limpiando juntos", en: "They’re cleaning together." }
        ]
    },
    {
        english: "She often arrives late.",
        correct: { es: "ella llega tarde a menudo", en: "She often arrives late." },
        options: [
            { es: "ella llega tarde a menudo", en: "She often arrives late." },
            { es: "ella llega temprano a menudo", en: "She often arrives early." },
            { es: "ella llega cansada a menudo", en: "She often arrives tired." }
        ]
    },
    {
        english: "We’ll visit the market tomorrow.",
        correct: { es: "visitaremos el mercado mañana", en: "We’ll visit the market tomorrow." },
        options: [
            { es: "visitaremos el mercado mañana", en: "We’ll visit the market tomorrow." },
            { es: "visitaremos la tienda mañana", en: "We’ll visit the shop tomorrow." },
            { es: "visitaremos el parque mañana", en: "We’ll visit the park tomorrow." }
        ]
    },
    {
        english: "I’m listening to a new song.",
        correct: { es: "estoy escuchando una canción nueva", en: "I’m listening to a new song." },
        options: [
            { es: "estoy escuchando una canción nueva", en: "I’m listening to a new song." },
            { es: "estoy cantando una canción nueva", en: "I’m singing a new song." },
            { es: "estoy escribiendo una canción nueva", en: "I’m writing a new song." }
        ]
    },
    {
        english: "She bought fresh fruit this morning.",
        correct: { es: "ella compró fruta fresca esta mañana", en: "She bought fresh fruit this morning." },
        options: [
            { es: "ella compró fruta fresca esta mañana", en: "She bought fresh fruit this morning." },
            { es: "ella vendió fruta fresca esta mañana", en: "She sold fresh fruit this morning." },
            { es: "ella cocinó fruta fresca esta mañana", en: "She cooked fresh fruit this morning." }
        ]
    },
    {
        english: "We’re waiting for our food.",
        correct: { es: "estamos esperando nuestra comida", en: "We’re waiting for our food." },
        options: [
            { es: "estamos esperando nuestra comida", en: "We’re waiting for our food." },
            { es: "estamos comiendo nuestra comida", en: "We’re eating our food." },
            { es: "estamos preparando nuestra comida", en: "We’re preparing our food." }
        ]
    },
    {
        english: "He’s driving to work right now.",
        correct: { es: "él está conduciendo al trabajo ahora", en: "He’s driving to work right now." },
        options: [
            { es: "él está conduciendo al trabajo ahora", en: "He’s driving to work right now." },
            { es: "él está caminando al trabajo ahora", en: "He’s walking to work right now." },
            { es: "él está durmiendo ahora", en: "He’s sleeping right now." }
        ]
    },
    {
        english: "I’ll call you later today.",
        correct: { es: "te llamaré más tarde hoy", en: "I’ll call you later today." },
        options: [
            { es: "te llamaré más tarde hoy", en: "I’ll call you later today." },
            { es: "te veré más tarde hoy", en: "I’ll see you later today." },
            { es: "te escribiré más tarde hoy", en: "I’ll message you later today." }
        ]
    },
    {
        english: "She’s cleaning the house right now.",
        correct: { es: "ella está limpiando la casa ahora", en: "She’s cleaning the house right now." },
        options: [
            { es: "ella está limpiando la casa ahora", en: "She’s cleaning the house right now." },
            { es: "ella está cocinando ahora", en: "She’s cooking right now." },
            { es: "ella está descansando ahora", en: "She’s resting right now." }
        ]
    },
    {
        english: "We usually eat dinner at six.",
        correct: { es: "normalmente cenamos a las seis", en: "We usually eat dinner at six." },
        options: [
            { es: "normalmente cenamos a las seis", en: "We usually eat dinner at six." },
            { es: "normalmente desayunamos a las seis", en: "We usually eat breakfast at six." },
            { es: "normalmente salimos a las seis", en: "We usually go out at six." }
        ]
    },
    {
        english: "I’m trying a new recipe today.",
        correct: { es: "estoy probando una receta nueva hoy", en: "I’m trying a new recipe today." },
        options: [
            { es: "estoy probando una receta nueva hoy", en: "I’m trying a new recipe today." },
            { es: "estoy leyendo una receta nueva hoy", en: "I’m reading a new recipe today." },
            { es: "estoy comprando una receta nueva hoy", en: "I’m buying a new recipe today." }
        ]
    },
    {
        english: "She’s writing an email.",
        correct: { es: "ella está escribiendo un correo", en: "She’s writing an email." },
        options: [
            { es: "ella está escribiendo un correo", en: "She’s writing an email." },
            { es: "ella está leyendo un correo", en: "She’s reading an email." },
            { es: "ella está borrando un correo", en: "She’s deleting an email." }
        ]
    },
    {
        english: "We arrived early this morning.",
        correct: { es: "llegamos temprano esta mañana", en: "We arrived early this morning." },
        options: [
            { es: "llegamos temprano esta mañana", en: "We arrived early this morning." },
            { es: "llegamos tarde esta mañana", en: "We arrived late this morning." },
            { es: "llegamos cansados esta mañana", en: "We arrived tired this morning." }
        ]
    },
    {
        english: "He’s watching the news.",
        correct: { es: "él está viendo las noticias", en: "He’s watching the news." },
        options: [
            { es: "él está viendo las noticias", en: "He’s watching the news." },
            { es: "él está leyendo las noticias", en: "He’s reading the news." },
            { es: "él está escuchando las noticias", en: "He’s listening to the news." }
        ]
    },
    {
        english: "I’ll meet you at the café.",
        correct: { es: "te veré en el café", en: "I’ll meet you at the café." },
        options: [
            { es: "te veré en el café", en: "I’ll meet you at the café." },
            { es: "te veré en el parque", en: "I’ll meet you at the park." },
            { es: "te veré en la tienda", en: "I’ll meet you at the shop." }
        ]
    },
    {
        english: "She’s learning new words every day.",
        correct: { es: "ella está aprendiendo palabras nuevas cada día", en: "She’s learning new words every day." },
        options: [
            { es: "ella está aprendiendo palabras nuevas cada día", en: "She’s learning new words every day." },
            { es: "ella está olvidando palabras cada día", en: "She’s forgetting words every day." },
            { es: "ella está enseñando palabras cada día", en: "She’s teaching words every day." }
        ]
    },
    {
        english: "We’re looking for a good restaurant.",
        correct: { es: "estamos buscando un buen restaurante", en: "We’re looking for a good restaurant." },
        options: [
            { es: "estamos buscando un buen restaurante", en: "We’re looking for a good restaurant." },
            { es: "estamos buscando un buen hotel", en: "We’re looking for a good hotel." },
            { es: "estamos buscando un buen parque", en: "We’re looking for a good park." }
        ]
    },
    {
        english: "I’m finishing my work now.",
        correct: { es: "estoy terminando mi trabajo ahora", en: "I’m finishing my work now." },
        options: [
            { es: "estoy terminando mi trabajo ahora", en: "I’m finishing my work now." },
            { es: "estoy empezando mi trabajo ahora", en: "I’m starting my work now." },
            { es: "estoy dejando mi trabajo ahora", en: "I’m leaving my work now." }
        ]
    },
    
    /* ===== A2 PART 2 (joined cleanly) ===== */

    {
        english: "She’s visiting her mum today.",
        correct: { es: "ella está visitando a su madre hoy", en: "She’s visiting her mum today." },
        options: [
            { es: "ella está visitando a su madre hoy", en: "She’s visiting her mum today." },
            { es: "ella está visitando a su amiga hoy", en: "She’s visiting her friend today." },
            { es: "ella está visitando a su hermana hoy", en: "She’s visiting her sister today." }
        ]
    },
    {
        english: "We’re having lunch at the market.",
        correct: { es: "estamos almorzando en el mercado", en: "We’re having lunch at the market." },
        options: [
            { es: "estamos almorzando en el mercado", en: "We’re having lunch at the market." },
            { es: "estamos desayunando en el mercado", en: "We’re having breakfast at the market." },
            { es: "estamos cenando en el mercado", en: "We’re having dinner at the market." }
        ]
    },
    {
        english: "He forgot his phone at work.",
        correct: { es: "él olvidó su teléfono en el trabajo", en: "He forgot his phone at work." },
        options: [
            { es: "él olvidó su teléfono en el trabajo", en: "He forgot his phone at work." },
            { es: "él perdió su teléfono en el trabajo", en: "He lost his phone at work." },
            { es: "él dejó su teléfono en casa", en: "He left his phone at home." }
        ]
    },
    {
        english: "I’m cooking early today.",
        correct: { es: "estoy cocinando temprano hoy", en: "I’m cooking early today." },
        options: [
            { es: "estoy cocinando temprano hoy", en: "I’m cooking early today." },
            { es: "estoy cocinando tarde hoy", en: "I’m cooking late today." },
            { es: "estoy cocinando ahora", en: "I’m cooking right now." }
        ]
    },
    {
        english: "She’s waiting outside.",
        correct: { es: "ella está esperando afuera", en: "She’s waiting outside." },
        options: [
            { es: "ella está esperando afuera", en: "She’s waiting outside." },
            { es: "ella está esperando adentro", en: "She’s waiting inside." },
            { es: "ella está esperando en casa", en: "She’s waiting at home." }
        ]
    },
    {
        english: "We’ll eat together later.",
        correct: { es: "comeremos juntos más tarde", en: "We’ll eat together later." },
        options: [
            { es: "comeremos juntos más tarde", en: "We’ll eat together later." },
            { es: "desayunaremos juntos más tarde", en: "We’ll have breakfast together later." },
            { es: "cenaremos juntos más tarde", en: "We’ll have dinner together later." }
        ]
    },
    {
        english: "I’m learning new phrases now.",
        correct: { es: "estoy aprendiendo frases nuevas ahora", en: "I’m learning new phrases now." },
        options: [
            { es: "estoy aprendiendo frases nuevas ahora", en: "I’m learning new phrases now." },
            { es: "estoy aprendiendo palabras nuevas ahora", en: "I’m learning new words now." },
            { es: "estoy aprendiendo números ahora", en: "I’m learning numbers now." }
        ]
    },
    {
        english: "He’s cleaning the kitchen again.",
        correct: { es: "él está limpiando la cocina otra vez", en: "He’s cleaning the kitchen again." },
        options: [
            { es: "él está limpiando la cocina otra vez", en: "He’s cleaning the kitchen again." },
            { es: "él está limpiando el baño otra vez", en: "He’s cleaning the bathroom again." },
            { es: "él está limpiando su habitación otra vez", en: "He’s cleaning his room again." }
        ]
    },
    {
        english: "We arrived late yesterday.",
        correct: { es: "llegamos tarde ayer", en: "We arrived late yesterday." },
        options: [
            { es: "llegamos tarde ayer", en: "We arrived late yesterday." },
            { es: "llegamos temprano ayer", en: "We arrived early yesterday." },
            { es: "llegamos cansados ayer", en: "We arrived tired yesterday." }
        ]
    },
    {
        english: "She’s buying fresh bread.",
        correct: { es: "ella está comprando pan fresco", en: "She’s buying fresh bread." },
        options: [
            { es: "ella está comprando pan fresco", en: "She’s buying fresh bread." },
            { es: "ella está comprando fruta fresca", en: "She’s buying fresh fruit." },
            { es: "ella está comprando café fresco", en: "She’s buying fresh coffee." }
        ]
    },
    {
        english: "I’ll call my mate later.",
        correct: { es: "llamaré a mi amigo más tarde", en: "I’ll call my mate later." },
        options: [
            { es: "llamaré a mi amigo más tarde", en: "I’ll call my mate later." },
            { es: "veré a mi amigo más tarde", en: "I’ll see my mate later." },
            { es: "visitaré a mi amigo más tarde", en: "I’ll visit my mate later." }
        ]
    },
    {
        english: "We’re visiting the shop now.",
        correct: { es: "estamos visitando la tienda ahora", en: "We’re visiting the shop now." },
        options: [
            { es: "estamos visitando la tienda ahora", en: "We’re visiting the shop now." },
            { es: "estamos visitando el mercado ahora", en: "We’re visiting the market now." },
            { es: "estamos visitando el parque ahora", en: "We’re visiting the park now." }
        ]
    },
    {
        english: "She’s drinking cold water.",
        correct: { es: "ella está tomando agua fría", en: "She’s drinking cold water." },
        options: [
            { es: "ella está tomando agua fría", en: "She’s drinking cold water." },
            { es: "ella está tomando agua caliente", en: "She’s drinking hot water." },
            { es: "ella está tomando jugo frío", en: "She’s drinking cold juice." }
        ]
    },
    {
        english: "I’m finishing my coffee.",
        correct: { es: "estoy terminando mi café", en: "I’m finishing my coffee." },
        options: [
            { es: "estoy terminando mi café", en: "I’m finishing my coffee." },
            { es: "estoy tomando mi café", en: "I’m drinking my coffee." },
            { es: "estoy preparando mi café", en: "I’m preparing my coffee." }
        ]
    },
    {
        english: "We’re eating together now.",
        correct: { es: "estamos comiendo juntos ahora", en: "We’re eating together now." },
        options: [
            { es: "estamos comiendo juntos ahora", en: "We’re eating together now." },
            { es: "estamos cocinando juntos ahora", en: "We’re cooking together now." },
            { es: "estamos limpiando juntos ahora", en: "We’re cleaning together now." }
        ]
    },
    {
        english: "She arrived early today.",
        correct: { es: "ella llegó temprano hoy", en: "She arrived early today." },
        options: [
            { es: "ella llegó temprano hoy", en: "She arrived early today." },
            { es: "ella llegó tarde hoy", en: "She arrived late today." },
            { es: "ella llegó cansada hoy", en: "She arrived tired today." }
        ]
    },
    {
        english: "I’m visiting my mum tomorrow.",
        correct: { es: "voy a visitar a mi madre mañana", en: "I’m visiting my mum tomorrow." },
        options: [
            { es: "voy a visitar a mi madre mañana", en: "I’m visiting my mum tomorrow." },
            { es: "voy a visitar a mi amigo mañana", en: "I’m visiting my mate tomorrow." },
            { es: "voy a visitar a mi hermana mañana", en: "I’m visiting my sister tomorrow." }
        ]
    },
    {
        english: "We’re learning together today.",
        correct: { es: "estamos aprendiendo juntos hoy", en: "We’re learning together today." },
        options: [
            { es: "estamos aprendiendo juntos hoy", en: "We’re learning together today." },
            { es: "estamos leyendo juntos hoy", en: "We’re reading together today." },
            { es: "estamos escribiendo juntos hoy", en: "We’re writing together today." }
        ]
    },
   {
        english: "She’s finishing her work now.",
        correct: { es: "ella está terminando su trabajo ahora", en: "She’s finishing her work now." },
        options: [
            { es: "ella está terminando su trabajo ahora", en: "She’s finishing her work now." },
            { es: "ella está empezando su trabajo ahora", en: "She’s starting her work now." },
            { es: "ella está dejando su trabajo ahora", en: "She’s leaving her work now." }
        ]
    }
],   // ← CLEAN END OF A2 ARRAY

/* ============================
   B1 — Intermediate
   ============================ */

B1: [
    {
        english: "We need to explain the plan clearly.",
        correct: { es: "necesitamos explicar el plan claramente", en: "We need to explain the plan clearly." },
        options: [
            { es: "necesitamos explicar el plan claramente", en: "We need to explain the plan clearly." },
            { es: "necesitamos cambiar el plan claramente", en: "We need to change the plan clearly." },
            { es: "necesitamos olvidar el plan claramente", en: "We need to forget the plan clearly." },
            { es: "necesitamos revisar el plan claramente", en: "We need to review the plan clearly." }
        ]
    },
    {
        english: "She prefers to work in a quiet place.",
        correct: { es: "ella prefiere trabajar en un lugar tranquilo", en: "She prefers to work in a quiet place." },
        options: [
            { es: "ella prefiere trabajar en un lugar tranquilo", en: "She prefers to work in a quiet place." },
            { es: "ella prefiere trabajar en un lugar ruidoso", en: "She prefers to work in a noisy place." },
            { es: "ella prefiere trabajar en un lugar pequeño", en: "She prefers to work in a small place." },
            { es: "ella prefiere trabajar en un lugar frío", en: "She prefers to work in a cold place." }
        ]
    },
    {
        english: "I decided to take the earlier bus.",
        correct: { es: "decidí tomar el autobús más temprano", en: "I decided to take the earlier bus." },
        options: [
            { es: "decidí tomar el autobús más temprano", en: "I decided to take the earlier bus." },
            { es: "decidí tomar el autobús más tarde", en: "I decided to take the later bus." },
            { es: "decidí tomar el autobús equivocado", en: "I decided to take the wrong bus." },
            { es: "decidí tomar el autobús correcto", en: "I decided to take the correct bus." }
        ]
    },
    {
        english: "We’re preparing a simple dinner tonight.",
        correct: { es: "estamos preparando una cena sencilla esta noche", en: "We’re preparing a simple dinner tonight." },
        options: [
            { es: "estamos preparando una cena sencilla esta noche", en: "We’re preparing a simple dinner tonight." },
            { es: "estamos preparando una cena grande esta noche", en: "We’re preparing a big dinner tonight." },
            { es: "estamos preparando una cena fría esta noche", en: "We’re preparing a cold dinner tonight." },
            { es: "estamos preparando una cena nueva esta noche", en: "We’re preparing a new dinner tonight." }
        ]
    },
    {
        english: "He explained the problem very well.",
        correct: { es: "él explicó el problema muy bien", en: "He explained the problem very well." },
        options: [
            { es: "él explicó el problema muy bien", en: "He explained the problem very well." },
            { es: "él olvidó el problema muy bien", en: "He forgot the problem very well." },
            { es: "él cambió el problema muy bien", en: "He changed the problem very well." },
            { es: "él revisó el problema muy bien", en: "He reviewed the problem very well." }
        ]
    },
    {
        english: "I’m trying to improve my Spanish every day.",
        correct: { es: "estoy tratando de mejorar mi español cada día", en: "I’m trying to improve my Spanish every day." },
        options: [
            { es: "estoy tratando de mejorar mi español cada día", en: "I’m trying to improve my Spanish every day." },
            { es: "estoy tratando de olvidar mi español cada día", en: "I’m trying to forget my Spanish every day." },
            { es: "estoy tratando de cambiar mi español cada día", en: "I’m trying to change my Spanish every day." },
            { es: "estoy tratando de enseñar mi español cada día", en: "I’m trying to teach my Spanish every day." }
        ]
    },
    {
        english: "She described the place in great detail.",
        correct: { es: "ella describió el lugar con mucho detalle", en: "She described the place in great detail." },
        options: [
            { es: "ella describió el lugar con mucho detalle", en: "She described the place in great detail." },
            { es: "ella olvidó el lugar con mucho detalle", en: "She forgot the place in great detail." },
            { es: "ella cambió el lugar con mucho detalle", en: "She changed the place in great detail." },
            { es: "ella revisó el lugar con mucho detalle", en: "She reviewed the place in great detail." }
        ]
    },
    {
        english: "We chose the restaurant because it’s quiet.",
        correct: { es: "elegimos el restaurante porque es tranquilo", en: "We chose the restaurant because it’s quiet." },
        options: [
            { es: "elegimos el restaurante porque es tranquilo", en: "We chose the restaurant because it’s quiet." },
            { es: "elegimos el restaurante porque es ruidoso", en: "We chose the restaurant because it’s noisy." },
            { es: "elegimos el restaurante porque es caro", en: "We chose the restaurant because it’s expensive." },
            { es: "elegimos el restaurante porque es pequeño", en: "We chose the restaurant because it’s small." }
        ]
    },
    {
        english: "He suggested a different idea.",
        correct: { es: "él sugirió una idea diferente", en: "He suggested a different idea." },
        options: [
            { es: "él sugirió una idea diferente", en: "He suggested a different idea." },
            { es: "él olvidó una idea diferente", en: "He forgot a different idea." },
            { es: "él rechazó una idea diferente", en: "He rejected a different idea." },
            { es: "él cambió una idea diferente", en: "He changed a different idea." }
        ]
    },
    {
        english: "I can’t imagine living in a cold place.",
        correct: { es: "no puedo imaginar vivir en un lugar frío", en: "I can’t imagine living in a cold place." },
        options: [
            { es: "no puedo imaginar vivir en un lugar frío", en: "I can’t imagine living in a cold place." },
            { es: "no puedo imaginar vivir en un lugar cálido", en: "I can’t imagine living in a warm place." },
            { es: "no puedo imaginar vivir en un lugar caro", en: "I can’t imagine living in an expensive place." },
            { es: "no puedo imaginar vivir en un lugar pequeño", en: "I can’t imagine living in a small place." }
        ]
    },
    {
        english: "We continued walking until we found the café.",
        correct: { es: "continuamos caminando hasta que encontramos el café", en: "We continued walking until we found the café." },
        options: [
            { es: "continuamos caminando hasta que encontramos el café", en: "We continued walking until we found the café." },
            { es: "continuamos caminando hasta que encontramos la tienda", en: "We continued walking until we found the shop." },
            { es: "continuamos caminando hasta que encontramos el parque", en: "We continued walking until we found the park." },
            { es: "continuamos caminando hasta que encontramos la casa", en: "We continued walking until we found the house." }
        ]
    },
    {
        english: "She explained why she arrived late.",
        correct: { es: "ella explicó por qué llegó tarde", en: "She explained why she arrived late." },
        options: [
            { es: "ella explicó por qué llegó tarde", en: "She explained why she arrived late." },
            { es: "ella explicó por qué llegó temprano", en: "She explained why she arrived early." },
            { es: "ella explicó por qué llegó cansada", en: "She explained why she arrived tired." },
            { es: "ella explicó por qué llegó feliz", en: "She explained why she arrived happy." }
        ]
    },
    {
        english: "I prefer to study in the morning.",
        correct: { es: "prefiero estudiar por la mañana", en: "I prefer to study in the morning." },
        options: [
            { es: "prefiero estudiar por la mañana", en: "I prefer to study in the morning." },
            { es: "prefiero estudiar por la tarde", en: "I prefer to study in the afternoon." },
            { es: "prefiero estudiar por la noche", en: "I prefer to study at night." },
            { es: "prefiero estudiar en casa", en: "I prefer to study at home." }
        ]
    },
    {
        english: "We’re trying to choose a good time.",
        correct: { es: "estamos tratando de elegir un buen momento", en: "We’re trying to choose a good time." },
        options: [
            { es: "estamos tratando de elegir un buen momento", en: "We’re trying to choose a good time." },
            { es: "estamos tratando de elegir un mal momento", en: "We’re trying to choose a bad time." },
            { es: "estamos tratando de elegir un momento temprano", en: "We’re trying to choose an early time." },
            { es: "estamos tratando de elegir un momento tarde", en: "We’re trying to choose a late time." }
        ]
    },
    {
        english: "He described the problem again.",
        correct: { es: "él describió el problema otra vez", en: "He described the problem again." },
        options: [
            { es: "él describió el problema otra vez", en: "He described the problem again." },
            { es: "él olvidó el problema otra vez", en: "He forgot the problem again." },
            { es: "él cambió el problema otra vez", en: "He changed the problem again." },
            { es: "él revisó el problema otra vez", en: "He reviewed the problem again." }
        ]
    },
    {
        english: "I’m preparing something simple for lunch.",
        correct: { es: "estoy preparando algo sencillo para el almuerzo", en: "I’m preparing something simple for lunch." },
        options: [
            { es: "estoy preparando algo sencillo para el almuerzo", en: "I’m preparing something simple for lunch." },
            { es: "estoy preparando algo grande para el almuerzo", en: "I’m preparing something big for lunch." },
            { es: "estoy preparando algo frío para el almuerzo", en: "I’m preparing something cold for lunch." },
            { es: "estoy preparando algo nuevo para el almuerzo", en: "I’m preparing something new for lunch." }
        ]
    },
    {
        english: "She continued talking for a long time.",
        correct: { es: "ella continuó hablando por mucho tiempo", en: "She continued talking for a long time." },
        options: [
            { es: "ella continuó hablando por mucho tiempo", en: "She continued talking for a long time." },
            { es: "ella continuó caminando por mucho tiempo", en: "She continued walking for a long time." },
            { es: "ella continuó leyendo por mucho tiempo", en: "She continued reading for a long time." },
            { es: "ella continuó escribiendo por mucho tiempo", en: "She continued writing for a long time." }
        ]
    },
    {
        english: "We chose this place because it’s comfortable.",
        correct: { es: "elegimos este lugar porque es cómodo", en: "We chose this place because it’s comfortable." },
        options: [
            { es: "elegimos este lugar porque es cómodo", en: "We chose this place because it’s comfortable." },
            { es: "elegimos este lugar porque es caro", en: "We chose this place because it’s expensive." },
            { es: "elegimos este lugar porque es frío", en: "We chose this place because it’s cold." },
            { es: "elegimos este lugar porque es pequeño", en: "We chose this place because it’s small." }
        ]
    },
       {
        english: "He suggested meeting a bit earlier.",
        correct: { es: "él sugirió reunirse un poco más temprano", en: "He suggested meeting a bit earlier." },
        options: [
            { es: "él sugirió reunirse un poco más temprano", en: "He suggested meeting a bit earlier." },
            { es: "él sugirió reunirse un poco más tarde", en: "He suggested meeting a bit later." },
            { es: "él sugirió reunirse en casa", en: "He suggested meeting at home." },
            { es: "él sugirió reunirse en el parque", en: "He suggested meeting at the park." }
        ]
    },

    /* ===== B1 PART 2 (joined cleanly) ===== */

    {
        english: "She explained the idea in a simple way.",
        correct: { es: "ella explicó la idea de una manera sencilla", en: "She explained the idea in a simple way." },
        options: [
            { es: "ella explicó la idea de una manera sencilla", en: "She explained the idea in a simple way." },
            { es: "ella explicó la idea de una manera difícil", en: "She explained the idea in a difficult way." },
            { es: "ella explicó la idea de una manera rápida", en: "She explained the idea in a fast way." },
            { es: "ella explicó la idea de una manera lenta", en: "She explained the idea in a slow way." }
        ]
    },

    {
        english: "We’re trying to improve the plan a little.",
        correct: { es: "estamos tratando de mejorar el plan un poco", en: "We’re trying to improve the plan a little." },
        options: [
            { es: "estamos tratando de mejorar el plan un poco", en: "We’re trying to improve the plan a little." },
            { es: "estamos tratando de cambiar el plan un poco", en: "We’re trying to change the plan a little." },
            { es: "estamos tratando de olvidar el plan un poco", en: "We’re trying to forget the plan a little." },
            { es: "estamos tratando de revisar el plan un poco", en: "We’re trying to review the plan a little." }
        ]
    },
    {
        english: "He suggested taking a short break.",
        correct: { es: "él sugirió tomar un descanso corto", en: "He suggested taking a short break." },
        options: [
            { es: "él sugirió tomar un descanso corto", en: "He suggested taking a short break." },
            { es: "él sugirió tomar un descanso largo", en: "He suggested taking a long break." },
            { es: "él sugirió tomar un descanso frío", en: "He suggested taking a cold break." },
            { es: "él sugirió tomar un descanso temprano", en: "He suggested taking an early break." }
        ]
    },
    {
        english: "I can’t imagine choosing another place.",
        correct: { es: "no puedo imaginar elegir otro lugar", en: "I can’t imagine choosing another place." },
        options: [
            { es: "no puedo imaginar elegir otro lugar", en: "I can’t imagine choosing another place." },
            { es: "no puedo imaginar elegir este lugar", en: "I can’t imagine choosing this place." },
            { es: "no puedo imaginar elegir un lugar pequeño", en: "I can’t imagine choosing a small place." },
            { es: "no puedo imaginar elegir un lugar caro", en: "I can’t imagine choosing an expensive place." }
        ]
    },
    {
        english: "She described the restaurant as very comfortable.",
        correct: { es: "ella describió el restaurante como muy cómodo", en: "She described the restaurant as very comfortable." },
        options: [
            { es: "ella describió el restaurante como muy cómodo", en: "She described the restaurant as very comfortable." },
            { es: "ella describió el restaurante como muy caro", en: "She described the restaurant as very expensive." },
            { es: "ella describió el restaurante como muy frío", en: "She described the restaurant as very cold." },
            { es: "ella describió el restaurante como muy pequeño", en: "She described the restaurant as very small." }
        ]
    },
    {
        english: "We continued talking until it got late.",
        correct: { es: "continuamos hablando hasta que se hizo tarde", en: "We continued talking until it got late." },
        options: [
            { es: "continuamos hablando hasta que se hizo tarde", en: "We continued talking until it got late." },
            { es: "continuamos hablando hasta que se hizo temprano", en: "We continued talking until it got early." },
            { es: "continuamos hablando hasta que se hizo frío", en: "We continued talking until it got cold." },
            { es: "continuamos hablando hasta que se hizo cómodo", en: "We continued talking until it got comfortable." }
        ]
    },
    {
        english: "He explained the reason very clearly.",
        correct: { es: "él explicó la razón muy claramente", en: "He explained the reason very clearly." },
        options: [
            { es: "él explicó la razón muy claramente", en: "He explained the reason very clearly." },
            { es: "él explicó la razón muy lentamente", en: "He explained the reason very slowly." },
            { es: "él explicó la razón muy rápidamente", en: "He explained the reason very quickly." },
            { es: "él explicó la razón muy mal", en: "He explained the reason very badly." }
        ]
    },
    {
        english: "I prefer to walk when the weather is warm.",
        correct: { es: "prefiero caminar cuando el clima está cálido", en: "I prefer to walk when the weather is warm." },
        options: [
            { es: "prefiero caminar cuando el clima está cálido", en: "I prefer to walk when the weather is warm." },
            { es: "prefiero caminar cuando el clima está frío", en: "I prefer to walk when the weather is cold." },
            { es: "prefiero caminar cuando el clima está lluvioso", en: "I prefer to walk when the weather is rainy." },
            { es: "prefiero caminar cuando el clima está caro", en: "I prefer to walk when the weather is expensive." }
        ]
    },
    {
        english: "We’re preparing everything for tomorrow.",
        correct: { es: "estamos preparando todo para mañana", en: "We’re preparing everything for tomorrow." },
        options: [
            { es: "estamos preparando todo para mañana", en: "We’re preparing everything for tomorrow." },
            { es: "estamos preparando todo para hoy", en: "We’re preparing everything for today." },
            { es: "estamos preparando todo para la tarde", en: "We’re preparing everything for the afternoon." },
            { es: "estamos preparando todo para la noche", en: "We’re preparing everything for tonight." }
        ]
    },
    {
        english: "She suggested choosing a quieter place.",
        correct: { es: "ella sugirió elegir un lugar más tranquilo", en: "She suggested choosing a quieter place." },
        options: [
            { es: "ella sugirió elegir un lugar más tranquilo", en: "She suggested choosing a quieter place." },
            { es: "ella sugirió elegir un lugar más ruidoso", en: "She suggested choosing a noisier place." },
            { es: "ella sugirió elegir un lugar más caro", en: "She suggested choosing a more expensive place." },
            { es: "ella sugirió elegir un lugar más pequeño", en: "She suggested choosing a smaller place." }
        ]
    },
    {
        english: "I’m trying to describe the problem clearly.",
        correct: { es: "estoy tratando de describir el problema claramente", en: "I’m trying to describe the problem clearly." },
        options: [
            { es: "estoy tratando de describir el problema claramente", en: "I’m trying to describe the problem clearly." },
            { es: "estoy tratando de describir el problema lentamente", en: "I’m trying to describe the problem slowly." },
            { es: "estoy tratando de describir el problema rápidamente", en: "I’m trying to describe the problem quickly." },
            { es: "estoy tratando de describir el problema mal", en: "I’m trying to describe the problem badly." }
        ]
    },
    {
        english: "We continued walking until we reached the shop.",
        correct: { es: "continuamos caminando hasta que llegamos a la tienda", en: "We continued walking until we reached the shop." },
        options: [
            { es: "continuamos caminando hasta que llegamos a la tienda", en: "We continued walking until we reached the shop." },
            { es: "continuamos caminando hasta que llegamos al parque", en: "We continued walking until we reached the park." },
            { es: "continuamos caminando hasta que llegamos al café", en: "We continued walking until we reached the café." },
            { es: "continuamos caminando hasta que llegamos a la casa", en: "We continued walking until we reached the house." }
        ]
    },
    {
        english: "He described the place as warm and comfortable.",
        correct: { es: "él describió el lugar como cálido y cómodo", en: "He described the place as warm and comfortable." },
        options: [
            { es: "él describió el lugar como cálido y cómodo", en: "He described the place as warm and comfortable." },
            { es: "él describió el lugar como frío y cómodo", en: "He described the place as cold and comfortable." },
            { es: "él describió el lugar como cálido y caro", en: "He described the place as warm and expensive." },
            { es: "él describió el lugar como cálido y pequeño", en: "He described the place as warm and small." }
        ]
    },
    {
        english: "I decided to choose the earlier time.",
        correct: { es: "decidí elegir el momento más temprano", en: "I decided to choose the earlier time." },
        options: [
            { es: "decidí elegir el momento más temprano", en: "I decided to choose the earlier time." },
            { es: "decidí elegir el momento más tarde", en: "I decided to choose the later time." },
            { es: "decidí elegir el momento más frío", en: "I decided to choose the colder time." },
            { es: "decidí elegir el momento más caro", en: "I decided to choose the more expensive time." }
        ]
    },
    {
        english: "She explained the plan again.",
        correct: { es: "ella explicó el plan otra vez", en: "She explained the plan again." },
        options: [
            { es: "ella explicó el plan otra vez", en: "She explained the plan again." },
            { es: "ella cambió el plan otra vez", en: "She changed the plan again." },
            { es: "ella olvidó el plan otra vez", en: "She forgot the plan again." },
            { es: "ella revisó el plan otra vez", en: "She reviewed the plan again." }
        ]
    },
    {
        english: "We’re preparing something warm for dinner.",
        correct: { es: "estamos preparando algo cálido para la cena", en: "We’re preparing something warm for dinner." },
        options: [
            { es: "estamos preparando algo cálido para la cena", en: "We’re preparing something warm for dinner." },
            { es: "estamos preparando algo frío para la cena", en: "We’re preparing something cold for dinner." },
            { es: "estamos preparando algo caro para la cena", en: "We’re preparing something expensive for dinner." },
            { es: "estamos preparando algo pequeño para la cena", en: "We’re preparing something small for dinner." }
        ]
    },
    {
        english: "He continued explaining for a long time.",
        correct: { es: "él continuó explicando por mucho tiempo", en: "He continued explaining for a long time." },
        options: [
            { es: "él continuó explicando por mucho tiempo", en: "He continued explaining for a long time." },
            { es: "él continuó leyendo por mucho tiempo", en: "He continued reading for a long time." },
            { es: "él continuó escribiendo por mucho tiempo", en: "He continued writing for a long time." },
            { es: "él continuó caminando por mucho tiempo", en: "He continued walking for a long time." }
        ]
    },
        {
        english: "I prefer to choose a simple option.",
        correct: { es: "prefiero elegir una opción sencilla", en: "I prefer to choose a simple option." },
        options: [
            { es: "prefiero elegir una opción sencilla", en: "I prefer to choose a simple option." },
            { es: "prefiero elegir una opción cara", en: "I prefer to choose an expensive option." },
            { es: "prefiero elegir una opción fría", en: "I prefer to choose a cold option." },
            { es: "prefiero elegir una opción pequeña", en: "I prefer to choose a small option." }
        ]
    }
],   // ← CLEAN END OF B1 ARRAY

/* ============================
   B2 — Upper Intermediate
   ============================ */

B2: [
    {
        english: "We need to consider all the details before deciding.",
        correct: { es: "necesitamos considerar todos los detalles antes de decidir", en: "We need to consider all the details before deciding." },
        options: [
            { es: "necesitamos considerar todos los detalles antes de decidir", en: "We need to consider all the details before deciding." },
            { es: "necesitamos ignorar todos los detalles antes de decidir", en: "We need to ignore all the details before deciding." },
            { es: "necesitamos cambiar todos los detalles antes de decidir", en: "We need to change all the details before deciding." },
            { es: "necesitamos revisar todos los detalles antes de decidir", en: "We need to review all the details before deciding." }
        ]
    },

    {
        english: "She realised the problem was more complex than expected.",
        correct: { es: "ella se dio cuenta de que el problema era más complejo de lo esperado", en: "She realised the problem was more complex than expected." },
        options: [
            { es: "ella se dio cuenta de que el problema era más complejo de lo esperado", en: "She realised the problem was more complex than expected." },
            { es: "ella se dio cuenta de que el problema era más simple de lo esperado", en: "She realised the problem was simpler than expected." },
            { es: "ella se dio cuenta de que el problema era más corto de lo esperado", en: "She realised the problem was shorter than expected." },
            { es: "ella se dio cuenta de que el problema era más caro de lo esperado", en: "She realised the problem was more expensive than expected." }
        ]
    },
    {
        english: "We’re organising everything so the day runs smoothly.",
        correct: { es: "estamos organizando todo para que el día vaya bien", en: "We’re organising everything so the day runs smoothly." },
        options: [
            { es: "estamos organizando todo para que el día vaya bien", en: "We’re organising everything so the day runs smoothly." },
            { es: "estamos organizando todo para que el día vaya mal", en: "We’re organising everything so the day goes badly." },
            { es: "estamos organizando todo para que el día sea corto", en: "We’re organising everything so the day is short." },
            { es: "estamos organizando todo para que el día sea caro", en: "We’re organising everything so the day is expensive." }
        ]
    },
    {
        english: "He managed to finish the task on time.",
        correct: { es: "él logró terminar la tarea a tiempo", en: "He managed to finish the task on time." },
        options: [
            { es: "él logró terminar la tarea a tiempo", en: "He managed to finish the task on time." },
            { es: "él logró terminar la tarea tarde", en: "He managed to finish the task late." },
            { es: "él logró terminar la tarea mal", en: "He managed to finish the task badly." },
            { es: "él logró terminar la tarea temprano", en: "He managed to finish the task early." }
        ]
    },
    {
        english: "I recommend choosing a quieter place for the meeting.",
        correct: { es: "recomiendo elegir un lugar más tranquilo para la reunión", en: "I recommend choosing a quieter place for the meeting." },
        options: [
            { es: "recomiendo elegir un lugar más tranquilo para la reunión", en: "I recommend choosing a quieter place for the meeting." },
            { es: "recomiendo elegir un lugar más ruidoso para la reunión", en: "I recommend choosing a noisier place for the meeting." },
            { es: "recomiendo elegir un lugar más caro para la reunión", en: "I recommend choosing a more expensive place for the meeting." },
            { es: "recomiendo elegir un lugar más pequeño para la reunión", en: "I recommend choosing a smaller place for the meeting." }
        ]
    },
    {
        english: "We discussed several options before making a decision.",
        correct: { es: "discutimos varias opciones antes de tomar una decisión", en: "We discussed several options before making a decision." },
        options: [
            { es: "discutimos varias opciones antes de tomar una decisión", en: "We discussed several options before making a decision." },
            { es: "discutimos varias opciones después de tomar una decisión", en: "We discussed several options after making a decision." },
            { es: "discutimos varias opciones sin tomar una decisión", en: "We discussed several options without making a decision." },
            { es: "discutimos varias opciones para evitar una decisión", en: "We discussed several options to avoid a decision." }
        ]
    },
    {
        english: "She recognised the place from a photo.",
        correct: { es: "ella reconoció el lugar por una foto", en: "She recognised the place from a photo." },
        options: [
            { es: "ella reconoció el lugar por una foto", en: "She recognised the place from a photo." },
            { es: "ella reconoció el lugar por un mensaje", en: "She recognised the place from a message." },
            { es: "ella reconoció el lugar por una llamada", en: "She recognised the place from a call." },
            { es: "ella reconoció el lugar por una historia", en: "She recognised the place from a story." }
        ]
    },
    {
        english: "We analysed the problem and found a simple solution.",
        correct: { es: "analizamos el problema y encontramos una solución sencilla", en: "We analysed the problem and found a simple solution." },
        options: [
            { es: "analizamos el problema y encontramos una solución sencilla", en: "We analysed the problem and found a simple solution." },
            { es: "analizamos el problema y encontramos una solución cara", en: "We analysed the problem and found an expensive solution." },
            { es: "analizamos el problema y encontramos una solución fría", en: "We analysed the problem and found a cold solution." },
            { es: "analizamos el problema y encontramos una solución pequeña", en: "We analysed the problem and found a small solution." }
        ]
    },
    {
        english: "He realised he needed more time to prepare.",
        correct: { es: "él se dio cuenta de que necesitaba más tiempo para prepararse", en: "He realised he needed more time to prepare." },
        options: [
            { es: "él se dio cuenta de que necesitaba más tiempo para prepararse", en: "He realised he needed more time to prepare." },
            { es: "él se dio cuenta de que necesitaba menos tiempo para prepararse", en: "He realised he needed less time to prepare." },
            { es: "él se dio cuenta de que necesitaba tiempo frío para prepararse", en: "He realised he needed cold time to prepare." },
            { es: "él se dio cuenta de que necesitaba tiempo caro para prepararse", en: "He realised he needed expensive time to prepare." }
        ]
    },
    {
        english: "We’re trying to organise the day more efficiently.",
        correct: { es: "estamos tratando de organizar el día de manera más eficiente", en: "We’re trying to organise the day more efficiently." },
        options: [
            { es: "estamos tratando de organizar el día de manera más eficiente", en: "We’re trying to organise the day more efficiently." },
            { es: "estamos tratando de organizar el día de manera más lenta", en: "We’re trying to organise the day more slowly." },
            { es: "estamos tratando de organizar el día de manera más cara", en: "We’re trying to organise the day more expensively." },
            { es: "estamos tratando de organizar el día de manera más fría", en: "We’re trying to organise the day more coldly." }
        ]
    },
    {
        english: "She compared the two options carefully.",
        correct: { es: "ella comparó las dos opciones cuidadosamente", en: "She compared the two options carefully." },
        options: [
            { es: "ella comparó las dos opciones cuidadosamente", en: "She compared the two options carefully." },
            { es: "ella comparó las dos opciones rápidamente", en: "She compared the two options quickly." },
            { es: "ella comparó las dos opciones mal", en: "She compared the two options badly." },
            { es: "ella comparó las dos opciones lentamente", en: "She compared the two options slowly." }
        ]
    },
    {
        english: "We expect the meeting to finish early.",
        correct: { es: "esperamos que la reunión termine temprano", en: "We expect the meeting to finish early." },
        options: [
            { es: "esperamos que la reunión termine temprano", en: "We expect the meeting to finish early." },
            { es: "esperamos que la reunión termine tarde", en: "We expect the meeting to finish late." },
            { es: "esperamos que la reunión termine mal", en: "We expect the meeting to finish badly." },
            { es: "esperamos que la reunión termine frío", en: "We expect the meeting to finish cold." }
        ]
    },
    {
        english: "He managed to organise everything before midday.",
        correct: { es: "él logró organizar todo antes del mediodía", en: "He managed to organise everything before midday." },
        options: [
            { es: "él logró organizar todo antes del mediodía", en: "He managed to organise everything before midday." },
            { es: "él logró organizar todo después del mediodía", en: "He managed to organise everything after midday." },
            { es: "él logró organizar todo en la noche", en: "He managed to organise everything at night." },
            { es: "él logró organizar todo en la mañana", en: "He managed to organise everything in the morning." }
        ]
    },
    {
        english: "I recommend preparing a bit earlier next time.",
        correct: { es: "recomiendo prepararse un poco más temprano la próxima vez", en: "I recommend preparing a bit earlier next time." },
        options: [
            { es: "recomiendo prepararse un poco más temprano la próxima vez", en: "I recommend preparing a bit earlier next time." },
            { es: "recomiendo prepararse un poco más tarde la próxima vez", en: "I recommend preparing a bit later next time." },
            { es: "recomiendo prepararse en casa la próxima vez", en: "I recommend preparing at home next time." },
            { es: "recomiendo prepararse en el parque la próxima vez", en: "I recommend preparing at the park next time." }
        ]
    },
    {
        english: "We discussed the plan and agreed on a few changes.",
        correct: { es: "discutimos el plan y acordamos algunos cambios", en: "We discussed the plan and agreed on a few changes." },
        options: [
            { es: "discutimos el plan y acordamos algunos cambios", en: "We discussed the plan and agreed on a few changes." },
            { es: "discutimos el plan y acordamos ningún cambio", en: "We discussed the plan and agreed on no changes." },
            { es: "discutimos el plan y acordamos muchos cambios", en: "We discussed the plan and agreed on many changes." },
            { es: "discutimos el plan y acordamos cambios fríos", en: "We discussed the plan and agreed on cold changes." }
        ]
    },
    {
        english: "She recognised the problem immediately.",
        correct: { es: "ella reconoció el problema de inmediato", en: "She recognised the problem immediately." },
        options: [
            { es: "ella reconoció el problema de inmediato", en: "She recognised the problem immediately." },
            { es: "ella reconoció el problema lentamente", en: "She recognised the problem slowly." },
            { es: "ella reconoció el problema tarde", en: "She recognised the problem late." },
            { es: "ella reconoció el problema mal", en: "She recognised the problem badly." }
        ]
    },
    {
        english: "We analysed the situation and chose the best option.",
        correct: { es: "analizamos la situación y elegimos la mejor opción", en: "We analysed the situation and chose the best option." },
        options: [
            { es: "analizamos la situación y elegimos la mejor opción", en: "We analysed the situation and chose the best option." },
            { es: "analizamos la situación y elegimos la peor opción", en: "We analysed the situation and chose the worst option." },
            { es: "analizamos la situación y elegimos una opción fría", en: "We analysed the situation and chose a cold option." },
            { es: "analizamos la situación y elegimos una opción cara", en: "We analysed the situation and chose an expensive option." }
        ]
    },
       {
        english: "He realised the meeting would take longer than planned.",
        correct: { es: "él se dio cuenta de que la reunión tomaría más tiempo de lo planeado", en: "He realised the meeting would take longer than planned." },
        options: [
            { es: "él se dio cuenta de que la reunión tomaría más tiempo de lo planeado", en: "He realised the meeting would take longer than planned." },
            { es: "él se dio cuenta de que la reunión tomaría menos tiempo de lo planeado", en: "He realised the meeting would take less time than planned." },
            { es: "él se dio cuenta de que la reunión tomaría tiempo frío", en: "He realised the meeting would take cold time." },
            { es: "él se dio cuenta de que la reunión tomaría tiempo caro", en: "He realised the meeting would take expensive time." }
        ]
    },

    /* ===== B2 PART 2 (joined cleanly) ===== */

    {
        english: "She considered changing the plan after the meeting.",
        correct: { es: "ella consideró cambiar el plan después de la reunión", en: "She considered changing the plan after the meeting." },
        options: [
            { es: "ella consideró cambiar el plan después de la reunión", en: "She considered changing the plan after the meeting." },
            { es: "ella consideró olvidar el plan después de la reunión", en: "She considered forgetting the plan after the meeting." },
            { es: "ella consideró revisar el plan después de la reunión", en: "She considered reviewing the plan after the meeting." },
            { es: "ella consideró terminar el plan después de la reunión", en: "She considered finishing the plan after the meeting." }
        ]
    },

    {
        english: "We realised the situation required more attention.",
        correct: { es: "nos dimos cuenta de que la situación requería más atención", en: "We realised the situation required more attention." },
        options: [
            { es: "nos dimos cuenta de que la situación requería más atención", en: "We realised the situation required more attention." },
            { es: "nos dimos cuenta de que la situación requería menos atención", en: "We realised the situation required less attention." },
            { es: "nos dimos cuenta de que la situación requería atención fría", en: "We realised the situation required cold attention." },
            { es: "nos dimos cuenta de que la situación requería atención cara", en: "We realised the situation required expensive attention." }
        ]
    },
    {
        english: "He managed to explain everything without any confusion.",
        correct: { es: "él logró explicar todo sin ninguna confusión", en: "He managed to explain everything without any confusion." },
        options: [
            { es: "él logró explicar todo sin ninguna confusión", en: "He managed to explain everything without any confusion." },
            { es: "él logró explicar todo con mucha confusión", en: "He managed to explain everything with a lot of confusion." },
            { es: "él logró explicar todo muy tarde", en: "He managed to explain everything very late." },
            { es: "él logró explicar todo muy rápido", en: "He managed to explain everything very quickly." }
        ]
    },
    {
        english: "I recommend discussing the problem before choosing a solution.",
        correct: { es: "recomiendo discutir el problema antes de elegir una solución", en: "I recommend discussing the problem before choosing a solution." },
        options: [
            { es: "recomiendo discutir el problema antes de elegir una solución", en: "I recommend discussing the problem before choosing a solution." },
            { es: "recomiendo discutir el problema después de elegir una solución", en: "I recommend discussing the problem after choosing a solution." },
            { es: "recomiendo discutir el problema sin elegir una solución", en: "I recommend discussing the problem without choosing a solution." },
            { es: "recomiendo discutir el problema para evitar una solución", en: "I recommend discussing the problem to avoid a solution." }
        ]
    },
    {
        english: "We compared several ideas and chose the most practical one.",
        correct: { es: "comparamos varias ideas y elegimos la más práctica", en: "We compared several ideas and chose the most practical one." },
        options: [
            { es: "comparamos varias ideas y elegimos la más práctica", en: "We compared several ideas and chose the most practical one." },
            { es: "comparamos varias ideas y elegimos la más cara", en: "We compared several ideas and chose the most expensive one." },
            { es: "comparamos varias ideas y elegimos la más fría", en: "We compared several ideas and chose the coldest one." },
            { es: "comparamos varias ideas y elegimos la más pequeña", en: "We compared several ideas and chose the smallest one." }
        ]
    },
    {
        english: "She recognised the mistake and corrected it quickly.",
        correct: { es: "ella reconoció el error y lo corrigió rápidamente", en: "She recognised the mistake and corrected it quickly." },
        options: [
            { es: "ella reconoció el error y lo corrigió rápidamente", en: "She recognised the mistake and corrected it quickly." },
            { es: "ella reconoció el error y lo corrigió lentamente", en: "She recognised the mistake and corrected it slowly." },
            { es: "ella reconoció el error y lo corrigió mal", en: "She recognised the mistake and corrected it badly." },
            { es: "ella reconoció el error y lo corrigió tarde", en: "She recognised the mistake and corrected it late." }
        ]
    },
    {
        english: "We analysed the results and noticed a clear pattern.",
        correct: { es: "analizamos los resultados y notamos un patrón claro", en: "We analysed the results and noticed a clear pattern." },
        options: [
            { es: "analizamos los resultados y notamos un patrón claro", en: "We analysed the results and noticed a clear pattern." },
            { es: "analizamos los resultados y notamos un patrón pequeño", en: "We analysed the results and noticed a small pattern." },
            { es: "analizamos los resultados y notamos un patrón caro", en: "We analysed the results and noticed an expensive pattern." },
            { es: "analizamos los resultados y notamos un patrón frío", en: "We analysed the results and noticed a cold pattern." }
        ]
    },
    {
        english: "He considered waiting a bit longer before leaving.",
        correct: { es: "él consideró esperar un poco más antes de irse", en: "He considered waiting a bit longer before leaving." },
        options: [
            { es: "él consideró esperar un poco más antes de irse", en: "He considered waiting a bit longer before leaving." },
            { es: "él consideró esperar un poco menos antes de irse", en: "He considered waiting a bit less before leaving." },
            { es: "él consideró esperar en casa antes de irse", en: "He considered waiting at home before leaving." },
            { es: "él consideró esperar en el parque antes de irse", en: "He considered waiting at the park before leaving." }
        ]
    },
    {
        english: "We expect the project to take a few more days.",
        correct: { es: "esperamos que el proyecto tome unos días más", en: "We expect the project to take a few more days." },
        options: [
            { es: "esperamos que el proyecto tome unos días más", en: "We expect the project to take a few more days." },
            { es: "esperamos que el proyecto tome unos días menos", en: "We expect the project to take a few fewer days." },
            { es: "esperamos que el proyecto tome días fríos", en: "We expect the project to take cold days." },
            { es: "esperamos que el proyecto tome días caros", en: "We expect the project to take expensive days." }
        ]
    },
    {
        english: "She managed to organise everything without any help.",
        correct: { es: "ella logró organizar todo sin ninguna ayuda", en: "She managed to organise everything without any help." },
        options: [
            { es: "ella logró organizar todo sin ninguna ayuda", en: "She managed to organise everything without any help." },
            { es: "ella logró organizar todo con mucha ayuda", en: "She managed to organise everything with a lot of help." },
            { es: "ella logró organizar todo muy tarde", en: "She managed to organise everything very late." },
            { es: "ella logró organizar todo muy rápido", en: "She managed to organise everything very quickly." }
        ]
    },
    {
        english: "I recommend choosing the option that feels most comfortable.",
        correct: { es: "recomiendo elegir la opción que se sienta más cómoda", en: "I recommend choosing the option that feels most comfortable." },
        options: [
            { es: "recomiendo elegir la opción que se sienta más cómoda", en: "I recommend choosing the option that feels most comfortable." },
            { es: "recomiendo elegir la opción que se sienta más cara", en: "I recommend choosing the option that feels more expensive." },
            { es: "recomiendo elegir la opción que se sienta más fría", en: "I recommend choosing the option that feels colder." },
            { es: "recomiendo elegir la opción que se sienta más pequeña", en: "I recommend choosing the option that feels smaller." }
        ]
    },
    {
        english: "We discussed the idea and agreed it was practical.",
        correct: { es: "discutimos la idea y acordamos que era práctica", en: "We discussed the idea and agreed it was practical." },
        options: [
            { es: "discutimos la idea y acordamos que era práctica", en: "We discussed the idea and agreed it was practical." },
            { es: "discutimos la idea y acordamos que era cara", en: "We discussed the idea and agreed it was expensive." },
            { es: "discutimos la idea y acordamos que era fría", en: "We discussed the idea and agreed it was cold." },
            { es: "discutimos la idea y acordamos que era pequeña", en: "We discussed the idea and agreed it was small." }
        ]
    },
    {
        english: "She recognised the voice immediately.",
        correct: { es: "ella reconoció la voz de inmediato", en: "She recognised the voice immediately." },
        options: [
            { es: "ella reconoció la voz de inmediato", en: "She recognised the voice immediately." },
            { es: "ella reconoció la voz lentamente", en: "She recognised the voice slowly." },
            { es: "ella reconoció la voz tarde", en: "She recognised the voice late." },
            { es: "ella reconoció la voz mal", en: "She recognised the voice badly." }
        ]
    },
    {
        english: "We analysed the options and chose the most efficient one.",
        correct: { es: "analizamos las opciones y elegimos la más eficiente", en: "We analysed the options and chose the most efficient one." },
        options: [
            { es: "analizamos las opciones y elegimos la más eficiente", en: "We analysed the options and chose the most efficient one." },
            { es: "analizamos las opciones y elegimos la más cara", en: "We analysed the options and chose the most expensive one." },
            { es: "analizamos las opciones y elegimos la más fría", en: "We analysed the options and chose the coldest one." },
            { es: "analizamos las opciones y elegimos la más pequeña", en: "We analysed the options and chose the smallest one." }
        ]
    },
    {
        english: "He considered preparing everything earlier next time.",
        correct: { es: "él consideró preparar todo más temprano la próxima vez", en: "He considered preparing everything earlier next time." },
        options: [
            { es: "él consideró preparar todo más temprano la próxima vez", en: "He considered preparing everything earlier next time." },
            { es: "él consideró preparar todo más tarde la próxima vez", en: "He considered preparing everything later next time." },
            { es: "él consideró preparar todo en casa la próxima vez", en: "He considered preparing everything at home next time." },
            { es: "él consideró preparar todo en el parque la próxima vez", en: "He considered preparing everything at the park next time." }
        ]
    },
    {
        english: "We expect the day to run smoothly if we organise well.",
        correct: { es: "esperamos que el día vaya bien si organizamos bien", en: "We expect the day to run smoothly if we organise well." },
        options: [
            { es: "esperamos que el día vaya bien si organizamos bien", en: "We expect the day to run smoothly if we organise well." },
            { es: "esperamos que el día vaya mal si organizamos bien", en: "We expect the day to go badly if we organise well." },
            { es: "esperamos que el día vaya frío si organizamos bien", en: "We expect the day to go cold if we organise well." },
            { es: "esperamos que el día vaya caro si organizamos bien", en: "We expect the day to go expensive if we organise well." }
        ]
    },
    {
        english: "She managed to finish everything before the deadline.",
        correct: { es: "ella logró terminar todo antes de la fecha límite", en: "She managed to finish everything before the deadline." },
        options: [
            { es: "ella logró terminar todo antes de la fecha límite", en: "She managed to finish everything before the deadline." },
            { es: "ella logró terminar todo después de la fecha límite", en: "She managed to finish everything after the deadline." },
            { es: "ella logró terminar todo muy tarde", en: "She managed to finish everything very late." },
            { es: "ella logró terminar todo muy rápido", en: "She managed to finish everything very quickly." }
        ]
    },
       {
        english: "I recommend discussing the details more carefully next time.",
        correct: { es: "recomiendo discutir los detalles más cuidadosamente la próxima vez", en: "I recommend discussing the details more carefully next time." },
        options: [
            { es: "recomiendo discutir los detalles más cuidadosamente la próxima vez", en: "I recommend discussing the details more carefully next time." },
            { es: "recomiendo discutir los detalles más rápidamente la próxima vez", en: "I recommend discussing the details more quickly next time." },
            { es: "recomiendo discutir los detalles más tarde la próxima vez", en: "I recommend discussing the details later next time." },
            { es: "recomiendo discutir los detalles en casa la próxima vez", en: "I recommend discussing the details at home next time." }
        ]
    }
]   // ← CLEAN END OF B2 ARRAY
};

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

const DISRUPTORS_A1 = [
    { es: "Bueno, te digo algo.", en: "Well, let me tell you something." },
    { es: "Pues mira.", en: "Well, look." },
    { es: "La verdad es que.", en: "The truth is that..." }
];

const DISRUPTORS_A2 = [
    { es: "A menudo pienso en esto.", en: "I often think about this." },
    { es: "Antes de responder, te cuento.", en: "Before answering, let me tell you something." },
    { es: "Ya sabes cómo es.", en: "You know how it is." }
];

const DISRUPTORS_B1 = [
    { es: "Mientras lo pienso, te digo algo.", en: "While I think about it, let me tell you something." },
    { es: "Sin embargo, hay más que decir.", en: "However, there's more to say." },
    { es: "Sobre esto, tengo una opinion.", en: "About this, I have an opinion." }
];

const DISRUPTORS_B2 = [
    { es: "además", en: "besides" },
    { es: "por lo tanto", en: "therefore" },
    { es: "a pesar de", en: "despite" },
    { es: "aunque", en: "although" },
    { es: "incluso", en: "even" }
];

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



const CEFR_CONVERSATION_PROMPTS = {

       A1: [
        {
            prompt_es: "¿Qué te gustaría beber?",
            prompt_en: "What would you like to drink?",
            expected_responses: [
                { es: "quiero agua por favor", en: "I want water please" },
                { es: "me gustaría una cerveza", en: "I would like a beer" },
                { es: "quiero café", en: "I want coffee" }
            ]
        },
        {
            prompt_es: "¿Cómo estás hoy?",
            prompt_en: "How are you today?",
            expected_responses: [
                { es: "estoy feliz", en: "I am happy" },
                { es: "estoy bien gracias", en: "I am good, thank you" },
                { es: "estoy cansado", en: "I am tired" }
            ]
        },
        {
            prompt_es: "¿Dónde vives?",
            prompt_en: "Where do you live?",
            expected_responses: [
                { es: "vivo en la casa", en: "I live in the house" },
                { es: "vivo cerca del hotel", en: "I live near the hotel" },
                { es: "vivo con mi familia", en: "I live with my family" }
            ]
        },
        {
            prompt_es: "¿Qué quieres comer?",
            prompt_en: "What do you want to eat?",
            expected_responses: [
                { es: "quiero pollo", en: "I want chicken" },
                { es: "quiero una ensalada", en: "I want a salad" },
                { es: "quiero sopa", en: "I want soup" }
            ]
        },
        {
            prompt_es: "¿Tienes hambre?",
            prompt_en: "Are you hungry?",
            expected_responses: [
                { es: "sí tengo hambre", en: "Yes, I'm hungry" },
                { es: "no tengo hambre", en: "I'm not hungry" },
                { es: "tengo un poco de hambre", en: "I'm a little hungry" }
            ]
        },
        {
            prompt_es: "¿Qué te gusta hacer?",
            prompt_en: "What do you like to do?",
            expected_responses: [
                { es: "me gusta leer libros", en: "I like reading books" },
                { es: "me gusta escuchar música", en: "I like listening to music" },
                { es: "me gusta cocinar", en: "I like cooking" }
            ]
        },
        {
            prompt_es: "¿A qué hora te levantas?",
            prompt_en: "What time do you get up?",
            expected_responses: [
                { es: "me levanto temprano", en: "I get up early" },
                { es: "me levanto tarde", en: "I get up late" },
                { es: "me levanto a las siete", en: "I get up at seven" }
            ]
        },
        {
            prompt_es: "¿Quieres salir hoy?",
            prompt_en: "Do you want to go out today?",
            expected_responses: [
                { es: "sí quiero salir", en: "Yes, I want to go out" },
                { es: "no quiero salir", en: "I don't want to go out" },
                { es: "quiero salir más tarde", en: "I want to go out later" }
            ]
        },
        {
            prompt_es: "¿Qué estás haciendo?",
            prompt_en: "What are you doing?",
            expected_responses: [
                { es: "estoy aprendiendo español", en: "I am learning Spanish" },
                { es: "estoy cocinando", en: "I am cooking" },
                { es: "estoy viendo televisión", en: "I am watching TV" }
            ]
        },
        {
            prompt_es: "¿Quieres ver una película?",
            prompt_en: "Do you want to watch a movie?",
            expected_responses: [
                { es: "sí quiero ver una película", en: "Yes, I want to watch a movie" },
                { es: "no quiero ver televisión", en: "I don't want to watch TV" },
                { es: "quiero ver una película nueva", en: "I want to watch a new movie" }
            ]
        },
        {
            prompt_es: "¿Dónde está el baño?",
            prompt_en: "Where is the bathroom?",
            expected_responses: [
                { es: "está cerca", en: "It is near" },
                { es: "está en la estación", en: "It is in the station" },
                { es: "está en la casa", en: "It is in the house" }
            ]
        },
        {
            prompt_es: "¿Qué música te gusta?",
            prompt_en: "What music do you like?",
            expected_responses: [
                { es: "me gusta la música", en: "I like music" },
                { es: "me gusta escuchar música", en: "I like listening to music" },
                { es: "me gusta la música nueva", en: "I like new music" }
            ]
        },
        {
            prompt_es: "¿Quieres descansar?",
            prompt_en: "Do you want to rest?",
            expected_responses: [
                { es: "sí quiero descansar", en: "Yes, I want to rest" },
                { es: "no quiero descansar", en: "I don't want to rest" },
                { es: "quiero descansar un poco", en: "I want to rest a little" }
            ]
        },
        {
            prompt_es: "¿Qué hay en la casa?",
            prompt_en: "What is in the house?",
            expected_responses: [
                { es: "hay pan", en: "There is bread" },
                { es: "hay arroz", en: "There is rice" },
                { es: "hay pollo", en: "There is chicken" }
            ]
        },
        {
            prompt_es: "¿Quieres ir al hotel?",
            prompt_en: "Do you want to go to the hotel?",
            expected_responses: [
                { es: "sí quiero ir al hotel", en: "Yes, I want to go to the hotel" },
                { es: "no quiero ir", en: "I don't want to go" },
                { es: "quiero ir más tarde", en: "I want to go later" }
            ]
        },
        {
            prompt_es: "¿Qué fruta te gusta?",
            prompt_en: "What fruit do you like?",
            expected_responses: [
                { es: "me gusta la manzana", en: "I like apple" },
                { es: "me gusta la naranja", en: "I like orange" },
                { es: "me gusta el plátano", en: "I like banana" }
            ]
        },
        {
            prompt_es: "¿Quieres aprender más?",
            prompt_en: "Do you want to learn more?",
            expected_responses: [
                { es: "sí quiero aprender más", en: "Yes, I want to learn more" },
                { es: "quiero aprender rápido", en: "I want to learn fast" },
                { es: "quiero aprender con música", en: "I want to learn with music" }
            ]
        },
        {
            prompt_es: "¿Qué ves en la televisión?",
            prompt_en: "What do you watch on TV?",
            expected_responses: [
                { es: "veo libros", en: "I look at books" },
                { es: "veo cosas buenas", en: "I watch good things" },
                { es: "veo música nueva", en: "I watch new music videos" }
            ]
        },
        {
            prompt_es: "¿Quieres pan con queso?",
            prompt_en: "Do you want bread with cheese?",
            expected_responses: [
                { es: "sí quiero pan con queso", en: "Yes, I want bread with cheese" },
                { es: "no quiero pan", en: "I don't want bread" },
                { es: "quiero queso", en: "I want cheese" }
            ]
        },
        {
            prompt_es: "¿Dónde está tu familia?",
            prompt_en: "Where is your family?",
            expected_responses: [
                { es: "está en la casa", en: "They are at home" },
                { es: "está cerca", en: "They are near" },
                { es: "está en la estación", en: "They are at the station" }
            ]
        },
        {
            prompt_es: "¿Quieres ir en autobús?",
            prompt_en: "Do you want to go by bus?",
            expected_responses: [
                { es: "sí quiero ir en autobús", en: "Yes, I want to go by bus" },
                { es: "no quiero ir en autobús", en: "I don't want to go by bus" },
                { es: "quiero ir en tren", en: "I want to go by train" }
            ]
        },
        {
            prompt_es: "¿Qué haces en casa?",
            prompt_en: "What do you do at home?",
            expected_responses: [
                { es: "cocino", en: "I cook" },
                { es: "leo libros", en: "I read books" },
                { es: "veo televisión", en: "I watch TV" }
            ]
        },
        {
            prompt_es: "¿Hola, tienes su boleto?",
            prompt_en: "Hello, do you have your ticket?",
            expected_responses: [
                { es: "sí tengo su boleto", en: "Yes, I have your ticket" },
                { es: "no tengo mi boleto", en: "I don't have my ticket" },
                { es: "necesito un boleto", en: "I need a ticket" }
            ]
        },
        {
            prompt_es: "¿Qué necesitas en la estación?",
            prompt_en: "What do you need at the station?",
            expected_responses: [
                { es: "necesito el autobús", en: "I need the bus" },
                { es: "necesito el tren", en: "I need the train" },
                { es: "necesito mi amigo", en: "I need my friend" }
            ]
        },
        {
            prompt_es: "¿Quieres café o té?",
            prompt_en: "Do you want coffee or tea?",
            expected_responses: [
                { es: "quiero café caliente", en: "I want hot coffee" },
                { es: "quiero té frío", en: "I want cold tea" },
                { es: "no quiero café", en: "I don't want coffee" }
            ]
        },
        {
            prompt_es: "¿Quién es ella?",
            prompt_en: "Who is she?",
            expected_responses: [
                { es: "ella es mi madre", en: "She is my mother" },
                { es: "ella es mi hermana", en: "She is my sister" },
                { es: "ella es mi amiga", en: "She is my friend (female)" }
            ]
        },
        {
            prompt_es: "¿Quién es el?",
            prompt_en: "Who is he?",
            expected_responses: [
                { es: "el es mi padre", en: "He is my father" },
                { es: "el es mi hijo", en: "He is my son" },
                { es: "el es mi amigo", en: "He is my friend" }
            ]
        },
        {
            prompt_es: "¿Hay problemas con el transporte?",
            prompt_en: "Are there problems with the transport?",
            expected_responses: [
                { es: "no hay problemas hoy", en: "There are no problems today" },
                { es: "sí hay problemas con el tren", en: "Yes, there are problems with the train" },
                { es: "el autobús es lento", en: "The bus is slow" }
            ]
        },
        {
            prompt_es: "¿Qué quieres aprender hoy?",
            prompt_en: "What do you want to learn today?",
            expected_responses: [
                { es: "quiero aprender a cocinar", en: "I want to learn to cook" },
                { es: "quiero aprender a escribir", en: "I want to learn to write" },
                { es: "quiero aprender más", en: "I want to learn more" }
            ]
        },
        {
            prompt_es: "¿Quieres comer filete hoy?",
            prompt_en: "Do you want to eat steak today?",
            expected_responses: [
                { es: "sí con papas fritas", en: "Yes, with french fries" },
                { es: "no quiero filete hoy", en: "I don't want steak today" },
                { es: "quiero sopa caliente", en: "I want hot soup" }
            ]
        },
        {
            prompt_es: "¿Dónde está la escuela?",
            prompt_en: "Where is the school?",
            expected_responses: [
                { es: "la escuela está cerca", en: "The school is near" },
                { es: "está cerca del hotel", en: "It is near the hotel" },
                { es: "no está cerca", en: "It is not near" }
            ]
        },
        {
            prompt_es: "¿Tienes leche o cerveza en casa?",
            prompt_en: "Do you have milk or beer at home?",
            expected_responses: [
                { es: "tengo leche y pan", en: "I have milk and bread" },
                { es: "tengo cerveza frío", en: "I have cold beer" },
                { es: "no tengo cerveza en casa", en: "I don't have beer at home" }
            ]
        },
        {
            prompt_es: "¿A qué hora vas a trabajar?",
            prompt_en: "What hour do you go to work?",
            expected_responses: [
                { es: "voy temprano", en: "I go early" },
                { es: "voy tarde hoy", en: "I go late today" },
                { es: "no voy a trabajar hoy", en: "I don't go to work today" }
            ]
        },
        {
            prompt_es: "¿Cómo está su abuela?",
            prompt_en: "How is your grandmother?",
            expected_responses: [
                { es: "su abuela está muy feliz", en: "His grandmother is very happy" },
                { es: "ella está bien gracias", en: "She is well, thank you" },
                { es: "está cansada hoy", en: "She is tired today" }
            ]
        },
        {
            prompt_es: "¿Quieres escuchar música nueva?",
            prompt_en: "Do you want to listen to new music?",
            expected_responses: [
                { es: "sí me gusta la música", en: "Yes, I like music" },
                { es: "no quiero escuchar música", en: "I don't want to listen to music" },
                { es: "quiero escuchar con mi amigo", en: "I want to listen with my friend" }
            ]
        },
        {
            prompt_es: "¿Qué necesitas limpiar hoy?",
            prompt_en: "What do you need to clean today?",
            expected_responses: [
                { es: "necesito limpiar la casa", en: "I need to clean the house" },
                { es: "necesito limpiar el baño", en: "I need to clean the bathroom" },
                { es: "no necesito limpiar hoy", en: "I don't need to clean today" }
            ]
        },
        {
            prompt_es: "¿Te gustan los libros nuevos?",
            prompt_en: "Do you like new books?",
            expected_responses: [
                { es: "sí me gusta leer mucho", en: "Yes, I like reading a lot" },
                { es: "no me gustan los libros", en: "I don't like books" },
                { es: "quiero escribir un libro", en: "I want to write a book" }
            ]
        },
        {
            prompt_es: "¿Hay fruta en la mesa?",
            prompt_en: "Is there fruit on the table?",
            expected_responses: [
                { es: "hay manzana y naranja", en: "There is apple and orange" },
                { es: "hay un plátano bueno", en: "There is a good banana" },
                { es: "no hay fruta hoy", en: "There is no fruit today" }
            ]
        },
        {
            prompt_es: "¿Quieres arroz con frijoles?",
            prompt_en: "Do you want rice with beans?",
            expected_responses: [
                { es: "sí con un poco de queso", en: "Yes, with a little cheese" },
                { es: "quiero arroz sin frijoles", en: "I want rice without beans" },
                { es: "no quiero arroz hoy", en: "I don't want rice today" }
            ]
        },
        {
            prompt_es: "¿Buenos días, estás listo?",
            prompt_en: "Good morning, are you ready?",
            expected_responses: [
                { es: "buenos días sí estoy listo", en: "Good morning, yes I am ready" },
                { es: "no estoy listo hoy", en: "I am not ready today" },
                { es: "necesito más tiempo por favor", en: "I need more time please" }
            ]
        },
        {
            prompt_es: "¿Cuándo vas al aeropuerto?",
            prompt_en: "When do you go to the airport?",
            expected_responses: [
                { es: "voy ahora", en: "I am going now" },
                { es: "voy temprano hoy", en: "I am going early today" },
                { es: "voy en autobús más tarde", en: "I am going by bus later" }
            ]
        },
        {
            prompt_es: "¿Te gusta este lugar nuevo?",
            prompt_en: "Do you like this new place?",
            expected_responses: [
                { es: "sí el lugar es muy bueno", en: "Yes, the place is very good" },
                { es: "no me gusta este lugar", en: "I don't like this place" },
                { es: "es un lugar pequeño", en: "It is a small place" }
            ]
        },
        {
            prompt_es: "¿Quieres un filete con papas fritas?",
            prompt_en: "Do you want a steak with french fries?",
            expected_responses: [
                { es: "sí, con un poco de sal", en: "Yes, with a little salt" },
                { es: "no, quiero una ensalada", en: "No, I want a salad" },
                { es: "quiero filete sin papas", en: "I want steak without fries" }
            ]
        },
        {
            prompt_es: "¿A qué hora termina la televisión?",
            prompt_en: "What hour does the television finish?",
            expected_responses: [
                { es: "termina a las diez", en: "It finishes at ten" },
                { es: "termina en una hora", en: "It finishes in an hour" },
                { es: "no veo televisión hoy", en: "I don't watch TV today" }
            ]
        },
        {
            prompt_es: "¿Qué fruta hay en la casa?",
            prompt_en: "What fruit is there in the house?",
            expected_responses: [
                { es: "hay manzana y plátano", en: "There is apple and banana" },
                { es: "hay naranja dulce", en: "There is sweet orange" },
                { es: "no hay fruta aquí", en: "There is no fruit here" }
            ]
        },
        {
            prompt_es: "¿Dónde está la estación de tren?",
            prompt_en: "Where is the train station?",
            expected_responses: [
                { es: "la estación está cerca", en: "The station is near" },
                { es: "está cerca de la escuela", en: "It is near the school" },
                { es: "está lejos del hotel", en: "It is far from the hotel" }
            ]
        },
        {
            prompt_es: "¿Quieres escuchar música con tu amigo?",
            prompt_en: "Do you want to listen to music with your friend?",
            expected_responses: [
                { es: "sí, me gusta escuchar música", en: "Yes, I like to listen to music" },
                { es: "no, quiero leer un libro", en: "No, I want to read a book" },
                { es: "mi amigo no está aquí", en: "My friend is not here" }
            ]
        },
        {
            prompt_es: "¿Qué necesitas hacer hoy?",
            prompt_en: "What do you need to do today?",
            expected_responses: [
                { es: "necesito trabajar más", en: "I need to work more" },
                { es: "necesito estudiar español", en: "I need to study Spanish" },
                { es: "quiero descansar en casa", en: "I want to rest at home" }
            ]
        },
        {
            prompt_es: "¿Tienes problemas con el autobús?",
            prompt_en: "Do you have problems with the bus?",
            expected_responses: [
                { es: "no hay problemas hoy", en: "There are no problems today" },
                { es: "sí, el autobús es lento", en: "Yes, the bus is slow" },
                { es: "quiero ir en tren", en: "I want to go by train" }
            ]
        },
        {
            prompt_es: "¿Te gusta cocinar comida caliente?",
            prompt_en: "Do you like to cook hot food?",
            expected_responses: [
                { es: "sí, cocino sopa y pollo", en: "Yes, I cook soup and chicken" },
                { es: "no, me gusta la fruta fría", en: "No, I like cold fruit" },
                { es: "quiero aprender a cocinar", en: "I want to learn to cook" }
            ]
        }
    ],
    A2: [
        {
            prompt_es: "¿Qué quieres para el desayuno?",
            prompt_en: "What do you want for breakfast?",
            expected_responses: [
                { es: "quiero huevo, pan y café", en: "I want egg, bread and coffee" },
                { es: "normalmente prefiero fruta fría", en: "Normally I prefer cold fruit" },
                { es: "un desayuno temprano, por favor", en: "An early breakfast, please" }
            ]
        },
        {
            prompt_es: "¿A qué hora es la cena hoy?",
            prompt_en: "What time is dinner today?",
            expected_responses: [
                { es: "la cena es tarde hoy", en: "Dinner is late today" },
                { es: "es en veinte minutos", en: "It is in twenty minutes" },
                { es: "quiero cocinar la cena ahora", en: "I want to cook dinner now" }
            ]
        },
        {
            prompt_es: "¿Por qué llegas tarde?",
            prompt_en: "Why are you arriving late?",
            expected_responses: [
                { es: "el autobús es lento hoy", en: "The bus is slow today" },
                { es: "porque tuve problemas con el coche", en: "Because I had problems with the car" },
                { es: "lo siento, el viaje es difícil", en: "I am sorry, the trip is difficult" }
            ]
        },
        {
            prompt_es: "¿Terminaste la tarea de la escuela?",
            prompt_en: "Did you finish the school homework?",
            expected_responses: [
                { es: "sí, ya terminé la tarea", en: "Yes, I already finished the homework" },
                { es: "todavía necesito más minutos", en: "I still need more minutes" },
                { es: "no, la tarea es muy difícil", en: "No, the homework is very difficult" }
            ]
        },
        {
            prompt_es: "¿Leíste mi mensaje anoche?",
            prompt_en: "Did you read my message last night?",
            expected_responses: [
                { es: "sí, leí su mensaje anoche", en: "Yes, I read your message last night" },
                { es: "no, olvidé ver la televisión", en: "No, I forgot to look at the television" },
                { es: "recibí la información ahora", en: "I received the information now" }
            ]
        },
        {
            prompt_es: "¿Quieres ver una película ahora?",
            prompt_en: "Do you want to watch a movie now?",
            expected_responses: [
                { es: "sí, la película es nueva", en: "Yes, the movie is new" },
                { es: "antes quiero limpiar la cocina", en: "Before I want to clean the kitchen" },
                { es: "no, es muy tarde para ver una película", en: "No, it is very late to watch a movie" }
            ]
        },
        {
            prompt_es: "¿Puedes abrir la ventana de la cocina?",
            prompt_en: "Can you open the kitchen window?",
            expected_responses: [
                { es: "sí, la cocina está muy caliente", en: "Yes, the kitchen is very hot" },
                { es: "no puedo abrir la ventana ahora", en: "I cannot open the window now" },
                { es: "la ventana está rota", en: "The window is broken" }
            ]
        },
        {
            prompt_es: "¿Quieres comprar zapatos nuevos?",
            prompt_en: "Do you want to buy new shoes?",
            expected_responses: [
                { es: "sí, necesito zapatos para el viaje", en: "Yes, I need shoes for the trip" },
                { es: "no, mis zapatos pequeños son buenos", en: "No, my small shoes are good" },
                { es: "quiero probar estos zapatos negros", en: "I want to try these black shoes" }
            ]
        },
        {
            prompt_es: "¿Cuándo viajas en avión?",
            prompt_en: "When do you travel by plane?",
            expected_responses: [
                { es: "el avión sale en quince minutos", en: "The plane leaves in fifteen minutes" },
                { es: "viajo temprano por la mañana", en: "I travel early in the morning" },
                { es: "todavía espero mi boleto de avión", en: "I am still waiting for my plane ticket" }
            ]
        },
        {
            prompt_es: "¿Vas a visitar a tus padres?",
            prompt_en: "Are you going to visit your parents?",
            expected_responses: [
                { es: "sí, voy a visitar a mis padres hoy", en: "Yes, I am going to visit my parents today" },
                { es: "a menudo los visito en su casa", en: "Often I visit them at their house" },
                { es: "no, ellos están de viaje ahora", en: "No, they are on a trip now" }
            ]
        },
        {
            prompt_es: "¿Necesitas transporte para ir al hotel?",
            prompt_en: "Do you need transport to go to the hotel?",
            expected_responses: [
                { es: "sí, necesito transporte rápido ahora", en: "Yes, I need fast transport now" },
                { es: "no, el hotel está muy cerca", en: "No, the hotel is very near" },
                { es: "prefiero conducir mi coche al hotel", en: "I prefer to drive my car to the hotel" }
            ]
        },
        {
            prompt_es: "¿Cuándo llega el tren a la estación?",
            prompt_en: "When does the train arrive at the station?",
            expected_responses: [
                { es: "el tren llega en once minutos", en: "The train arrives in eleven minutes" },
                { es: "normalmente llega temprano", en: "Normally it arrives early" },
                { es: "ya llegó a la estación", en: "It already arrived at the station" }
            ]
        },
        {
            prompt_es: "¿Quieres almorzar conmigo ahora?",
            prompt_en: "Do you want to have lunch with me now?",
            expected_responses: [
                { es: "sí, tengo mucha hambre", en: "Yes, I am very hungry" },
                { es: "antes necesito terminar mi tarea", en: "Before I need to finish my homework" },
                { es: "lo siento, es muy tarde para almorzar", en: "I am sorry, it is very late to have lunch" }
            ]
        },
        {
            prompt_es: "¿Olvidaste el mensaje anoche?",
            prompt_en: "Did you forget the message last night?",
            expected_responses: [
                { es: "sí, olvidé leer el mensaje anoche", en: "Yes, I forgot to read the message last night" },
                { es: "no, tengo la información aquí", en: "No, I have the information here" },
                { es: "no recibí su mensaje", en: "I did not receive your message" }
            ]
        },
        {
            prompt_es: "¿Cuántos minutos necesitas para estar listo?",
            prompt_en: "How many minutes do you need to be ready?",
            expected_responses: [
                { es: "necesito doce minutos más", en: "I need twelve minutes more" },
                { es: "ya estoy listo para salir", en: "I am already ready to go out" },
                { es: "espera quince minutos por favor", en: "Wait fifteen minutes please" }
            ]
        },
        {
            prompt_es: "¿Te gusta conducir de noche?",
            prompt_en: "Do you like to drive at night?",
            expected_responses: [
                { es: "no, prefiero conducir de tarde", en: "No, I prefer to drive in the afternoon" },
                { es: "a menudo conduzco temprano", en: "Often I drive early" },
                { es: "sí, la carretera está clara ahora", en: "Yes, the road is clear now" }
            ]
        },
        {
            prompt_es: "¿Qué necesitas arreglar en la casa?",
            prompt_en: "What do you need to fix in the house?",
            expected_responses: [
                { es: "necesito arreglar la ventana grande", en: "I need to fix the big window" },
                { es: "quiero arreglar la cocina hoy", en: "I want to fix the kitchen today" },
                { es: "ya arreglé la televisión nueva", en: "I already fixed the new television" }
            ]
        },
        {
            prompt_es: "¿Cuándo vas a irse del hotel?",
            prompt_en: "When are you going to leave the hotel?",
            expected_responses: [
                { es: "quiero irse temprano por la mañana", en: "I want to leave early in the morning" },
                { es: "me voy en trece minutos", en: "I am leaving in thirteen minutes" },
                { es: "todavía necesito esperar mi transporte", en: "I still need to wait for my transport" }
            ]
        },
        {
            prompt_es: "¿Cuántos boletos de autobús tienes?",
            prompt_en: "How many bus tickets do you have?",
            expected_responses: [
                { es: "tengo catorce boletos nuevos", en: "I have fourteen new tickets" },
                { es: "solo tengo doce boletos para la familia", en: "I only have twelve tickets for the family" },
                { es: "necesito comprar otra entrada", en: "I need to buy another entry" }
            ]
        },
        {
            prompt_es: "¿Quieres probar esta comida nueva?",
            prompt_en: "Do you want to try this new food?",
            expected_responses: [
                { es: "sí, me gustaría probar el filete", en: "Yes, I would like to try the steak" },
                { es: "no, prefiero mi desayuno de siempre", en: "No, I prefer my usual breakfast" },
                { es: "porque ya comí arroz con frijoles", en: "Because I already ate rice with beans" }
            ]
        },
        {
            prompt_es: "¿Tienes información sobre el viaje?",
            prompt_en: "Do you have information about the trip?",
            expected_responses: [
                { es: "sí, ya tengo la información aquí", en: "Yes, I already have the information here" },
                { es: "todavía espero el mensaje de mi amigo", en: "I am still waiting for my friend's message" },
                { es: "no, olvidé preguntar en la estación", en: "No, I forgot to ask at the station" }
            ]
        },
        {
            prompt_es: "¿A qué hora llega tu amigo?",
            prompt_en: "What time does your friend arrive?",
            expected_responses: [
                { es: "el llega en dieciséis minutos", en: "He arrives in sixteen minutes" },
                { es: "normalmente llega temprano para el almuerzo", en: "Normally he arrives early for lunch" },
                { es: "llegar tarde porque el tren es lento", en: "Arriving late because the train is slow" }
            ]
        },
        {
            prompt_es: "¿Quieres cenar en el hotel hoy?",
            prompt_en: "Do you want to have dinner at the hotel today?",
            expected_responses: [
                { es: "sí, la cena del hotel es buena", en: "Yes, the hotel dinner is good" },
                { es: "antes quiero visitar a mis padres", en: "Before I want to visit my parents" },
                { es: "no, prefiero cocinar en mi casa", en: "No, I prefer to cook at my house" }
            ]
        },
        {
            prompt_es: "¿Cuántos minutos dura la película?",
            prompt_en: "How many minutes does the movie last?",
            expected_responses: [
                { es: "la película dura veinte minutos más", en: "The movie lasts twenty minutes more" },
                { es: "terminar temprano hoy", en: "Finishing early today" },
                { es: "todavía faltan diecisiete minutos", en: "There are still seventeen minutes left" }
            ]
        },
        {
            prompt_es: "¿Limpiaste la ventana de la cocina?",
            prompt_en: "Did you clean the kitchen window?",
            expected_responses: [
                { es: "sí, la ventana está limpia ahora", en: "Yes, the window is clean now" },
                { es: "no, olvidé limpiar la cocina", en: "No, I forgot to clean the kitchen" },
                { es: "quiero arreglar la ventana antes", en: "Before, I want to fix the window" }
            ]
        },
        {
            prompt_es: "¿Cuántos zapatos nuevos tienes?",
            prompt_en: "How many new shoes do you have?",
            expected_responses: [
                { es: "tengo dieciocho zapatos en mi casa", en: "I have eighteen shoes at my house" },
                { es: "solo tengo un par nuevo", en: "I only have one new pair" },
                { es: "necesito comprar zapatos para el viaje", en: "I need to buy shoes for the trip" }
            ]
        },
        {
            prompt_es: "¿Quieres esperar el autobús aquí?",
            prompt_en: "Do you want to wait for the bus here?",
            expected_responses: [
                { es: "sí, el transporte es tarde hoy", en: "Yes, the transport is late today" },
                { es: "no, prefiero ir al aeropuerto ahora", en: "No, I prefer to go to the airport now" },
                { es: "es mejor esperar en la estación", en: "It is better to wait at the station" }
            ]
        },
        {
            prompt_es: "¿Por qué compraste catorce manzanas?",
            prompt_en: "Why did you buy fourteen apples?",
            expected_responses: [
                { es: "porque mi familia come mucha fruta", en: "Because my family eats a lot of fruit" },
                { es: "para preparar un desayuno grande", en: "To prepare a big breakfast" },
                { es: "ya olvidé por qué las compré", en: "I already forgot why I bought them" }
            ]
        },
        {
            prompt_es: "¿Te gusta viajar en avión?",
            prompt_en: "Do you like to travel by plane?",
            expected_responses: [
                { es: "sí, el viaje en avión es rápido", en: "Yes, the trip by plane is fast" },
                { es: "no, prefiero el tren o el autobús", en: "No, I prefer the train or the bus" },
                { es: "a menudo viajo por mi trabajo", en: "Often I travel for my work" }
            ]
        },
        {
            prompt_es: "¿Tienes diecinueve boletos de tren?",
            prompt_en: "Do you have nineteen train tickets?",
            expected_responses: [
                { es: "sí, tengo diecinueve boletos listos", en: "Yes, I have nineteen tickets ready" },
                { es: "no, solo tengo quince boletos", en: "No, I only have fifteen tickets" },
                { es: "necesito veinte para el grupo", en: "I need twenty for the group" }
            ]
        },
        {
            prompt_es: "¿Cuándo vas a visitar a tu familia?",
            prompt_en: "When are you going to visit your family?",
            expected_responses: [
                { es: "normalmente los visito temprano", en: "Normally I visit them early" },
                { es: "voy a ir ahora en tren", en: "I am going to go now by train" },
                { es: "mañana porque hoy tengo tarea", en: "Tomorrow because today I have homework" }
            ]
        },
        {
            prompt_es: "¿Dejaste un mensaje en mi teléfono?",
            prompt_en: "Did you leave a message on my phone?",
            expected_responses: [
                { es: "sí, envié un mensaje rápido", en: "Yes, I sent a quick message" },
                { es: "no, olvidé su información", en: "No, I forgot your information" },
                { es: "todavía no, llamo más tarde", en: "Not yet, I will call later" }
            ]
        },
        {
            prompt_es: "¿Qué película quieres ver en la televisión?",
            prompt_en: "What movie do you want to watch on TV?",
            expected_responses: [
                { es: "quiero ver una película nueva", en: "I want to watch a new movie" },
                { es: "prefiero escuchar música ahora", en: "I prefer to listen to music now" },
                { es: "cualquier película buena es perfecta", en: "Any good movie is perfect" }
            ]
        },
        {
            prompt_es: "¿Dónde compraste esos zapatos nuevos?",
            prompt_en: "Where did you buy those new shoes?",
            expected_responses: [
                { es: "los compré cerca de la estación", en: "I bought them near the station" },
                { es: "en un lugar pequeño del centro", en: "In a small place downtown" },
                { es: "ya olvidé el nombre de la tienda", en: "I already forgot the name of the store" }
            ]
        },
        {
            prompt_es: "¿Por qué abriste la ventana de la cocina?",
            prompt_en: "Why did you open the kitchen window?",
            expected_responses: [
                { es: "porque la cocina está muy caliente", en: "Because the kitchen is very hot" },
                { es: "antes de limpiar la cocina hoy", en: "Before cleaning the kitchen today" },
                { es: "para ver el jardín un minuto", en: "To see the garden for a minute" }
            ]
        },
        {
            prompt_es: "¿Tienes suficiente información para el viaje?",
            prompt_en: "Do you have enough information for the trip?",
            expected_responses: [
                { es: "sí, ya tengo la información lista", en: "Yes, I already have the information ready" },
                { es: "todavía necesito esperar el mensaje", en: "I still need to wait for the message" },
                { es: "no, la información es muy difícil", en: "No, the information is very difficult" }
            ]
        },
        {
            prompt_es: "¿Quieres cenar temprano hoy?",
            prompt_en: "Do you want to have dinner early today?",
            expected_responses: [
                { es: "sí, quiero cenar ahora por favor", en: "Yes, I want to have dinner now please" },
                { es: "no, normalmente ceno muy tarde", en: "No, normally I have dinner very late" },
                { es: "porque tengo que hacer la tarea antes", en: "Because I have to do homework before" }
            ]
        },
        {
            prompt_es: "¿Arreglaste el coche de tu padre?",
            prompt_en: "Did you fix your father's car?",
            expected_responses: [
                { es: "sí, arreglar el coche fue fácil", en: "Yes, fixing the car was easy" },
                { es: "todavía estoy arreglando el coche", en: "I am still fixing the car" },
                { es: "no, el coche está en el taller", en: "No, the car is in the repair shop" }
            ]
        },
        {
            prompt_es: "¿Cuántos minutos faltan para llegar?",
            prompt_en: "How many minutes are left to arrive?",
            expected_responses: [
                { es: "faltan quince minutos para llegar", en: "There are fifteen minutes left to arrive" },
                { es: "llegamos temprano en doce minutos", en: "We arrive early in twelve minutes" },
                { es: "el autobús llega tarde hoy", en: "The bus arrives late today" }
            ]
        },
        {
            prompt_es: "¿A menudo viajas en avión?",
            prompt_en: "Do you often travel by plane?",
            expected_responses: [
                { es: "a menudo viajo por mi trabajo", en: "Often I travel for my work" },
                { es: "no, prefiero viajar en tren rápido", en: "No, I prefer to travel by fast train" },
                { es: "ya es mi segundo viaje este año", en: "It is already my second trip this year" }
            ]
        },
        {
            prompt_es: "¿Olvidaste preparar el almuerzo hoy?",
            prompt_en: "Did you forget to prepare lunch today?",
            expected_responses: [
                { es: "sí, olvidé cocinar el almuerzo temprano", en: "Yes, I forgot to cook lunch early" },
                { es: "no, la comida está en la cocina", en: "No, the food is in the kitchen" },
                { es: "ya preparé un filete con arroz", en: "I already prepared a steak with rice" }
            ]
        },
        {
            prompt_es: "¿Quieres probar estos zapatos negros?",
            prompt_en: "Do you want to try these black shoes?",
            expected_responses: [
                { es: "sí, quiero probar los zapatos nuevos", en: "Yes, I want to try the new shoes" },
                { es: "no, mis zapatos viejos son buenos", en: "No, my old shoes are good" },
                { es: "los zapatos son pequeños para mí", en: "The shoes are small for me" }
            ]
        },
        {
            prompt_es: "¿Por qué quieres irse del hotel ahora?",
            prompt_en: "Why do you want to leave the hotel now?",
            expected_responses: [
                { es: "porque mi avión sale en una hora", en: "Because my plane leaves in an hour" },
                { es: "antes quiero visitar la estación", en: "Before I want to visit the station" },
                { es: "irse temprano es una buena idea", en: "Leaving early is a good idea" }
            ]
        },
        {
            prompt_es: "¿Tienes catorce o quince boletos?",
            prompt_en: "Do you have fourteen or fifteen tickets?",
            expected_responses: [
                { es: "tengo catorce boletos para el transporte", en: "I have fourteen tickets for the transport" },
                { es: "necesito quince boletos para la familia", en: "I need fifteen tickets for the family" },
                { es: "solo tengo once boletos hoy", en: "I only have eleven tickets today" }
            ]
        },
        {
            prompt_es: "¿Normalmente estudias después de la cena?",
            prompt_en: "Do you normally study after dinner?",
            expected_responses: [
                { es: "normalmente estudio antes de la cena", en: "Normally I study before dinner" },
                { es: "sí, estudio treinta minutos todas las noches", en: "Yes, I study thirty minutes every night" },
                { es: "no, prefiero ver una película tarde", en: "No, I prefer to watch a movie late" }
            ]
        },
        {
            prompt_es: "¿Dónde está la ventana de su cocina?",
            prompt_en: "Where is the window of your kitchen?",
            expected_responses: [
                { es: "está cerca de la puerta grande", en: "It is near the big door" },
                { es: "la ventana abre al jardín claro", en: "The window opens to the clear garden" },
                { es: "olvidé cerrar la ventana ahora", en: "I forgot to close the window now" }
            ]
        },
        {
            prompt_es: "¿Quieres desayunar temprano mañana?",
            prompt_en: "Do you want to have breakfast early tomorrow?",
            expected_responses: [
                { es: "sí, el desayuno temprano es bueno", en: "Yes, early breakfast is good" },
                { es: "no, mañana prefiero levantarser tarde", en: "No, tomorrow I prefer to get up late" },
                { es: "quiero pan, leche y fruta ahora", en: "I want bread, milk and fruit now" }
            ]
        },
        {
            prompt_es: "¿Tienes diecisiete minutos para hablar?",
            prompt_en: "Do you have seventeen minutes to talk?",
            expected_responses: [
                { es: "sí, tengo tiempo libre ahora", en: "Yes, I have free time now" },
                { es: "todavía necesito terminar mi tarea", en: "I still need to finish my homework" },
                { es: "lo siento, el transporte llega ya", en: "I am sorry, the transport is arriving already" }
            ]
        },
        {
            prompt_es: "¿Por qué no respondiste mi mensaje anoche?",
            prompt_en: "Why didn't you answer my message last night?",
            expected_responses: [
                { es: "porque ya estaba durmiendo temprano", en: "Because I was already sleeping early" },
                { es: "olvidé mi teléfono en la escuela", en: "I forgot my phone at school" },
                { es: "leí el mensaje hoy por la mañana", en: "I read the message today in the morning" }
            ]
        },
        {
            prompt_es: "¿El transporte llegó a tiempo hoy?",
            prompt_en: "Did the transport arrive on time today?",
            expected_responses: [
                { es: "sí, el autobús llegó muy temprano", en: "Yes, the bus arrived very early" },
                { es: "no, el tren llegó veinte minutos tarde", en: "No, the train arrived twenty minutes late" },
                { es: "todavía estoy esperando en la estación", en: "I am still waiting at the station" }
            ]
        }
    ],

    B1: [
        {
            prompt_es: "¿Has estado trabajando en el nuevo restaurante?",
            prompt_en: "Have you been working at the new restaurant?",
            expected_responses: [
                { es: "sí, he estado trabajando allí un mes", en: "Yes, I have been working there a month" },
                { es: "no, he estado estudiando para mejorar", en: "No, I have been studying to improve" },
                { es: "todavía no, pero quiero empezar ahora", en: "Not yet, but I want to start now" }
            ]
        },
        {
            prompt_es: "¿Qué has aprendido de las experiencias pasadas?",
            prompt_en: "What have you learned from past experiences?",
            expected_responses: [
                { es: "he aprendido a mejorar mis habilidades", en: "I have learned to improve my skills" },
                { es: "he aprendido a escuchar con atención", en: "I have learned to listen carefully" },
                { es: "todavía necesito revisar la información", en: "I still need to review the information" }
            ]
        },
        {
            prompt_es: "¿Ha traído el menú el restaurante?",
            prompt_en: "Has the restaurant brought the menu?",
            expected_responses: [
                { es: "sí, ha traído el menú a la mesa", en: "Yes, they have brought the menu to the table" },
                { es: "no, por favor trae la cuenta también", en: "No, please bring the bill too" },
                { es: "quiero entender el menú antes de comer", en: "I want to understand the menu before eating" }
            ]
        },
        {
            prompt_es: "¿Dónde has estado viviendo este mes?",
            prompt_en: "Where have you been living this month?",
            expected_responses: [
                { es: "he estado viviendo cerca del aeropuerto", en: "I have been living near the airport" },
                { es: "he estado viviendo con mi familia", en: "I have been living with my family" },
                { es: "planeamos mudarse de casa pronto", en: "We plan to move house soon" }
            ]
        },
        {
            prompt_es: "¿Han cancelado el viaje de autobús hoy?",
            prompt_en: "Have they canceled the bus trip today?",
            expected_responses: [
                { es: "sí, han cancelado el transporte por problemas", en: "Yes, they have canceled the transport due to problems" },
                { es: "no, el autobús llega en quince minutos", en: "No, the bus arrives in fifteen minutes" },
                { es: "necesito encontrar otra estación rápido", en: "I need to find another station quickly" }
            ]
        },
        {
            prompt_es: "¿Estás leyendo las noticias diarias en casa?",
            prompt_en: "Are you reading the daily news at home?",
            expected_responses: [
                { es: "sí, estoy leyendo para mejorar mi comunicación", en: "Yes, I am reading to improve my communication" },
                { es: "no, prefiero continuar mis conversaciones", en: "No, I prefer to continue my conversations" },
                { es: "olvidé revisar la información diarias", en: "I forgot to review the daily information" }
            ]
        },
        {
            prompt_es: "¿Hemos conseguido los boletos para el avión?",
            prompt_en: "Have we gotten the tickets for the plane?",
            expected_responses: [
                { es: "sí, hemos conseguido los boletos temprano", en: "Yes, we have gotten the tickets early" },
                { es: "todavía no, el transporte es difícil", en: "Not yet, the transport is difficult" },
                { es: "necesito encontrar la cuenta del viaje", en: "I need to find the bill for the trip" }
            ]
        },
        {
            prompt_es: "¿Qué estás preparando para la cena hoy?",
            prompt_en: "What are you preparing for dinner today?",
            expected_responses: [
                { es: "estoy preparando pollo con arroz y queso", en: "I am preparing chicken with rice and cheese" },
                { es: "he preparado un filete con papas fritas", en: "I have prepared a steak with french fries" },
                { es: "quiero preparar sopa mientras esperamos", en: "I want to prepare soup while we wait" }
            ]
        },
        {
            prompt_es: "¿Has entendido las conversaciones de la escuela?",
            prompt_en: "Have you understood the school conversations?",
            expected_responses: [
                { es: "sí, he entendido casi todo hoy", en: "Yes, I have understood almost everything today" },
                { es: "sin embargo necesito estudiar más", en: "However, I need to study more" },
                { es: "todavía es difícil entender rápido", en: "It is still difficult to understand fast" }
            ]
        },
        {
            prompt_es: "¿Quieres unirse a nuestro viaje este mes?",
            prompt_en: "Do you want to join our trip this month?",
            expected_responses: [
                { es: "sí, quiero unirse a su grupo hoy", en: "Yes, I want to join your group today" },
                { es: "no, tengo que trabajar durante el mes", en: "No, I have to work during the month" },
                { es: "planeamos visitar a los padres antes", en: "We plan to visit parents before" }
            ]
        },
        {
            prompt_es: "¿A qué hora hemos terminado las tareas diarias?",
            prompt_en: "What time have we finished the daily tasks?",
            expected_responses: [
                { es: "hemos terminado temprano hoy", en: "We have finished early today" },
                { es: "después de estudiar tres horas", en: "After studying for three hours" },
                { es: "todavía estamos trabajando en ellas ahora", en: "We are still working on them now" }
            ]
        },
        {
            prompt_es: "¿Por qué han cancelado su cuenta del hotel?",
            prompt_en: "Why have they canceled their hotel account?",
            expected_responses: [
                { es: "porque han cambiado su plan de viaje", en: "Because they have changed their trip plan" },
                { es: "sin embargo van a pagar la cuenta mañana", en: "However they are going to pay the bill tomorrow" },
                { es: "olvidaron revisar la información antes de irse", en: "They forgot to review the information before leaving" }
            ]
        },
        {
            prompt_es: "¿Estás estudiando para mejorar tus habilidades hoy?",
            prompt_en: "Are you studying to improve your skills today?",
            expected_responses: [
                { es: "sí, estoy estudiando para conseguir un trabajo", en: "Yes, I am studying to get a job" },
                { es: "necesito continuar mis conversaciones diarias", en: "I need to continue my daily conversations" },
                { es: "revisar mis libros me ayuda a aprender rápido", en: "Reviewing my books helps me learn fast" }
            ]
        },
        {
            prompt_es: "¿Has traído la comida del restaurante?",
            prompt_en: "Have you brought the food from the restaurant?",
            expected_responses: [
                { es: "sí, he traído pan, sopa y queso", en: "Yes, I have brought bread, soup and cheese" },
                { es: "no, el restaurante está cerrado ahora", en: "No, the restaurant is closed now" },
                { es: "traer la comida es difícil sin transporte", en: "Bringing the food is difficult without transport" }
            ]
        },
        {
            prompt_es: "¿Dónde podemos encontrar un buen menú hoy?",
            prompt_en: "Where can we find a good menu today?",
            expected_responses: [
                { es: "podemos encontrar un menú en el hotel", en: "We can find a menu at the hotel" },
                { es: "mientras caminamos podemos buscar un restaurante", en: "While we walk we can look for a restaurant" },
                { es: "ya tengo el menú de la cocina aquí", en: "I already have the kitchen menu here" }
            ]
        },
        {
            prompt_es: "¿Cuánto tiempo has estado viviendo en esta casa?",
            prompt_en: "How much time have you been living in this house?",
            expected_responses: [
                { es: "he estado viviendo aquí durante dos años", en: "I have been living here for two years" },
                { es: "hemos vivido aquí un mes solamente", en: "We have lived here one month only" },
                { es: "después de este mes quiero mudarse", en: "After this month I want to move" }
            ]
        },
        {
            prompt_es: "¿Qué estás leyendo sobre las experiencias pasadas?",
            prompt_en: "What are you reading about past experiences?",
            expected_responses: [
                { es: "estoy leyendo un libro sobre comunicación", en: "I am reading a book about communication" },
                { es: "ha sido un viaje largo y difícil", en: "It has been a long and difficult trip" },
                { es: "quiero entender su problemas antes de seguir", en: "I want to understand their problems before following" }
            ]
        },
        {
            prompt_es: "¿Quieres planear un nuevo viaje conmigo?",
            prompt_en: "Do you want to plan a new trip with me?",
            expected_responses: [
                { es: "sí, quiero planear un viaje en avión", en: "Yes, I want to plan a trip by plane" },
                { es: "durante este mes no tengo tiempo libre", en: "During this month I do not have free time" },
                { es: "sin embargo podemos hablar de eso después", en: "However we can talk about that later" }
            ]
        },
        {
            prompt_es: "¿Has conseguido revisar la información del tren?",
            prompt_en: "Have you managed to review the train information?",
            expected_responses: [
                { es: "sí, he revisado todo en la estación", en: "Yes, I have reviewed everything at the station" },
                { es: "todavía no, el mensaje no llegó", en: "Not yet, the message did not arrive" },
                { es: "necesito encontrar mi boleto de tren antes", en: "I need to find my train ticket before" }
            ]
        },
        {
            prompt_es: "¿Por qué has decidido mudarse de casa este año?",
            prompt_en: "Why have you decided to move house this year?",
            expected_responses: [
                { es: "porque mi nueva casa está cerca del trabajo", en: "Because my new house is near work" },
                { es: "para vivir con mi familia otra vez", en: "To live with my family again" },
                { es: "he estado viviendo en un lugar muy pequeño", en: "I have been living in a very small place" }
            ]
        },
        {
            prompt_es: "¿Has pagado la cuenta en el restaurante?",
            prompt_en: "Have you paid the bill at the restaurant?",
            expected_responses: [
                { es: "sí, ya he pagado la cuenta con dinero", en: "Yes, I have already paid the bill with money" },
                { es: "no, todavía espero que traigan la cuenta", en: "No, I am still waiting for them to bring the bill" },
                { es: "mi amigo ha pagado todo hoy", en: "My friend has paid for everything today" }
            ]
        },
        {
            prompt_es: "¿Estás trabajando para mejorar tus habilidades diarias?",
            prompt_en: "Are you working to improve your daily skills?",
            expected_responses: [
                { es: "sí, estoy trabajando duro cada hora", en: "Yes, I am working hard every hour" },
                { es: "quiero continuar aprendiendo más cosas", en: "I want to continue learning more things" },
                { es: "revisar mi tarea me ayuda a mejorar", en: "Reviewing my homework helps me improve" }
            ]
        },
        {
            prompt_es: "¿Ha preparado ella la comida para el viaje?",
            prompt_en: "Has she prepared the food for the trip?",
            expected_responses: [
                { es: "sí, ha preparado pan, queso y fruta", en: "Yes, she has prepared bread, cheese and fruit" },
                { es: "está preparando la comida en la cocina ahora", en: "She is preparing the food in the kitchen now" },
                { es: "no, olvidó preparar las cosas diarias", en: "No, she forgot to prepare the daily things" }
            ]
        },
        {
            prompt_es: "¿Dónde han estado estudiando tus hermanos este mes?",
            prompt_en: "Where have your brothers been studying this month?",
            expected_responses: [
                { es: "han estado estudiando en la escuela grande", en: "They have been studying at the big school" },
                { es: "hemos estado estudiando juntos en casa", en: "We have been studying together at home" },
                { es: "ellos quieren continuar estudiando en el hotel", en: "They want to continue studying at the hotel" }
            ]
        },
        {
            prompt_es: "¿Quieres leer su mensaje mientras esperamos el tren?",
            prompt_en: "Do you want to read his message while we wait for the train?",
            expected_responses: [
                { es: "sí, quiero leer el mensaje ahora", en: "Yes, I want to read the message now" },
                { es: "no, prefiero escuchar música en mi televisión", en: "No, I prefer to listen to music on my television" },
                { es: "necesito revisar la información del transporte antes", en: "I need to review the transport information before" }
            ]
        },
        {
            prompt_es: "¿Has conseguido encontrar un lugar cerca de la estación?",
            prompt_en: "Have you managed to find a place near the station?",
            expected_responses: [
                { es: "sí, he encontrado una casa pequeña muy cerca", en: "Yes, I have found a small house very near" },
                { es: "todavía estoy buscando con mi amigo", en: "I am still looking with my friend" },
                { es: "es difícil encontrar un lugar rápido hoy", en: "It is difficult to find a place quickly today" }
            ]
        },
        {
            prompt_es: "¿Por qué has cancelado tus conversaciones de hoy?",
            prompt_en: "Why have you canceled your conversations today?",
            expected_responses: [
                { es: "porque he estado muy cansado este mes", en: "Because I have been very tired this month" },
                { es: "necesito preparar mi viaje de avión antes", en: "I need to prepare my plane trip before" },
                { es: "sin embargo podemos hablar después de cenar", en: "However we can talk after having dinner" }
            ]
        },
        {
            prompt_es: "¿Qué ha dicho su familia sobre la mudanza?",
            prompt_en: "What has his family said about the move?",
            expected_responses: [
                { es: "ellos quieren mudarse el próximo mes", en: "They want to move next month" },
                { es: "están felices con el cambio de lugar", en: "They are happy with the change of place" },
                { es: "todavía tienen problemas para empaquetar", en: "They still have problems packing" }
            ]
        },
        {
            prompt_es: "¿Estás viviendo con tus padres este año?",
            prompt_en: "Are you living with your parents this year?",
            expected_responses: [
                { es: "sí, he estado viviendo con ellos cinco meses", en: "Yes, I have been working/living with them for five months" },
                { es: "no, prefiero vivir solo en la ciudad", en: "No, I prefer to live alone in the city" },
                { es: "quiero mudarse a otra casa pronto", en: "I want to move to another house soon" }
            ]
        },
        {
            prompt_es: "¿Has revisado el menú del nuevo restaurante?",
            prompt_en: "Have you reviewed the menu of the new restaurant?",
            expected_responses: [
                { es: "sí, el menú tiene filete, pollo y pescado", en: "Yes, the menu has steak, chicken and fish" },
                { es: "no, olvidé mirar el menú antes", en: "No, I forgot to look at the menu before" },
                { es: "quiero entender sus precios primero", en: "I want to understand their prices first" }
            ]
        },
        {
            prompt_es: "¿Has continuado estudiando durante el viaje?",
            prompt_en: "Have you continued studying during the trip?",
            expected_responses: [
                { es: "sí, he estado estudiando libros diarios", en: "Yes, I have been studying daily books" },
                { es: "no, he estado descansando y viendo películas", en: "No, I have been resting and watching movies" },
                { es: "mientras viajo es difícil estudiar más", en: "While I travel it is difficult to study more" }
            ]
        },
        {
            prompt_es: "¿Han traído los padres su coche nuevo?",
            prompt_en: "Have the parents brought their new car?",
            expected_responses: [
                { es: "sí, han traído el coche grande hoy", en: "Yes, they have brought the big car today" },
                { es: "no, el coche está arreglando en casa", en: "No, the car is fixing at home" },
                { es: "ellos quieren viajar en tren hoy", en: "They want to travel by train today" }
            ]
        },
        {
            prompt_es: "¿Quieres seguir las instrucciones del menú?",
            prompt_en: "Do you want to follow the menu instructions?",
            expected_responses: [
                { es: "sí, para preparar la sopa de pescado", en: "Yes, to prepare the fish soup" },
                { es: "no, quiero cocinar pollo con ensalada", en: "No, I want to cook chicken with salad" },
                { es: "necesito entender la información antes", en: "I need to understand the information before" }
            ]
        },
        {
            prompt_es: "¿Has conseguido la cuenta del transporte?",
            prompt_en: "Have you gotten the transport bill?",
            expected_responses: [
                { es: "sí, he conseguido la cuenta de la estación", en: "Yes, I have gotten the bill from the station" },
                { es: "todavía no, el mensaje no llegó", en: "Not yet, the message did not arrive" },
                { es: "mi amigo tiene el boleto y la cuenta", en: "My friend has the ticket and the bill" }
            ]
        },
        {
            prompt_es: "¿Por qué has estado leyendo sobre este lugar?",
            prompt_en: "Why have you been reading about this place?",
            expected_responses: [
                { es: "porque planeo visitar el hotel pronto", en: "Because I plan to visit the hotel soon" },
                { es: "para entender su cultura y comida buena", en: "To understand its culture and good food" },
                { es: "sin embargo solo leo por placer hoy", en: "However I only read for pleasure today" }
            ]
        },
        {
            prompt_es: "¿Han estado viviendo en este hotel cinco años?",
            prompt_en: "Have they been living in this hotel for five years?",
            expected_responses: [
                { es: "no, han estado viviendo aquí un mes", en: "No, they have been living here a month" },
                { es: "sí, han estado viviendo aquí muchos años", en: "Yes, they have been living here many years" },
                { es: "quieren mudarse de casa después de este mes", en: "They want to move house after this month" }
            ]
        },
        {
            prompt_es: "¿Quieres revisar tu tarea después de comer?",
            prompt_en: "Do you want to review your homework after eating?",
            expected_responses: [
                { es: "sí, necesito revisar todo hoy", en: "Yes, I need to review everything today" },
                { es: "no, prefiero escuchar música y descansar", en: "No, I prefer to listen to music and rest" },
                { es: "ya revisé las tareas diarias temprano", en: "I already reviewed the daily tasks early" }
            ]
        },
        {
            prompt_es: "¿Has estado trabajando para mejorar tu comunicación?",
            prompt_en: "Have you been working to improve your communication?",
            expected_responses: [
                { es: "sí, he estado teniendo muchas conversaciones", en: "Yes, I have been having many conversations" },
                { es: "quiero conseguir mejores habilidades este año", en: "I want to get better skills this year" },
                { es: "todavía es difícil hablar rápido con amigos", en: "It is still difficult to talk fast with friends" }
            ]
        },
        {
            prompt_es: "¿Qué has traído para el desayuno de hoy?",
            prompt_en: "What have you brought for today's breakfast?",
            expected_responses: [
                { es: "he traído pan caliente, leche y fruta", en: "I have brought hot bread, milk and fruit" },
                { es: "no he traído nada de la cocina", en: "I have not brought anything from the kitchen" },
                { es: "mi hermana ha preparado huevos con queso", en: "My sister has prepared eggs with cheese" }
            ]
        },
        {
            prompt_es: "¿Han conseguido entender sus problemas?",
            prompt_en: "Have they managed to understand their problems?",
            expected_responses: [
                { es: "sí, han conversado durante una hora", en: "Yes, they have conversed for an hour" },
                { es: "sin embargo necesitan cambiar su estrategia", en: "However they need to change their strategy" },
                { es: "todavía no, es una situación difícil", en: "Not yet, it is a difficult situation" }
            ]
        },
        {
            prompt_es: "¿Has planeado cancelar tu viaje en avión?",
            prompt_en: "Have you planned to cancel your plane trip?",
            expected_responses: [
                { es: "sí, he tenido que cancelar el viaje hoy", en: "Yes, I have had to cancel the trip today" },
                { es: "no, quiero ir al hotel este mes", en: "No, I want to go to the hotel this month" },
                { es: "todavía no, espero revisar la información antes", en: "Not yet, I hope to review the information before" }
            ]
        },
        {
            prompt_es: "¿Qué habilidades has aprendido en tu nuevo trabajo?",
            prompt_en: "What skills have you learned in your new job?",
            expected_responses: [
                { es: "he aprendido a mejorar mi comunicación diaria", en: "I have learned to improve my daily communication" },
                { es: "he estado aprendiendo a preparar comida", en: "I have been learning to prepare food" },
                { es: "todavía necesito continuar aprendiendo más", en: "I still need to continue learning more" }
            ]
        },
        {
            prompt_es: "¿Han estado leyendo sus libros durante la tarde?",
            prompt_en: "Have they been reading their books during the afternoon?",
            expected_responses: [
                { es: "sí, han estado leyendo sobre experiencias pasadas", en: "Yes, they have been reading about past experiences" },
                { es: "no, prefieren escuchar música o ver televisión", en: "No, they prefer to listen to music or watch TV" },
                { es: "mientras ellos descansan yo cocino la cena", en: "While they rest I cook dinner" }
            ]
        },
        {
            prompt_es: "¿Quieres continuar la conversación en el restaurante?",
            prompt_en: "Do you want to continue the conversation at the restaurant?",
            expected_responses: [
                { es: "sí, podemos pedir el menú y almorzar", en: "Yes, we can ask for the menu and have lunch" },
                { es: "no, prefiero ir a casa a descansar ahora", en: "No, I prefer to go home to rest now" },
                { es: "después de revisar la cuenta del hotel podemos ir", en: "After reviewing the hotel bill we can go" }
            ]
        },
        {
            prompt_es: "¿Ha conseguido tu hermano un nuevo lugar para vivir?",
            prompt_en: "Has your brother gotten a new place to live?",
            expected_responses: [
                { es: "sí, ha encontrado una casa pequeña muy buena", en: "Yes, he has found a very good small house" },
                { es: "todavía está viviendo con sus padres este mes", en: "He is still living with his parents this month" },
                { es: "quiere mudarse de casa después de este año", en: "He wants to move house after this year" }
            ]
        },
        {
            prompt_es: "¿Qué has estado preparando durante el mes?",
            prompt_en: "What have you been preparing during the month?",
            expected_responses: [
                { es: "he estado preparando mi viaje de avión", en: "I have been preparing my plane trip" },
                { es: "he preparado un nuevo plan para el trabajo", en: "I have prepared a new plan for work" },
                { es: "necesito preparar las tareas de la escuela", en: "I need to prepare the school homework" }
            ]
        },
        {
            prompt_es: "¿Has intentado seguir sus conversaciones diarias?",
            prompt_en: "Have you tried to follow their daily conversations?",
            expected_responses: [
                { es: "sí, pero hablan muy rápido en el restaurante", en: "Yes, but they talk very fast at the restaurant" },
                { es: "me ayuda a entender y mejorar mis habilidades", en: "It helps me understand and improve my skills" },
                { es: "sin embargo prefiero leer libros en casa", en: "However I prefer to read books at home" }
            ]
        },
        {
            prompt_es: "¿Por qué has traído a tu amigo a mi casa?",
            prompt_en: "Why have you brought your friend to my house?",
            expected_responses: [
                { es: "porque queremos estudiar y hacer la tarea juntos", en: "Because we want to study and do homework together" },
                { es: "para tener una conversación sobre las vacaciones", en: "To have a conversation about the vacation" },
                { es: "el quiere conocer a mi familia hoy", en: "He wants to meet my family today" }
            ]
        },
        {
            prompt_es: "¿Han conseguido revisar la cuenta del restaurante?",
            prompt_en: "Have they managed to review the restaurant bill?",
            expected_responses: [
                { es: "sí, han revisado la cuenta antes de pagar", en: "Yes, they have reviewed the bill before paying" },
                { es: "todavía no, la cuenta tiene problemas hoy", en: "Not yet, the bill has problems today" },
                { es: "mi padre ha pagado la cuenta del almuerzo ya", en: "My father has already paid the lunch bill" }
            ]
        },
        {
            prompt_es: "¿Quieres unirse a nosotros para cenar después?",
            prompt_en: "Do you want to join us for dinner later?",
            expected_responses: [
                { es: "sí, quiero unirse a su mesa después de trabajar", en: "Yes, I want to join your table after working" },
                { es: "lo siento, ya comí pescado en mi casa", en: "I am sorry, I already ate fish at my house" },
                { es: "mientras tenga que estudiar no puedo salir", en: "As long as I have to study I cannot go out" }
            ]
        }
    ],
    B2: [
        {
            prompt_es: "¿Cómo planeas optimizar el nuevo proceso del sistema?",
            prompt_en: "How do you plan to optimize the new system process?",
            expected_responses: [
                { es: "necesitamos analizar el rendimiento cuidadosamente", en: "We need to analyze the performance carefully" },
                { es: "con una estrategia efectiva podemos lograr resultados", en: "With an effective strategy we can achieve results" },
                { es: "aunque es complicado, podemos actualizar el enfoque", en: "Although it is complicated, we can update the approach" }
            ]
        },
        {
            prompt_es: "¿Has evaluado los riesgos de esta estrategia profesional?",
            prompt_en: "Have you evaluated the risks of this professional strategy?",
            expected_responses: [
                { es: "sí, he evaluado cada riesgo posible", en: "Yes, I have evaluated every possible risk" },
                { es: "por lo tanto es necesario cambiar el enfoque", en: "Therefore it is necessary to change the approach" },
                { es: "existe una posibilidad de tener problemas", en: "There is a possibility of having problems" }
            ]
        },
        {
            prompt_es: "¿Qué resultados han analizado en la reunión?",
            prompt_en: "What results have they analyzed in the meeting?",
            expected_responses: [
                { es: "han analizado un rendimiento muy positivo", en: "They have analyzed a very positive performance" },
                { es: "además han optimizado el concepto de trabajo", en: "In addition they have optimized the concept of work" },
                { es: "los resultados muestran que el sistema funciona", en: "The results show that the system works" }
            ]
        },
        {
            prompt_es: "¿Cómo podemos coordinar esta situación complicada?",
            prompt_en: "How can we coordinate this complicated situation?",
            expected_responses: [
                { es: "debemos coordinar los pasos cuidadosamente", en: "We must coordinate the steps carefully" },
                { es: "a pesar de los problemas, el enfoque es realista", en: "Despite the problems, the approach is realistic" },
                { es: "quiero discutir una nueva estrategia hoy", en: "I want to discuss a new strategy today" }
            ]
        },
        {
            prompt_es: "¿Has aclarado las expectativas para el futuro viaje?",
            prompt_en: "Have you clarified the expectations for the future trip?",
            expected_responses: [
                { es: "sí, he aclarado todo con mis padres", en: "Yes, I have clarified everything with my parents" },
                { es: "aunque es a largo plazo, el plan es bueno", en: "Although it is long term, the plan is good" },
                { es: "todavía necesito explorar un lugar remoto", en: "I still need to explore a remote place" }
            ]
        },
        {
            prompt_es: "¿Por qué han insistido en actualizar el sistema?",
            prompt_en: "Why have they insisted on updating the system?",
            expected_responses: [
                { es: "para aumentar la comunicación en la sociedad", en: "To increase communication in society" },
                { es: "han insistido porque la estrategia ha cambiado", en: "They have insisted because the strategy has changed" },
                { es: "incluso con problemas, es necesario avanzar", en: "Even with problems, it is necessary to move forward" }
            ]
        },
        {
            prompt_es: "¿Qué motivación necesitas para lograr tus metas?",
            prompt_en: "What motivation do you need to achieve your goals?",
            expected_responses: [
                { es: "mi familia es mi mayor motivación", en: "My family is my biggest motivation" },
                { es: "necesito fortalecer mis habilidades profesionales", en: "I need to strengthen my professional skills" },
                { es: "un enfoque positivo ayuda a cambiar la situación", en: "A positive approach helps to change the situation" }
            ]
        },
        {
            prompt_es: "¿Cómo se adapta tu cultura a estos desafíos?",
            prompt_en: "How does your culture adapt to these challenges?",
            expected_responses: [
                { es: "nuestra sociedad sabe adaptarse a los cambios", en: "Our society knows how to adapt to changes" },
                { es: "es un proceso complicado pero positivo", en: "It is a complicated but positive process" },
                { es: "discutir los desafíos ayuda a fortalecer la cultura", en: "Discussing challenges helps to strengthen culture" }
            ]
        },
        {
            prompt_es: "¿Has explorado la posibilidad de reducir el riesgo?",
            prompt_en: "Have you explored the possibility of reducing the risk?",
            expected_responses: [
                { es: "sí, he explorado una estrategia más realista", en: "Yes, I have explored a more realistic strategy" },
                { es: "por lo tanto hemos reducido el riesgo hoy", en: "Therefore we have reduced the risk today" },
                { es: "todavía es necesario analizar el concepto", en: "It is still necessary to analyze the concept" }
            ]
        },
        {
            prompt_es: "¿Es posible lograr un rendimiento efectivo ahora?",
            prompt_en: "Is it possible to achieve an effective performance now?",
            expected_responses: [
                { es: "sí, con un sistema innovadora es posible", en: "Yes, with an innovative system it is possible" },
                { es: "hemos optimizado el enfoque para lograrlo", en: "We have optimized the approach to achieve it" },
                { es: "sin embargo la situación actual es difícil", en: "However the current situation is difficult" }
            ]
        },

        {
            prompt_es: "¿Han discutido la nueva estrategia de comunicación?",
            prompt_en: "Have they discussed the new communication strategy?",
            expected_responses: [
                { es: "sí, han discutido la estrategia cuidadosamente", en: "Yes, they have discussed the strategy carefully" },
                { es: "además han aclarado todas las expectativas", en: "In addition they have clarified all expectations" },
                { es: "por lo tanto el proceso es más claro hoy", en: "Therefore the process is clearer today" }
            ]
        },
        {
            prompt_es: "¿Es necesario cambiar el enfoque a largo plazo?",
            prompt_en: "Is it necessary to change the long term approach?",
            expected_responses: [
                { es: "sí, un enfoque realista es necesario hoy", en: "Yes, a realistic approach is necessary today" },
                { es: "a pesar de los resultados, prefiero esperar", en: "Despite the results, I prefer to wait" },
                { es: "aunque es difícil, el futuro es positivo", en: "Although it is difficult, the future is positive" }
            ]
        },
        {
            prompt_es: "¿Has actualizado la información sobre el sistema?",
            prompt_en: "Have you updated the system information?",
            expected_responses: [
                { es: "sí, he actualizado la información hoy", en: "Yes, I have updated the information today" },
                { es: "necesito optimizar el proceso antes de cambiar", en: "I need to optimize the process before changing" },
                { es: "incluso sin ayuda, logré actualizar todo", en: "Even without help, I achieved updating everything" }
            ]
        },
        {
            prompt_es: "¿Qué desafíos tiene nuestra sociedad actual?",
            prompt_en: "What challenges does our current society have?",
            expected_responses: [
                { es: "debemos fortalecer la cultura y la educación", en: "We must strengthen culture and education" },
                { es: "la situación es un proceso complicado", en: "The situation is a complicated process" },
                { es: "por lo tanto la motivación es muy necesaria", en: "Therefore motivation is very necessary" }
            ]
        },
        {
            prompt_es: "¿Han evaluado el rendimiento del transporte?",
            prompt_en: "Have they evaluated the transport performance?",
            expected_responses: [
                { es: "sí, han evaluado el sistema de trenes", en: "Yes, they have evaluated the train system" },
                { es: "el rendimiento ha sido reducido este mes", en: "The performance has been reduced this month" },
                { es: "es posible coordinar un mejor transporte", en: "It is possible to coordinate better transport" }
            ]
        },
        {
            prompt_es: "¿Cómo lograste coordinar la reunión del restaurante?",
            prompt_en: "How did you manage to coordinate the restaurant meeting?",
            expected_responses: [
                { es: "coordinar la reunión fue un proceso fácil", en: "Coordinating the meeting was an easy process" },
                { es: "discutido el menú antes, todo fue rápido", en: "Having discussed the menu before, everything was fast" },
                { es: "traer la cuenta a tiempo ayudó mucho", en: "Bringing the bill on time helped a lot" }
            ]
        },
        {
            prompt_es: "¿Has analizado la posibilidad de un viaje remoto?",
            prompt_en: "Have you analyzed the possibility of a remote trip?",
            expected_responses: [
                { es: "sí, es una posibilidad a largo plazo", en: "Yes, it is a long-term possibility" },
                { es: "quiero explorar un lugar remoto en el futuro", en: "I want to explore a remote place in the future" },
                { es: "a pesar de los riesgos, el viaje es positivo", en: "Despite the risks, the trip is positive" }
            ]
        },
        {
            prompt_es: "¿Por qué has insistido en una estrategia innovadora?",
            prompt_en: "Why have you insisted on an innovative strategy?",
            expected_responses: [
                { es: "porque queremos optimizar los resultados", en: "Because we want to optimize the results" },
                { es: "una estrategia innovadora fortalece el trabajo", en: "An innovative strategy strengthens work" },
                { es: "aunque es complicado, ayuda a aumentar el rendimiento", en: "Although it is complicated, it helps to increase performance" }
            ]
        },
        {
            prompt_es: "¿Has aclarado el concepto de riesgo con tu equipo?",
            prompt_en: "Have you clarified the risk concept with your team?",
            expected_responses: [
                { es: "sí, el concepto ha sido aclarado hoy", en: "Yes, the concept has been clarified today" },
                { es: "por lo tanto todos entienden la situación", en: "Therefore everyone understands the situation" },
                { es: "todavía necesitamos evaluar algunas cosas", en: "We still need to evaluate some things" }
            ]
        },
        {
            prompt_es: "¿Es realista esperar un cambio positivo ahora?",
            prompt_en: "Is it realistic to expect a positive change now?",
            expected_responses: [
                { es: "sí, con un enfoque profesional es realista", en: "Yes, with a professional approach it is realistic" },
                { es: "hemos ampliado la estrategia para lograrlo", en: "We have expanded the strategy to achieve it" },
                { es: "sin embargo la situación es muy difícil", en: "However the situation is very difficult" }
            ]
        },
        {
            prompt_es: "¿Has logrado adaptar la estrategia para mejorar el proceso?",
            prompt_en: "Have you achieved adapting the strategy to improve the process?",
            expected_responses: [
                { es: "sí, me he adaptado a la nueva situación", en: "Yes, I have adapted to the new situation" },
                { es: "hemos optimizado el rendimiento del sistema", en: "We have optimized the system performance" },
                { es: "por lo tanto los resultados son muy positivos", en: "Therefore the results are very positive" }
            ]
        },
        {
            prompt_es: "¿Qué expectativas tienes sobre la cultura de la sociedad?",
            prompt_en: "What expectations do you have about the culture of society?",
            expected_responses: [
                { es: "quiero entender su sociedad y cultura mejor", en: "I want to understand their society and culture better" },
                { es: "además tengo altas expectativas para el futuro", en: "In addition I have high expectations for the future" },
                { es: "es un proceso necesario para fortalecer la unión", en: "It is a necessary process to strengthen the union" }
            ]
        },
        {
            prompt_es: "¿Han analizado los riesgos del enfoque actual?",
            prompt_en: "Have they analyzed the risks of the current approach?",
            expected_responses: [
                { es: "sí, han analizado cada riesgo cuidadosamente", en: "Yes, they have analyzed every risk carefully" },
                { es: "aunque es complicado, el enfoque es realista", en: "Although it is complicated, the approach is realistic" },
                { es: "por lo tanto prefieren cambiar la estrategia hoy", en: "Therefore they prefer to change the strategy today" }
            ]
        },
        {
            prompt_es: "¿Por qué has insistido en evaluar el rendimiento otra vez?",
            prompt_en: "Why have you insisted on evaluating the performance again?",
            expected_responses: [
                { es: "porque los resultados pasados no fueron buenos", en: "Because past results were not good" },
                { es: "necesitamos evaluar todo para optimizar el sistema", en: "We need to evaluate everything to optimize the system" },
                { es: "incluso con problemas, prefiero revisar la información", en: "Even with problems, I prefer to review the information" }
            ]
        },
        {
            prompt_es: "¿Es posible coordinar el transporte a largo plazo?",
            prompt_en: "Is it possible to coordinate long term transport?",
            expected_responses: [
                { es: "sí, es una posibilidad que estamos explorando", en: "Yes, it is a possibility that we are exploring" },
                { es: "a pesar de los desafíos, podemos lograrlo hoy", en: "Despite the challenges, we can achieve it today" },
                { es: "necesitamos coordinar con el aeropuerto antes", en: "We need to coordinate with the airport before" }
            ]
        },
        {
            prompt_es: "¿Has aclarado el concepto innovadora con tu familia?",
            prompt_en: "Have you clarified the innovative concept with your family?",
            expected_responses: [
                { es: "sí, el concepto ha sido aclarado en casa", en: "Yes, the concept has been clarified at home" },
                { es: "ellos tienen una motivación muy positiva hoy", en: "They have a very positive motivation today" },
                { es: "aunque es difícil de entender, les gusta", en: "Although it is difficult to understand, they like it" }
            ]
        },
        {
            prompt_es: "¿Cómo podemos fortalecer la estrategia profesional?",
            prompt_en: "How can we strengthen the professional strategy?",
            expected_responses: [
                { es: "debemos actualizar el sistema y las habilidades", en: "We must update the system and the skills" },
                { es: "además es necesario aumentar la comunicación", en: "In addition it is necessary to increase communication" },
                { es: "un enfoque profesional ayuda a reducir riesgos", en: "A professional approach helps to reduce risks" }
            ]
        },
        {
            prompt_es: "¿Han explorado un lugar remoto durante su viaje?",
            prompt_en: "Have they explored a remote place during their trip?",
            expected_responses: [
                { es: "sí, han explorado un lugar muy remoto", en: "Yes, they have explored a very remote place" },
                { es: "su viaje a largo plazo ha sido positivo", en: "Their long term trip has been positive" },
                { es: "sin embargo fue un proceso complicado llegar allí", en: "However it was a complicated process to get there" }
            ]
        },
        {
            prompt_es: "¿Por lo tanto has decidido actualizar la información?",
            prompt_en: "Therefore have you decided to update the information?",
            expected_responses: [
                { es: "sí, he actualizado los resultados del proceso", en: "Yes, I have updated the process results" },
                { es: "ya he analizado la situación cuidadosamente", en: "I have already analyzed the situation carefully" },
                { es: "todavía necesito discutir esto con mi amigo", en: "I still need to discuss this with my friend" }
            ]
        },
        {
            prompt_es: "¿Es complicado lograr un enfoque realista hoy?",
            prompt_en: "Is it complicated to achieve a realistic approach today?",
            expected_responses: [
                { es: "sí, la situación actual es muy complicada", en: "Yes, the current situation is very complicated" },
                { es: "aunque es difícil, con trabajo es posible", en: "Although it is difficult, with work it is possible" },
                { es: "hemos ampliado la estrategia para lograr resultados", en: "We have expanded the strategy to achieve results" }
            ]
        },
        {
            prompt_es: "¿Has logrado optimizar el rendimiento del restaurante?",
            prompt_en: "Have you achieved optimizing the performance of the restaurant?",
            expected_responses: [
                { es: "sí, hemos optimizado el proceso de la cocina", en: "Yes, we have optimized the kitchen process" },
                { es: "por lo tanto los resultados son muy positivos hoy", en: "Therefore the results are very positive today" },
                { es: "aunque fue complicado, logramos cambiar el enfoque", en: "Although it was complicated, we achieved changing the approach" }
            ]
        },
        {
            prompt_es: "¿Qué estrategia profesional tienes para el futuro?",
            prompt_en: "What professional strategy do you have for the future?",
            expected_responses: [
                { es: "planeo fortalecer mis habilidades a largo plazo", en: "I plan to strengthen my skills long term" },
                { es: "además quiero explorar un enfoque innovadora", en: "In addition I want to explore an innovative approach" },
                { es: "mi estrategia es reducir el riesgo del proceso", en: "My strategy is to reduce the risk of the process" }
            ]
        },
        {
            prompt_es: "¿Han coordinado la información de la mudanza?",
            prompt_en: "Have they coordinated the information of the move?",
            expected_responses: [
                { es: "sí, la situación ha sido coordinada cuidadosamente", en: "Yes, the situation has been coordinated carefully" },
                { es: "hemos actualizado los planes de viaje hoy", en: "We have updated the trip plans today" },
                { es: "incluso con problemas, es posible mudarse pronto", en: "Even with problems, it is possible to move soon" }
            ]
        },
        {
            prompt_es: "¿Por qué has discutido los desafíos con la familia?",
            prompt_en: "Why have you discussed the challenges with the family?",
            expected_responses: [
                { es: "porque sus expectativas son muy altas", en: "Because their expectations are very high" },
                { es: "discutir los problemas ayuda a la motivación", en: "Discussing the problems helps motivation" },
                { es: "queremos adaptarse juntos a la nueva situación", en: "We want to adapt together to the new situation" }
            ]
        },
        {
            prompt_es: "¿Es necesario evaluar el sistema de transporte?",
            prompt_en: "Is it necessary to evaluate the transport system?",
            expected_responses: [
                { es: "sí, para reducir el riesgo en la estación", en: "Yes, to reduce the risk at the station" },
                { es: "hemos evaluado el rendimiento del autobús antes", en: "We have evaluated the bus performance before" },
                { es: "por lo tanto un enfoque realista es posible hoy", en: "Therefore a realistic approach is possible today" }
            ]
        },
        {
            prompt_es: "¿Has aclarado el concepto de sociedad con tus amigos?",
            prompt_en: "Have you clarified the concept of society with your friends?",
            expected_responses: [
                { es: "sí, hemos analizado su cultura cuidadosamente", en: "Yes, we have analyzed its culture carefully" },
                { es: "es un concepto complicado pero muy positivo", en: "It is a complicated but very positive concept" },
                { es: "además ayuda a entender las experiencias pasadas", en: "In addition it helps to understand past experiences" }
            ]
        },
        {
            prompt_es: "¿Han aumentado los resultados de tu trabajo?",
            prompt_en: "Have the results of your work increased?",
            expected_responses: [
                { es: "sí, he logrado aumentar mi rendimiento este mes", en: "Yes, I have achieved increasing my performance this month" },
                { es: "con una estrategia efectiva todo es posible", en: "With an effective strategy everything is possible" },
                { es: "sin embargo la situación actual es difícil", en: "However the current situation is difficult" }
            ]
        },
        {
            prompt_es: "¿Cómo podemos lograr un enfoque realista para el viaje?",
            prompt_en: "How can we achieve a realistic approach for the trip?",
            expected_responses: [
                { es: "debemos planear los pasos del viaje antes", en: "We must plan the trip steps before" },
                { es: "a pesar de la distancia, es un lugar remoto bueno", en: "Despite the distance, it is a good remote place" },
                { es: "aunque es a largo plazo, el plan es efectivo", en: "Although it is long term, the plan is effective" }
            ]
        },
        {
            prompt_es: "¿Por qué has argumentado que el riesgo es alto?",
            prompt_en: "Why have you argued that the risk is high?",
            expected_responses: [
                { es: "porque ya he evaluado la situación otra vez", en: "Because I have already evaluated the situation again" },
                { es: "el proceso actual tiene muchos desafíos", en: "The current process has many challenges" },
                { es: "por lo tanto es necesario cambiar la estrategia", en: "Therefore it is necessary to change the strategy" }
            ]
        },
        {
            prompt_es: "¿Has explorado un sistema más innovadora este año?",
            prompt_en: "Have you explored a more innovative system this year?",
            expected_responses: [
                { es: "sí, he explorado un sistema profesional nuevo", en: "Yes, I have explored a new professional system" },
                { es: "hemos ampliado el enfoque para optimizar resultados", en: "We have expanded the approach to optimize results" },
                { es: "todavía necesito discutir esto con mi equipo", en: "I still need to discuss this with my team" }
            ]
        },
        {
            prompt_es: "¿Has logrado coordinar las expectativas con tu familia?",
            prompt_en: "Have you achieved coordinating the expectations with your family?",
            expected_responses: [
                { es: "sí, las expectativas han sido aclaradas hoy", en: "Yes, the expectations have been clarified today" },
                { es: "tenemos una motivación positiva para el futuro", en: "We have a positive motivation for the future" },
                { es: "aunque fue un proceso difícil, logramos avanzar", en: "Although it was a difficult process, we achieved moving forward" }
            ]
        },
        {
            prompt_es: "¿Por qué quieres actualizar la estrategia del sistema?",
            prompt_en: "Why do you want to update the system strategy?",
            expected_responses: [
                { es: "porque queremos optimizar el rendimiento diario", en: "Because we want to optimize the daily performance" },
                { es: "para reducir el riesgo de la situación actual", en: "To reduce the risk of the current situation" },
                { es: "una estrategia efectiva aumenta la posibilidad de éxito", en: "An effective strategy increases the possibility of success" }
            ]
        },
        {
            prompt_es: "¿Qué resultados has evaluado en el trabajo?",
            prompt_en: "What results have you evaluated at work?",
            expected_responses: [
                { es: "he evaluado un rendimiento muy positivo hoy", en: "I have evaluated a very positive performance today" },
                { es: "además los resultados del proceso son realistas", en: "In addition the process results are realistic" },
                { es: "todavía necesito analizar alguna información antes", en: "I still need to analyze some information before" }
            ]
        },
        {
            prompt_es: "¿Es posible adaptarse a esta cultura diferente?",
            prompt_en: "Is it possible to adapt to this different culture?",
            expected_responses: [
                { es: "sí, me he adaptado a su sociedad rápido", en: "Yes, I have adapted to their society quickly" },
                { es: "aunque es complicado, la cultura es buena", en: "Although it is complicated, the culture is good" },
                { es: "a pesar de los desafíos, el enfoque es positivo", en: "Despite the challenges, the approach is positive" }
            ]
        },
        {
            prompt_es: "¿Por lo tanto has decidido cancelar el viaje remoto?",
            prompt_en: "Therefore have you decided to cancel the remote trip?",
            expected_responses: [
                { es: "sí, el viaje a largo plazo es muy costoso", en: "Yes, the long term trip is very expensive" },
                { es: "no, quiero explorar ese lugar en el futuro", en: "No, I want to explore that place in the future" },
                { es: "todavía espero la confirmación del transporte", en: "I am still waiting for the transport confirmation" }
            ]
        },
        {
            prompt_es: "¿Qué concepto profesional quieres discutir hoy?",
            prompt_en: "What professional concept do you want to discuss today?",
            expected_responses: [
                { es: "quiero discutir la estrategia para lograr metas", en: "I want to discuss the strategy to achieve goals" },
                { es: "el concepto de enfoque realista del sistema", en: "The concept of realistic system approach" },
                { es: "necesitamos aclarar los resultados del mes antes", en: "We need to clarify the results of the month before" }
            ]
        },
        {
            prompt_es: "¿Has insistido en fortalecer la comunicación diaria?",
            prompt_en: "Have you insisted on strengthening daily communication?",
            expected_responses: [
                { es: "sí, para optimizar las conversaciones del equipo", en: "Yes, to optimize team conversations" },
                { es: "una buena comunicación reduce el riesgo de problemas", en: "Good communication reduces the risk of problems" },
                { es: "incluso con poco tiempo, es necesario hablar", en: "Even with little time, it is necessary to talk" }
            ]
        },
        {
            prompt_es: "¿Aunque la situación es difícil, el enfoque es efectivo?",
            prompt_en: "Although the situation is difficult, is the approach effective?",
            expected_responses: [
                { es: "sí, hemos logrado resultados muy positivos", en: "Yes, we have achieved very positive results" },
                { es: "por lo tanto queremos continuar con este plan", en: "Therefore we want to continue with this plan" },
                { es: "necesitamos evaluar el rendimiento una vez más", en: "We need to evaluate the performance once more" }
            ]
        },
        {
            prompt_es: "¿Cómo planeas aumentar la motivación de la sociedad?",
            prompt_en: "How do you plan to increase the motivation of society?",
            expected_responses: [
                { es: "aumentar la motivación es un proceso a largo plazo", en: "Increasing motivation is a long-term process" },
                { es: "con un sistema innovadora y un enfoque positivo", en: "With an innovative system and a positive approach" },
                { es: "discutir los desafíos ayuda a lograrlo", en: "Discussing the challenges helps to achieve it" }
            ]
        },
        {
            prompt_es: "¿Has analizado cuidadosamente la información del viaje?",
            prompt_en: "Have you carefully analyzed the trip information?",
            expected_responses: [
                { es: "sí, he revisado los boletos y el hotel antes", en: "Yes, I have reviewed the tickets and the hotel before" },
                { es: "el viaje a este lugar remoto tiene sus riesgos", en: "The trip to this remote place has its risks" },
                { es: "ya he preparado todo para el próximo mes", en: "I have already prepared everything for next month" }
            ]
        }
    ]
};


const CEFR_CONVERSATION_AUDIO_A1 = [
    { es: "qué te gustaría beber", file: "que-te-gustaria-beber.mp3", en: "What would you like to drink?" },
    { es: "cómo estás hoy", file: "como-estas-hoy.mp3", en: "How are you today?" },
    { es: "dónde vives", file: "donde-vives.mp3", en: "Where do you live?" },
    { es: "qué quieres comer", file: "que-quieres-comer.mp3", en: "What do you want to eat?" },
    { es: "tienes hambre", file: "tienes-hambre.mp3", en: "Are you hungry?" },
    { es: "qué te gusta hacer", file: "que-te-gusta-hacer.mp3", en: "What do you like to do?" },
    { es: "a qué hora te levantas", file: "a-que-hora-te-levantas.mp3", en: "What time do you get up?" },
    { es: "quieres salir hoy", file: "quieres-salir-hoy.mp3", en: "Do you want to go out today?" },
    { es: "qué estás haciendo", file: "que-estas-haciendo.mp3", en: "What are you doing?" },
    { es: "quieres ver una película", file: "quieres-ver-una-pelicula.mp3", en: "Do you want to watch a movie?" },
    { es: "dónde está el baño", file: "donde-esta-el-bano.mp3", en: "Where is the bathroom?" },
    { es: "qué música te gusta", file: "que-musica-te-gusta.mp3", en: "What music do you like?" },
    { es: "quieres descansar", file: "quieres-descansar.mp3", en: "Do you want to rest?" },
    { es: "qué hay en la cocina", file: "que-hay-en-la-cocina.mp3", en: "What is in the kitchen?" },
    { es: "quieres ir al hotel", file: "quieres-ir-al-hotel.mp3", en: "Do you want to go to the hotel?" },
    { es: "qué fruta te gusta", file: "que-fruta-te-gusta.mp3", en: "What fruit do you like?" },
    { es: "quieres aprender más español", file: "quieres-aprender-mas-espanol.mp3", en: "Do you want to learn more Spanish?" },
    { es: "qué ves en la televisión", file: "que-ves-en-la-television.mp3", en: "What do you watch on TV?" },
    { es: "quieres pan con queso", file: "quieres-pan-con-queso.mp3", en: "Do you want bread with cheese?" },
    { es: "dónde está tu familia", file: "donde-esta-tu-familia.mp3", en: "Where is your family?" },
    { es: "quieres ir en autobús", file: "quieres-ir-en-autobus.mp3", en: "Do you want to go by bus?" },
    { es: "qué haces en casa", file: "que-haces-en-casa.mp3", en: "What do you do at home?" }
];

const CEFR_CONVERSATION_AUDIO_A2 = [
    { es: "qué haces normalmente por la mañana", file: "que-haces-normalmente-por-la-manana.mp3", en: "What do you normally do in the morning?" },
    { es: "qué te gustaría probar hoy", file: "que-te-gustaria-probar-hoy.mp3", en: "What would you like to try today?" },
    { es: "a qué hora llegaste anoche", file: "a-que-hora-llegaste-anoche.mp3", en: "What time did you arrive last night?" },
    { es: "qué almuerzas normalmente", file: "que-almuerzas-normalmente.mp3", en: "What do you normally have for lunch?" },
    { es: "qué película quieres ver", file: "que-pelicula-quieres-ver.mp3", en: "What movie do you want to watch?" },
    { es: "qué mensaje recibiste", file: "que-mensaje-recibiste.mp3", en: "What message did you receive?" },
    { es: "qué vas a cocinar esta noche", file: "que-vas-a-cocinar-esta-noche.mp3", en: "What are you going to cook tonight?" },
    { es: "qué tarea tienes hoy", file: "que-tarea-tienes-hoy.mp3", en: "What homework do you have today?" },
    { es: "qué quieres visitar en tu próximo viaje", file: "que-quieres-visitar-en-tu-proximo-viaje.mp3", en: "What do you want to visit on your next trip?" },
    { es: "conduces a menudo", file: "conduces-a-menudo.mp3", en: "Do you drive often?" },
    { es: "qué esperas hoy", file: "que-esperas-hoy.mp3", en: "What are you waiting for today?" },
    { es: "qué te gustaría olvidar", file: "que-te-gustaria-olvidar.mp3", en: "What would you like to forget?" },
    { es: "qué haces antes de dormir", file: "que-haces-antes-de-dormir.mp3", en: "What do you do before sleeping?" },
    { es: "qué haces después del almuerzo", file: "que-haces-despues-del-almuerzo.mp3", en: "What do you do after lunch?" },
    { es: "qué transporte usas normalmente", file: "que-transporte-usas-normalmente.mp3", en: "What transport do you normally use?" },
    { es: "qué cocina te gusta más", file: "que-cocina-te-gusta-mas.mp3", en: "Which kitchen do you like more?" },
    { es: "qué haces ahora", file: "que-haces-ahora.mp3", en: "What are you doing now?" },
    { es: "qué zapatos usas hoy", file: "que-zapatos-usas-hoy.mp3", en: "What shoes are you wearing today?" },
    { es: "qué te gustaría cocinar mañana", file: "que-te-gustaria-cocinar-manana.mp3", en: "What would you like to cook tomorrow?" },
    { es: "qué información necesitas", file: "que-informacion-necesitas.mp3", en: "What information do you need?" },
    { es: "qué haces cuando llegas a casa", file: "que-haces-cuando-llegas-a-casa.mp3", en: "What do you do when you arrive home?" },
    { es: "qué te gustaría visitar este año", file: "que-te-gustaria-visitar-este-ano.mp3", en: "What would you like to visit this year?" }
];

const CEFR_CONVERSATION_AUDIO_B1 = [
    { es: "qué has aprendido recientemente", file: "que-has-aprendido-recientemente.mp3", en: "What have you learned recently?" },
    { es: "qué estás estudiando ahora", file: "que-estas-estudiando-ahora.mp3", en: "What are you studying now?" },
    { es: "qué experiencias pasadas recuerdas más", file: "que-experiencias-pasadas-recuerdas-mas.mp3", en: "What past experiences do you remember most?" },
    { es: "qué habilidades quieres mejorar", file: "que-habilidades-quieres-mejorar.mp3", en: "What skills do you want to improve?" },
    { es: "qué estás trabajando esta semana", file: "que-estas-trabajando-esta-semana.mp3", en: "What are you working on this week?" },
    { es: "qué conversaciones tienes a menudo", file: "que-conversaciones-tienes-a-menudo.mp3", en: "What conversations do you often have?" },
    { es: "qué has estado haciendo últimamente", file: "que-has-estado-haciendo-ultimamente.mp3", en: "What have you been doing lately?" },
    { es: "qué quieres conseguir este mes", file: "que-quieres-conseguir-este-mes.mp3", en: "What do you want to achieve this month?" },
    { es: "qué te gustaría continuar aprendiendo", file: "que-te-gustaria-continuar-aprendiendo.mp3", en: "What would you like to continue learning?" },
    { es: "qué tipo de comunicación es importante para ti", file: "que-tipo-de-comunicacion-es-importante-para-ti.mp3", en: "What type of communication is important to you?" },
    { es: "qué has estado leyendo últimamente", file: "que-has-estado-leyendo-ultimamente.mp3", en: "What have you been reading lately?" },
    { es: "qué te gustaría preparar mañana", file: "que-te-gustaria-preparar-manana.mp3", en: "What would you like to prepare tomorrow?" },
    { es: "qué te gustaría cambiar este año", file: "que-te-gustaria-cambiar-este-ano.mp3", en: "What would you like to change this year?" },
    { es: "qué te gustaría seguir haciendo", file: "que-te-gustaria-seguir-haciendo.mp3", en: "What would you like to keep doing?" },
    { es: "qué tipo de tareas tienes esta semana", file: "que-tipo-de-tareas-tienes-esta-semana.mp3", en: "What tasks do you have this week?" },
    { es: "qué te gustaría encontrar hoy", file: "que-te-gustaria-encontrar-hoy.mp3", en: "What would you like to find today?" },
    { es: "qué te gustaría cancelar este mes", file: "que-te-gustaria-cancelar-este-mes.mp3", en: "What would you like to cancel this month?" },
    { es: "qué te gustaría traer a la reunión", file: "que-te-gustaria-traer-a-la-reunion.mp3", en: "What would you like to bring to the meeting?" },
    { es: "qué planeas hacer mañana", file: "que-planeas-hacer-manana.mp3", en: "What do you plan to do tomorrow?" },
    { es: "qué te gustaría entender mejor", file: "que-te-gustaria-entender-mejor.mp3", en: "What would you like to understand better?" },
    { es: "qué te gustaría seguir revisando", file: "que-te-gustaria-seguir-revisando.mp3", en: "What would you like to keep reviewing?" }
];

const CEFR_CONVERSATION_AUDIO_B2 = [
    { es: "qué estrategia usas para aprender mejor", file: "que-estrategia-usas-para-aprender-mejor.mp3", en: "What strategy do you use to learn better?" },
    { es: "cómo evalúas tu rendimiento en el trabajo", file: "como-evaluas-tu-rendimiento-en-el-trabajo.mp3", en: "How do you evaluate your performance at work?" },
    { es: "qué concepto te parece complicado últimamente", file: "que-concepto-te-parece-complicado-ultimamente.mp3", en: "What concept seems complicated to you lately?" },
    { es: "qué riesgo consideras importante en tu trabajo", file: "que-riesgo-consideras-importante-en-tu-trabajo.mp3", en: "What risk do you consider important in your work?" },
    { es: "qué posibilidad te gustaría explorar", file: "que-posibilidad-te-gustaria-explorar.mp3", en: "What possibility would you like to explore?" },
    { es: "qué situación te ha afectado recientemente", file: "que-situacion-te-ha-afectado-recientemente.mp3", en: "What situation has affected you recently?" },
    { es: "cómo optimizas tu tiempo cada día", file: "como-optimizas-tu-tiempo-cada-dia.mp3", en: "How do you optimize your time each day?" },
    { es: "qué enfoque profesional te funciona mejor", file: "que-enfoque-profesional-te-funciona-mejor.mp3", en: "What professional approach works best for you?" },
    { es: "qué tarea te gustaría actualizar", file: "que-tarea-te-gustaria-actualizar.mp3", en: "What task would you like to update?" },
    { es: "qué has analizado esta semana", file: "que-has-analizado-esta-semana.mp3", en: "What have you analyzed this week?" },
    { es: "qué te gustaría discutir con tu equipo", file: "que-te-gustaria-discutir-con-tu-equipo.mp3", en: "What would you like to discuss with your team?" },
    { es: "qué has logrado este mes", file: "que-has-logrado-este-mes.mp3", en: "What have you achieved this month?" },
    { es: "qué cultura te interesa explorar", file: "que-cultura-te-interesa-explorar.mp3", en: "What culture are you interested in exploring?" },
    { es: "qué desafíos has enfrentado recientemente", file: "que-desafios-has-enfrentado-recientemente.mp3", en: "What challenges have you faced recently?" },
    { es: "qué expectativas tienes para este año", file: "que-expectativas-tienes-para-este-ano.mp3", en: "What expectations do you have for this year?" },
    { es: "qué situación te gustaría aclarar", file: "que-situacion-te-gustaria-aclarar.mp3", en: "What situation would you like to clarify?" },
    { es: "qué proceso te gustaría optimizar", file: "que-proceso-te-gustaria-optimizar.mp3", en: "What process would you like to optimize?" },
    { es: "qué información has evaluado recientemente", file: "que-informacion-has-evaluado-recientemente.mp3", en: "What information have you evaluated recently?" },
    { es: "qué idea te gustaría fortalecer", file: "que-idea-te-gustaria-fortalecer.mp3", en: "What idea would you like to strengthen?" },
    { es: "qué tema te gustaría discutir más profundamente", file: "que-tema-te-gustaria-discutir-mas-profundamente.mp3", en: "What topic would you like to discuss more deeply?" },
    { es: "qué enfoque te gustaría adaptar este año", file: "que-enfoque-te-gustaria-adaptar-este-ano.mp3", en: "What approach would you like to adapt this year?" }
];


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
