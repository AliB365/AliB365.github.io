#!/usr/bin/env pwsh
# New Blog Post Generator for Autonomous Agentic
# Usage: .\new-post.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  New Blog Post Generator" -ForegroundColor Cyan
Write-Host "  Autonomous Agentic Blog" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Function to convert title to URL-friendly slug
function Convert-ToSlug {
    param([string]$text)
    $slug = $text.ToLower()
    $slug = $slug -replace '[^a-z0-9\s-]', ''
    $slug = $slug -replace '\s+', '-'
    $slug = $slug -replace '-+', '-'
    $slug = $slug.Trim('-')
    return $slug
}

# Function to format date
function Get-FormattedDate {
    param([datetime]$date)
    return $date.ToString("MMMM d, yyyy")
}

# Collect post information
Write-Host "Let's create a new blog post!" -ForegroundColor Green
Write-Host ""

$title = Read-Host "Enter post title"
if ([string]::IsNullOrWhiteSpace($title)) {
    Write-Host "Error: Title cannot be empty" -ForegroundColor Red
    exit 1
}

$excerpt = Read-Host "Enter post excerpt (brief description)"
if ([string]::IsNullOrWhiteSpace($excerpt)) {
    Write-Host "Error: Excerpt cannot be empty" -ForegroundColor Red
    exit 1
}

$author = Read-Host "Enter author name (press Enter for 'Autonomous Agentic')"
if ([string]::IsNullOrWhiteSpace($author)) {
    $author = "Autonomous Agentic"
}

$readTime = Read-Host "Enter estimated read time in minutes (e.g., 5)"
if ([string]::IsNullOrWhiteSpace($readTime)) {
    $readTime = "5"
}

$imageUrl = Read-Host "Enter image URL (or press Enter to use default)"
if ([string]::IsNullOrWhiteSpace($imageUrl)) {
    $imageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
}

Write-Host ""
Write-Host "Available tags: ai, agents, automation, tutorials" -ForegroundColor Yellow
$tagsInput = Read-Host "Enter tags (comma-separated, e.g., ai,agents)"
if ([string]::IsNullOrWhiteSpace($tagsInput)) {
    $tags = @("ai")
} else {
    $tags = $tagsInput.Split(',') | ForEach-Object { $_.Trim() }
}

$featuredInput = Read-Host "Make this a featured post? (y/n, default: n)"
$featured = $featuredInput -eq 'y'

# Generate slug from title
$slug = Convert-ToSlug -text $title
Write-Host ""
Write-Host "Generated slug: $slug" -ForegroundColor Cyan

$customSlug = Read-Host "Use this slug? (press Enter to accept, or type a custom slug)"
if (-not [string]::IsNullOrWhiteSpace($customSlug)) {
    $slug = Convert-ToSlug -text $customSlug
}

# Get current date
$currentDate = Get-Date
$dateString = $currentDate.ToString("yyyy-MM-dd")
$formattedDate = Get-FormattedDate -date $currentDate

# Define file paths
$htmlFile = "posts/$slug.html"
$indexFile = "data/posts-index.json"

# Check if post already exists
if (Test-Path $htmlFile) {
    Write-Host ""
    Write-Host "Error: A post with this slug already exists!" -ForegroundColor Red
    Write-Host "File: $htmlFile" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -ne 'y') {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "Creating new blog post..." -ForegroundColor Green

# Generate tag HTML
$tagHtml = ($tags | ForEach-Object { "<span class=`"tag`">$_</span>" }) -join "`n                        "
$tagFooterHtml = ($tags | ForEach-Object { "<span class=`"tag`">$_</span>" }) -join "`n                        "

# Create HTML content
$htmlContent = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title | Autonomous Agentic</title>
    <meta name="description" content="$excerpt">
    <link rel="icon" type="image/png" href="../assets/images/favicon.png">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <div class="nav-content">
                <a href="../index.html" class="logo">
                    <img src="../assets/images/favicon.png" alt="Autonomous Agentic" class="logo-img">
                    <span class="logo-text">Autonomous Agentic</span>
                </a>
                <ul class="nav-links">
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../index.html#about">About</a></li>
                    <li><a href="../index.html#blog">Blog</a></li>
                    <li><a href="../profile.html">Profile</a></li>
                    <li><a href="../index.html#contact">Contact</a></li>
                </ul>
                <div class="nav-auth">
                    <button id="signin-btn" class="btn-auth btn-signin">Sign In</button>
                    <div id="user-menu" class="user-menu" style="display: none;">
                        <button class="user-menu-btn">
                            <img id="user-avatar" class="user-avatar" alt="User">
                            <span id="user-name"></span>
                        </button>
                        <div class="user-dropdown">
                            <a href="../profile.html">Profile</a>
                            <button id="signout-btn">Sign Out</button>
                        </div>
                    </div>
                </div>
                <button class="mobile-menu-toggle" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </nav>

    <main class="article-page">
        <div class="container">
            <!-- Reading Progress Bar -->
            <div class="reading-progress-bar"></div>

            <article class="article-full">
                <!-- Article Actions (Like, Bookmark) -->
                <div class="article-actions">
                    <button class="like-btn" data-post-id="$slug" aria-label="Like this post">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        <span class="like-count">0</span>
                    </button>
                    <button class="bookmark-btn" data-post-id="$slug" aria-label="Bookmark this post">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                    </button>
                </div>

                <div class="article-header">
                    <div class="article-tags">
                        $tagHtml
                    </div>
                    <h1 class="article-title">$title</h1>
                    <div class="article-meta">
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            $formattedDate
                        </span>
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            $readTime min read
                        </span>
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            $author
                        </span>
                    </div>
                </div>
                
                <img src="$imageUrl" alt="$title" class="article-image">
                
                <div class="article-body">
                    <p>$excerpt</p>
                    
                    <h2>Introduction</h2>
                    <p>Start writing your article content here...</p>
                    
                    <h2>Main Section</h2>
                    <p>Add your main content here. You can use:</p>
                    <ul>
                        <li>Bullet points for lists</li>
                        <li>Bold text with <strong>strong</strong> tags</li>
                        <li>Code blocks with <code>pre</code> and <code>code</code> tags</li>
                    </ul>
                    
                    <h2>Conclusion</h2>
                    <p>Wrap up your article with a conclusion...</p>
                    
                    <blockquote>Add a memorable quote or key takeaway here.</blockquote>
                </div>
                
                <div class="article-footer">
                    <div class="article-tags-footer">
                        <strong>Tags:</strong>
                        $tagFooterHtml
                    </div>
                </div>
            </article>

            <!-- Share Section -->
            <div class="share-section">
                <h3>Share this article</h3>
                <div class="share-buttons">
                    <button class="share-btn twitter" data-platform="twitter" aria-label="Share on Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                    </button>
                    <button class="share-btn linkedin" data-platform="linkedin" aria-label="Share on LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        LinkedIn
                    </button>
                    <button class="share-btn facebook" data-platform="facebook" aria-label="Share on Facebook">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </button>
                    <button class="share-btn copy" data-platform="copy" aria-label="Copy link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy Link
                    </button>
                </div>
            </div>

            <!-- Related Posts -->
            <div class="related-posts-section">
                <h3>Related Articles</h3>
                <div class="related-posts-grid" id="related-posts">
                    <!-- Related posts will be loaded dynamically -->
                </div>
            </div>
            
            <div class="article-navigation">
                <a href="../index.html#blog" class="btn btn-primary">← Back to Home</a>
            </div>

            <!-- Auth Container -->
            <div id="auth-container" class="auth-container" style="display: none;">
                <div class="auth-modal">
                    <button class="auth-close" id="auth-close-btn">×</button>
                    <h2>Sign in to continue</h2>
                    <p>Sign in to like posts, bookmark articles, and track your reading progress.</p>
                    <button class="btn btn-primary" id="google-signin-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign in with Google
                    </button>
                </div>
            </div>

            <!-- Comments Section -->
            <section class="comments-section-wrapper">
                <div class="comments-section">
                    <h2 class="comments-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        <span id="comment-count">0 Comments</span>
                    </h2>
                    
                    <!-- Comment Form -->
                    <div class="comment-form">
                        <div id="comment-auth-prompt" class="comment-auth-prompt">
                            <p>Please <a href="#" id="comment-signin-link">sign in</a> to leave a comment.</p>
                        </div>
                        <div id="comment-form-container" class="comment-form-container" style="display: none;">
                            <textarea 
                                id="comment-input" 
                                placeholder="Share your thoughts..." 
                                maxlength="1000"
                                rows="4"
                            ></textarea>
                            <div class="comment-form-actions">
                                <span class="comment-char-count">
                                    <span id="comment-char-count">0</span>/1000
                                </span>
                                <button id="post-comment-btn" class="btn btn-primary">Post Comment</button>
                            </div>
                            <div id="comment-error" class="comment-error"></div>
                        </div>
                    </div>

                    <!-- Comments List -->
                    <div id="comments-list" class="comments-list">
                        <!-- Comments will be loaded here -->
                    </div>
                </div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Autonomous Agentic. All rights reserved.</p>
        </div>
    </footer>

    <script src=\"../firebase-config.js\"></script>
    <script type=\"module\" src=\"../assets/js/auth.js\"></script>
    <script type=\"module\" src=\"../assets/js/comments.js\"></script>
    <script type=\"module\" src=\"../assets/js/likes.js\"></script>
    <script type=\"module\" src=\"../assets/js/progress-bar.js\"></script>
    <script type=\"module\" src=\"../assets/js/toc.js\"></script>
    <script type=\"module\" src=\"../assets/js/profile.js\"></script>
    <script type=\"module\" src=\"../assets/js/achievements.js\"></script>
    <script type=\"module\" src=\"../assets/js/preferences.js\"></script>
    <script src=\"../assets/js/shared.js\"></script>
    <script type=\"module\">
        import { initComments, postComment } from '../assets/js/comments.js';
        import { initPostActions, initShareButtons } from '../assets/js/likes.js';
        import { initProgressBar } from '../assets/js/progress-bar.js';
        import { initTableOfContents } from '../assets/js/toc.js';
        import { trackReading } from '../assets/js/profile.js';
        import { checkAchievements } from '../assets/js/achievements.js';
        
        // Get post ID from slug
        const postId = '$slug';
        const postTitle = '$title';
        
        // Wait for Firebase to initialize before running features
        function initializeFeatures() {
            // Initialize engagement features
            initPostActions(postId, postTitle);
            initShareButtons();
            initProgressBar();
            initTableOfContents();
            
            // Initialize comments
            initComments(postId);
        }
        
        // Initialize all features when page loads
        window.addEventListener('DOMContentLoaded', () => {
            // Check if Firebase is ready
            if (window.firebaseApp) {
                initializeFeatures();
            } else {
                // Wait for Firebase to initialize
                const checkFirebase = setInterval(() => {
                    if (window.firebaseApp) {
                        clearInterval(checkFirebase);
                        initializeFeatures();
                    }
                }, 100);
            }
            
            // Listen for auth state changes to track reading
            window.addEventListener('auth-state-changed', async (e) => {
                const user = e.detail.user;
                
                // Update comment form visibility
                const authPrompt = document.getElementById('comment-auth-prompt');
                const formContainer = document.getElementById('comment-form-container');
                
                if (user) {
                    if (authPrompt) authPrompt.style.display = 'none';
                    if (formContainer) formContainer.style.display = 'block';
                    
                    // Track reading and check achievements
                    trackReading(user.uid, postId, '$title');
                    checkAchievements(user.uid);
                } else {
                    if (authPrompt) authPrompt.style.display = 'block';
                    if (formContainer) formContainer.style.display = 'none';
                }
            });
            
            // Sign in link
            const commentSigninLink = document.getElementById('comment-signin-link');
            if (commentSigninLink) {
                commentSigninLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const signinBtn = document.getElementById('signin-btn');
                    if (signinBtn) signinBtn.click();
                });
            }
            
            // Post comment button
            const postCommentBtn = document.getElementById('post-comment-btn');
            if (postCommentBtn) {
                postCommentBtn.addEventListener('click', postComment);
            }
            
            // Character count
            const commentInput = document.getElementById('comment-input');
            if (commentInput) {
                commentInput.addEventListener('input', (e) => {
                    const charCount = document.getElementById('comment-char-count');
                    if (charCount) charCount.textContent = e.target.value.length;
                });
            }
        });
    </script>
</body>
</html>
\"@

# Write HTML file
$htmlContent | Out-File -FilePath $htmlFile -Encoding UTF8
Write-Host "✓ Created HTML file: $htmlFile" -ForegroundColor Green

# Update posts-index.json
if (Test-Path $indexFile) {
    $indexContent = Get-Content $indexFile -Raw | ConvertFrom-Json
    
    # Check if post already exists in index
    $existingIndex = -1
    for ($i = 0; $i -lt $indexContent.Count; $i++) {
        if ($indexContent[$i].id -eq $slug) {
            $existingIndex = $i
            break
        }
    }
    
    # Create new post entry
    $newEntry = [PSCustomObject]@{
        id = $slug
        title = $title
        excerpt = $excerpt
        url = "posts/$slug.html"
        image = $imageUrl
        date = $dateString
        author = $author
        readTime = [int]$readTime
        tags = $tags
        featured = $featured
    }
    
    # If featured, unfeatured other posts
    if ($featured) {
        foreach ($post in $indexContent) {
            $post.featured = $false
        }
    }
    
    # Add or update entry
    if ($existingIndex -ge 0) {
        $indexContent[$existingIndex] = $newEntry
        Write-Host "✓ Updated existing entry in posts index" -ForegroundColor Yellow
    } else {
        # Add new entry at the beginning (most recent first)
        $indexContent = @($newEntry) + $indexContent
        Write-Host "✓ Added new entry to posts index" -ForegroundColor Green
    }
    
    # Save updated index
    $indexContent | ConvertTo-Json -Depth 10 -AsArray | Out-File -FilePath $indexFile -Encoding UTF8
} else {
    Write-Host "Error: Could not find $indexFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Blog Post Created Successfully!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Post Details:" -ForegroundColor Yellow
Write-Host "  Title:     $title"
Write-Host "  Slug:      $slug"
Write-Host "  File:      $htmlFile"
Write-Host "  Featured:  $featured"
Write-Host "  Tags:      $($tags -join ', ')"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Edit $htmlFile to add your content"
Write-Host "  2. The post is already added to the blog index"
Write-Host "  3. Refresh your blog to see the new post!"
Write-Host ""
Write-Host "To edit the post:" -ForegroundColor Cyan
Write-Host "  code $htmlFile" -ForegroundColor White
Write-Host ""