// Random Mascot Loader with Seasonal Themes
// Regular mascots (available year-round)
const regularMascots = [
    'mascot.png',
    'mascot2.png',
    // Add more regular mascots here:
    // 'mascot3.png',
    // 'mascot4.png',
];

// Seasonal mascots (only appear during specific seasons)
const seasonalMascots = {
    winter: [
        // 'mascot-winter-1.png',
        // 'mascot-winter-2.png',
        // 'mascot-santa.png',
        // 'mascot-snowman.png',
    ],
    spring: [
        // 'mascot-spring-1.png',
        // 'mascot-easter.png',
        // 'mascot-flowers.png',
    ],
    summer: [
        // 'mascot-summer-1.png',
        // 'mascot-beach.png',
        // 'mascot-sunglasses.png',
    ],
    autumn: [
        // 'mascot-autumn-1.png',
        // 'mascot-halloween.png',
        // 'mascot-thanksgiving.png',
    ]
};

// Holiday-specific mascots (appear on specific date ranges)
const holidayMascots = {
    christmas: {
        start: { month: 12, day: 1 },
        end: { month: 12, day: 26 },
        mascots: [
            // 'mascot-christmas-1.png',
            // 'mascot-christmas-2.png',
        ]
    },
    halloween: {
        start: { month: 10, day: 15 },
        end: { month: 10, day: 31 },
        mascots: [
            // 'mascot-halloween-1.png',
            // 'mascot-halloween-2.png',
        ]
    },
    easter: {
        // Easter is dynamic, but approximate early April
        start: { month: 4, day: 1 },
        end: { month: 4, day: 20 },
        mascots: [
            // 'mascot-easter-1.png',
        ]
    },
    newYear: {
        start: { month: 12, day: 27 },
        end: { month: 1, day: 5 },
        mascots: [
            // 'mascot-newyear-1.png',
            // 'mascot-party.png',
        ]
    }
};

// Get current season based on month
function getCurrentSeason() {
    const month = new Date().getMonth() + 1; // 1-12
    
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter'; // 12, 1, 2
}

// Check if current date is within a holiday period
function getActiveHoliday() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    for (const [holiday, dates] of Object.entries(holidayMascots)) {
        const { start, end, mascots } = dates;
        
        // Handle holidays that span across year boundary (e.g., New Year)
        if (start.month > end.month) {
            if (month >= start.month || month <= end.month) {
                if ((month === start.month && day >= start.day) ||
                    (month === end.month && day <= end.day) ||
                    (month > start.month && month < 12) ||
                    (month < end.month && month > 1)) {
                    return mascots.length > 0 ? mascots : null;
                }
            }
        } else {
            // Normal date range within same year
            if (month >= start.month && month <= end.month) {
                if ((month === start.month && day >= start.day) ||
                    (month === end.month && day <= end.day) ||
                    (month > start.month && month < end.month)) {
                    return mascots.length > 0 ? mascots : null;
                }
            }
        }
    }
    
    return null;
}

// Get available mascots based on current date
function getAvailableMascots() {
    let availableMascots = [...regularMascots];
    
    // Check for holiday mascots first (higher priority)
    const holidayMascotList = getActiveHoliday();
    if (holidayMascotList && holidayMascotList.length > 0) {
        availableMascots = [...availableMascots, ...holidayMascotList];
        console.log('🎉 Holiday mascots active!');
    }
    
    // Add seasonal mascots
    const currentSeason = getCurrentSeason();
    const currentSeasonMascots = seasonalMascots[currentSeason] || [];
    if (currentSeasonMascots.length > 0) {
        availableMascots = [...availableMascots, ...currentSeasonMascots];
        console.log(`🌸 ${currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)} mascots active!`);
    }
    
    return availableMascots;
}

// Randomly select and load a mascot on page load
document.addEventListener('DOMContentLoaded', () => {
    const mascotImg = document.querySelector('.mascot');
    
    if (mascotImg) {
        const availableMascots = getAvailableMascots();
        
        if (availableMascots.length > 0) {
            // Get random mascot from available pool
            const randomMascot = availableMascots[Math.floor(Math.random() * availableMascots.length)];
            
            // Update the image source
            mascotImg.src = `assets/images/${randomMascot}`;
            
            // Add a fade-in animation
            mascotImg.style.opacity = '0';
            mascotImg.style.transition = 'opacity 0.5s ease-in';
            
            // Fade in once loaded
            mascotImg.onload = () => {
                mascotImg.style.opacity = '1';
            };
            
            // Log which mascot was loaded
            console.log(`🎨 Loaded mascot: ${randomMascot}`);
            console.log(`📅 Current season: ${getCurrentSeason()}`);
        }
    }
});
