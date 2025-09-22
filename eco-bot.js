// Eco Bot functionality
class EcoBot {
    constructor() {
        this.ecoBot = document.getElementById('eco-bot');
        this.chatBubble = document.getElementById('chat-bubble');
        this.isFollowing = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.botX = 0;
        this.botY = 0;
        this.wasteTips = [
            {
                title: "♻️ Recycling Tips",
                content: "Clean containers before recycling. Remove caps and lids from bottles. Check local recycling programs for specific material acceptance policies.",
                tips: [
                    "Rinse containers to remove food residue",
                    "Remove plastic caps from bottles",
                    "Flatten cardboard boxes",
                    "Check recycling symbols (1-7)"
                ]
            },
            {
                title: "🌱 Organic Waste",
                content: "Organic waste should be composted to create nutrient-rich soil. Keep food scraps, yard trimmings, and biodegradable materials separate.",
                tips: [
                    "Compost fruit and vegetable scraps",
                    "Avoid meat and dairy in compost",
                    "Add brown materials (leaves, paper)",
                    "Turn compost regularly"
                ]
            },
            {
                title: "⚠️ Hazardous Waste",
                content: "Electronics, batteries, chemicals, and medical waste require special disposal methods. Never put these items in regular trash or recycling bins.",
                tips: [
                    "Take electronics to e-waste centers",
                    "Recycle batteries at designated points",
                    "Dispose of chemicals properly",
                    "Check local hazardous waste facilities"
                ]
            },
            {
                title: "🌍 Reduction Tips",
                content: "Buy only what you need, choose reusable products, repair instead of replacing, and donate items in good condition.",
                tips: [
                    "Use reusable bags and containers",
                    "Buy products with minimal packaging",
                    "Repair items when possible",
                    "Donate usable items instead of trashing"
                ]
            },
            {
                title: "🗑️ General Waste",
                content: "General waste should be minimized through proper sorting and recycling. Only non-recyclable items should go in general waste.",
                tips: [
                    "Sort waste properly first",
                    "Compress items to save space",
                    "Use appropriate bag sizes",
                    "Empty containers completely"
                ]
            }
        ];
        this.currentTipIndex = 0;
        this.init();
    }

    init() {
        if (this.ecoBot) {
            this.setupEventListeners();
            this.startFollowing();
            // Remove automatic tip rotation
        }
    }

    setupEventListeners() {
        // Click event for showing chat bubble - instant change
        this.ecoBot.addEventListener('click', () => {
            this.nextTip();
            this.showChatBubble();
        });

        // Touch events for mobile
        this.ecoBot.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.nextTip();
            this.showChatBubble();
        });

        // Mouse events for following
        document.addEventListener('mousemove', (e) => {
            this.updateMousePosition(e.clientX, e.clientY);
        });

        // Touch events for following
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.updateMousePosition(e.touches[0].clientX, e.touches[0].clientY);
            }
        });

        // Hide chat bubble when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.ecoBot.contains(e.target) && !this.chatBubble.contains(e.target)) {
                this.hideChatBubble();
            }
        });
    }

    updateMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
        this.isFollowing = true;
    }

    startFollowing() {
        const follow = () => {
            if (this.isFollowing) {
                const botRect = this.ecoBot.getBoundingClientRect();
                const botCenterX = botRect.left + botRect.width / 2;
                const botCenterY = botRect.top + botRect.height / 2;

                // Calculate distance and direction
                const deltaX = this.mouseX - botCenterX;
                const deltaY = this.mouseY - botCenterY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                // Only move if mouse is far enough away
                if (distance > 100) {
                    const speed = 0.02;
                    this.botX += deltaX * speed;
                    this.botY += deltaY * speed;

                    // Keep bot within viewport bounds
                    const maxX = window.innerWidth - botRect.width - 20;
                    const maxY = window.innerHeight - botRect.height - 20;
                    
                    this.botX = Math.max(20, Math.min(maxX, this.botX));
                    this.botY = Math.max(20, Math.min(maxY, this.botY));

                    this.ecoBot.style.transform = `translate(${this.botX}px, ${this.botY}px)`;
                }
            }
            requestAnimationFrame(follow);
        };
        follow();
    }

    // New method to instantly switch to next tip
    nextTip() {
        this.currentTipIndex = (this.currentTipIndex + 1) % this.wasteTips.length;
    }

    showChatBubble() {
        const currentTip = this.wasteTips[this.currentTipIndex];
        
        // Update chat content
        this.chatBubble.innerHTML = `
            <div class="chat-content">
                <h4>🤖 Eco Bot</h4>
                <p>${currentTip.content}</p>
                <div class="waste-info">
                    <h5>${currentTip.title}</h5>
                    <ul>
                        ${currentTip.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
            <div class="chat-arrow"></div>
        `;
        
        this.chatBubble.classList.add('show');
        
        // Remove speech synthesis - Eco Bot cannot talk anymore
    }

    hideChatBubble() {
        this.chatBubble.classList.remove('show');
    }

    // Method to manually set position
    setPosition(x, y) {
        this.botX = x;
        this.botY = y;
        this.ecoBot.style.transform = `translate(${x}px, ${y}px)`;
    }
}

// Hamburger Menu Functionality
class HamburgerMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburger-menu');
        this.navMenu = document.getElementById('nav-menu');
        this.init();
    }

    init() {
        if (this.hamburger && this.navMenu) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.hamburger.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking on a nav item (mobile)
        this.navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu when window is resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Enhanced notification system to fix spam issue
function enhanceNotificationSystem() {
    const originalShowNotification = window.showNotification;
    let notificationInProgress = false;
    let notificationQueue = [];
    let lastNotificationTime = 0;
    const MIN_NOTIFICATION_INTERVAL = 2000; // 2 seconds

    window.showNotification = function(message) {
        const now = Date.now();
        
        // Prevent spam by checking time interval
        if (now - lastNotificationTime < MIN_NOTIFICATION_INTERVAL) {
            // Queue the notification for later
            if (!notificationQueue.includes(message)) {
                notificationQueue.push(message);
            }
            return;
        }

        // Prevent duplicate notifications
        if (notificationInProgress) {
            return;
        }

        notificationInProgress = true;
        lastNotificationTime = now;

        // Show the notification
        originalShowNotification(message);

        // Reset flag after notification is complete
        setTimeout(() => {
            notificationInProgress = false;
            
            // Process queued notifications
            if (notificationQueue.length > 0) {
                const nextMessage = notificationQueue.shift();
                setTimeout(() => {
                    window.showNotification(nextMessage);
                }, MIN_NOTIFICATION_INTERVAL);
            }
        }, 3000);
    };
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Eco Bot
    const ecoBot = new EcoBot();
    
    // Initialize Hamburger Menu
    const hamburgerMenu = new HamburgerMenu();
    
    // Enhance notification system
    enhanceNotificationSystem();
    
    // Add some interactive features
    setupInteractiveFeatures();
});

function setupInteractiveFeatures() {
    // Add hover sound effect for Eco Bot (optional)
    const ecoBot = document.getElementById('eco-bot');
    if (ecoBot && typeof Audio !== 'undefined') {
        ecoBot.addEventListener('mouseenter', () => {
            // Play a subtle hover sound if audio files are available
            const audio = new Audio();
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore errors if audio fails
        });
    }
}

// Additional utility functions
function getRandomWasteTip() {
    const tips = [
        "Remember to rinse containers before recycling!",
        "Composting reduces methane emissions from landfills.",
        "Electronic waste contains valuable materials that can be recovered.",
        "Single-use plastics take hundreds of years to decompose.",
        "Paper can be recycled 5-7 times before fibers become too short."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
}

// Export for use in other scripts if needed
window.EcoBot = EcoBot;
window.HamburgerMenu = HamburgerMenu;