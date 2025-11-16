// Get article ID from URL parameter
function getArticleIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load and display article
async function loadArticle() {
    const articleId = getArticleIdFromURL();
    
    if (!articleId) {
        displayError('No article specified');
        return;
    }
    
    try {
        const response = await fetch('data/posts.json');
        if (!response.ok) {
            throw new Error('Failed to load posts');
        }
        
        const posts = await response.json();
        const post = posts.find(p => p.id === articleId);
        
        if (!post) {
            displayError('Article not found');
            return;
        }
        
        displayArticle(post);
    } catch (error) {
        console.error('Error loading article:', error);
        displayError('Unable to load article. Please try again.');
    }
}

// Display the article
function displayArticle(post) {
    // Update page title
    document.getElementById('page-title').textContent = `${post.title} | Autonomous Agentic`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt);
    }
    
    // Display article content
    const container = document.getElementById('article-container');
    container.innerHTML = `
        <div class="article-header">
            <div class="article-tags">
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <h1 class="article-title">${post.title}</h1>
            <div class="article-meta">
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${formatDate(post.date)}
                </span>
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${post.readTime} min read
                </span>
                <span class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    ${post.author}
                </span>
            </div>
        </div>
        
        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="article-image">` : ''}
        
        <div class="article-body">
            ${post.content}
        </div>
        
        <div class="article-footer">
            <div class="article-tags-footer">
                <strong>Tags:</strong>
                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
}

// Display error message
function displayError(message) {
    const container = document.getElementById('article-container');
    container.innerHTML = `
        <div class="error-message">
            <h2>Oops!</h2>
            <p>${message}</p>
            <a href="index.html" class="btn btn-primary">← Back to Home</a>
        </div>
    `;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadArticle();
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.right = '20px';
                navLinks.style.background = 'var(--darker-bg)';
                navLinks.style.padding = '1rem';
                navLinks.style.borderRadius = '8px';
                navLinks.style.border = '1px solid var(--border-color)';
            }
        });
    }
});
