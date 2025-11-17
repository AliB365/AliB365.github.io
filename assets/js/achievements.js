// Achievements and Gamification System
import { getFirestore, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getUserStats } from './profile.js';

let db = null;

function initFirestore() {
    if (!window.firebaseApp) return false;
    db = getFirestore(window.firebaseApp);
    return true;
}

// Achievement definitions
export const achievements = [
    {
        id: 'first-read',
        name: 'First Steps',
        description: 'Read your first article',
        icon: '📖',
        requirement: { type: 'articlesRead', value: 1 }
    },
    {
        id: 'avid-reader',
        name: 'Avid Reader',
        description: 'Read 10 articles',
        icon: '📚',
        requirement: { type: 'articlesRead', value: 10 }
    },
    {
        id: 'bookworm',
        name: 'Bookworm',
        description: 'Read 50 articles',
        icon: '🐛',
        requirement: { type: 'articlesRead', value: 50 }
    },
    {
        id: 'first-comment',
        name: 'Breaking the Ice',
        description: 'Post your first comment',
        icon: '💬',
        requirement: { type: 'commentsPosted', value: 1 }
    },
    {
        id: 'conversationalist',
        name: 'Conversationalist',
        description: 'Post 25 comments',
        icon: '💭',
        requirement: { type: 'commentsPosted', value: 25 }
    },
    {
        id: 'week-streak',
        name: 'Week Warrior',
        description: '7 day reading streak',
        icon: '🔥',
        requirement: { type: 'streak', value: 7 }
    },
    {
        id: 'month-streak',
        name: 'Month Master',
        description: '30 day reading streak',
        icon: '⭐',
        requirement: { type: 'streak', value: 30 }
    },
    {
        id: 'collector',
        name: 'Collector',
        description: 'Bookmark 10 articles',
        icon: '🔖',
        requirement: { type: 'bookmarks', value: 10 }
    },
    {
        id: 'early-bird',
        name: 'Early Supporter',
        description: 'One of the first users',
        icon: '🐦',
        requirement: { type: 'manual', value: true }
    }
];

// Check and unlock achievements
export async function checkAchievements() {
    if (!initFirestore() || !window.currentUser) return;

    const stats = await getUserStats();
    if (!stats) return;

    const userAchievementsRef = doc(db, 'achievements', window.currentUser.uid);
    const achievementsDoc = await getDoc(userAchievementsRef);
    const unlockedAchievements = achievementsDoc.exists() ? achievementsDoc.data().unlocked || [] : [];

    const newlyUnlocked = [];

    for (const achievement of achievements) {
        if (unlockedAchievements.includes(achievement.id)) continue;
        if (achievement.requirement.type === 'manual') continue;

        const statValue = stats[achievement.requirement.type] || 0;
        if (statValue >= achievement.requirement.value) {
            newlyUnlocked.push(achievement.id);
            showAchievementNotification(achievement);
        }
    }

    if (newlyUnlocked.length > 0) {
        await setDoc(userAchievementsRef, {
            userId: window.currentUser.uid,
            unlocked: [...unlockedAchievements, ...newlyUnlocked]
        }, { merge: true });
    }
}

// Show achievement notification
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-notification-content">
            <div class="achievement-notification-icon">${achievement.icon}</div>
            <div>
                <div class="achievement-notification-title">Achievement Unlocked!</div>
                <div class="achievement-notification-name">${achievement.name}</div>
                <div class="achievement-notification-desc">${achievement.description}</div>
            </div>
        </div>
    `;

    // Add styles if not already present
    if (!document.getElementById('achievement-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'achievement-notification-styles';
        style.textContent = `
            .achievement-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--card-bg);
                border: 2px solid var(--primary-color);
                border-radius: 12px;
                padding: 1.5rem;
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 4.5s;
            }
            .achievement-notification-content {
                display: flex;
                gap: 1rem;
                align-items: center;
            }
            .achievement-notification-icon {
                font-size: 3rem;
            }
            .achievement-notification-title {
                font-size: 0.85rem;
                color: var(--primary-color);
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            .achievement-notification-name {
                font-size: 1.1rem;
                color: var(--text-primary);
                font-weight: 700;
                margin-bottom: 0.25rem;
            }
            .achievement-notification-desc {
                font-size: 0.9rem;
                color: var(--text-secondary);
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes fadeOut {
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Initialize achievements display on profile page
export async function initAchievementsDisplay() {
    if (!initFirestore() || !window.currentUser) return;

    const achievementsContainer = document.getElementById('achievements-grid');
    if (!achievementsContainer) return;

    const userAchievementsRef = doc(db, 'achievements', window.currentUser.uid);
    const achievementsDoc = await getDoc(userAchievementsRef);
    const unlockedAchievements = achievementsDoc.exists() ? achievementsDoc.data().unlocked || [] : [];

    const stats = await getUserStats();

    achievementsContainer.innerHTML = achievements.map(achievement => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        const progress = achievement.requirement.type !== 'manual' 
            ? Math.min(100, (stats[achievement.requirement.type] || 0) / achievement.requirement.value * 100)
            : 0;

        return `
            <div class="achievement-badge ${isUnlocked ? '' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                ${!isUnlocked && achievement.requirement.type !== 'manual' ? `
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar" style="width: ${progress}%"></div>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}
