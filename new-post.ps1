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
                    <li><a href="../index.html#contact">Contact</a></li>
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

    <script src="../assets/js/shared.js"></script>
</body>
</html>
"@

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