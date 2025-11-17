// Comments System using Firebase Firestore
import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot,
    serverTimestamp,
    deleteDoc,
    doc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let db;
let currentPostId;
let unsubscribe;

// Initialize Firestore
export function initComments(postId) {
    currentPostId = postId;
    
    // Wait for Firebase to be initialized
    if (window.firebaseApp) {
        db = getFirestore(window.firebaseApp);
        loadComments();
    } else {
        // Wait for Firebase initialization
        const checkFirebase = setInterval(() => {
            if (window.firebaseApp) {
                clearInterval(checkFirebase);
                db = getFirestore(window.firebaseApp);
                loadComments();
            }
        }, 100);
    }
}

// Load comments for current post
function loadComments() {
    const commentsContainer = document.getElementById('comments-list');
    if (!commentsContainer) return;

    // Create query for comments
    const commentsRef = collection(db, 'comments');
    const q = query(
        commentsRef,
        orderBy('timestamp', 'desc')
    );

    // Listen for real-time updates
    unsubscribe = onSnapshot(q, (snapshot) => {
        const postComments = [];
        snapshot.forEach((doc) => {
            const comment = { id: doc.id, ...doc.data() };
            if (comment.postId === currentPostId) {
                postComments.push(comment);
            }
        });

        displayComments(postComments);
    });
}

// Display comments
function displayComments(comments) {
    const commentsContainer = document.getElementById('comments-list');
    const commentCount = document.getElementById('comment-count');
    
    commentCount.textContent = `${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`;

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
        return;
    }

    commentsContainer.innerHTML = comments.map(comment => `
        <div class="comment" data-comment-id="${comment.id}">
            <div class="comment-header">
                <div class="comment-author">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>${comment.userName}</span>
                </div>
                <div class="comment-actions">
                    <span class="comment-date">${formatCommentDate(comment.timestamp)}</span>
                    ${comment.userId === (window.currentUser ? window.currentUser.uid : null) ? `
                        <button class="comment-delete-btn" onclick="deleteComment('${comment.id}')">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
            </div>
            <div class="comment-body">
                <p>${escapeHtml(comment.text)}</p>
            </div>
        </div>
    `).join('');
}

// Post a new comment
export async function postComment() {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();

    if (!commentText) {
        showCommentError('Please enter a comment');
        return;
    }

    if (!window.currentUser) {
        showCommentError('Please sign in to comment');
        return;
    }

    if (commentText.length > 1000) {
        showCommentError('Comment is too long (max 1000 characters)');
        return;
    }

    if (!db) {
        showCommentError('Database not initialized. Please refresh the page.');
        return;
    }

    try {
        await addDoc(collection(db, 'comments'), {
            postId: currentPostId,
            userId: window.currentUser.uid,
            userName: window.currentUser.email.split('@')[0],
            userEmail: window.currentUser.email,
            text: commentText,
            timestamp: serverTimestamp()
        });

        commentInput.value = '';
        hideCommentError();
    } catch (error) {
        console.error('Error posting comment:', error);
        showCommentError('Failed to post comment. Please try again.');
    }
}

// Delete a comment
window.deleteComment = async function(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) {
        return;
    }

    if (!db) {
        alert('Database not initialized. Please refresh the page.');
        return;
    }

    try {
        await deleteDoc(doc(db, 'comments', commentId));
    } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment. Please try again.');
    }
}

// Show comment error
function showCommentError(message) {
    const errorElement = document.getElementById('comment-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Hide comment error
function hideCommentError() {
    const errorElement = document.getElementById('comment-error');
    errorElement.style.display = 'none';
}

// Format comment date
function formatCommentDate(timestamp) {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cleanup when leaving page
export function cleanupComments() {
    if (unsubscribe) {
        unsubscribe();
    }
}
