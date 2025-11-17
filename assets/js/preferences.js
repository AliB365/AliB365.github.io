// User Preferences System
const DEFAULT_PREFERENCES = {
    fontSize: 16,
    emailNotifications: true,
    commentNotifications: true,
    achievementNotifications: true
};

// Load preferences from localStorage
export function loadPreferences() {
    const saved = localStorage.getItem('userPreferences');
    return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
}

// Save preferences to localStorage
export function savePreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    applyPreferences(preferences);
}

// Apply preferences to the page
export function applyPreferences(preferences) {
    // Apply font size
    document.documentElement.style.setProperty('--reading-font-size', `${preferences.fontSize}px`);
    
    // Apply to article body if it exists
    const articleBody = document.querySelector('.article-body');
    if (articleBody) {
        articleBody.style.fontSize = `${preferences.fontSize}px`;
    }
}

// Initialize preferences on page load
export function initPreferences() {
    const preferences = loadPreferences();
    applyPreferences(preferences);
}

// Initialize preferences panel
export function initPreferencesPanel() {
    const preferences = loadPreferences();

    // Font size control
    const fontSizeInput = document.getElementById('font-size-input');
    const fontSizeValue = document.getElementById('font-size-value');
    
    if (fontSizeInput && fontSizeValue) {
        fontSizeInput.value = preferences.fontSize;
        fontSizeValue.textContent = `${preferences.fontSize}px`;
        
        fontSizeInput.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            fontSizeValue.textContent = `${size}px`;
            preferences.fontSize = size;
            savePreferences(preferences);
        });
    }

    // Email notifications toggle
    const emailNotificationsToggle = document.getElementById('email-notifications');
    if (emailNotificationsToggle) {
        emailNotificationsToggle.checked = preferences.emailNotifications;
        emailNotificationsToggle.addEventListener('change', (e) => {
            preferences.emailNotifications = e.target.checked;
            savePreferences(preferences);
        });
    }

    // Comment notifications toggle
    const commentNotificationsToggle = document.getElementById('comment-notifications');
    if (commentNotificationsToggle) {
        commentNotificationsToggle.checked = preferences.commentNotifications;
        commentNotificationsToggle.addEventListener('change', (e) => {
            preferences.commentNotifications = e.target.checked;
            savePreferences(preferences);
        });
    }

    // Achievement notifications toggle
    const achievementNotificationsToggle = document.getElementById('achievement-notifications');
    if (achievementNotificationsToggle) {
        achievementNotificationsToggle.checked = preferences.achievementNotifications;
        achievementNotificationsToggle.addEventListener('change', (e) => {
            preferences.achievementNotifications = e.target.checked;
            savePreferences(preferences);
        });
    }
}

// Get notification preferences
export function shouldShowNotification(type) {
    const preferences = loadPreferences();
    switch (type) {
        case 'email':
            return preferences.emailNotifications;
        case 'comment':
            return preferences.commentNotifications;
        case 'achievement':
            return preferences.achievementNotifications;
        default:
            return true;
    }
}
