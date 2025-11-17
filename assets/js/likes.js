// Likes and Bookmarks System
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, query, where, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let db = null;

// Initialize Firestore
function initFirestore() {
    if (!window.firebaseApp) {
        console.error('Firebase app not initialized');
        return false;
    }
    db = getFirestore(window.firebaseApp);
    return true;
}

// Like a post
export async function likePost(postId) {
    if (!initFirestore() || !window.currentUser) {
        console.error('Not authenticated or Firestore not available');
        return false;
    }

    try {
        const likeRef = doc(db, 'likes', `${window.currentUser.uid}_${postId}`);
        await setDoc(likeRef, {
            userId: window.currentUser.uid,
            postId: postId,
            createdAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error liking post:', error);
        return false;
    }
}

// Unlike a post
export async function unlikePost(postId) {
    if (!initFirestore() || !window.currentUser) {
        return false;
    }

    try {
        const likeRef = doc(db, 'likes', `${window.currentUser.uid}_${postId}`);
        await deleteDoc(likeRef);
        return true;
    } catch (error) {
        console.error('Error unliking post:', error);
        return false;
    }
}

// Check if user liked a post
export async function isPostLiked(postId) {
    if (!initFirestore() || !window.currentUser) {
        return false;
    }

    try {
        const likeRef = doc(db, 'likes', `${window.currentUser.uid}_${postId}`);
        const likeDoc = await getDoc(likeRef);
        return likeDoc.exists();
    } catch (error) {
        console.error('Error checking like status:', error);
        return false;
    }
}

// Get like count for a post
export async function getLikeCount(postId) {
    if (!initFirestore()) {
        return 0;
    }

    try {
        const likesQuery = query(collection(db, 'likes'), where('postId', '==', postId));
        const querySnapshot = await getDocs(likesQuery);
        return querySnapshot.size;
    } catch (error) {
        console.error('Error getting like count:', error);
        return 0;
    }
}

// Bookmark a post
export async function bookmarkPost(postId, postTitle) {
    if (!initFirestore() || !window.currentUser) {
        console.error('Not authenticated or Firestore not available');
        return false;
    }

    try {
        const bookmarkRef = doc(db, 'bookmarks', `${window.currentUser.uid}_${postId}`);
        await setDoc(bookmarkRef, {
            userId: window.currentUser.uid,
            postId: postId,
            postTitle: postTitle,
            createdAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error bookmarking post:', error);
        return false;
    }
}

// Remove bookmark
export async function removeBookmark(postId) {
    if (!initFirestore() || !window.currentUser) {
        return false;
    }

    try {
        const bookmarkRef = doc(db, 'bookmarks', `${window.currentUser.uid}_${postId}`);
        await deleteDoc(bookmarkRef);
        return true;
    } catch (error) {
        console.error('Error removing bookmark:', error);
        return false;
    }
}

// Check if post is bookmarked
export async function isPostBookmarked(postId) {
    if (!initFirestore() || !window.currentUser) {
        return false;
    }

    try {
        const bookmarkRef = doc(db, 'bookmarks', `${window.currentUser.uid}_${postId}`);
        const bookmarkDoc = await getDoc(bookmarkRef);
        return bookmarkDoc.exists();
    } catch (error) {
        console.error('Error checking bookmark status:', error);
        return false;
    }
}

// Get user's bookmarks
export async function getUserBookmarks() {
    if (!initFirestore() || !window.currentUser) {
        return [];
    }

    try {
        const bookmarksQuery = query(collection(db, 'bookmarks'), where('userId', '==', window.currentUser.uid));
        const querySnapshot = await getDocs(bookmarksQuery);
        const bookmarks = [];
        querySnapshot.forEach((doc) => {
            bookmarks.push({ id: doc.id, ...doc.data() });
        });
        return bookmarks.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
        console.error('Error getting bookmarks:', error);
        return [];
    }
}

// Initialize like and bookmark buttons on post page
export function initPostActions(postId, postTitle) {
    const likeBtn = document.getElementById('like-btn');
    const bookmarkBtn = document.getElementById('bookmark-btn');

    if (!likeBtn || !bookmarkBtn) return;

    // Check initial states
    isPostLiked(postId).then(liked => {
        if (liked) {
            likeBtn.classList.add('active');
        }
    });

    isPostBookmarked(postId).then(bookmarked => {
        if (bookmarked) {
            bookmarkBtn.classList.add('active');
        }
    });

    // Get and display like count
    getLikeCount(postId).then(count => {
        const likeCount = likeBtn.querySelector('.like-count');
        if (likeCount) {
            likeCount.textContent = count;
        }
    });

    // Like button handler
    likeBtn.addEventListener('click', async () => {
        if (!window.currentUser) {
            alert('Please sign in to like posts');
            return;
        }

        const isLiked = likeBtn.classList.contains('active');
        if (isLiked) {
            await unlikePost(postId);
            likeBtn.classList.remove('active');
        } else {
            await likePost(postId);
            likeBtn.classList.add('active');
        }

        // Update count
        const count = await getLikeCount(postId);
        const likeCount = likeBtn.querySelector('.like-count');
        if (likeCount) {
            likeCount.textContent = count;
        }
    });

    // Bookmark button handler
    bookmarkBtn.addEventListener('click', async () => {
        if (!window.currentUser) {
            alert('Please sign in to bookmark posts');
            return;
        }

        const isBookmarked = bookmarkBtn.classList.contains('active');
        if (isBookmarked) {
            await removeBookmark(postId);
            bookmarkBtn.classList.remove('active');
        } else {
            await bookmarkPost(postId, postTitle);
            bookmarkBtn.classList.add('active');
        }
    });
}

// Share functionality
export function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    shareButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.dataset.platform;

            let shareUrl = '';
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                    break;
                case 'copy':
                    navigator.clipboard.writeText(window.location.href);
                    btn.textContent = '✓ Copied!';
                    setTimeout(() => {
                        btn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
                                <rect x="8" y="2" width="8" height="4" rx="1"/>
                            </svg>
                            Copy Link
                        `;
                    }, 2000);
                    return;
            }

            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}
