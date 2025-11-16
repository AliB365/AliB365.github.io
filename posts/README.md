# Blog Post Template Generator

This directory contains individual HTML files for each blog post.

## 🚀 Quick Start - Using the Generator Script

The **easiest and recommended** way to create a new blog post:

```powershell
.\new-post.ps1
```

### What the Script Does:

1. **Guides you through**: Interactive prompts for all post details
2. **Auto-generates slug**: Converts your title to a URL-friendly slug
3. **Creates HTML file**: Full post structure with your metadata
4. **Updates index**: Automatically adds entry to `posts-index.json`
5. **Starter content**: Includes template content you can customize

### Example Usage:

```powershell
PS> .\new-post.ps1

==================================
  New Blog Post Generator
  Autonomous Agentic Blog
==================================

Let's create a new blog post!

Enter post title: The Future of AI Agents
Enter post excerpt: Exploring what's next for autonomous AI systems
Enter author name: Autonomous Agentic
Enter estimated read time: 8
Enter image URL: https://example.com/image.jpg
Available tags: ai, agents, automation, tutorials
Enter tags: ai,agents
Make this featured? (y/n): n

Generated slug: the-future-of-ai-agents

✓ Created HTML file: posts/the-future-of-ai-agents.html
✓ Added new entry to posts index

==================================
  Blog Post Created Successfully!
==================================
```

After running the script, just edit the generated HTML file to add your full content!

## 📝 Manual Method

If you prefer to create posts manually:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YOUR POST TITLE | Autonomous Agentic</title>
    <meta name="description" content="YOUR POST EXCERPT">
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
                    <li><a href="../index.html#blog">Articles</a></li>
                    <li><a href="../index.html#contact">Contact</a></li>
                    <li id="auth-nav-container">
                        <div id="auth-buttons" class="auth-buttons">
                            <button id="signin-btn" class="btn btn-secondary btn-nav">Sign In</button>
                        </div>
                        <div id="user-menu" class="user-menu" style="display: none;">
                            <button id="user-menu-btn" class="user-menu-btn">
                                <span id="user-name-display"></span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                                    <path d="M6 9L1 4h10z"/>
                                </svg>
                            </button>
                            <div id="user-dropdown" class="user-dropdown">
                                <div class="user-info">
                                    <div class="user-email" id="user-email-display"></div>
                                </div>
                                <button id="signout-btn" class="dropdown-item">Sign Out</button>
                            </div>
                        </div>
                    </li>
                </ul>
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
            <article class="article-full">
                <div class="article-header">
                    <div class="article-tags">
                        <span class="tag">tag1</span>
                        <span class="tag">tag2</span>
                    </div>
                    <h1 class="article-title">YOUR POST TITLE</h1>
                    <div class="article-meta">
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Month Day, Year
                        </span>
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            X min read
                        </span>
                        <span class="meta-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            Autonomous Agentic
                        </span>
                    </div>
                </div>
                
                <img src="YOUR_IMAGE_URL" alt="YOUR POST TITLE" class="article-image">
                
                <div class="article-body">
                    <!-- YOUR CONTENT HERE -->
                    <p>Your article content...</p>
                    
                    <h2>Section Title</h2>
                    <p>More content...</p>
                </div>
                
                <div class="article-footer">
                    <div class="article-tags-footer">
                        <strong>Tags:</strong>
                        <span class="tag">tag1</span>
                        <span class="tag">tag2</span>
                    </div>
                </div>
            </article>
            
            <div class="article-navigation">
                <a href="../index.html#blog" class="btn btn-primary">← Back to Home</a>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Autonomous Agentic. All rights reserved.</p>
        </div>
    </footer>

    <script src="../firebase-config.js"></script>
    <script type="module" src="../assets/js/auth.js"></script>
    <script src="../assets/js/shared.js"></script>
</body>
</html>
```

## Adding to Posts Index

Add an entry to `data/posts-index.json`:

```json
{
  "id": "your-post-id",
  "title": "Your Post Title",
  "excerpt": "A brief description of your post",
  "url": "posts/your-post-id.html",
  "image": "https://example.com/image.jpg",
  "date": "2025-11-15",
  "author": "Autonomous Agentic",
  "readTime": 5,
  "tags": ["ai", "automation"],
  "featured": false
}
```

## Benefits of This Approach

- **SEO Friendly**: Each post has its own URL, title, and meta description
- **Fast Loading**: No JSON parsing or dynamic rendering needed
- **Indexable**: Search engines can crawl and index each page independently
- **Scalable**: Performance doesn't degrade as you add more posts
- **Simple**: Just HTML files, easy to edit and deploy
