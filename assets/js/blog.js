// Blog configuration
const POSTS_PER_PAGE = 6;
let currentPage = 1;
let currentFilter = 'all';
let allPosts = [];

// Load blog posts from index
async function loadBlogPosts() {
    try {
        const response = await fetch('data/posts-index.json');
        if (!response.ok) {
            throw new Error('Failed to load posts');
        }
        allPosts = await response.json();
        displayBlogPosts();
        displayFeaturedPost();
    } catch (error) {
        console.error('Error loading blog posts:', error);
        document.getElementById('blog-grid').innerHTML = 
            '<p class="loading-message">Unable to load blog posts. Please check that data/posts-index.json exists.</p>';
        document.getElementById('featured-post').innerHTML = 
            '<p class="loading-message">Unable to load featured post.</p>';
    }
}

// Display featured post
function displayFeaturedPost() {
    const featuredPost = allPosts.find(post => post.featured) || allPosts[0];
    if (!featuredPost) return;

    const featuredSection = document.getElementById('featured-post');
    featuredSection.innerHTML = `
        <div class="featured-post" onclick="openArticlePreview('${featuredPost.id}')">
            <img src="${featuredPost.image}" alt="${featuredPost.title}" class="featured-post-image">
            <div class="featured-post-content">
                <span class="featured-badge">Featured Article</span>
                <h3 class="featured-post-title">${featuredPost.title}</h3>
                <p class="featured-post-excerpt">${featuredPost.excerpt}</p>
                <div class="featured-post-meta">
                    <span>${formatDate(featuredPost.date)}</span>
                    <span>${featuredPost.readTime} min read</span>
                </div>
            </div>
        </div>
    `;
}

// Filter posts by category
function filterPosts(category) {
    currentFilter = category;
    currentPage = 1;
    
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    displayBlogPosts();
}

// Get filtered posts
function getFilteredPosts() {
    if (currentFilter === 'all') {
        return allPosts;
    }
    return allPosts.filter(post => post.tags.includes(currentFilter));
}

// Display blog posts
function displayBlogPosts() {
    const filteredPosts = getFilteredPosts();
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const postsToDisplay = filteredPosts.slice(startIndex, endIndex);
    
    const blogGrid = document.getElementById('blog-grid');
    
    if (postsToDisplay.length === 0) {
        blogGrid.innerHTML = '<p class="loading-message">No posts found for this category.</p>';
        return;
    }
    
    blogGrid.innerHTML = postsToDisplay.map(post => `
        <div class="blog-card" onclick="openArticlePreview('${post.id}')">
            <img src="${post.image}" alt="${post.title}" class="blog-card-image">
            <div class="blog-card-content">
                <div class="blog-card-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <div class="blog-card-meta">
                    <span>${formatDate(post.date)}</span>
                    <span class="read-time">${post.readTime} min read</span>
                </div>
            </div>
        </div>
    `).join('');
    
    displayPagination(filteredPosts.length);
}

// Display pagination
function displayPagination(totalPosts) {
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            Previous
        </button>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button onclick="changePage(${i})" class="${i === currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span>...</span>';
        }
    }
    
    // Next button
    paginationHTML += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Next
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(getFilteredPosts().length / POSTS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayBlogPosts();
    
    // Scroll to blog section
    document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
}

// Open article preview in modal
function openArticlePreview(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;
    
    const modal = document.getElementById('article-modal');
    const articleContent = document.getElementById('article-content');
    
    articleContent.innerHTML = `
        <div class="article-header">
            <h1 class="article-title">${post.title}</h1>
            <div class="article-meta">
                <span>${formatDate(post.date)}</span>
                <span>${post.readTime} min read</span>
                <span>${post.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</span>
            </div>
        </div>
        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="article-image">` : ''}
        <div class="article-preview">
            <h2>About This Article</h2>
            <p class="preview-excerpt">${post.excerpt}</p>
            <a href="${post.url}" class="btn btn-primary">Read Full Article →</a>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close article modal
function closeArticle() {
    const modal = document.getElementById('article-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBlogPosts();
    
    // Filter button event listeners
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const filter = e.target.getAttribute('data-filter');
            currentFilter = filter;
            currentPage = 1;
            
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            displayBlogPosts();
        });
    });
    
    // Modal close button
    document.querySelector('.modal-close').addEventListener('click', closeArticle);
    
    // Close modal when clicking outside
    document.getElementById('article-modal').addEventListener('click', (e) => {
        if (e.target.id === 'article-modal') {
            closeArticle();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeArticle();
        }
    });
    
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
