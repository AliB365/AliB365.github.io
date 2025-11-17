// Profile, Dashboard, and User Stats System
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, limit, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getUserBookmarks } from './likes.js';

let db = null;

function initFirestore() {
    if (!window.firebaseApp) {
        console.error('Firebase app not initialized');
        return false;
    }
    db = getFirestore(window.firebaseApp);
    return true;
}

// Track reading activity
export async function trackReading(postId, postTitle) {
    if (!initFirestore() || !window.currentUser) return false;

    try {
        const today = new Date().toISOString().split('T')[0];
        const readingId = `${window.currentUser.uid}_${postId}_${today}`;
        const readingRef = doc(db, 'readingHistory', readingId);
        
        // Check if already tracked today
        const existingDoc = await getDoc(readingRef);
        if (existingDoc.exists()) {
            console.log('Already tracked this post today');
            return true; // Already tracked today, no need to write again
        }
        
        // Track new reading for today
        await setDoc(readingRef, {
            userId: window.currentUser.uid,
            postId: postId,
            postTitle: postTitle,
            timestamp: serverTimestamp(),
            date: today
        });

        // Update streak
        await updateStreak();
        return true;
    } catch (error) {
        console.error('Error tracking reading:', error);
        return false;
    }
}

// Update reading streak
async function updateStreak() {
    if (!initFirestore() || !window.currentUser) return;

    try {
        const userStatsRef = doc(db, 'userStats', window.currentUser.uid);
        const statsDoc = await getDoc(userStatsRef);
        
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        let streak = 1;
        let lastReadDate = today;
        
        if (statsDoc.exists()) {
            const data = statsDoc.data();
            lastReadDate = data.lastReadDate || today;
            
            if (lastReadDate === today) {
                return; // Already read today
            } else if (lastReadDate === yesterday) {
                streak = (data.streak || 0) + 1;
            }
        }
        
        await setDoc(userStatsRef, {
            userId: window.currentUser.uid,
            streak: streak,
            lastReadDate: today,
            longestStreak: Math.max(streak, statsDoc.exists() ? statsDoc.data().longestStreak || 0 : 0)
        }, { merge: true });
    } catch (error) {
        console.error('Error updating streak:', error);
    }
}

// Get user stats
export async function getUserStats() {
    if (!initFirestore() || !window.currentUser) return null;

    try {
        const userStatsRef = doc(db, 'userStats', window.currentUser.uid);
        const statsDoc = await getDoc(userStatsRef);
        
        // Get reading count
        const readingQuery = query(
            collection(db, 'readingHistory'),
            where('userId', '==', window.currentUser.uid)
        );
        const readingSnapshot = await getDocs(readingQuery);
        const articlesRead = new Set(readingSnapshot.docs.map(doc => doc.data().postId)).size;
        
        // Get comment count
        const commentsQuery = query(
            collection(db, 'comments'),
            where('userId', '==', window.currentUser.uid)
        );
        const commentsSnapshot = await getDocs(commentsQuery);
        
        // Get bookmark count
        const bookmarks = await getUserBookmarks();
        
        return {
            streak: statsDoc.exists() ? statsDoc.data().streak || 0 : 0,
            longestStreak: statsDoc.exists() ? statsDoc.data().longestStreak || 0 : 0,
            articlesRead: articlesRead,
            commentsPosted: commentsSnapshot.size,
            bookmarks: bookmarks.length
        };
    } catch (error) {
        console.error('Error getting user stats:', error);
        return null;
    }
}

// Get reading history
export async function getReadingHistory() {
    if (!initFirestore() || !window.currentUser) return [];

    try {
        const readingQuery = query(
            collection(db, 'readingHistory'),
            where('userId', '==', window.currentUser.uid),
            orderBy('timestamp', 'desc'),
            limit(10)
        );
        const querySnapshot = await getDocs(readingQuery);
        const history = [];
        querySnapshot.forEach((doc) => {
            history.push(doc.data());
        });
        return history;
    } catch (error) {
        console.error('Error getting reading history:', error);
        return [];
    }
}

// Initialize profile page
export async function initProfilePage() {
    console.log('initProfilePage called, currentUser:', window.currentUser);
    
    if (!window.currentUser) {
        console.log('No current user, redirecting...');
        window.location.href = 'index.html';
        return;
    }

    if (!initFirestore()) {
        console.error('Failed to initialize Firestore');
        return;
    }

    console.log('Loading user profile...');
    // Load user profile first
    const userProfile = await loadUserProfile();
    console.log('User profile loaded:', userProfile);

    console.log('Getting user stats...');
    const stats = await getUserStats();
    console.log('User stats:', stats);
    if (!stats) {
        console.error('Failed to get user stats');
        return;
    }

    // Update profile info
    const profileEmail = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar');
    const profileName = document.querySelector('.profile-details h1');
    
    console.log('Updating profile UI elements...');
    if (profileEmail) {
        profileEmail.textContent = window.currentUser.email;
    }
    
    if (profileAvatar) {
        if (userProfile && userProfile.profilePicture) {
            profileAvatar.style.backgroundImage = `url(${userProfile.profilePicture})`;
            profileAvatar.style.backgroundSize = 'cover';
            profileAvatar.style.backgroundPosition = 'center';
            profileAvatar.textContent = '';
        } else {
            const initial = (userProfile && userProfile.displayName) 
                ? userProfile.displayName.charAt(0).toUpperCase()
                : window.currentUser.email.charAt(0).toUpperCase();
            profileAvatar.textContent = initial;
        }
    }
    
    if (profileName) {
        if (userProfile && userProfile.displayName) {
            profileName.textContent = userProfile.displayName;
        } else {
            profileName.textContent = 'My Profile';
        }
    }

    // Update stats
    const statStreak = document.getElementById('stat-streak');
    if (statStreak) statStreak.textContent = stats.streak;
    
    const statArticles = document.getElementById('stat-articles');
    if (statArticles) statArticles.textContent = stats.articlesRead;
    
    const statComments = document.getElementById('stat-comments');
    if (statComments) statComments.textContent = stats.commentsPosted;
    
    const statBookmarks = document.getElementById('stat-bookmarks');
    if (statBookmarks) statBookmarks.textContent = stats.bookmarks;

    console.log('Loading bookmarks...');
    // Load bookmarks
    const bookmarks = await getUserBookmarks();
    console.log('Bookmarks loaded:', bookmarks.length);
    const bookmarkList = document.getElementById('bookmark-list');
    if (bookmarkList) {
        if (bookmarks.length === 0) {
            bookmarkList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No bookmarks yet</p>';
        } else {
            bookmarkList.innerHTML = bookmarks.map(bookmark => `
                <div class="bookmark-item" onclick="window.location.href='posts/${bookmark.postId}.html'">
                    <div>
                        <div class="bookmark-item-title">${bookmark.postTitle}</div>
                        <div class="bookmark-item-date">${bookmark.createdAt ? new Date(bookmark.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </div>
            `).join('');
        }
    }

    console.log('Loading reading history...');
    // Load reading history
    const history = await getReadingHistory();
    console.log('Reading history loaded:', history.length);
    const historyList = document.getElementById('history-list');
    if (historyList) {
        if (history.length === 0) {
            historyList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No reading history yet</p>';
        } else {
            historyList.innerHTML = history.map(item => `
                <div class="bookmark-item" onclick="window.location.href='posts/${item.postId}.html'">
                    <div>
                        <div class="bookmark-item-title">${item.postTitle}</div>
                        <div class="bookmark-item-date">${item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    console.log('Profile page initialization complete');
}

// Load user profile information (kept for potential future use)
async function loadUserProfile() {
    if (!initFirestore() || !window.currentUser) return null;

    try {
        const userRef = doc(db, 'users', window.currentUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            return userDoc.data();
        }
        return null;
    } catch (error) {
        console.error('Error loading user profile:', error);
        return null;
    }
}
