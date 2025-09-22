// App state
let currentSection = 'home';
let currentTheme = 'light';
let currentLanguage = 'en';
let puzzleState = Array(9).fill('');

// Game state
let gameState = {
    sorting: {
        points: 0,
        difficulty: 'easy',
        items: [],
        bins: []
    },
    matching: {
        points: 0,
        difficulty: 'easy',
        cards: [],
        flippedCards: [],
        matchedPairs: 0
    },
    memory: {
        points: 0,
        difficulty: 'easy',
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0
    }
};

// Rewards state
let rewardsState = {
    totalPoints: 0,
    rewards: {
        1: { name: "First Steps", pointsRequired: 50, earned: false },
        2: { name: "Recycling Master", pointsRequired: 100, earned: false, game: "sorting" },
        3: { name: "Memory Champion", pointsRequired: 150, earned: false, game: "memory" },
        4: { name: "Matching Expert", pointsRequired: 200, earned: false, game: "matching" },
        5: { name: "Eco Hero", pointsRequired: 500, earned: false, game: "total" },
        6: { name: "Difficulty Master", pointsRequired: 0, earned: false, game: "nightmare" }
    }
};

// Enhanced notification system with debouncing and spam prevention
let notificationTimeout = null;
let notificationQueue = [];
let isNotificationActive = false;
let lastNotificationTime = 0;
let notificationDebounceDelay = 1000; // 1 second debounce
let activeMessage = null;
let clickLock = new Set(); // Track locked elements

// Debounce function to prevent rapid firing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Click lock mechanism to prevent spam
function createClickLock(elementId, duration = 1000) {
    if (clickLock.has(elementId)) return false;
    
    clickLock.add(elementId);
    setTimeout(() => clickLock.delete(elementId), duration);
    return true;
}

// Translation data
const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.info': 'Info',
        'nav.games': 'Games',
        'nav.tracker': 'Tracker',
        'nav.about': 'About',
        'nav.settings': 'Settings',
        
        // Hero section
        'hero.title': 'Transform Waste into Worth',
        'hero.description': 'Join the green revolution with our comprehensive waste management platform. Track, reduce, and recycle your way to a sustainable future.',
        'hero.cta': 'Start Tracking',
        
        // Features
        'features.recycling.title': 'Smart Recycling',
        'features.recycling.description': 'Learn how to properly sort and recycle different materials with our intelligent guidance system.',
        'features.analytics.title': 'Waste Analytics',
        'features.analytics.description': 'Track your waste reduction progress with detailed analytics and environmental impact metrics.',
        'features.rewards.title': 'Eco Rewards',
        'features.rewards.description': 'Earn points for sustainable practices and redeem them for eco-friendly merchandise.',
        
        // Info section
        'info.title': 'Waste Management Information',
        'info.subtitle': 'Learn about sustainable waste disposal practices',
        'info.categories.title': 'Waste Categories',
        'info.categories.description': 'Organic waste should be composted to create nutrient-rich soil. Keep food scraps, yard trimmings, and biodegradable materials separate from other waste streams.',
        'info.recycling.title': 'Recycling Guidelines',
        'info.recycling.description': 'Clean containers before recycling. Remove caps and lids from bottles. Check local recycling programs for specific material acceptance policies.',
        'info.hazardous.title': 'Hazardous Waste',
        'info.hazardous.description': 'Electronics, batteries, chemicals, and medical waste require special disposal methods. Never put these items in regular trash or recycling bins.',
        'info.reduction.title': 'Reduction Tips',
        'info.reduction.description': 'Buy only what you need, choose reusable products, repair instead of replacing, and donate items in good condition to reduce overall waste generation.',
        'info.composting.title': 'Composting Guide',
        'info.composting.description': 'Create a balanced mix of green materials (food scraps) and brown materials (dry leaves, paper) for optimal composting conditions.',
        'info.industrial.title': 'Industrial Waste',
        'info.industrial.description': 'Businesses must follow specific regulations for waste disposal. Partner with certified waste management companies for proper handling and documentation.',
        
        // Games section
        'games.title': 'Eco-Friendly Games',
        'games.subtitle': 'Learn while you play',
        
        // Tracker section
        'tracker.title': 'Waste Tracker Dashboard',
        'tracker.subtitle': 'Monitor your environmental impact',
        'tracker.metrics.wasteReduced': 'Pounds Reduced',
        'tracker.metrics.recyclingRate': 'Recycling Rate %',
        'tracker.metrics.carbonSaved': 'Tons CO2 Saved',
        'tracker.metrics.ecoPoints': 'Eco Points',
        'tracker.report.title': 'Yearly Report',
        'tracker.report.description': 'This week you\'ve improved your recycling rate by 12% and reduced overall waste by 8 pounds. Keep up the excellent work!',
        'tracker.report.button': 'View Full Report',
        'tracker.goals.title': 'Goals & Achievements',
        'tracker.goals.description': 'You\'re 78% towards your monthly goal of reducing waste by 50 pounds. Complete 3 more recycling activities to unlock the "Green Champion" badge!',
        'tracker.goals.button': 'Set New Goals',
        'tracker.comparison.title': 'Impact Comparison',
        'tracker.comparison.description': 'Compared to the average household, you\'re producing 32% less waste and recycling 28% more materials. You\'re making a real difference!',
        'tracker.comparison.button': 'Compare with Others',
        
        // About section
        'about.title': 'About ECOTrack',
        'about.subtitle': 'Our mission for a sustainable future',
        'about.mission.title': 'Our Mission',
        'about.mission.description': 'To create a world where waste is minimized, resources are conserved, and every individual contributes to environmental sustainability through informed actions and smart technology.',
        'about.team.title': 'Our Team',
        'about.team.description': 'A dedicated group of environmental scientists, software engineers, and sustainability experts working together to develop innovative solutions for waste management challenges.',
        'about.impact.title': 'Global Impact',
        'about.impact.description': 'Since our launch, ECOTrack users have diverted over 2 million pounds of waste from landfills and reduced carbon emissions by 15,000 tons through improved recycling practices.',
        'about.technology.title': 'Technology',
        'about.technology.description': 'Our platform uses advanced analytics and machine learning to provide personalized waste reduction recommendations and track environmental impact in real-time.',
        'about.partnerships.title': 'Partnerships',
        'about.partnerships.description': 'We collaborate with local waste management companies, environmental organizations, and municipalities to create comprehensive sustainability programs.',
        'about.education.title': 'Education',
        'about.education.description': 'Through workshops, online resources, and community programs, we educate individuals and businesses about sustainable waste management practices.',
        
        // Settings section
        'settings.title': 'Settings',
        'settings.subtitle': 'Customize your ECOTrack experience',
        'settings.theme.title': 'Choose Theme',
        'settings.theme.light': 'Light',
        'settings.theme.dark': 'Dark',
        'settings.theme.forest': 'Forest',
        'settings.theme.ocean': 'Ocean',
        'settings.theme.sunset': 'Sunset',
        'settings.theme.description': 'Choose from our collection of beautiful themes to personalize your ECOTrack experience.',
        'settings.language.title': 'Language / Idioma',
        'settings.notifications.title': 'Notifications',
        'settings.notifications.description': 'Manage your notification preferences for reminders, achievements, and weekly reports.',
        'settings.notifications.button': 'Configure Notifications',
        'settings.privacy.title': 'Data & Privacy',
        'settings.privacy.description': 'Control your data sharing preferences and privacy settings for a personalized experience.',
        'settings.privacy.button': 'Privacy Settings'
    },
    es: {
        // Navigation
        'nav.home': 'Inicio',
        'nav.info': 'Info',
        'nav.games': 'Juegos',
        'nav.tracker': 'Monitor',
        'nav.about': 'Acerca',
        'nav.settings': 'Configuración',
        
        // Hero section
        'hero.title': 'Transforma Residuos en Valor',
        'hero.description': 'Únete a la revolución verde con nuestra plataforma integral de gestión de residuos. Rastrea, reduce y recicla hacia un futuro sostenible.',
        'hero.cta': 'Comenzar Seguimiento',
        
        // Features
        'features.recycling.title': 'Reciclaje Inteligente',
        'features.recycling.description': 'Aprende cómo clasificar y reciclar diferentes materiales correctamente con nuestro sistema de guía inteligente.',
        'features.analytics.title': 'Análisis de Residuos',
        'features.analytics.description': 'Rastrea tu progreso de reducción de residuos con análisis detallados y métricas de impacto ambiental.',
        'features.rewards.title': 'Recompensas Eco',
        'features.rewards.description': 'Gana puntos por prácticas sostenibles y cámbialos por productos ecológicos.',
        
        // Info section
        'info.title': 'Información de Gestión de Residuos',
        'info.subtitle': 'Aprende sobre prácticas sostenibles de eliminación de residuos',
        'info.categories.title': 'Categorías de Residuos',
        'info.categories.description': 'Los residuos orgánicos deben compostarse para crear suelo rico en nutrientes. Mantén los restos de comida, recortes de jardín y materiales biodegradables separados de otros flujos de residuos.',
        'info.recycling.title': 'Guías de Reciclaje',
        'info.recycling.description': 'Limpia los contenedores antes de reciclar. Retira tapas y tapones de las botellas. Consulta los programas de reciclaje locales para políticas específicas de aceptación de materiales.',
        'info.hazardous.title': 'Residuos Peligrosos',
        'info.hazardous.description': 'Electrónicos, baterías, químicos y residuos médicos requieren métodos especiales de eliminación. Nunca pongas estos artículos en contenedores regulares de basura o reciclaje.',
        'info.reduction.title': 'Consejos de Reducción',
        'info.reduction.description': 'Compra solo lo que necesite, elige productos reutilizables, repara en lugar de reemplazar, y dona artículos en buenas condiciones para reducir la generación total de residuos.',
        'info.composting.title': 'Guía de Compostaje',
        'info.composting.description': 'Crea una mezcla equilibrada de materiales verdes (restos de comida) y materiales marrones (hojas secas, papel) para condiciones óptimas de compostaje.',
        'info.industrial.title': 'Residuos Industriales',
        'info.industrial.description': 'Las empresas deben seguir regulaciones específicas para la eliminación de residuos. Asíóciate con empresas certificadas de gestión de residuos para el manejo y documentación adecuados.',
        
        // Games section
        'games.title': 'Juegos Ecológicos',
        'games.subtitle': 'Aprende mientras juegas',
        
        // Tracker section
        'tracker.title': 'Panel de Control de Seguimiento de Residuos',
        'tracker.subtitle': 'Monitorea tu impacto ambiental',
        'tracker.metrics.wasteReduced': 'Libras Reducidas',
        'tracker.metrics.recyclingRate': 'Tasa de Reciclaje %',
        'tracker.metrics.carbonSaved': 'Toneladas CO2 Ahorradas',
        'tracker.metrics.ecoPoints': 'Puntos Eco',
        'tracker.report.title': 'Informe Anual',
        'tracker.report.description': 'Esta semana has mejorado tu tasa de reciclaje en 12% y reducido los residuos totales en 8 libras. ¡Sigue con el excelente trabajo!',
        'tracker.report.button': 'Ver Informe Completo',
        'tracker.goals.title': 'Metas y Logros',
        'tracker.goals.description': 'Estás al 78% hacia tu meta mensual de reducir residuos en 50 libras. ¡Completa 3 actividades más de reciclaje para desbloquear la insignia "Campeón Verde"!',
        'tracker.goals.button': 'Establecer Nuevas Metas',
        'tracker.comparison.title': 'Comparación de Impacto',
        'tracker.comparison.description': 'Comparado con el hogar promedio, estás produciendo 32% menos residuos y reciclando 28% más materiales. ¡Estás haciendo una diferencia real!',
        'tracker.comparison.button': 'Comparar con Otros',
        
        // About section
        'about.title': 'Acerca de ECOTrack',
        'about.subtitle': 'Nuestra misión para un futuro sostenible',
        'about.mission.title': 'Nuestra Misión',
        'about.mission.description': 'Crear un mundo donde los residuos se minimicen, los recursos se conserven, y cada individuo contribuya a la sostenibilidad ambiental a través de acciones informadas y tecnología inteligente.',
        'about.team.title': 'Nuestro Equipo',
        'about.team.description': 'Un grupo dedicado de científicos ambientales, ingenieros de software y expertos en sostenibilidad trabajando juntos para desarrollar soluciones innovadoras para los desafíos de gestión de residuos.',
        'about.impact.title': 'Impacto Global',
        'about.impact.description': 'Desde nuestro lanzamiento, los usuarios de ECOTrack han desviado más de 2 millones de libras de residuos de vertederos y reducido las emisiones de carbono en 15,000 toneladas a través de mejores prácticas de reciclaje.',
        'about.technology.title': 'Tecnología',
        'about.technology.description': 'Nuestra plataforma utiliza análisis avanzados y aprendizaje automático para proporcionar recomendaciones personalizadas de reducción de residuos y rastrear el impacto ambiental en tiempo real.',
        'about.partnerships.title': 'Alianzas',
        'about.partnerships.description': 'Colaboramos con empresas locales de gestión de residuos, organizaciones ambientales y municipalidades para crear programas integrales de sostenibilidad.',
        'about.education.title': 'Educación',
        'about.education.description': 'A través de talleres, recursos en línea y programas comunitarios, educamos a individuos y empresas sobre prácticas sostenibles de gestión de residuos.',
        
        // Settings section
        'settings.title': 'Configuración',
        'settings.subtitle': 'Personaliza tu experiencia ECOTrack',
        'settings.theme.title': 'Elegir Tema',
        'settings.theme.light': 'Claro',
        'settings.theme.dark': 'Oscuro',
        'settings.theme.forest': 'Bosque',
        'settings.theme.ocean': 'Océano',
        'settings.theme.sunset': 'Atardecer',
        'settings.theme.description': 'Elige de nuestra colección de hermosos temas para personalizar tu experiencia ECOTrack.',
        'settings.language.title': 'Idioma / Language',
        'settings.notifications.title': 'Notificaciones',
        'settings.notifications.description': 'Gestiona tus preferencias de notificación para recordatorios, logros e informes semanales.',
        'settings.notifications.button': 'Configurar Notificaciones',
        'settings.privacy.title': 'Datos y Privacidad',
        'settings.privacy.description': 'Controla tus preferencias de compartir datos y configuraciones de privacidad para una experiencia personalizada.',
        'settings.privacy.button': 'Configuración de Privacidad'
    }
};

// Waste disposal API configuration
const WASTE_API_CONFIG = {
    baseUrl: 'https://api.waste-tracker.com/v1',
    endpoints: {
        disposal: '/disposal',
        metrics: '/metrics',
        categories: '/categories'
    },
    refreshInterval: 30000 // 30 seconds
};

// Live waste disposal data
let wasteData = {
    totalDisposal: 0,
    categories: {},
    recentActivity: [],
    lastUpdated: null
};

// Waste items for games
const wasteItems = {
    recyclable: [
        { name: "Plastic Bottle", icon: "🧃" },
        { name: "Glass Jar", icon: "🍯" },
        { name: "Aluminum Can", icon: "🥫" },
        { name: "Newspaper", icon: "🗞️" },
        { name: "Cardboard Box", icon: "📦" },
        { name: "Steel Can", icon: "🥫" }
    ],
    organic: [
        { name: "Apple Core", icon: "🍎" },
        { name: "Banana Peel", icon: "🍌" },
        { name: "Egg Shells", icon: "🥚" },
        { name: "Coffee Grounds", icon: "☕" },
        { name: "Grass Clippings", icon: "🌿" },
        { name: "Vegetable Scraps", icon: "🥕" }
    ],
    hazardous: [
        { name: "Battery", icon: "🔋" },
        { name: "Paint Can", icon: "🛢️" },
        { name: "Medicine Bottle", icon: "💊" },
        { name: "Motor Oil", icon: "🛢️" },
        { name: "Electronic Device", icon: "📱" },
        { name: "Cleaning Chemical", icon: "🧴" }
    ],
    general: [
        { name: "Plastic Bag", icon: "🛍️" },
        { name: "Ceramic Bowl", icon: "🥣" },
        { name: "Styrofoam", icon: "🍱" },
        { name: "Used Tissue", icon: "🧻" },
        { name: "Broken Glass", icon: "🥃" },
        { name: "Food Wrapper", icon: "🥡" }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadSavedSettings();
    setupEventListeners();
    showSection('home');
    updateLanguage();
    applyTheme();
    startWasteTracker();
    
    // Initialize games
    initGames();
    
    // Load rewards state
    loadRewardsState();
    
    // Update rewards display
    updateRewardsDisplay();
}

function loadSavedSettings() {
    const saved = localStorage.getItem('ecotrack-settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            currentTheme = settings.theme || 'light';
            currentLanguage = settings.language || 'en';
        } catch (error) {
            console.error('Error loading saved settings:', error);
        }
    }
}

function saveSettings() {
    const settings = {
        theme: currentTheme,
        language: currentLanguage
    };
    localStorage.setItem('ecotrack-settings', JSON.stringify(settings));
}

function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Theme selection with enhanced protection
    document.querySelectorAll('[data-theme]').forEach((themeBtn, index) => {
        themeBtn.addEventListener('click', debounce(() => {
            if (createClickLock(`theme-${index}`)) {
                const theme = themeBtn.getAttribute('data-theme');
                setTheme(theme);
            }
        }, 1000));
    });

    // Language selection with enhanced protection
    document.querySelectorAll('[data-language]').forEach((langBtn, index) => {
        langBtn.addEventListener('click', debounce(() => {
            if (createClickLock(`language-${index}`)) {
                const language = langBtn.getAttribute('data-language');
                setLanguage(language);
            }
        }, 1000));
    });

    // Enhanced button handlers with triple protection (debounce + click lock + notification dedupe)
    function createSafeClickHandler(element, message, elementId) {
        const safeHandler = debounce(() => {
            if (createClickLock(elementId)) {
                showNotification(message);
            }
        }, 1000);
        
        if (element) {
            element.addEventListener('click', safeHandler);
        }
    }

    // Game buttons
    document.getElementById('sorting-game-btn').addEventListener('click', () => {
        showGame('sorting');
    });
    
    document.getElementById('matching-game-btn').addEventListener('click', () => {
        showGame('matching');
    });
    
    document.getElementById('memory-game-btn').addEventListener('click', () => {
        showGame('memory');
    });
    
    // Difficulty selectors
    document.getElementById('sorting-difficulty').addEventListener('change', (e) => {
        gameState.sorting.difficulty = e.target.value;
        resetSortingGame();
    });
    
    document.getElementById('matching-difficulty').addEventListener('change', (e) => {
        gameState.matching.difficulty = e.target.value;
        resetMatchingGame();
    });
    
    document.getElementById('memory-difficulty').addEventListener('change', (e) => {
        gameState.memory.difficulty = e.target.value;
        resetMemoryGame();
    });
    
    // Reset buttons
    document.getElementById('reset-sorting').addEventListener('click', resetSortingGame);
    document.getElementById('reset-matching').addEventListener('click', resetMatchingGame);
    document.getElementById('reset-memory').addEventListener('click', resetMemoryGame);

    // Tracker buttons
    createSafeClickHandler(
        document.querySelector('[data-testid="button-view-report"]'),
        'Full report coming soon!',
        'view-report-btn'
    );
    
    createSafeClickHandler(
        document.querySelector('[data-testid="button-set-goals"]'),
        'Goal setting feature coming soon!',
        'set-goals-btn'
    );
    
    createSafeClickHandler(
        document.querySelector('[data-testid="button-view-comparison"]'),
        'Comparison feature coming soon!',
        'view-comparison-btn'
    );

    // Settings buttons
    createSafeClickHandler(
        document.querySelector('[data-testid="button-configure-notifications"]'),
        'Notification settings coming soon!',
        'configure-notifications-btn'
    );
    
    createSafeClickHandler(
        document.querySelector('[data-testid="button-privacy-settings"]'),
        'Privacy settings coming soon!',
        'privacy-settings-btn'
    );
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }

    // Update navigation active state
    document.querySelectorAll('[data-section]').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });

    // Special handling for tracker section
    if (sectionName === 'tracker') {
        animateMetrics();
        updateTrackerData();
    }
    
    // Special handling for games section
    if (sectionName === 'games') {
        hideAllGames();
    }
}

// Improved notification system
// Enhanced notification system with debouncing and spam prevention
function showNotification(message) {
    const now = Date.now();
    
    // Prevent spam: skip if same message is already active or too recent
    if (message === activeMessage || (now - lastNotificationTime) < notificationDebounceDelay) {
        return;
    }
    
    // Add to queue only if not already in queue
    if (!notificationQueue.includes(message)) {
        notificationQueue.push(message);
    }
    
    processNotificationQueue();
}

function processNotificationQueue() {
    if (isNotificationActive || notificationQueue.length === 0) {
        return;
    }

    isNotificationActive = true;
    const message = notificationQueue.shift();
    const notification = document.getElementById('notification');
    
    // Clear any existing timeout
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }
    
    // Update content and show
    activeMessage = message;
    notification.textContent = message;
    notification.classList.add('show');
    lastNotificationTime = Date.now();
    
    // Hide after delay
    notificationTimeout = setTimeout(() => {
        notification.classList.remove('show');
        isNotificationActive = false;
        activeMessage = null;
        
        // Clear queue to prevent buildup
        notificationQueue = [];
        
        // Small delay before processing next
        setTimeout(() => {
            processNotificationQueue();
        }, 300);
    }, 2500);
}

// Waste disposal tracker API functions
async function fetchWasteData() {
    try {
        // Simulate API call - replace with real API endpoint
        const mockData = {
            totalDisposal: Math.floor(Math.random() * 1000) + 500,
            categories: {
                organic: Math.floor(Math.random() * 300) + 100,
                recyclable: Math.floor(Math.random() * 250) + 150,
                electronic: Math.floor(Math.random() * 100) + 50,
                hazardous: Math.floor(Math.random() * 50) + 10,
                general: Math.floor(Math.random() * 200) + 100
            },
            recentActivity: [
                { type: 'recycled', amount: Math.floor(Math.random() * 50) + 10, timestamp: new Date().toISOString() },
                { type: 'disposed', amount: Math.floor(Math.random() * 30) + 5, timestamp: new Date().toISOString() }
            ],
            lastUpdated: new Date().toISOString()
        };
        
        return mockData;
    } catch (error) {
        console.error('Error fetching waste data:', error);
        return null;
    }
}

function updateTrackerDisplay(data) {
    if (!data) return;
    
    // Update metrics with live data
    const wasteReducedEl = document.querySelector('[data-testid="metric-waste-reduced"]');
    const recyclingRateEl = document.querySelector('[data-testid="metric-recycling-rate"]');
    const carbonSavedEl = document.querySelector('[data-testid="metric-carbon-saved"]');
    const ecoPointsEl = document.querySelector('[data-testid="metric-eco-points"]');
    
    if (wasteReducedEl) {
        animateValue(wasteReducedEl, 0, data.totalDisposal, 1000);
    }
    
    if (recyclingRateEl) {
        const recyclingRate = Math.round((data.categories.recyclable / data.totalDisposal) * 100);
        animateValue(recyclingRateEl, 0, recyclingRate, 1000);
    }
    
    if (carbonSavedEl) {
        const carbonSaved = (data.categories.recyclable * 0.002).toFixed(1);
        animateValue(carbonSavedEl, 0, parseFloat(carbonSaved), 1000, true);
    }
    
    if (ecoPointsEl) {
        const ecoPoints = data.categories.recyclable * 10;
        animateValue(ecoPointsEl, 0, ecoPoints, 1000);
    }
    
    // Update category values
    const categories = ['organic', 'recyclable', 'electronic', 'hazardous', 'general'];
    categories.forEach(category => {
        const element = document.querySelector(`[data-category="${category}"]`);
        if (element && data.categories[category] !== undefined) {
            animateValue(element, 0, data.categories[category], 1000, false, ' lbs');
        }
    });
}

function animateValue(element, start, end, duration, isDecimal = false, suffix = '') {
    const startTime = performance.now();
    const currentText = element.textContent;
    const numericValue = parseFloat(currentText) || 0;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * progress;
        const displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);
        element.textContent = displayValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

async function updateTrackerData() {
    const data = await fetchWasteData();
    if (data) {
        wasteData = data;
        updateTrackerDisplay(data);
    }
}

function startWasteTracker() {
    // Initial load
    updateTrackerData();
    
    // Set up periodic updates
    setInterval(() => {
        if (currentSection === 'tracker') {
            updateTrackerData();
        }
    }, WASTE_API_CONFIG.refreshInterval);
}

function setTheme(theme) {
    currentTheme = theme;
    applyTheme();
    saveSettings();
    showNotification(`Theme changed to ${theme}`);
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update theme selection UI
    document.querySelectorAll('[data-theme]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeThemeBtn = document.querySelector(`[data-theme="${currentTheme}"]`);
    if (activeThemeBtn) {
        activeThemeBtn.classList.add('active');
    }
}

function setLanguage(language) {
    currentLanguage = language;
    updateLanguage();
    saveSettings();
    showNotification(`Language changed to ${language === 'en' ? 'English' : 'Español'}`);
}

function translate(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

function updateLanguage() {
    // Update all elements with data-key attributes
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        const translation = translate(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Update navigation text
    const navItems = document.querySelectorAll('.nav-text');
    navItems.forEach((item, index) => {
        const keys = ['nav.home', 'nav.info', 'nav.games', 'nav.tracker', 'nav.about', 'nav.settings'];
        if (keys[index]) {
            item.textContent = translate(keys[index]);
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
}

function animateMetrics() {
    // This function is now handled by updateTrackerDisplay
    // Kept for backward compatibility
}

// Game functions
function initGames() {
    // Initialize all games with default settings
    resetSortingGame();
    resetMatchingGame();
    resetMemoryGame();
}

function hideAllGames() {
    document.querySelectorAll('.game-content').forEach(game => {
        game.style.display = 'none';
    });
    
    // Show the games grid
    document.querySelector('.games-grid').style.display = 'grid';
}

function showGame(gameType) {
    hideAllGames();
    
    // Hide the games grid
    document.querySelector('.games-grid').style.display = 'none';
    
    // Show the selected game
    const gameElement = document.getElementById(`${gameType}-game`);
    if (gameElement) {
        gameElement.style.display = 'block';
    }
    
    // Reset the game when shown
    switch(gameType) {
        case 'sorting':
            resetSortingGame();
            break;
        case 'matching':
            resetMatchingGame();
            break;
        case 'memory':
            resetMemoryGame();
            break;
    }
}

// Sorting Game Implementation
function resetSortingGame() {
    gameState.sorting.points = 0;
    document.getElementById('sorting-points').textContent = '0';
    
    const itemsContainer = document.getElementById('sorting-items');
    itemsContainer.innerHTML = '';
    
    // Generate waste items based on difficulty
    const itemCount = getDifficultyItemCount(gameState.sorting.difficulty);
    gameState.sorting.items = generateWasteItems(itemCount);
    
    // Create draggable items
    gameState.sorting.items.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'waste-item';
        itemElement.draggable = true;
        itemElement.innerHTML = `
            <span class="waste-icon">${item.icon}</span>
            <span class="waste-name">${item.name}</span>
        `;
        itemElement.dataset.itemType = item.type;
        itemElement.dataset.itemId = index;
        
        // Add drag events
        itemElement.addEventListener('dragstart', handleDragStart);
        itemElement.addEventListener('dragend', handleDragEnd);
        
        itemsContainer.appendChild(itemElement);
    });
    
    // Setup bins
    const bins = document.querySelectorAll('.bin');
    bins.forEach(bin => {
        bin.addEventListener('dragover', handleDragOver);
        bin.addEventListener('dragenter', handleDragEnter);
        bin.addEventListener('dragleave', handleDragLeave);
        bin.addEventListener('drop', handleDrop);
    });
}

function getDifficultyItemCount(difficulty) {
    switch(difficulty) {
        case 'easy': return 4;
        case 'hard': return 8;
        case 'nightmare': return 12;
        case 'impossible': return 16;
        default: return 4;
    }
}

function generateWasteItems(count) {
    const items = [];
    const types = ['recyclable', 'organic', 'hazardous', 'general'];
    
    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const itemOptions = wasteItems[type];
        const item = itemOptions[Math.floor(Math.random() * itemOptions.length)];
        items.push({
            ...item,
            type: type
        });
    }
    
    return items;
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.itemId);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const itemId = e.dataTransfer.getData('text/plain');
    const itemElement = document.querySelector(`[data-item-id="${itemId}"]`);
    const itemType = itemElement.dataset.itemType;
    const binType = e.target.dataset.binType;
    
    // Check if item was dropped in correct bin
    if (itemType === binType) {
        // Correct bin - add points
        const points = getDifficultyPoints(gameState.sorting.difficulty);
        gameState.sorting.points += points;
        document.getElementById('sorting-points').textContent = gameState.sorting.points;
        
        // Update total points
        rewardsState.totalPoints += points;
        saveRewardsState();
        updateRewardsDisplay();
        
        // Show success notification
        showNotification(`Correct! +${points} points`);
        
        // Remove item
        itemElement.remove();
        
        // Check if game is complete
        if (document.querySelectorAll('.waste-item').length === 0) {
            showNotification(`Game complete! Total points: ${gameState.sorting.points}`);
        }
    } else {
        // Wrong bin - show notification
        showNotification('Wrong bin! Try again.');
    }
}

// Matching Game Implementation
function resetMatchingGame() {
    gameState.matching.points = 0;
    gameState.matching.flippedCards = [];
    gameState.matching.matchedPairs = 0;
    document.getElementById('matching-points').textContent = '0';
    
    const board = document.getElementById('matching-board');
    board.innerHTML = '';
    
    // Generate cards based on difficulty
    const pairCount = getDifficultyPairCount(gameState.matching.difficulty);
    gameState.matching.cards = generateMatchingCards(pairCount);
    
    // Create card elements
    gameState.matching.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'matching-card';
        cardElement.innerHTML = `
            <div class="card-front">${card.icon}</div>
            <div class="card-back">❓</div>
        `;
        cardElement.dataset.cardType = card.type;
        cardElement.dataset.cardId = index;
        cardElement.dataset.cardName = card.name;
        
        cardElement.addEventListener('click', () => flipMatchingCard(cardElement));
        board.appendChild(cardElement);
    });
}

function getDifficultyPairCount(difficulty) {
    switch(difficulty) {
        case 'easy': return 4;
        case 'hard': return 6;
        case 'nightmare': return 8;
        case 'impossible': return 10;
        default: return 4;
    }
}

function generateMatchingCards(pairCount) {
    const cards = [];
    const types = ['recyclable', 'organic', 'hazardous', 'general'];
    
    for (let i = 0; i < pairCount; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const itemOptions = wasteItems[type];
        const item = itemOptions[Math.floor(Math.random() * itemOptions.length)];
        
        // Add two cards for each pair
        cards.push({...item, type: type});
        cards.push({...item, type: type});
    }
    
    // Shuffle cards
    return shuffleArray(cards);
}

function flipMatchingCard(cardElement) {
    // Prevent flipping if already matched or two cards are already flipped
    if (cardElement.classList.contains('matched') || 
        gameState.matching.flippedCards.length >= 2 ||
        gameState.matching.flippedCards.includes(cardElement)) {
        return;
    }
    
    // Flip the card
    cardElement.classList.add('flipped');
    gameState.matching.flippedCards.push(cardElement);
    
    // Check for match when two cards are flipped
    if (gameState.matching.flippedCards.length === 2) {
        const [card1, card2] = gameState.matching.flippedCards;
        
        if (card1.dataset.cardType === card2.dataset.cardType &&
            card1.dataset.cardName === card2.dataset.cardName) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                // Add points
                const points = getDifficultyPoints(gameState.matching.difficulty) * 2;
                gameState.matching.points += points;
                document.getElementById('matching-points').textContent = gameState.matching.points;
                
                // Update total points
                rewardsState.totalPoints += points;
                saveRewardsState();
                updateRewardsDisplay();
                
                // Show notification
                showNotification(`Match found! +${points} points`);
                
                // Reset flipped cards
                gameState.matching.flippedCards = [];
                gameState.matching.matchedPairs++;
                
                // Check if game is complete
                const totalPairs = getDifficultyPairCount(gameState.matching.difficulty);
                if (gameState.matching.matchedPairs === totalPairs) {
                    showNotification(`Game complete! Total points: ${gameState.matching.points}`);
                }
            }, 1000);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                gameState.matching.flippedCards = [];
                showNotification('No match! Try again.');
            }, 1000);
        }
    }
}

// Memory Game Implementation
function resetMemoryGame() {
    gameState.memory.points = 0;
    gameState.memory.flippedCards = [];
    gameState.memory.matchedPairs = 0;
    gameState.memory.moves = 0;
    document.getElementById('memory-points').textContent = '0';
    
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    
    // Generate cards based on difficulty
    const pairCount = getDifficultyPairCount(gameState.memory.difficulty);
    gameState.memory.cards = generateMemoryCards(pairCount);
    
    // Create card elements
    gameState.memory.cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.innerHTML = `
            <div class="card-front">${card.icon}</div>
            <div class="card-back">❓</div>
        `;
        cardElement.dataset.cardId = index;
        cardElement.dataset.cardValue = card.value;
        
        cardElement.addEventListener('click', () => flipMemoryCard(cardElement));
        board.appendChild(cardElement);
    });
}

function generateMemoryCards(pairCount) {
    const cards = [];
    const values = [];
    
    // Create pairs of values
    for (let i = 1; i <= pairCount; i++) {
        values.push(i);
        values.push(i);
    }
    
    // Create card objects with values and icons
    values.forEach((value, index) => {
        cards.push({
            value: value,
            icon: getMemoryCardIcon(value)
        });
    });
    
    // Shuffle cards
    return shuffleArray(cards);
}

function getMemoryCardIcon(value) {
    const icons = ['♻️', '🌱', '⚠️', '🗑️', '🍎', '🥤', '📦', '🔋', '📱', '🧴'];
    return icons[value - 1] || '❓';
}

function flipMemoryCard(cardElement) {
    // Prevent flipping if already matched or two cards are already flipped
    if (cardElement.classList.contains('matched') || 
        gameState.memory.flippedCards.length >= 2 ||
        gameState.memory.flippedCards.includes(cardElement)) {
        return;
    }
    
    // Flip the card
    cardElement.classList.add('flipped');
    gameState.memory.flippedCards.push(cardElement);
    gameState.memory.moves++;
    
    // Check for match when two cards are flipped
    if (gameState.memory.flippedCards.length === 2) {
        const [card1, card2] = gameState.memory.flippedCards;
        
        if (card1.dataset.cardValue === card2.dataset.cardValue) {
            // Match found
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                // Add points (more points for fewer moves)
                const points = Math.max(10, getDifficultyPoints(gameState.memory.difficulty) - (gameState.memory.moves * 0.5));
                gameState.memory.points += Math.floor(points);
                document.getElementById('memory-points').textContent = gameState.memory.points;
                
                // Update total points
                rewardsState.totalPoints += Math.floor(points);
                saveRewardsState();
                updateRewardsDisplay();
                
                // Show notification
                showNotification(`Match found! +${Math.floor(points)} points`);
                
                // Reset flipped cards
                gameState.memory.flippedCards = [];
                gameState.memory.matchedPairs++;
                
                // Check if game is complete
                const totalPairs = getDifficultyPairCount(gameState.memory.difficulty);
                if (gameState.memory.matchedPairs === totalPairs) {
                    showNotification(`Game complete! Total points: ${gameState.memory.points}`);
                }
            }, 1000);
        } else {
            // No match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                gameState.memory.flippedCards = [];
                showNotification('No match! Try again.');
            }, 1000);
        }
    }
}

// Helper function to get points based on difficulty
function getDifficultyPoints(difficulty) {
    switch(difficulty) {
        case 'easy': return 10;
        case 'hard': return 20;
        case 'nightmare': return 30;
        case 'impossible': return 50;
        default: return 10;
    }
}

// Helper function to shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Eco Rewards System Implementation
function loadRewardsState() {
    const saved = localStorage.getItem('ecotrack-rewards');
    if (saved) {
        try {
            rewardsState = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading rewards state:', error);
        }
    }
}

function saveRewardsState() {
    localStorage.setItem('ecotrack-rewards', JSON.stringify(rewardsState));
}

function updateRewardsDisplay() {
    // Update rewards status
    Object.entries(rewardsState.rewards).forEach(([id, reward]) => {
        const rewardCard = document.querySelector(`[data-reward-id="${id}"]`);
        if (rewardCard) {
            const statusElement = rewardCard.querySelector('.reward-status');
            if (reward.earned) {
                statusElement.textContent = 'Earned!';
                statusElement.className = 'reward-status earned';
            } else {
                statusElement.textContent = 'Locked';
                statusElement.className = 'reward-status locked';
            }
        }
    });
    
    // Check for reward completion
    checkRewardsCompletion();
}

function checkRewardsCompletion() {
    Object.entries(rewardsState.rewards).forEach(([id, reward]) => {
        if (!reward.earned) {
            let rewardEarned = false;
            
            switch(reward.game) {
                case 'total':
                    rewardEarned = rewardsState.totalPoints >= reward.pointsRequired;
                    break;
                case 'nightmare':
                    // Check if all games have been completed on nightmare difficulty
                    rewardEarned = (gameState.sorting.difficulty === 'nightmare' && gameState.sorting.points > 0) &&
                                   (gameState.matching.difficulty === 'nightmare' && gameState.matching.points > 0) &&
                                   (gameState.memory.difficulty === 'nightmare' && gameState.memory.points > 0);
                    break;
                default:
                    // Check if specific game points meet requirement
                    if (gameState[reward.game]) {
                        rewardEarned = gameState[reward.game].points >= reward.pointsRequired;
                    }
                    break;
            }
            
            if (rewardEarned) {
                rewardsState.rewards[id].earned = true;
                showNotification(`🏆 Reward earned: ${reward.name}!`);
                saveRewardsState();
                updateRewardsDisplay();
            }
        }
    });
}